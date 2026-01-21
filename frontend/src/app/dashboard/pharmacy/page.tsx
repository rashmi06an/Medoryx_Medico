"use client";

import { FiBox, FiInbox, FiAlertTriangle, FiLogOut, FiArrowRight } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PharmacyDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ id?: string; name: string; address?: string; googleMapsUrl?: string; phone?: string } | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    googleMapsUrl: ""
  });
  const [lowStockCount, setLowStockCount] = useState(0);
  const [expiryAlertCount, setExpiryAlertCount] = useState(0);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.replace("/");
    } else {
      const userData = JSON.parse(userStr);
      setUser(userData);
      setFormData({
        name: userData.name || "",
        address: userData.address || "",
        googleMapsUrl: userData.googleMapsUrl || ""
      });
      fetchLowStockCount();
      fetchExpiryAlertCount();
    }
  }, [router]);

  const fetchLowStockCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/medicines/low-stock", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setLowStockCount(res.data.count);
      }
    } catch (err) {
      console.error("Error fetching low stock count:", err);
    }
  };

  const fetchExpiryAlertCount = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8000/api/medicines/expiry-alerts", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setExpiryAlertCount(res.data.count);
      }
    } catch (err) {
      console.error("Error fetching expiry alert count:", err);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch("http://localhost:8000/api/users/profile", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        const updatedUser = { ...user, ...res.data.data };
        setUser(updatedUser);
        localStorage.setItem("currentUser", JSON.stringify(updatedUser));
        setIsEditing(false);
        alert("Profile updated successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-teal-800 tracking-tight">Medico<span className="text-teal-500">.</span></h1>
            <p className="text-sm text-teal-500">Pharmacy Control Center</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Welcome, {user?.name || "Pharmacist"}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pharmacy Overview</h2>
            <p className="mt-2 text-lg text-gray-600">Manage inventory, orders, and your pharmacy profile.</p>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
          >
            {isEditing ? "Cancel Editing" : "Manage Profile"}
          </button>
        </div>

        {isEditing ? (
          <div className="bg-teal-50 p-8 rounded-[2.5rem] border border-teal-100 max-w-2xl animate-fade-in">
            <h3 className="text-xl font-bold text-teal-900 mb-6 flex items-center gap-2">
              <FiInfo className="text-teal-600" /> Update Pharmacy Details
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">Pharmacy Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-white focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="e.g. Apollo Pharmacy"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">Physical Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-white focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="e.g. 123 Health Street, City"
                  rows={3}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-teal-800 mb-2">Google Maps URL</label>
                <input
                  type="url"
                  value={formData.googleMapsUrl}
                  onChange={(e) => setFormData({ ...formData, googleMapsUrl: e.target.value })}
                  className="w-full p-3 rounded-xl border-2 border-white focus:border-teal-500 focus:outline-none transition-all"
                  placeholder="https://www.google.com/maps/..."
                />
                <p className="mt-2 text-xs text-teal-600/70 italic">Paste the Google Maps share link to help patients find you.</p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-teal-600 text-white p-4 rounded-xl font-bold hover:bg-teal-700 transition shadow-xl shadow-teal-200 disabled:opacity-50"
              >
                {loading ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>
        ) : (
          <div className="space-y-8">
            {lowStockCount > 0 && (
              <div
                onClick={() => router.push("/dashboard/pharmacy/inventory")}
                className="bg-red-50 border-2 border-red-100 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-red-100 transition-colors group animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-500 rounded-xl flex items-center justify-center text-white text-xl">
                    <FiAlertTriangle />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-red-900">Low-Stock Alert!</h3>
                    <p className="text-red-700">{lowStockCount} medicines are running low on stock (less than 10 units).</p>
                  </div>
                </div>
                <span className="text-red-600 font-bold group-hover:underline flex items-center gap-1">
                  Restock Now <FiArrowRight />
                </span>
              </div>
            )}

            {expiryAlertCount > 0 && (
              <div
                onClick={() => router.push("/dashboard/pharmacy/inventory")}
                className="bg-orange-50 border-2 border-orange-100 p-6 rounded-[2rem] flex items-center justify-between cursor-pointer hover:bg-orange-100 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white text-xl">
                    <FiClock />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-orange-900">Expiry Alert!</h3>
                    <p className="text-orange-700">{expiryAlertCount} medicines are expiring within 60 days. List them on the marketplace to reduce wastage.</p>
                  </div>
                </div>
                <span className="text-orange-600 font-bold group-hover:underline flex items-center gap-1">
                  Manage Now <FiArrowRight />
                </span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Action Card: Manage Inventory */}
              <div
                onClick={() => router.push("/dashboard/pharmacy/inventory")}
                className="group bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50"
              >
                <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
                  <FiBox className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">Manage Inventory</h3>
                <p className="text-gray-500 leading-relaxed mb-4">
                  Add new medicines, update stock levels, and track batch numbers.
                </p>
                <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
                  Open Inventory &rarr;
                </span>
              </div>

              {/* Profile Summary Card */}
              <div className="bg-teal-50/50 p-8 rounded-[2.5rem] border border-teal-100 flex flex-col">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm">
                  <FiMapPin className="text-2xl text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-teal-900 mb-2">Location Info</h3>
                <div className="space-y-3">
                  <p className="text-sm text-teal-800 font-medium">
                    {user?.address || "Address not set yet"}
                  </p>
                  {user?.googleMapsUrl ? (
                    <a
                      href={user.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-teal-600 font-bold hover:underline flex items-center gap-1"
                    >
                      View on Map &rarr;
                    </a>
                  ) : (
                    <p className="text-xs text-teal-500 italic">No Maps link added</p>
                  )}
                </div>
              </div>

              {/* Placeholder Card: Order Requests */}
              <div className="group bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
                  <FiInbox className="text-2xl text-gray-400" />
                </div>
                <h3 className="text-xl font-bold text-gray-400 mb-2">Order Requests</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  View and fulfill medicine reservation requests from patients.
                </p>
                <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

import { FiMapPin, FiInfo, FiClock } from "react-icons/fi";
import axios from "axios";
