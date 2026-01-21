"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
    FiSearch, FiMapPin, FiPhone, FiShoppingBag, FiInfo, FiChevronRight,
    FiUpload, FiFileText, FiTarget, FiX, FiCheckCircle, FiArrowRight
} from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

interface Pharmacy {
    name: string;
    address: string;
    phone: string;
    googleMapsUrl?: string;
    location?: {
        coordinates: [number, number];
    };
}

interface Medicine {
    _id: string;
    name: string;
    brand: string;
    category: string;
    price: number;
    stock: number;
    expiryDate: string;
    dosageForm: string;
    strength: string;
    pharmacy: Pharmacy;
    distance?: number;
}

export default function MedicineSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Medicine[]>([]);
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);
    const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
    const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
    const [prescriptionText, setPrescriptionText] = useState("");

    // Request geolocation on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                (err) => console.error("Geolocation error:", err)
            );
        }
    }, []);

    const fetchSuggestions = useCallback(
        debounce(async (val: string) => {
            if (val.length < 2) {
                setSuggestions([]);
                setShowSuggestions(false);
                return;
            }
            try {
                const res = await axios.get(`${API_URL}/medicines/suggestions?query=${val}`);
                setSuggestions(res.data.data);
                setShowSuggestions(res.data.data.length > 0);
            } catch (err) {
                console.error("Error fetching suggestions:", err);
            }
        }, 300),
        []
    );

    const handleSearch = async (overrideQuery?: string) => {
        const searchQuery = overrideQuery || query;
        if (!searchQuery.trim()) return;

        setLoading(true);
        setSearched(true);
        setShowSuggestions(false);
        try {
            let url = `${API_URL}/medicines/search?query=${searchQuery}`;
            if (coords) {
                url += `&lat=${coords.lat}&lng=${coords.lng}`;
            }
            const res = await axios.get(url);
            setResults(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Error searching medicines");
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (val: string) => {
        setQuery(val);
        fetchSuggestions(val);
    };

    const handleSuggestionClick = (suggestion: string) => {
        setQuery(suggestion);
        setSuggestions([]);
        setShowSuggestions(false);
        handleSearch(suggestion);
    };

    const handlePrescriptionMatch = () => {
        // Simple logic: extract words and search for the first recognizable one
        const words = prescriptionText.split(/[,\s\n]+/).filter(w => w.length > 3);
        if (words.length > 0) {
            setQuery(words[0]);
            handleSearch(words[0]);
            setShowPrescriptionModal(false);
        }
    };

    return (
        <div className="p-6 bg-teal-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-teal-900 mb-2 tracking-tight">Medicine Discovery</h1>
                        <p className="text-teal-600 font-medium">Find availability in the nearest pharmacies within your network.</p>
                    </div>
                    <button
                        onClick={() => setShowPrescriptionModal(true)}
                        className="bg-white text-teal-600 border-2 border-teal-100 px-6 py-3 rounded-2xl font-black flex items-center gap-3 hover:bg-teal-50 transition-all shadow-xl shadow-teal-200/50"
                    >
                        <FiFileText className="text-xl" /> Auto-Match Prescription
                    </button>
                </div>

                {/* Search Interface */}
                <div className="mb-14 relative flex flex-col md:flex-row gap-4">
                    <div className="relative flex-grow">
                        <form onSubmit={(e) => { e.preventDefault(); handleSearch(); }} className="relative">
                            <input
                                type="text"
                                value={query}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onFocus={() => query.length >= 2 && setShowSuggestions(true)}
                                placeholder="Search for 'Paracetamol', 'Metformin', etc."
                                className="w-full p-5 pl-14 rounded-[2rem] shadow-2xl shadow-teal-200/40 border-2 border-transparent focus:border-teal-500 focus:outline-none text-lg transition-all bg-white"
                            />
                            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-2xl text-teal-300" />
                            <button
                                type="submit"
                                className="absolute right-2.5 top-2.5 bottom-2.5 bg-teal-600 text-white px-10 rounded-[1.5rem] font-black hover:bg-teal-700 transition shadow-lg shadow-teal-200"
                            >
                                Locate
                            </button>
                        </form>

                        {/* Autocomplete Suggestions */}
                        {showSuggestions && suggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 z-50 mt-4 bg-white rounded-[2rem] shadow-2xl border border-teal-50 overflow-hidden animate-fade-in py-2">
                                {suggestions.map((suggestion, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSuggestionClick(suggestion)}
                                        className="w-full text-left px-8 py-4 hover:bg-teal-50 flex items-center justify-between group transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-all">
                                                <FiTarget />
                                            </div>
                                            <span className="font-bold text-teal-900 text-lg">{suggestion}</span>
                                        </div>
                                        <FiChevronRight className="text-teal-200 group-hover:text-teal-600 transition-transform group-hover:translate-x-1" />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <div className="bg-white px-6 py-5 rounded-[2rem] border-2 border-teal-100 flex items-center gap-3 shadow-xl shadow-teal-200/30">
                        <div className={`w-3 h-3 rounded-full ${coords ? 'bg-green-500 animate-pulse' : 'bg-red-400'}`}></div>
                        <span className="text-xs font-black text-teal-800 uppercase tracking-widest whitespace-nowrap">
                            {coords ? 'Network Positioned' : 'Positioning...'}
                        </span>
                    </div>
                </div>

                {/* Results Grid */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-32 opacity-50">
                        <div className="w-16 h-16 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-6"></div>
                        <div className="text-teal-900 font-black uppercase tracking-widest text-sm">Mapping Stock availability...</div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {searched && results.length === 0 && (
                            <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-4 border-dashed border-teal-100">
                                <div className="w-24 h-24 bg-teal-50 rounded-full flex items-center justify-center text-teal-200 text-5xl mx-auto mb-8">
                                    <FiInfo />
                                </div>
                                <h3 className="text-2xl font-black text-teal-900 mb-2">No Local Matches Found</h3>
                                <p className="text-teal-500 font-medium">We couldn't find "{query}" in pharmacies near your position.</p>
                            </div>
                        )}

                        {results.map((med) => (
                            <div key={med._id} className="bg-white p-10 rounded-[3rem] shadow-xl shadow-teal-100/50 border border-teal-50 hover:shadow-2xl hover:border-teal-100 transition-all group duration-500 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-black text-teal-950">{med.name}</h3>
                                            <span className="text-[10px] font-black uppercase tracking-widest bg-teal-900 text-white px-3 py-1 rounded-lg">{med.category || 'General'}</span>
                                        </div>
                                        <p className="text-teal-500 font-bold text-sm tracking-tight">{med.brand} • {med.strength} • {med.dosageForm}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-3xl font-black text-teal-700 leading-none mb-1">₹{med.price}</p>
                                        <p className="text-[10px] font-black text-teal-300 uppercase tracking-widest">Unit Price</p>
                                    </div>
                                </div>

                                <div className="bg-teal-50/50 p-6 rounded-2xl border border-teal-100 mb-10 group-hover:bg-white transition-colors">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-teal-600 rounded-xl flex items-center justify-center text-white text-xl">
                                            <FiShoppingBag />
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-teal-950 leading-tight">{med.pharmacy?.name}</p>
                                            <p className="text-xs font-bold text-teal-400 italic">Verified Partner Pharmacy</p>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3 text-sm font-bold text-teal-700">
                                            <FiMapPin className="text-teal-400" />
                                            <span className="truncate">{med.pharmacy?.address}</span>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center gap-2 text-xs font-black text-teal-900 uppercase tracking-widest">
                                                <div className={`w-2 h-2 rounded-full ${med.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                                {med.stock > 0 ? `${med.stock} Units In Stock` : 'Out of Stock'}
                                            </div>
                                            {coords && (
                                                <div className="flex items-center gap-2 text-xs font-black text-teal-500 uppercase tracking-widest bg-white px-3 py-1 rounded-lg border border-teal-50">
                                                    <FiTarget className="text-teal-600" /> {med.distance ? `${(med.distance / 1000).toFixed(1)} km away` : 'Calculating...'}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => med.pharmacy?.googleMapsUrl ? window.open(med.pharmacy.googleMapsUrl, "_blank") : alert("No Maps Link")}
                                    className="w-full bg-teal-600 text-white font-black py-4 rounded-2xl shadow-xl shadow-teal-100 hover:bg-teal-700 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    Map Route Arrival <FiArrowRight />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Prescription Auto-Matcher Modal */}
            {showPrescriptionModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 backdrop-blur-3xl bg-teal-950/20 animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3.5rem] p-12 shadow-2xl relative overflow-hidden border border-teal-50">
                        <button onClick={() => setShowPrescriptionModal(false)} className="absolute top-10 right-10 w-12 h-12 rounded-2xl bg-teal-50 flex items-center justify-center text-teal-600 hover:rotate-90 transition-all">
                            <FiX className="text-2xl" />
                        </button>

                        <div className="mb-10 text-center">
                            <div className="w-20 h-20 bg-teal-600 rounded-3xl flex items-center justify-center text-white text-4xl mx-auto mb-6 shadow-xl shadow-teal-200">
                                <FiUpload />
                            </div>
                            <h2 className="text-4xl font-black text-teal-950 mb-3 tracking-tighter">Inventory Matchmaker</h2>
                            <p className="text-teal-500 font-bold">Paste your prescription text or scan image to find matches.</p>
                        </div>

                        <div className="space-y-6">
                            <textarea
                                value={prescriptionText}
                                onChange={(e) => setPrescriptionText(e.target.value)}
                                placeholder="Paste medicine names, dosages or diagnostic text here..."
                                className="w-full min-h-[150px] p-8 rounded-[2rem] bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none text-teal-950 font-bold placeholder:text-teal-200 transition-all"
                            />

                            <div className="flex gap-4">
                                <button className="flex-grow bg-slate-100 text-slate-500 font-black py-5 rounded-2xl flex items-center justify-center gap-3 cursor-not-allowed">
                                    <FiUpload /> Upload Image Scan
                                </button>
                                <button
                                    onClick={handlePrescriptionMatch}
                                    className="flex-grow bg-teal-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all flex items-center justify-center gap-3 active:scale-95"
                                >
                                    <FiCheckCircle /> Execute Match
                                </button>
                            </div>
                        </div>
                        <p className="mt-8 text-center text-xs text-teal-300 font-bold uppercase tracking-widest">
                            AI-Powered analysis is in beta v2.0
                        </p>
                    </div>
                </div>
            )}

            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
            `}</style>
        </div>
    );
}
