"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiLock, FiSave, FiShield } from "react-icons/fi";

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const userStr = localStorage.getItem("currentUser");
        if (userStr) setUser(JSON.parse(userStr));
    }, []);

    return (
        <div className="min-h-screen bg-[#F0F7F7] flex flex-col font-sans selection:bg-teal-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-teal-200/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-200/20 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-[1600px] mx-auto px-8 py-10 w-full flex-grow flex flex-col items-start">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl text-teal-600 font-black text-sm mb-12 shadow-sm hover:shadow-md transition-all border border-teal-50 group active:scale-95"
                >
                    <FiArrowLeft className="group-hover:-tranteal-x-1 transition-transform" /> Back to Dashboard
                </button>

                <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

                    <div className="lg:col-span-4">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-teal-200/50 border border-teal-50 flex flex-col items-center text-center">
                            <div className="w-32 h-32 bg-gradient-to-tr from-teal-400 to-teal-600 rounded-[2.5rem] flex items-center justify-center text-white text-6xl font-black shadow-2xl mb-8 group hover:rotate-6 transition-transform duration-500">
                                {user?.name?.charAt(0) || "P"}
                            </div>
                            <h2 className="text-3xl font-black text-teal-900 mb-2 tracking-tight">{user?.name}</h2>
                            <span className="text-teal-600 text-xs font-black uppercase tracking-[0.3em] bg-teal-50 px-5 py-2 rounded-full">Verified Medico Member</span>

                            <div className="mt-12 w-full space-y-4">
                                <div className="p-5 bg-teal-50 rounded-2xl flex justify-between items-center">
                                    <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Medical ID</span>
                                    <span className="font-mono text-teal-800 font-bold">#RX-9921-A</span>
                                </div>
                                <div className="p-5 bg-teal-50 rounded-2xl flex justify-between items-center">
                                    <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Member Since</span>
                                    <span className="font-bold text-teal-800">Jan 2026</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-8">
                        <div className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-teal-200/50 border border-teal-50">
                            <h2 className="text-3xl font-black text-teal-900 mb-10 tracking-tight flex items-center gap-4">
                                Personal Information
                                <div className="h-1 flex-grow bg-teal-100 rounded-full"></div>
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                <div className="space-y-4">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] ml-1">Legal Full Name</label>
                                    <div className="relative">
                                        <input readOnly value={user?.name || ""} className="w-full p-6 pl-16 rounded-[1.5rem] bg-teal-50 border-none outline-none font-bold text-teal-500 cursor-not-allowed text-lg shadow-inner" />
                                        <FiUser className="absolute left-6 top-1/2 -tranteal-y-1/2 text-teal-400 text-2xl" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] ml-1">Mobile Contact</label>
                                    <div className="relative">
                                        <input readOnly value={user?.phone || ""} className="w-full p-6 pl-16 rounded-[1.5rem] bg-teal-50 border-none outline-none font-bold text-teal-500 cursor-not-allowed text-lg shadow-inner" />
                                        <FiPhone className="absolute left-6 top-1/2 -tranteal-y-1/2 text-teal-400 text-2xl" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <div className="relative">
                                        <input readOnly value={user?.email || "patient@medico.com"} className="w-full p-6 pl-16 rounded-[1.5rem] bg-teal-50 border-none outline-none font-bold text-teal-500 cursor-not-allowed text-lg shadow-inner" />
                                        <FiMail className="absolute left-6 top-1/2 -tranteal-y-1/2 text-teal-400 text-2xl" />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-teal-400 uppercase tracking-[0.2em] ml-1">Security PIN</label>
                                    <div className="relative">
                                        <input type="password" value="****" readOnly className="w-full p-6 pl-16 rounded-[1.5rem] bg-teal-50 border-none outline-none font-bold text-teal-500 cursor-not-allowed text-lg shadow-inner" />
                                        <FiLock className="absolute left-6 top-1/2 -tranteal-y-1/2 text-teal-400 text-2xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-16 p-8 bg-amber-50 rounded-[2rem] border border-amber-100 flex items-center gap-6">
                                <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center text-amber-600 text-3xl shrink-0">
                                    <FiShield />
                                </div>
                                <div>
                                    <h4 className="font-black text-amber-900 text-lg mb-1">Account is Locked</h4>
                                    <p className="text-amber-700/70 font-medium">To edit your verified profile information, please contact our support team with valid identification documents.</p>
                                </div>
                            </div>

                            <button disabled className="w-full mt-12 py-6 bg-teal-900 text-white rounded-[1.5rem] font-black text-lg opacity-20 cursor-not-allowed flex items-center justify-center gap-3 transition-all tracking-widest uppercase">
                                <FiSave className="text-2xl" /> Save Configuration
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
