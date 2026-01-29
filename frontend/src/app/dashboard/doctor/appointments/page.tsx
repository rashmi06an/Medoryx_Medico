"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiCalendar, FiClock, FiUser, FiCheck, FiX, FiRefreshCw, FiPlus, FiSearch } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Appointment {
    _id: string;
    patient: {
        _id: string;
        name: string;
        phone: string;
    };
    startTime: string;
    status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
    reason: string;
}

interface Patient {
    _id: string;
    name: string;
    phone: string;
}

export default function DoctorAppointments() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [patients, setPatients] = useState<Patient[]>([]);
    const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
    const [formData, setFormData] = useState({
        date: "",
        time: "",
        reason: ""
    });
    const [bookingLoading, setBookingLoading] = useState(false);

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

    const searchPatients = async (query: string) => {
        setSearchQuery(query);
        if (query.length < 2) {
            setPatients([]);
            return;
        }
        try {
            const res = await axios.get(`${API_URL}/users/patients?query=${query}`, getAuthHeader());
            setPatients(res.data.data);
        } catch (err) {
            console.error(err);
        }
    };

    const handleBook = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPatient) return alert("Please select a patient");

        setBookingLoading(true);
        try {
            const startTime = `${formData.date}T${formData.time}`;

            await axios.post(`${API_URL}/appointments`, {
                patientId: selectedPatient._id,
                startTime,
                reason: formData.reason
            }, getAuthHeader());

            alert("Appointment scheduled successfully!");
            setShowModal(false);
            fetchAppointments();
            // Reset form
            setFormData({ date: "", time: "", reason: "" });
            setSelectedPatient(null);
            setSearchQuery("");
        } catch (err: any) {
            console.error(err);
            alert(`Failed: ${err.response?.data?.message || "Error scheduling appointment"}`);
        } finally {
            setBookingLoading(false);
        }
    };

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
                        <p className="text-slate-500">Manage your daily schedule and patient consultations.</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-teal-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-teal-700 transition shadow-lg shadow-teal-100"
                        >
                            <FiPlus /> Add Appointment
                        </button>
                        <button
                            onClick={fetchAppointments}
                            className="p-3 bg-white border border-teal-50 rounded-xl shadow-sm hover:shadow-md transition-all text-teal-600"
                        >
                            <FiRefreshCw className={loading ? "animate-spin" : ""} />
                        </button>
                    </div>
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

            {/* Add Appointment Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-teal-950/20 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl relative border border-teal-50">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-8 right-8 text-slate-400 hover:text-teal-600 transition-colors"
                        >
                            <FiX size={24} />
                        </button>

                        <h2 className="text-2xl font-black text-teal-900 mb-8">Schedule Appointment</h2>

                        <form onSubmit={handleBook} className="space-y-6">
                            {/* Patient Search */}
                            <div className="space-y-2">
                                <label className="text-xs font-black text-teal-400 uppercase tracking-widest pl-1">Search Patient</label>
                                <div className="relative">
                                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-teal-400" />
                                    <input
                                        type="text"
                                        placeholder="Name or Phone Number"
                                        value={searchQuery}
                                        onChange={(e) => searchPatients(e.target.value)}
                                        className="w-full pl-12 pr-4 py-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-900"
                                    />

                                    {patients.length > 0 && !selectedPatient && (
                                        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-teal-50 overflow-hidden z-10">
                                            {patients.map((p) => (
                                                <button
                                                    key={p._id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedPatient(p);
                                                        setSearchQuery(p.name);
                                                        setPatients([]);
                                                    }}
                                                    className="w-full px-6 py-4 text-left hover:bg-teal-50 transition-colors border-b border-teal-50 last:border-0"
                                                >
                                                    <p className="font-bold text-teal-900">{p.name}</p>
                                                    <p className="text-xs text-teal-400">{p.phone}</p>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                                {selectedPatient && (
                                    <div className="mt-2 p-3 bg-teal-600 text-white rounded-xl flex justify-between items-center animate-fade-in">
                                        <span className="text-xs font-bold">Selected: {selectedPatient.name}</span>
                                        <button onClick={() => setSelectedPatient(null)} className="hover:text-red-200"><FiX /></button>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-widest pl-1">Date</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.date}
                                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                        className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-900"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-widest pl-1">Time</label>
                                    <input
                                        type="time"
                                        required
                                        value={formData.time}
                                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                        className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-900"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-black text-teal-400 uppercase tracking-widest pl-1">Reason / Notes</label>
                                <textarea
                                    required
                                    rows={3}
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    placeholder="Consultation for..."
                                    className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-900 resize-none"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={bookingLoading}
                                className="w-full py-5 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-100 hover:bg-teal-700 transition-all flex items-center justify-center gap-2 group"
                            >
                                {bookingLoading ? <FiRefreshCw className="animate-spin" /> : <FiCalendar />}
                                Confirm Scheduling
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }
                .animate-fade-in {
                    animation: fade-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
}
