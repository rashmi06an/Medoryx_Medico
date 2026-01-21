"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiActivity, FiLogOut, FiPlus, FiMinus, FiSave } from "react-icons/fi";
import { useRouter } from "next/navigation";

const API_URL = "http://localhost:8000/api";

export default function HospitalDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState({
    bedsTotal: 0,
    bedsAvailable: 0,
    icuAvailable: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState<any>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.replace("/");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    // Initial stats from local storage or fetch
    setStats({
      bedsTotal: userData.bedsTotal || 0,
      bedsAvailable: userData.bedsAvailable || 0,
      icuAvailable: userData.icuAvailable || 0,
    });
    setLoading(false);
  }, [router]);

  const handleUpdate = async () => {
    setSaving(true);
    try {
      const res = await axios.patch(`${API_URL}/users/hospital-stats`, stats, getAuthHeader());
      alert("Inventory updated successfully!");
      // Update local storage
      const updatedUser = { ...user, ...res.data.data };
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (err) {
      console.error(err);
      alert("Failed to update stats.");
    } finally {
      setSaving(false);
    }
  };

  const adjust = (field: keyof typeof stats, delta: number) => {
    setStats(prev => ({
      ...prev,
      [field]: Math.max(0, prev[field] + delta)
    }));
  };

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-white border-b border-teal-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-teal-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">H</div>
            <h1 className="text-xl font-bold text-teal-800">Hospital<span className="text-teal-600">Sync</span></h1>
          </div>
          <div className="flex items-center gap-6">
            <span className="text-sm font-medium text-teal-600">Admin: {user?.name || "Hospital Admin"}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm font-bold text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg transition-all"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <div className="mb-12">
          <h2 className="text-4xl font-extrabold text-teal-900 mb-2">Resource Management</h2>
          <p className="text-lg text-teal-500">Real-time tracking of critical hospital infrastructure.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Total Beds */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-200">
            <p className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-4">Total Capacity</p>
            <div className="flex items-center justify-between">
              <span className="text-5xl font-black text-teal-800">{stats.bedsTotal}</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => adjust('bedsTotal', 1)} className="p-2 bg-teal-100 rounded-lg hover:bg-teal-200 transition"><FiPlus /></button>
                <button onClick={() => adjust('bedsTotal', -1)} className="p-2 bg-teal-100 rounded-lg hover:bg-teal-200 transition"><FiMinus /></button>
              </div>
            </div>
            <p className="mt-4 text-xs text-teal-400 font-medium italic">General Ward + Emergency</p>
          </div>

          {/* Available Beds */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-teal-200 ring-4 ring-teal-500/10">
            <p className="text-sm font-bold text-teal-600 uppercase tracking-widest mb-4 flex items-center gap-2">
              <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></div> Available Beds
            </p>
            <div className="flex items-center justify-between">
              <span className="text-5xl font-black text-teal-600">{stats.bedsAvailable}</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => adjust('bedsAvailable', 1)} className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"><FiPlus /></button>
                <button onClick={() => adjust('bedsAvailable', -1)} className="p-2 bg-teal-50 text-teal-600 rounded-lg hover:bg-teal-100 transition"><FiMinus /></button>
              </div>
            </div>
            <div className="mt-6 h-2 w-full bg-teal-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-teal-500 transition-all duration-500"
                style={{ width: `${stats.bedsTotal ? (stats.bedsAvailable / stats.bedsTotal) * 100 : 0}%` }}
              ></div>
            </div>
          </div>

          {/* ICU / Ventilator */}
          <div className="bg-teal-900 p-8 rounded-3xl shadow-xl">
            <p className="text-sm font-bold text-teal-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <FiActivity className="text-red-500" /> ICU Availability
            </p>
            <div className="flex items-center justify-between">
              <span className="text-5xl font-black text-white">{stats.icuAvailable}</span>
              <div className="flex flex-col gap-2">
                <button onClick={() => adjust('icuAvailable', 1)} className="p-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 transition"><FiPlus /></button>
                <button onClick={() => adjust('icuAvailable', -1)} className="p-2 bg-teal-800 text-white rounded-lg hover:bg-teal-700 transition"><FiMinus /></button>
              </div>
            </div>
            <p className="mt-4 text-sm font-medium text-teal-500">Critical care units ready.</p>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            onClick={handleUpdate}
            disabled={saving}
            className="group flex items-center gap-3 bg-teal-600 text-white px-12 py-5 rounded-2xl font-black text-xl hover:bg-teal-700 hover:shadow-2xl hover:shadow-teal-200 transition-all disabled:opacity-50 active:scale-95"
          >
            {saving ? "Updating Cloud..." : (
              <>
                <FiSave className="group-hover:scale-110 transition-transform" /> Save Infrastructure Data
              </>
            )}
          </button>
        </div>
      </main>

      <footer className="py-10 text-center text-teal-400 text-sm">
        <p>Medoryx Global Hospital Network &copy; 2026</p>
        <p className="mt-1">Last Sync: {new Date().toLocaleTimeString()}</p>
      </footer>
    </div>
  );
}
