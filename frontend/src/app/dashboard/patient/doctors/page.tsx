"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiSearch, FiUser, FiArrowRight, FiActivity, FiFilter, FiStar, FiClock, FiAward } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

const specializations = [
    "All Specializations",
    "General Physician",
    "Cardiology",
    "Dermatology",
    "Pediatrics",
    "Neurology",
    "Orthopedics",
    "Psychiatry"
];

interface Doctor {
    _id: string;
    name: string;
    email?: string;
    specialization?: string;
    department?: string;
    experience?: number;
    rating?: number;
    availableTimings?: string;
}

export default function DoctorListing() {
    const router = useRouter();
    const [doctors, setDoctors] = useState<Doctor[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
    const [sortBy, setSortBy] = useState("-rating");

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    const fetchDoctors = useCallback(async () => {
        setLoading(true);
        try {
            let url = `${API_URL}/users/doctors?name=${search}&sort=${sortBy}`;
            if (selectedSpecialization !== "All Specializations") {
                url += `&specialization=${selectedSpecialization}`;
            }
            const res = await axios.get(url, getAuthHeader());
            setDoctors(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [search, selectedSpecialization, sortBy]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            fetchDoctors();
        }, 500); // Debounce search
        return () => clearTimeout(timeoutId);
    }, [fetchDoctors]);

    return (
        <div className="p-6 bg-white min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-12 text-center">
                    <h1 className="text-5xl font-black text-teal-900 mb-4 tracking-tight">Consult Medical Experts</h1>
                    <p className="text-teal-600 text-lg font-medium">Find the right specialist and book your consultation in seconds.</p>
                </div>

                {/* Search and Filters Section */}
                <div className="bg-teal-50/50 p-8 rounded-[2.5rem] border border-teal-100 mb-10">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-5 relative">
                            <label className="block text-xs font-black text-teal-400 uppercase tracking-widest mb-3 ml-1">Search by Name</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="e.g. Dr. Smith..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="w-full p-4 pl-12 rounded-2xl shadow-sm border-2 border-white focus:border-teal-500 outline-none transition-all bg-white"
                                />
                                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-teal-400" />
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-xs font-black text-teal-400 uppercase tracking-widest mb-3 ml-1">Specialization</label>
                            <div className="relative">
                                <select
                                    value={selectedSpecialization}
                                    onChange={(e) => setSelectedSpecialization(e.target.value)}
                                    className="w-full p-4 pr-10 rounded-2xl shadow-sm border-2 border-white focus:border-teal-500 outline-none transition-all bg-white appearance-none cursor-pointer"
                                >
                                    {specializations.map(spec => (
                                        <option key={spec} value={spec}>{spec}</option>
                                    ))}
                                </select>
                                <FiFilter className="absolute right-4 top-1/2 -translate-y-1/2 text-teal-400 pointer-events-none" />
                            </div>
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-xs font-black text-teal-400 uppercase tracking-widest mb-3 ml-1">Sort By</label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full p-4 rounded-2xl shadow-sm border-2 border-white focus:border-teal-500 outline-none transition-all bg-white cursor-pointer"
                            >
                                <option value="-rating">Highest Rated</option>
                                <option value="-experience">Most Experienced</option>
                                <option value="name">Name (A-Z)</option>
                                <option value="-name">Name (Z-A)</option>
                            </select>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50">
                        <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-6"></div>
                        <div className="text-teal-900 font-black uppercase tracking-widest text-sm">Searching specialists...</div>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {doctors.length > 0 ? (
                            doctors.map((doc) => (
                                <div key={doc._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-teal-50 flex flex-col md:flex-row items-center justify-between hover:shadow-2xl hover:border-teal-100 transition-all group duration-500">
                                    <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                        <div className="w-24 h-24 bg-gradient-to-tr from-teal-50 to-teal-100 rounded-3xl flex items-center justify-center text-teal-600 text-4xl shadow-inner group-hover:rotate-3 transition-transform duration-500">
                                            <FiUser />
                                        </div>
                                        <div>
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-2 justify-center md:justify-start">
                                                <h3 className="text-2xl font-black text-teal-900">Dr. {doc.name || "Specialist"}</h3>
                                                {doc.rating && (
                                                    <div className="flex items-center gap-1 bg-amber-50 text-amber-600 px-3 py-1 rounded-full text-xs font-black">
                                                        <FiStar className="fill-amber-600" /> {doc.rating.toFixed(1)}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-teal-600 justify-center md:justify-start">
                                                <div className="flex items-center gap-2 bg-teal-50 px-4 py-2 rounded-xl">
                                                    <FiActivity /> <span>{doc.specialization || "General Physician"}</span>
                                                </div>
                                                {doc.experience && (
                                                    <div className="flex items-center gap-2 bg-slate-50 px-4 py-2 rounded-xl text-slate-600">
                                                        <FiAward /> <span>{doc.experience}+ Years Exp.</span>
                                                    </div>
                                                )}
                                                {doc.availableTimings && (
                                                    <div className="flex items-center gap-2 bg-teal-900 text-white px-4 py-2 rounded-xl">
                                                        <FiClock /> <span>{doc.availableTimings}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => router.push(`/dashboard/patient/book-appointment?doctorId=${doc._id}&doctorName=${doc.name}`)}
                                        className="mt-6 md:mt-0 bg-teal-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-teal-700 transition-all flex items-center gap-3 shadow-xl shadow-teal-100 hover:scale-105 active:scale-95"
                                    >
                                        Book Consultation <FiArrowRight />
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-32 bg-teal-50/30 rounded-[3rem] border-4 border-dashed border-teal-100 flex flex-col items-center justify-center">
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-teal-200 text-6xl mb-8 shadow-sm">
                                    <FiUser />
                                </div>
                                <h3 className="text-3xl font-black text-teal-900 mb-2">No Specialists Found</h3>
                                <p className="text-teal-600 font-medium text-lg max-w-sm">Try adjusting your filters or search keywords to find certified medical experts.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
