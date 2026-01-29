"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { FiShoppingBag, FiMapPin, FiClock, FiTag, FiSearch, FiInfo } from "react-icons/fi";
import Link from "next/link";

interface MarketplaceMedicine {
    _id: string;
    name: string;
    brand: string;
    price: number;
    discountPrice: number;
    expiryDate: string;
    pharmacy: {
        name: string;
        address: string;
        location: {
            coordinates: [number, number];
        };
        googleMapsUrl?: string;
    };
}

export default function MarketplacePage() {
    const [medicines, setMedicines] = useState<MarketplaceMedicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchMarketplace();
    }, []);

    const fetchMarketplace = async () => {
        try {
            const res = await axios.get("http://localhost:8000/api/medicines/marketplace");
            if (res.data.success) {
                setMedicines(res.data.data);
            }
        } catch (err) {
            console.error("Failed to fetch marketplace:", err);
        } finally {
            setLoading(false);
        }
    };

    const filteredMedicines = medicines.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.brand.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            {/* Header */}
            <header className="bg-white border-b border-orange-100 sticky top-0 z-20">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <Link href="/" className="flex items-center gap-2">
                        <span className="text-2xl font-black text-teal-800 tracking-tight">Medico<span className="text-orange-500">Market</span></span>
                    </Link>
                    <div className="flex-grow max-w-md mx-8 relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search discounted medicines..."
                            className="w-full pl-12 pr-4 py-2.5 bg-slate-100 border-transparent focus:bg-white focus:border-orange-200 focus:ring-4 focus:ring-orange-100 rounded-2xl outline-none transition-all font-medium text-slate-700"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <Link
                        href="/auth/login"
                        className="text-sm font-bold text-teal-600 hover:text-teal-700 bg-teal-50 px-5 py-2.5 rounded-xl transition"
                    >
                        Pharmacy Login
                    </Link>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 w-full flex-grow">
                {/* Hero Banner Area */}
                <div className="bg-gradient-to-br from-orange-400 to-orange-600 rounded-[3rem] p-12 text-white mb-12 shadow-2xl shadow-orange-100 relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl">
                        <h1 className="text-5xl font-black mb-4 tracking-tighter">Save Lives, <br />Stop Wastage.</h1>
                        <p className="text-orange-50 text-xl font-medium leading-relaxed opacity-90">
                            Access high-quality medicines at significantly reduced prices. These genuine supplies are nearing their expiry date but are perfectly safe and verified for use.
                        </p>
                        <div className="mt-8 flex gap-4">
                            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                                <FiTag className="text-xl" /> Up to 80% Off
                            </div>
                            <div className="bg-white/20 backdrop-blur-md px-6 py-3 rounded-2xl font-bold flex items-center gap-2">
                                <FiClock className="text-xl" /> Near-Expiry Only
                            </div>
                        </div>
                    </div>
                    <FiShoppingBag className="absolute -right-10 -bottom-10 text-[20rem] text-white/10 rotate-12" />
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-4"></div>
                        <p className="font-black text-orange-950 uppercase tracking-widest text-xs">Curating Marketplace...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredMedicines.length > 0 ? (
                            filteredMedicines.map((med) => (
                                <div key={med._id} className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 p-8 hover:shadow-2xl transition-all group hover:-translate-y-1">
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 text-2xl shadow-sm">
                                            <FiTag />
                                        </div>
                                        <div className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
                                            Save ₹{med.price - med.discountPrice}
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-2xl font-black text-slate-900 mb-1">{med.name}</h3>
                                        <p className="text-slate-400 font-bold">{med.brand}</p>
                                    </div>

                                    <div className="flex items-baseline flex-wrap gap-2 mb-8">
                                        <span className="text-3xl font-black text-orange-600 break-all leading-none">₹{med.discountPrice}</span>
                                        <span className="text-xl text-slate-300 font-bold line-through break-all leading-none opacity-60">₹{med.price}</span>
                                    </div>

                                    <div className="space-y-4 pt-6 border-t border-slate-50 mb-8">
                                        <div className="flex items-center gap-3">
                                            <FiClock className="text-orange-400" />
                                            <span className="text-sm font-bold text-slate-600">Expires: {new Date(med.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <FiMapPin className="text-slate-400 mt-1 shrink-0" />
                                            <div>
                                                <p className="text-sm font-black text-slate-800 leading-none mb-1">{med.pharmacy.name}</p>
                                                <p className="text-xs font-medium text-slate-400 leading-tight">{med.pharmacy.address}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        {med.pharmacy.googleMapsUrl && (
                                            <a
                                                href={med.pharmacy.googleMapsUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-14 h-14 flex items-center justify-center rounded-2xl bg-slate-50 text-slate-600 hover:bg-slate-200 transition-colors"
                                            >
                                                <FiMapPin className="text-xl" />
                                            </a>
                                        )}
                                        <button className="flex-grow bg-slate-900 text-white font-black py-4 rounded-2xl hover:bg-slate-800 transition shadow-xl shadow-slate-200 active:scale-95">
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center opacity-50">
                                <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-300 text-4xl mb-6">
                                    <FiSearch />
                                </div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">No Medicines Found</h3>
                                <p className="text-slate-500 font-bold">Try searching for something else or check back later.</p>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Footer / Disclaimer */}
            <footer className="bg-white border-t border-slate-100 py-12 mt-12">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="flex items-center gap-2">
                        <FiInfo className="text-orange-400 text-xl" />
                        <p className="text-sm font-medium text-slate-400">
                            Medico Marketplace is a waste reduction initiative. All medicines are authentic pharmacy stock.
                        </p>
                    </div>
                    <div className="flex gap-8">
                        <Link href="/" className="text-sm font-bold text-slate-400 hover:text-teal-600 transition">Home</Link>
                        <Link href="/auth/login" className="text-sm font-bold text-slate-400 hover:text-teal-600 transition">Pharmacy Portal</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
