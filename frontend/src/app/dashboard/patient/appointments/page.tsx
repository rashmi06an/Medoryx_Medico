"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiCheckCircle, FiXCircle, FiRefreshCw } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Appointment {
    _id: string;
    doctor: {
        name: string;
    };
    startTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    reason: string;
}

export default function PatientAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/appointments/patient`, getAuthHeader());
            setAppointments(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F7F7] flex flex-col font-sans selection:bg-teal-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-teal-200/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-200/20 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-[1600px] mx-auto px-8 py-10 w-full flex-grow">
                <div className="flex justify-between items-end mb-16">
                    <div>
                        <h1 className="text-6xl font-black text-teal-900 mb-4 tracking-tight leading-tight">My Consultations</h1>
                        <p className="text-xl text-teal-500 font-medium max-w-2xl">Manage your upcoming visits and review past medical interactions with certified specialists.</p>
                    </div>
                    <button
                        onClick={fetchAppointments}
                        className="w-16 h-16 bg-white rounded-2xl shadow-xl shadow-teal-200/50 flex items-center justify-center text-teal-600 hover:scale-110 active:scale-95 transition-all text-2xl border border-teal-50"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50">
                        <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-6"></div>
                        <div className="text-teal-900 font-black uppercase tracking-widest text-sm">Syncing with medical system...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {appointments.length > 0 ? (
                            appointments.map((app) => (
                                <div key={app._id} className="bg-white p-10 rounded-[3rem] shadow-lg shadow-teal-200/50 border border-teal-50 flex flex-col justify-between transition-all hover:shadow-2xl hover:border-teal-100 cursor-pointer group hover:-tranteal-y-2 duration-500">
                                    <div className="flex justify-between items-start mb-8">
                                        <div className="flex items-center gap-6">
                                            <div className="w-20 h-20 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-[2rem] flex items-center justify-center text-white text-4xl shadow-lg shadow-teal-900/10 group-hover:rotate-6 transition-all duration-500">
                                                <FiUser />
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-teal-900 mb-1 group-hover:text-teal-700 transition-colors">Dr. {app.doctor?.name || "Specialist"}</h3>
                                                <div className="flex items-center gap-4">
                                                    <span className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                                        <FiCalendar className="text-teal-600" /> {new Date(app.startTime).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-xs font-black text-teal-400 uppercase tracking-widest flex items-center gap-2">
                                                        <FiClock className="text-teal-600" /> {new Date(app.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={`px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 ${app.status === 'confirmed' ? 'bg-teal-50 text-teal-600' :
                                                app.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                                    'bg-amber-50 text-amber-600'
                                            }`}>
                                            {app.status === 'confirmed' && <FiCheckCircle />}
                                            {app.status === 'cancelled' && <FiXCircle />}
                                            {app.status}
                                        </div>
                                    </div>

                                    <div className="p-6 bg-teal-50 rounded-2xl border border-teal-100 group-hover:bg-teal-50/50 group-hover:border-teal-100 transition-colors">
                                        <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-2 block">Consultation Reason</span>
                                        <p className="text-teal-700 font-bold leading-relaxed">
                                            "{app.reason || "General Consultation and Health Checkup"}"
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-32 bg-white rounded-[4rem] border-4 border-dashed border-teal-50 flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-200 text-6xl mb-8">
                                    <FiCalendar />
                                </div>
                                <h3 className="text-3xl font-black text-teal-400 mb-2">No Appointments Found</h3>
                                <p className="text-teal-400 font-medium text-lg max-w-sm">Your health journey is just beginning. Book a consultation with our experts today.</p>
                                <button className="mt-8 bg-teal-600 text-white font-black px-10 py-4 rounded-2xl shadow-xl shadow-teal-100 hover:scale-105 active:scale-95 transition-all">Book Now</button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
