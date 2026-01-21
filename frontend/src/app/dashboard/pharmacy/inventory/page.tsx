"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FiPlus, FiTrash2, FiEdit2, FiSearch } from "react-icons/fi";

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
                // alert("Session expired. Please login again.");
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

    return (
        <div className="p-6 bg-gray-50 min-h-screen text-slate-800">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-teal-700">My Inventory</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="flex items-center gap-2 bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                    <FiPlus /> Add Medicine
                </button>
            </div>

            {loading ? (
                <p>Loading inventory...</p>
            ) : (
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-teal-50">
                            <tr>
                                <th className="p-4 border-b text-teal-800 font-semibold">Name</th>
                                <th className="p-4 border-b text-teal-800 font-semibold">Brand</th>
                                <th className="p-4 border-b text-teal-800 font-semibold">Stock</th>
                                <th className="p-4 border-b text-teal-800 font-semibold">Price</th>
                                <th className="p-4 border-b text-teal-800 font-semibold">Expiry</th>
                                <th className="p-4 border-b text-teal-800 font-semibold">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {medicines.length > 0 ? (
                                medicines.map((med) => (
                                    <tr key={med._id} className="hover:bg-gray-50">
                                        <td className="p-4 border-b">{med.name}</td>
                                        <td className="p-4 border-b">{med.brand}</td>
                                        <td className="p-4 border-b">
                                            <span className={`px-2 py-1 rounded text-sm ${med.stock < 10 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                                                {med.stock}
                                            </span>
                                        </td>
                                        <td className="p-4 border-b">₹{med.price}</td>
                                        <td className="p-4 border-b">{new Date(med.expiryDate).toLocaleDateString()}</td>
                                        <td className="p-4 border-b flex gap-3">
                                            <button className="text-blue-600 hover:text-blue-800"><FiEdit2 /></button>
                                            <button onClick={() => handleDelete(med._id)} className="text-red-600 hover:text-red-800"><FiTrash2 /></button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className="p-8 text-center text-gray-500">
                                        No medicines in stock. Add some!
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add Medicine Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
                        <h2 className="text-xl font-bold mb-4">Add Medicine</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Medicine Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-teal-500"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Brand</label>
                                    <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Category</label>
                                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Price (₹)</label>
                                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Stock Qty</label>
                                    <input type="number" name="stock" value={formData.stock} onChange={handleInputChange} required className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Expiry Date</label>
                                    <input type="date" name="expiryDate" value={formData.expiryDate} onChange={handleInputChange} required className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Batch No.</label>
                                    <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleInputChange} className="w-full mt-1 p-2 border rounded-lg" />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="w-full py-2 border rounded-lg hover:bg-gray-50 text-gray-700"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="w-full py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
                                >
                                    Save Medicine
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
