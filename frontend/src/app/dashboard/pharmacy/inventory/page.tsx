"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiSearch, FiPackage, FiBarChart2, FiCalendar, FiArrowLeft, FiUpload, FiDownload, FiShare2, FiRefreshCw, FiCheck, FiX } from "react-icons/fi";

// Configure base URL (should be in env or config)
const API_URL = "http://localhost:8000/api";

interface Medicine {
    _id: string;
    name: string;
    brand?: string;
    category?: string;
    price: number;
    stock: number;
    expiryDate: string;
    batchNumber?: string;
    isOnMarketplace?: boolean;
    discountPrice?: number;
    onExchange?: boolean;
}

export default function InventoryPage() {
    const router = useRouter();
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        brand: "",
        category: "",
        price: "",
        stock: "",
        expiryDate: "",
        batchNumber: "",
    });

    const getAuthHeader = () => {
        const token = localStorage.getItem("token");
        return { headers: { Authorization: `Bearer ${token}` } };
    };

    useEffect(() => {
        fetchStock();
    }, []);

    const fetchStock = async () => {
        try {
            const res = await axios.get(`${API_URL}/medicines/mystock`, getAuthHeader());
            setMedicines(res.data.data);
            setLoading(false);
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert("Session expired or unauthorized. Please login again.");
                localStorage.removeItem("token");
                localStorage.removeItem("currentUser");
                router.push("/auth/login");
                return;
            }
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                price: Number(formData.price),
                stock: Number(formData.stock),
            };

            await axios.post(`${API_URL}/medicines`, payload, getAuthHeader());
            alert("Medicine added successfully!");
            setShowModal(false);
            fetchStock();
            setFormData({
                name: "",
                brand: "",
                category: "",
                price: "",
                stock: "",
                expiryDate: "",
                batchNumber: "",
            });
        } catch (err: any) {
            console.error(err);
            if (err.response?.status === 401) {
                alert("Session expired. Please login again.");
                router.push("/auth/login");
                return;
            }
            const msg = err.response?.data?.message || "Error adding medicine";
            alert(`Failed: ${msg}`);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this medicine?")) {
            try {
                await axios.delete(`${API_URL}/medicines/${id}`, getAuthHeader());
                fetchStock();
            } catch (err) {
                console.error(err);
                alert("Error deleting medicine");
            }
        }
    };

    const handleExport = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/medicines/export`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'inventory.xlsx');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error("Export failed:", err);
            alert("Failed to export inventory");
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files?.[0]) return;
        const file = e.target.files[0];
        const formData = new FormData();
        formData.append('file', file);

        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/medicines/import`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert("Inventory imported successfully!");
            fetchStock();
        } catch (err) {
            console.error("Import failed:", err);
            alert("Failed to import inventory. Ensure file matches required format.");
        }
    };

    const toggleMarketplaceListing = async (med: Medicine) => {
        try {
            const discount = med.isOnMarketplace ? undefined : prompt("Enter discount price (₹):", String(med.price * 0.8));
            if (!med.isOnMarketplace && discount === null) return;

            await axios.patch(`${API_URL}/medicines/${med._id}/marketplace`, {
                isOnMarketplace: !med.isOnMarketplace,
                discountPrice: discount ? Number(discount) : undefined
            }, getAuthHeader());

            fetchStock();
        } catch (err) {
            console.error(err);
        }
    };

    const toggleExchangeListing = async (med: Medicine) => {
        try {
            await axios.patch(`${API_URL}/medicines/${med._id}/exchange`, {
                onExchange: !med.onExchange
            }, getAuthHeader());
            fetchStock();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-teal-50">
                <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push("/dashboard/pharmacy")}
                            className="w-10 h-10 rounded-xl bg-teal-50 flex items-center justify-center text-teal-600 hover:bg-teal-600 hover:text-white transition-all"
                        >
                            <FiArrowLeft />
                        </button>
                        <div>
                            <h1 className="text-xl font-black text-teal-900 tracking-tight">Inventory Manager</h1>
                            <p className="text-xs font-bold text-teal-500 uppercase tracking-widest">Stock Control Portal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <input
                            type="file"
                            id="excel-import"
                            className="hidden"
                            accept=".xlsx, .xls"
                            onChange={handleImport}
                        />
                        <button
                            onClick={() => document.getElementById('excel-import')?.click()}
                            className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-100 transition"
                        >
                            <FiUpload /> Import Excel
                        </button>
                        <button
                            onClick={handleExport}
                            className="flex items-center gap-2 bg-slate-50 text-slate-600 px-5 py-3 rounded-2xl font-bold hover:bg-slate-100 transition"
                        >
                            <FiDownload /> Export Excel
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            className="flex items-center gap-2 bg-teal-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-teal-700 transition shadow-xl shadow-teal-100 active:scale-95"
                        >
                            <FiPlus /> Add New
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                    <div className="bg-teal-50/50 p-6 rounded-[2rem] border border-teal-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-sm text-xl">
                                <FiPackage />
                            </div>
                            <span className="text-xs font-black text-teal-300 uppercase tracking-widest">Total SKUs</span>
                        </div>
                        <h3 className="text-3xl font-black text-teal-950">{medicines.length}</h3>
                        <p className="text-sm font-bold text-teal-500">Medicines in inventory</p>
                    </div>
                    <div className="bg-red-50/50 p-6 rounded-[2rem] border border-red-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-red-500 shadow-sm text-xl">
                                <FiBarChart2 />
                            </div>
                            <span className="text-xs font-black text-red-200 uppercase tracking-widest">Low Stock</span>
                        </div>
                        <h3 className="text-3xl font-black text-red-900">{medicines.filter(m => m.stock < 10).length}</h3>
                        <p className="text-sm font-bold text-red-500">Items requiring restock</p>
                    </div>
                    <div className="bg-teal-900 p-6 rounded-[2rem] shadow-xl shadow-teal-100">
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 bg-teal-800 rounded-2xl flex items-center justify-center text-teal-300 shadow-sm text-xl">
                                <FiCalendar />
                            </div>
                            <span className="text-xs font-black text-teal-500 uppercase tracking-widest">Quick View</span>
                        </div>
                        <h3 className="text-2xl font-black text-white">Live Tracking</h3>
                        <p className="text-sm font-bold text-teal-400">Inventory Status: Active</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 opacity-40">
                        <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mb-4"></div>
                        <p className="font-black text-teal-900 uppercase tracking-widest text-xs">Syncing Stock Levels...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {medicines.length > 0 ? (
                            medicines.map((med) => (
                                <div key={med._id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-teal-50 hover:shadow-2xl hover:border-teal-100 transition-all group overflow-hidden relative">
                                    <div className="absolute top-0 right-0 p-4">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${med.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                                            {med.stock} Units
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <h3 className="text-xl font-black text-teal-950 mb-1">{med.name}</h3>
                                        <p className="text-sm font-bold text-teal-400">{med.brand} • {med.category || 'General'}</p>
                                    </div>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex justify-between items-center py-2 border-b border-teal-50/50">
                                            <span className="text-xs font-black text-teal-200 uppercase tracking-widest">Price</span>
                                            <span className="font-bold text-teal-900">₹{med.price}</span>
                                        </div>
                                        <div className="flex justify-between items-center py-2 border-b border-teal-50/50">
                                            <span className="text-xs font-black text-teal-200 uppercase tracking-widest">Expiry</span>
                                            <span className="font-bold text-teal-900">{new Date(med.expiryDate).toLocaleDateString()}</span>
                                        </div>
                                        {med.batchNumber && (
                                            <div className="flex justify-between items-center py-2">
                                                <span className="text-xs font-black text-teal-200 uppercase tracking-widest">Batch No</span>
                                                <span className="font-mono text-[10px] font-black text-teal-500">{med.batchNumber}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 pt-4 border-t border-teal-50/50">
                                        <button
                                            onClick={() => toggleMarketplaceListing(med)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${med.isOnMarketplace ? 'bg-orange-500 text-white' : 'bg-orange-50 text-orange-600 hover:bg-orange-100'}`}
                                        >
                                            <FiShare2 className="text-lg mb-1" />
                                            {med.isOnMarketplace ? 'On Mart' : 'Sell Cheap'}
                                        </button>
                                        <button
                                            onClick={() => toggleExchangeListing(med)}
                                            className={`flex flex-col items-center justify-center p-3 rounded-2xl text-[10px] font-black uppercase tracking-tighter transition-all ${med.onExchange ? 'bg-teal-600 text-white' : 'bg-teal-50 text-teal-600 hover:bg-teal-100'}`}
                                        >
                                            <FiRefreshCw className="text-lg mb-1" />
                                            {med.onExchange ? 'In Trade' : 'P2P Trade'}
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-6">
                                        <button className="flex-grow bg-slate-50 text-slate-400 font-black py-4 rounded-xl hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
                                            <FiEdit2 /> Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(med._id)}
                                            className="w-14 h-14 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-sm"
                                        >
                                            <FiTrash2 />
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-full bg-teal-50/30 border-4 border-dashed border-teal-100 rounded-[3rem] py-20 flex flex-col items-center justify-center text-center">
                                <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center text-teal-300 text-3xl mb-6">
                                    <FiPackage />
                                </div>
                                <h3 className="text-2xl font-black text-teal-900 mb-2">Inventory Empty</h3>
                                <p className="text-teal-500 font-bold mb-8">You haven't added any medicines yet.</p>
                                <button
                                    onClick={() => setShowModal(true)}
                                    className="bg-teal-600 text-white px-8 py-3 rounded-2xl font-black hover:bg-teal-700 transition"
                                >
                                    Stock New Medicine
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {/* Add Medicine Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-blur-2xl bg-teal-950/20 animate-fade-in">
                    <div className="bg-white w-full max-w-lg rounded-[3rem] p-10 shadow-2xl relative border border-teal-50">
                        <h2 className="text-3xl font-black text-teal-950 mb-8 tracking-tighter">Stock New Entry</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Medical Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    placeholder="e.g. Amoxicillin"
                                    className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Brand</label>
                                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} placeholder="GSK" className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} placeholder="Antibiotic" className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required placeholder="250" className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Units</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required placeholder="100" className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Expiry</label>
                                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-teal-300 uppercase tracking-widest pl-2">Batch No</label>
                                    <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} placeholder="BN-9921" className="w-full p-4 rounded-2xl bg-teal-50/50 border-2 border-transparent focus:border-teal-500 outline-none transition-all font-bold text-teal-950" />
                                </div>
                            </div>

                            <div className="flex gap-4 mt-10">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="flex-grow py-4 rounded-2xl border-2 border-teal-50 font-black text-teal-300 hover:text-teal-600 transition-all"
                                >
                                    Discard
                                </button>
                                <button
                                    type="submit"
                                    className="flex-grow py-4 bg-teal-600 text-white rounded-2xl font-black shadow-xl shadow-teal-200 hover:bg-teal-700 transition-all active:scale-95"
                                >
                                    Confirm Stock
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
