"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiArrowRight, FiActivity } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Doctor {
    _id: string;
    name: string;
    email?: string;
}

export default function DoctorListing() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const res = await axios.get(`${API_URL}/users/doctors`, getAuthHeader());
                setDoctors(res.data.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDoctors();
    }, []);

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="p-6 bg-teal-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-extrabold text-teal-900 mb-2">Consult a Specialist</h1>
                    <p className="text-teal-700">Find the right doctor and book your consultation in seconds.</p>
                </div>

                <div className="relative mb-8">
                    <input
                        type="text"
                        placeholder="Search by doctor name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-4 pl-12 rounded-2xl shadow-sm border-2 border-transparent focus:border-teal-500 outline-none transition-all"
                    />
                    <FiSearch className="absolute left-4 top-1/2 -tranteal-y-1/2 text-xl text-teal-600" />
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin text-4xl text-teal-600">⌛</div>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {filteredDoctors.length > 0 ? (
                            filteredDoctors.map((doc) => (
                                <div key={doc._id} className="bg-white p-6 rounded-2xl shadow-sm border border-teal-100 flex items-center justify-between hover:shadow-md transition-shadow">
                                    <div className="flex items-center gap-4">
                                        <div className="w-14 h-14 bg-teal-100 rounded-xl flex items-center justify-center text-teal-600 text-2xl">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-teal-900">Dr. {doc.name || "Doctor"}</h3>
                                            <div className="flex items-center gap-2 text-sm text-teal-600">
                                                <FiActivity /> <span>General Physician</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/dashboard/patient/book-appointment?doctorId=${doc._id}&doctorName=${doc.name}`)}
                                        className="bg-teal-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-teal-700 transition flex items-center gap-2"
                                    >
                                        Book Now <FiArrowRight />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 bg-white/50 rounded-2xl border-2 border-dashed border-teal-200">
                                <p className="text-teal-800">No doctors found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
