"use client";

import { FiUsers, FiCalendar, FiActivity, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorDashboard() {
    const router = useRouter();
    const [user] = useState<{ name: string } | null>(() => {
        const userStr = localStorage.getItem("currentUser");
        return userStr ? JSON.parse(userStr) : null;
    });

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            router.replace("/");
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-teal-800 tracking-tight">Medico<span className="text-teal-500">.</span></h1>
                        <p className="text-sm text-gray-500">Doctor Portal</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-gray-700">Dr. {user?.name || "Doctor"}</span>
                        <button
                            onClick={() => {
                                localStorage.removeItem("currentUser");
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
                <div className="mb-10">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Clinical Dashboard</h2>
                    <p className="mt-2 text-lg text-gray-600">Manage appointments, patients, and prescriptions.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Action Card: Appointments */}
                    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
                            <FiCalendar className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">Appointments</h3>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            View upcoming consultations and manage your daily schedule.
                        </p>
                        <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
                            View Schedule &rarr;
                        </span>
                    </div>

                    {/* Action Card: My Patients */}
                    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
                            <FiUsers className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">My Patients</h3>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            Access patient records, history, and contact information.
                        </p>
                        <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
                            Patient List &rarr;
                        </span>
                    </div>

                    {/* Action Card: Prescriptions */}
                    <div className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50">
                        <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
                            <FiActivity className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">Prescriptions</h3>
                        <p className="text-gray-500 leading-relaxed mb-4">
                            Create and manage digital prescriptions for your patients.
                        </p>
                        <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
                            Write Rx &rarr;
                        </span>
                    </div>
                </div>
            </main>
        </div>
    );
}
