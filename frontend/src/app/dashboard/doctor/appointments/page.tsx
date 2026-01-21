"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiRefreshCw } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Appointment {
    _id: string;
    patient: {
        name: string;
        phone: string;
    };
    startTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    reason: string;
}

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchAppointments = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${API_URL}/appointments/doctor`, getAuthHeader());
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

    const updateStatus = async (id: string, status: string) => {
        try {
            await axios.patch(`${API_URL}/appointments/${id}`, { status }, getAuthHeader());
            fetchAppointments();
        } catch (err) {
            console.error(err);
            alert("Failed to update status");
        }
    };

    return (
        <div className="p-6 bg-white min-h-screen text-teal-800">
            <div className="max-w-6xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-teal-800">Appointments</h1>
                        <p className="text-white0">Manage your daily schedule and patient consultations.</p>
                    </div>
                    <button
                        onClick={fetchAppointments}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-teal-600"
                    >
                        <FiRefreshCw className={loading ? "animate-spin" : ""} />
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-pulse text-teal-600 font-semibold italic text-lg line-clamp-3">Loading schedule...</div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {appointments.length > 0 ? (
                            appointments.map((app) => (
                                <div key={app._id} className="bg-white p-6 rounded-2xl shadow-sm border border-teal-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{app.patient?.name || "Patient"}</h3>
                                            <p className="text-sm text-white0 flex items-center gap-1">
                                                <FiClock className="text-teal-500" /> {new Date(app.startTime).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex-grow">
                                        <p className="text-sm text-gray-600 italic">"{app.reason || "No reason provided"}"</p>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${app.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                app.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                    'bg-yellow-100 text-yellow-700'
                                            }`}>
                                            {app.status}
                                        </span>

                                        <div className="flex gap-2">
                                            {app.status === 'pending' && (
                                                <>
                                                    <button
                                                        onClick={() => updateStatus(app._id, 'confirmed')}
                                                        className="p-2 bg-green-50 text-green-600 rounded-lg hover:bg-green-600 hover:text-white transition-all"
                                                        title="Confirm"
                                                    >
                                                        <FiCheck />
                                                    </button>
                                                    <button
                                                        onClick={() => updateStatus(app._id, 'cancelled')}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all"
                                                        title="Cancel"
                                                    >
                                                        <FiX />
                                                    </button>
                                                </>
                                            )}
                                            {app.status === 'confirmed' && (
                                                <button
                                                    onClick={() => updateStatus(app._id, 'completed')}
                                                    className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition"
                                                >
                                                    Finish Consultation
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <FiCalendar className="text-5xl text-gray-300 mx-auto mb-4" />
                                <p className="text-white0">No appointments scheduled for today.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
