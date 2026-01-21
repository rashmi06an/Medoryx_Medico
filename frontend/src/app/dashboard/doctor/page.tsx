"use client";

import { FiUsers, FiCalendar, FiActivity, FiLogOut, FiChevronDown, FiPlus } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DoctorDashboard() {
    const router = useRouter();
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [user] = useState<{ name: string } | null>(() => {
        if (typeof window !== 'undefined') {
            const userStr = localStorage.getItem("currentUser");
            return userStr ? JSON.parse(userStr) : null;
        }
        return null;
    });

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (!userStr) {
            router.replace("/");
        }
    }, [router]);

    return (
        <div className="min-h-screen bg-teal-50 flex flex-col font-sans text-teal-900">
            {/* Header / Navbar */}
            <nav className="h-20 flex items-center justify-between px-6 md:px-12 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-teal-50">
                <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/dashboard/doctor')}>
                    <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-teal-200 transition-transform group-hover:rotate-12">
                        <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="flex flex-col leading-none">
                        <span className="text-2xl font-bold text-teal-900 tracking-tight">Medoryx</span>
                        <span className="text-[10px] font-bold text-teal-500 uppercase tracking-widest mt-1">Doctor Portal</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="flex items-center gap-3 bg-teal-50 p-1.5 pr-4 rounded-full hover:bg-teal-50 transition-all border border-teal-100"
                    >
                        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white shadow-md shadow-teal-100 font-bold text-xs">
                            Dr.
                        </div>
                        <span className="text-sm font-semibold text-teal-800 hidden sm:block">
                            {user?.name || "Practitioner"}
                        </span>
                        <FiChevronDown className={`text-teal-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
                    </button>

                    {showProfileMenu && (
                        <div className="absolute top-14 right-0 w-60 bg-white rounded-2xl shadow-2xl border border-teal-50 p-4 z-50 animate-fade-in ring-1 ring-teal-500/5">
                            <div className="px-4 py-2 mb-2 border-b border-teal-50">
                                <p className="text-[10px] font-bold text-teal-400 uppercase tracking-widest mb-1">Authenticated</p>
                                <p className="text-md font-bold text-teal-800 truncate">Dr. {user?.name}</p>
                            </div>
                            <div className="space-y-1">
                                <button
                                    onClick={() => {
                                        localStorage.removeItem("currentUser");
                                        localStorage.removeItem("token");
                                        router.push("/");
                                    }}
                                    className="w-full text-left px-4 py-2.5 rounded-xl hover:bg-red-50 text-red-500 font-medium text-sm transition-all flex items-center gap-2"
                                >
                                    <FiLogOut /> Logout Session
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-grow max-w-7xl mx-auto px-6 lg:px-12 py-12 w-full">
                {/* Hero Section */}
                <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="text-4xl font-extrabold text-teal-800 tracking-tight">Clinical Dashboard</h2>
                        <p className="mt-2 text-lg text-teal-500 font-medium">Manage your digital practice, patients, and prescriptions.</p>
                    </div>
                    <button className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-lg shadow-teal-100 flex items-center gap-2 w-fit">
                        <FiPlus /> New Appointment
                    </button>
                </div>

                {/* Dashboard Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Action Card: Appointments */}
                    <div
                        onClick={() => router.push("/dashboard/doctor/appointments")}
                        className="group bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.08)] hover:-tranteal-y-1.5 transition-all duration-300 cursor-pointer border border-teal-100 hover:border-teal-100 flex flex-col"
                    >
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-50">
                            <FiCalendar size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-teal-800 mb-3 group-hover:text-teal-700 transition-colors">Appointments</h3>
                        <p className="text-teal-500 font-medium leading-relaxed mb-6">
                            View upcoming consultations and manage your daily patient schedule.
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider">
                            Open Schedule <span className="transition-transform group-hover:tranteal-x-1">→</span>
                        </div>
                    </div>

                    {/* Action Card: My Patients */}
                    <div
                        onClick={() => router.push("/dashboard/doctor/patients")}
                        className="group bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.08)] hover:-tranteal-y-1.5 transition-all duration-300 cursor-pointer border border-teal-100 hover:border-teal-100 flex flex-col"
                    >
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-50">
                            <FiUsers size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-teal-800 mb-3 group-hover:text-teal-700 transition-colors">My Patients</h3>
                        <p className="text-teal-500 font-medium leading-relaxed mb-6">
                            Securely access centralized patient records, history, and contact info.
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider">
                            Patient Database <span className="transition-transform group-hover:tranteal-x-1">→</span>
                        </div>
                    </div>

                    {/* Action Card: Prescriptions */}
                    <div
                        onClick={() => router.push("/dashboard/doctor/prescriptions")}
                        className="group bg-white p-10 rounded-[2.5rem] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_20px_40px_rgba(13,148,136,0.08)] hover:-tranteal-y-1.5 transition-all duration-300 cursor-pointer border border-teal-100 hover:border-teal-100 flex flex-col"
                    >
                        <div className="w-16 h-16 bg-teal-50 text-teal-600 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all duration-300 shadow-sm shadow-teal-50">
                            <FiActivity size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-teal-800 mb-3 group-hover:text-teal-700 transition-colors">Prescriptions</h3>
                        <p className="text-teal-500 font-medium leading-relaxed mb-6">
                            Create, sign, and manage secure digital prescriptions for your patients.
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-teal-600 font-bold text-sm uppercase tracking-wider">
                            Write New Rx <span className="transition-transform group-hover:tranteal-x-1">→</span>
                        </div>
                    </div>

                    {/* Action Card: Live Queue Manager */}
                    <div
                        onClick={() => router.push("/dashboard/doctor/queue")}
                        className="group bg-teal-900 p-10 rounded-[2.5rem] shadow-2xl shadow-teal-950/20 hover:-tranteal-y-1.5 transition-all duration-300 cursor-pointer flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <FiActivity size={120} className="text-white" />
                        </div>
                        <div className="w-16 h-16 bg-white/10 text-white rounded-2xl flex items-center justify-center mb-8 group-hover:bg-white group-hover:text-teal-900 transition-all duration-300">
                            <FiActivity size={28} />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">Live Queue</h3>
                        <p className="text-teal-300 font-medium leading-relaxed mb-6">
                            Real-time turn management. Call patients and monitor waiting room status.
                        </p>
                        <div className="mt-auto flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                            Start Serving <span className="transition-transform group-hover:tranteal-x-1">→</span>
                        </div>
                    </div>
                </div>
            </main>

            <style jsx global>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    background-color: #FFFFFF;
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(8px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.3s ease-out forwards;
                }
            `}</style>
        </div>
    );
}