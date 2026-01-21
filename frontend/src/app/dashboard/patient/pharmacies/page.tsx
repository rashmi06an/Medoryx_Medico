"use client";

import { useRouter } from "next/navigation";
import { FiArrowLeft, FiMapPin, FiSearch } from "react-icons/fi";

const pharmacies = [
    { id: 1, name: "City Care Pharmacy", address: "123 Healthcare Ave, Metro City", distance: "0.8 km", status: "Open" },
    { id: 2, name: "Wellness Plus", address: "45 Wellness St, South Park", distance: "1.2 km", status: "Closes at 10 PM" },
    { id: 3, name: "MedLife Express", address: "89 Rapid Road, North Metro", distance: "2.5 km", status: "24/7" },
];

export default function PharmaciesPage() {
    const router = useRouter();

    return (
        <div className="min-h-screen bg-[#F0F7F7] flex flex-col font-sans selection:bg-teal-100 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-orange-200/10 blur-[120px] rounded-full -z-10"></div>
            <div className="absolute bottom-20 left-0 w-96 h-96 bg-teal-200/10 blur-[120px] rounded-full -z-10"></div>

            <div className="max-w-[1600px] mx-auto px-8 py-10 w-full flex-grow">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 bg-white px-6 py-3 rounded-2xl text-teal-600 font-black text-sm mb-12 shadow-sm hover:shadow-md transition-all border border-teal-50 group active:scale-95"
                >
                    <FiArrowLeft className="group-hover:-tranteal-x-1 transition-transform" /> Back to Dashboard
                </button>

                <div className="mb-16">
                    <h1 className="text-6xl font-black text-teal-900 mb-4 tracking-tight leading-tight">Pharmacy Network</h1>
                    <p className="text-xl text-teal-500 font-medium max-w-2xl">Locate and navigate to our certified partner pharmacies for immediate physical medication pickups.</p>
                </div>

                <div className="relative mb-16 max-w-2xl">
                    <input
                        type="text"
                        placeholder="Search by area or pharmacy name..."
                        className="w-full p-6 pl-16 rounded-[2rem] shadow-xl shadow-teal-200/50 border-white outline-none focus:ring-4 ring-teal-500/10 transition-all font-bold text-teal-700 text-lg"
                    />
                    <FiSearch className="absolute left-6 top-1/2 -tranteal-y-1/2 text-2xl text-teal-400" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {pharmacies.map((pharmacy) => (
                        <div key={pharmacy.id} className="bg-white p-10 rounded-[3rem] shadow-lg shadow-teal-200/50 border border-teal-50 flex flex-col justify-between transition-all hover:shadow-2xl hover:border-teal-100 cursor-pointer group hover:-tranteal-y-2 duration-500">
                            <div className="mb-10">
                                <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2rem] flex items-center justify-center text-white text-3xl shadow-lg shadow-orange-900/10 group-hover:rotate-12 transition-all duration-500 mb-8">
                                    <FiMapPin />
                                </div>
                                <h3 className="text-2xl font-black text-teal-900 mb-3 group-hover:text-teal-700 transition-colors">{pharmacy.name}</h3>
                                <p className="text-teal-500 text-base font-medium leading-relaxed">{pharmacy.address}</p>
                            </div>

                            <div className="flex items-center justify-between pt-8 border-t border-teal-50">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1">Status</span>
                                    <span className="text-xs font-black text-teal-600 bg-teal-50 px-4 py-1.5 rounded-full">{pharmacy.status}</span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-teal-400 uppercase tracking-widest mb-1 block">Distance</span>
                                    <p className="text-teal-900 font-black text-base">{pharmacy.distance}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
