"use client";

import { useRouter } from 'next/navigation';

export default function RoleSelect() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-6">
            <div className="max-w-4xl w-full bg-white rounded-[3rem] shadow-2xl p-12 text-center border border-teal-50">
                <h1 className="text-4xl font-black text-teal-950 mb-6">Select Your Role</h1>
                <p className="text-teal-600/70 mb-12">Please choose how you would like to continue with MEDORYX.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {['Patient', 'Doctor', 'Pharmacy', 'Hospital'].map((role) => (
                        <button
                            key={role}
                            onClick={() => router.push(`/dashboard/${role.toLowerCase()}`)}
                            className="p-8 bg-teal-50/50 rounded-2xl border-2 border-teal-50 hover:border-teal-600 hover:bg-teal-50 transition-all font-bold text-teal-800"
                        >
                            {role}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
