"use client";

import { useState } from "react";
import axios from "axios";
import { FiSearch, FiMapPin, FiPhone, FiShoppingBag, FiInfo } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

interface Pharmacy {
    name: string;
    address: string;
    phone: string;
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
}

export default function MedicineSearchPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setSearched(true);
        try {
            // Public route
            const res = await axios.get(`${API_URL}/medicines/search?query=${query}`);
            setResults(res.data.data);
        } catch (err) {
            console.error(err);
            alert("Error searching medicines");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 bg-teal-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-teal-800 mb-2">Find Medicines Nearby</h1>
                <p className="text-teal-600 mb-8">Search for medicines and check realtime availability in local pharmacies.</p>

                {/* Search Bar */}
                <form onSubmit={handleSearch} className="mb-10 relative">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for 'Paracetamol', 'Metformin', etc."
                        className="w-full p-4 pl-12 rounded-xl shadow-lg border-2 border-transparent focus:border-teal-500 focus:outline-none text-lg transition-all"
                    />
                    <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl text-gray-400" />
                    <button
                        type="submit"
                        className="absolute right-2 top-2 bottom-2 bg-teal-600 text-white px-8 rounded-lg font-semibold hover:bg-teal-700 transition"
                    >
                        Search
                    </button>
                </form>

                {/* Results */}
                {loading ? (
                    <div className="text-center py-10">
                        <div className="animate-spin text-4xl text-teal-600 mx-auto w-fit">⌛</div>
                        <p className="mt-2 text-teal-700">Searching inventory network...</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {searched && results.length === 0 && (
                            <div className="text-center py-10 bg-white rounded-xl shadow-sm">
                                <p className="text-xl text-gray-500">No medicines found matching "{query}".</p>
                                <p className="text-sm text-gray-400">Try checking spelling or generic names.</p>
                            </div>
                        )}

                        {results.map((med) => (
                            <div
                                key={med._id}
                                className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-teal-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                            >
                                <div>
                                    <h3 className="text-xl font-bold text-teal-900 flex items-center gap-2">
                                        {med.name}
                                        <span className="text-xs bg-teal-100 text-teal-700 px-2 py-1 rounded-full">{med.category || 'General'}</span>
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-2">{med.brand} • {med.strength} • {med.dosageForm}</p>

                                    <div className="flex flex-col gap-1 text-gray-600 text-sm mt-3">
                                        <div className="flex items-center gap-2">
                                            <FiShoppingBag className="text-teal-600" />
                                            <span className="font-semibold">{med.pharmacy?.name || "Unknown Pharmacy"}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FiMapPin className="text-gray-400" />
                                            <span>{med.pharmacy?.address || "Location not available"}</span>
                                        </div>
                                        {med.pharmacy?.phone && (
                                            <div className="flex items-center gap-2">
                                                <FiPhone className="text-gray-400" />
                                                <span>{med.pharmacy.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col items-end gap-2 w-full md:w-auto">
                                    <div className="text-right">
                                        <p className="text-sm text-gray-500">Price</p>
                                        <p className="text-2xl font-bold text-teal-700">₹{med.price}</p>
                                    </div>

                                    {med.stock > 0 ? (
                                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                            In Stock ({med.stock})
                                        </span>
                                    ) : (
                                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">Out of Stock</span>
                                    )}

                                    <button className="w-full md:w-auto mt-2 px-4 py-2 border border-teal-600 text-teal-600 rounded-lg hover:bg-teal-50 transition text-sm font-semibold">
                                        Get Directions
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
