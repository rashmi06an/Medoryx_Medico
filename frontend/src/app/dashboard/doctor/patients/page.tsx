"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiUsers, FiUser, FiPhone, FiMail, FiFileText } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Patient {
    _id: string;
    name: string;
    phone: string;
    email?: string;
}

export default function DoctorPatients() {
    const [patients, setPatients] = useState<Patient[]>([]);
    const [loading, setLoading] = useState(true);

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchPatients = async () => {
        setLoading(true);
        try {
            // For now, we can fetch patients from a generic endpoint or through appointments
            // Let's assume there's a custom logic to get unique patients seen by this doctor
            const res = await axios.get(`${API_URL}/appointments/doctor`, getAuthHeader());
            const uniquePatients = Array.from(new Set(res.data.data.map((app: any) => JSON.stringify(app.patient))))
                .map((p: any) => JSON.parse(p))
                .filter(p => p !== null);
            setPatients(uniquePatients);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
    }, []);

    return (
        <div className="p-6 bg-white min-h-screen text-teal-800">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-teal-800">My Patients</h1>
                    <p className="text-white0">Directory of patients who have consulted with you.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-pulse text-teal-600 font-semibold italic">Loading patient list...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {patients.length > 0 ? (
                            patients.map((p) => (
                                <div key={p._id} className="bg-white p-6 rounded-2xl shadow-sm border border-teal-50 hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center text-teal-600 text-xl font-bold">
                                            {p.name?.charAt(0) || "P"}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">{p.name || "Unknown"}</h3>
                                            <p className="text-sm text-white0 italic">Medoryx Patient</p>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <FiPhone className="text-teal-500" /> {p.phone}
                                        </div>
                                        {p.email && (
                                            <div className="flex items-center gap-2">
                                                <FiMail className="text-teal-500" /> {p.email}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-6 pt-4 border-t border-gray-100 flex gap-2">
                                        <button className="flex-grow flex items-center justify-center gap-2 py-2 bg-teal-50 text-teal-600 rounded-lg font-semibold hover:bg-teal-600 hover:text-white transition-all">
                                            <FiFileText /> View Records
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white rounded-2xl border border-dashed border-gray-300">
                                <FiUsers className="text-5xl text-gray-300 mx-auto mb-4" />
                                <p className="text-white0">No patients found in your records yet.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
