"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiSearch, FiMapPin, FiPhone, FiActivity, FiMap, FiArrowLeft, FiFilter, FiPhoneCall, FiExternalLink, FiRefreshCw, FiHome } from "react-icons/fi";
import { LuBedDouble, LuThermometer } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

export default function BedSearch() {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        city: "",
        area: "",
        type: ""
    });

    const searchHospitals = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filters.city) params.append('city', filters.city);
            if (filters.area) params.append('area', filters.area);
            if (filters.type) params.append('type', filters.type);

            const res = await axios.get(`${API_URL}/hospital/search?${params.toString()}`);
            setHospitals(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        searchHospitals();
    }, []);

    const handleFilterChange = (name: string, value: string) => {
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100">
            {/* Hero & Search Header */}
            <div className="bg-white border-b border-teal-50 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => window.history.back()}
                                className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                            >
                                <FiArrowLeft size={20} />
                            </button>
                            <div>
                                <h1 className="text-2xl font-black text-teal-900 tracking-tight">Emergency Bed Tracker</h1>
                                <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mt-1 flex items-center gap-2">
                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
                                    Real-time Availability
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <div className="relative group">
                                <FiMapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-500 transition-colors" />
                                <input
                                    type="text"
                                    placeholder="Search City..."
                                    value={filters.city}
                                    onChange={(e) => handleFilterChange('city', e.target.value)}
                                    className="pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-teal-100 focus:bg-white transition-all font-bold text-slate-700 w-full md:w-64"
                                />
                            </div>
                            <button
                                onClick={searchHospitals}
                                className="bg-teal-600 hover:bg-teal-500 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-teal-200 transition-all flex items-center gap-3 active:scale-95"
                            >
                                <FiSearch /> Search
                            </button>
                        </div>
                    </div>

                    {/* Quick Filters */}
                    <div className="mt-8 flex flex-wrap gap-4">
                        {[
                            { id: '', label: 'All Beds', icon: <FiActivity /> },
                            { id: 'icu', label: 'ICU', icon: <LuBedDouble /> },
                            { id: 'nicu', label: 'NICU', icon: <LuThermometer /> },
                            { id: 'ventilator', label: 'Ventilator', icon: <FiActivity /> },
                            { id: 'general', label: 'General', icon: <FiHome /> }
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => {
                                    handleFilterChange('type', btn.id);
                                    // Trigger search immediately on type toggle
                                    const newFilters = { ...filters, type: btn.id };
                                    const params = new URLSearchParams();
                                    if (newFilters.city) params.append('city', newFilters.city);
                                    if (newFilters.area) params.append('area', newFilters.area);
                                    if (newFilters.type) params.append('type', newFilters.type);
                                    axios.get(`${API_URL}/hospital/search?${params.toString()}`).then(res => setHospitals(res.data.data));
                                }}
                                className={`px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all border ${filters.type === btn.id
                                    ? 'bg-teal-900 border-teal-900 text-white shadow-xl shadow-teal-200 -translate-y-1'
                                    : 'bg-white border-slate-100 text-slate-500 hover:border-teal-200 hover:text-teal-600'
                                    }`}
                            >
                                {btn.icon} {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-12">
                {loading ? (
                    <div className="py-20 flex flex-col items-center justify-center gap-4 text-teal-600">
                        <FiRefreshCw className="animate-spin text-4xl" />
                        <span className="font-black uppercase text-xs tracking-widest">Scanning Hospitals...</span>
                    </div>
                ) : hospitals.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {hospitals.map((h: any) => (
                            <div key={h._id} className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-teal-900/5 hover:-translate-y-2 transition-all group relative overflow-hidden">
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                                    <FiActivity size={120} />
                                </div>

                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-teal-600 transition-colors">{h.name}</h3>
                                        <p className="text-xs font-bold text-slate-400 mt-1 flex items-center gap-1">
                                            <FiMapPin /> {h.area}, {h.city}
                                        </p>
                                    </div>
                                    <div className="bg-teal-50 text-teal-600 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider">
                                        Active
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="bg-rose-50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-1">ICU</span>
                                        <span className="text-2xl font-black text-rose-900">{h.icuAvailable || 0}</span>
                                    </div>
                                    <div className="bg-sky-50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-1">NICU</span>
                                        <span className="text-2xl font-black text-sky-900">{h.nicuAvailable || 0}</span>
                                    </div>
                                    <div className="bg-amber-50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest mb-1">Ventilator</span>
                                        <span className="text-2xl font-black text-amber-900">{h.ventilatorsAvailable || 0}</span>
                                    </div>
                                    <div className="bg-slate-50 p-4 rounded-2xl flex flex-col">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">General</span>
                                        <span className="text-2xl font-black text-slate-900">{h.generalBedsAvailable || 0}</span>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href={`tel:${h.hospitalPhone}`}
                                        className="flex-1 bg-red-600 hover:bg-red-700 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-red-200 transition-all hover:scale-105 active:scale-95"
                                    >
                                        <FiPhoneCall /> Call Now
                                    </a>
                                    {h.googleMapsUrl && (
                                        <a
                                            href={h.googleMapsUrl}
                                            target="_blank"
                                            className="w-14 bg-slate-100 hover:bg-teal-600 hover:text-white text-slate-600 rounded-2xl flex items-center justify-center transition-all hover:shadow-lg shadow-teal-100"
                                        >
                                            <FiMap />
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-32 flex flex-col items-center justify-center opacity-30 gap-6">
                        <FiSearch size={64} />
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-slate-900 mb-2">No Hospitals Found</h3>
                            <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">Try adjusting your filters or area</p>
                        </div>
                    </div>
                )}
            </main>

            {/* Emergency Floating Note */}
            <div className="fixed bottom-10 left-10 z-40 max-w-sm hidden lg:block">
                <div className="bg-teal-900 text-white p-6 rounded-[2rem] shadow-2xl border border-teal-800 animate-fade-in-up">
                    <p className="text-xs font-bold leading-relaxed opacity-80 mb-4">
                        Data is updated in real-time by hospitals. For critical emergencies, always call the hospital first to confirm current status.
                    </p>
                    <div className="flex items-center gap-3 text-teal-400">
                        <FiPhoneCall />
                        <span className="text-[10px] font-black uppercase tracking-widest">Emergency Helpdesk: 102 / 108</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up {
                    animation: fade-in-up 0.6s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
