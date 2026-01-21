"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiHome, FiSettings, FiActivity, FiPhone, FiMapPin, FiSave, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { LuBedDouble, LuThermometer, LuStethoscope } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

export default function HospitalDashboard() {
  const [hospital, setHospital] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    bedsTotal: 0,
    icuAvailable: 0,
    nicuAvailable: 0,
    ventilatorsAvailable: 0,
    generalBedsAvailable: 0,
    hospitalPhone: "",
    city: "",
    area: "",
    googleMapsUrl: ""
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem("token");
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const fetchHospitalData = async () => {
    try {
      const res = await axios.get(`${API_URL}/auth/me`, getAuthHeader());
      const data = res.data.data;
      setHospital(data);
      setFormData({
        bedsTotal: data.bedsTotal || 0,
        icuAvailable: data.icuAvailable || 0,
        nicuAvailable: data.nicuAvailable || 0,
        ventilatorsAvailable: data.ventilatorsAvailable || 0,
        generalBedsAvailable: data.generalBedsAvailable || 0,
        hospitalPhone: data.hospitalPhone || "",
        city: data.city || "",
        area: data.area || "",
        googleMapsUrl: data.googleMapsUrl || ""
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHospitalData();
  }, []);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: e.target.type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSave = async (e: any) => {
    e.preventDefault();
    setSaving(true);
    try {
      await axios.patch(`${API_URL}/hospital/beds`, formData, getAuthHeader());
      alert("Bed availability updated successfully!");
      fetchHospitalData();
    } catch (err) {
      console.error(err);
      alert("Failed to update availability.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <FiRefreshCw className="animate-spin text-teal-600 text-4xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-teal-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-teal-50">
        <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white flex items-center justify-center shadow-lg shadow-teal-200">
              <FiActivity size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-black text-teal-900 tracking-tight">{hospital?.name}</h1>
              <p className="text-xs font-bold text-teal-400 uppercase tracking-widest leading-none mt-1">Bed Availability Control Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-xs font-black uppercase tracking-widest text-teal-500">
            <span className="w-2 h-2 bg-teal-500 rounded-full animate-pulse"></span>
            Live Updates
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <form onSubmit={handleSave} className="space-y-12">

          {/* Real-time Availability Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-teal-900 text-white p-8 rounded-[3rem] shadow-2xl shadow-teal-950/20 relative overflow-hidden group">
              <div className="absolute -top-10 -right-10 w-32 h-32 bg-teal-800 rounded-full blur-3xl opacity-50 group-hover:scale-150 transition-transform duration-700"></div>
              <div className="relative z-10">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-400 mb-6 block leading-none">Total Capacity</span>
                <input
                  type="number"
                  name="bedsTotal"
                  value={formData.bedsTotal}
                  onChange={handleChange}
                  className="bg-transparent text-5xl font-black focus:outline-none w-full border-b-2 border-teal-800 focus:border-white transition-colors py-2"
                />
                <div className="mt-4 flex items-center gap-2 text-teal-300 font-bold text-sm">
                  <FiHome /> General Ward Support
                </div>
              </div>
            </div>

            <div className="bg-rose-50 border border-rose-100 p-8 rounded-[3rem] shadow-xl shadow-rose-900/5 relative overflow-hidden group">
              <div className="relative z-10 text-rose-900">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-rose-400 mb-6 block leading-none">ICU Available</span>
                <input
                  type="number"
                  name="icuAvailable"
                  value={formData.icuAvailable}
                  onChange={handleChange}
                  className="bg-transparent text-5xl font-black focus:outline-none w-full border-b-2 border-rose-200 focus:border-rose-900 transition-colors py-2"
                />
                <div className="mt-4 flex items-center gap-2 text-rose-600 font-bold text-sm">
                  <LuBedDouble /> Intensive Care Unit
                </div>
              </div>
            </div>

            <div className="bg-sky-50 border border-sky-100 p-8 rounded-[3rem] shadow-xl shadow-sky-900/5 relative overflow-hidden group">
              <div className="relative z-10 text-sky-900">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-400 mb-6 block leading-none">NICU Available</span>
                <input
                  type="number"
                  name="nicuAvailable"
                  value={formData.nicuAvailable}
                  onChange={handleChange}
                  className="bg-transparent text-5xl font-black focus:outline-none w-full border-b-2 border-sky-200 focus:border-sky-900 transition-colors py-2"
                />
                <div className="mt-4 flex items-center gap-2 text-sky-600 font-bold text-sm">
                  <LuThermometer /> Neonatal ICU
                </div>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[3rem] shadow-xl shadow-amber-900/5 relative overflow-hidden group">
              <div className="relative z-10 text-amber-900">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-400 mb-6 block leading-none">Ventilators</span>
                <input
                  type="number"
                  name="ventilatorsAvailable"
                  value={formData.ventilatorsAvailable}
                  onChange={handleChange}
                  className="bg-transparent text-5xl font-black focus:outline-none w-full border-b-2 border-amber-200 focus:border-amber-900 transition-colors py-2"
                />
                <div className="mt-4 flex items-center gap-2 text-amber-600 font-bold text-sm">
                  <FiActivity /> Life Support Systems
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FiMapPin className="text-teal-600" /> Location & Mapping
              </h3>
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">City</label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="e.g. New York"
                    className="bg-white p-5 rounded-3xl border border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Area / Suburb</label>
                  <input
                    type="text"
                    name="area"
                    value={formData.area}
                    onChange={handleChange}
                    placeholder="e.g. Manhattan"
                    className="bg-white p-5 rounded-3xl border border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Google Maps Embed/URL</label>
                <input
                  type="text"
                  name="googleMapsUrl"
                  value={formData.googleMapsUrl}
                  onChange={handleChange}
                  placeholder="Paste Google Maps link here"
                  className="bg-white p-5 rounded-3xl border border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
                />
              </div>
            </section>

            <section className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100 shadow-sm">
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                <FiPhone className="text-teal-600" /> Emergency Contacts
              </h3>
              <div className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">Emergency Hotline</label>
                  <input
                    type="text"
                    name="hospitalPhone"
                    value={formData.hospitalPhone}
                    onChange={handleChange}
                    placeholder="+1 234 567 890"
                    className="bg-white p-5 rounded-3xl border border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-2">General Bed Availability</label>
                  <input
                    type="number"
                    name="generalBedsAvailable"
                    value={formData.generalBedsAvailable}
                    onChange={handleChange}
                    className="bg-white p-5 rounded-3xl border border-slate-100 focus:border-teal-500 focus:ring-4 focus:ring-teal-50 focus:outline-none transition-all font-bold text-slate-800 shadow-sm"
                  />
                </div>
              </div>
              <div className="mt-8 p-6 bg-amber-50 rounded-3xl border border-amber-100 flex items-start gap-4">
                <FiAlertCircle className="text-amber-600 mt-1 flex-shrink-0" />
                <p className="text-xs font-bold text-amber-800 leading-relaxed">
                  Keep your counts updated in real-time. This data is critical for emergency services and patient redirects.
                </p>
              </div>
            </section>
          </div>

          {/* Submit Bar */}
          <div className="fixed bottom-10 left-0 right-0 z-30 px-6">
            <div className="max-w-7xl mx-auto flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-teal-600 hover:bg-teal-500 text-white font-black px-12 py-6 rounded-[2rem] shadow-2xl shadow-teal-500/40 transition-all flex items-center gap-4 text-xl hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                {saving ? "Saving Changes..." : "Publish Live Updates"}
              </button>
            </div>
          </div>

        </form>
      </main>

      {/* Extra padding for float button */}
      <div className="h-32"></div>

      <style jsx global>{`
                input::-webkit-outer-spin-button,
                input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            `}</style>
    </div>
  );
}
