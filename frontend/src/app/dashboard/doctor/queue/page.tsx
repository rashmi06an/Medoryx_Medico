"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiUsers, FiClock, FiPlay, FiCheckCircle, FiArrowLeft, FiRefreshCw, FiAlertCircle } from "react-icons/fi";
import { LuUserCheck } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

interface Appointment {
    _id: string;
    patient: {
        name: string;
        phone: string;
    };
    tokenNumber: number;
    status: 'pending' | 'confirmed' | 'serving' | 'completed' | 'missed';
    queueStatus: string;
}

export default function DoctorQueuePage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [serving, setServing] = useState<Appointment | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchQueue = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/appointments/doctor`, getAuthHeader());
            const all = res.data.data;
            const waiting = all.filter((a: any) => a.queueStatus === 'waiting').sort((a: any, b: any) => a.tokenNumber - b.tokenNumber);
            const current = all.find((a: any) => a.queueStatus === 'serving');

            setAppointments(waiting);
            setServing(current || null);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQueue();
        const interval = setInterval(fetchQueue, 30000); // Auto-refresh every 30s
        return () => clearInterval(interval);
    }, []);

    const callNext = async () => {
        setActionLoading(true);
        try {
            const res = await axios.patch(`${API_URL}/appointments/doctor/call-next`, {}, getAuthHeader());
            if (res.data.success) {
                fetchQueue();
            }
        } catch (err) {
            console.error(err);
            alert("Failed to call next patient");
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white font-sans selection:bg-teal-100">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-teal-50">
                <div className="max-w-7xl mx-auto px-6 py-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-teal-900 tracking-tight">Live Queue Manager</h1>
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest leading-none mt-1">Real-time turn handling</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchQueue}
                        className="w-12 h-12 rounded-2xl bg-white border border-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-50 transition-all shadow-sm"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                    {/* Left & Middle: Serving & Controls */}
                    <div className="lg:col-span-2 space-y-10">

                        {/* Current Serving Card */}
                        <div className="bg-teal-900 rounded-[3.5rem] p-12 text-white relative overflow-hidden shadow-2xl shadow-teal-900/20">
                            <div className="absolute -top-20 -right-20 w-80 h-80 bg-teal-800 rounded-full blur-[100px] opacity-50"></div>

                            <div className="relative z-10">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-400 mb-8 block">Currently Serving</span>

                                {serving ? (
                                    <div className="animate-fade-in">
                                        <div className="flex items-end gap-6 mb-10">
                                            <span className="text-8xl font-black leading-none tracking-tighter text-white">#{serving.tokenNumber}</span>
                                            <div className="pb-2">
                                                <h2 className="text-3xl font-black text-teal-100">{serving.patient.name}</h2>
                                                <p className="font-bold text-teal-400">{serving.patient.phone}</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4">
                                            <button
                                                onClick={callNext}
                                                disabled={actionLoading}
                                                className="bg-white text-teal-900 font-black px-10 py-5 rounded-3xl shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 text-lg"
                                            >
                                                {actionLoading ? <FiRefreshCw className="animate-spin" /> : <FiCheckCircle />}
                                                Complete & Call Next
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="py-10 text-center">
                                        <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-white/30 text-5xl mx-auto mb-6">
                                            <LuUserCheck />
                                        </div>
                                        <h2 className="text-3xl font-black mb-4">No Active Patient</h2>
                                        <p className="text-teal-400 font-medium mb-10">Ready to start your consultation session?</p>
                                        <button
                                            onClick={callNext}
                                            disabled={actionLoading || appointments.length === 0}
                                            className="bg-teal-500 hover:bg-teal-400 text-white font-black px-12 py-6 rounded-[2rem] shadow-2xl shadow-teal-500/20 transition-all flex items-center gap-4 mx-auto text-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {actionLoading ? <FiRefreshCw className="animate-spin" /> : <FiPlay />}
                                            Call First Patient
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity or Quick Filters */}
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-teal-50 p-6 rounded-[2.5rem] border border-teal-100 flex flex-col justify-center">
                                <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Waiting</span>
                                <span className="text-3xl font-black text-teal-900">{appointments.length}</span>
                            </div>
                            <div className="bg-orange-50 p-6 rounded-[2.5rem] border border-orange-100 flex flex-col justify-center">
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest mb-1">Avg. Wait</span>
                                <span className="text-3xl font-black text-orange-900">12m</span>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-[2.5rem] border border-slate-100 col-span-2 flex flex-col justify-center">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Clinical Insight</span>
                                <p className="text-slate-600 font-bold leading-tight">Patient flow is 15% faster today.</p>
                            </div>
                        </div>

                    </div>

                    {/* Right: Waiting List */}
                    <div className="lg:col-span-1">
                        <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 sticky top-32">
                            <div className="flex justify-between items-center mb-8">
                                <h3 className="text-xl font-black text-teal-950">Waiting List</h3>
                                <div className="px-3 py-1 bg-teal-100 text-teal-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                    Queue
                                </div>
                            </div>

                            <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {appointments.length > 0 ? (
                                    appointments.map((app) => (
                                        <div key={app._id} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 hover:border-teal-200 transition-all group">
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-teal-600 font-black text-xl group-hover:bg-teal-600 group-hover:text-white transition-colors">
                                                        #{app.tokenNumber}
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-slate-900 group-hover:text-teal-900 transition-colors">{app.patient.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{app.patient.phone}</p>
                                                    </div>
                                                </div>
                                                <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-300 group-hover:text-teal-500 transition-colors">
                                                    <FiUsers />
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-20 text-center opacity-30 flex flex-col items-center">
                                        <FiAlertCircle size={40} className="mb-4" />
                                        <p className="font-black uppercase text-xs tracking-widest">No patients waiting</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.4s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
