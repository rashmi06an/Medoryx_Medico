"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
    FiUploadCloud, FiSearch, FiFilter, FiDownload, FiTrash2,
    FiPlus, FiFileText, FiCalendar, FiUser, FiMoreVertical,
    FiX, FiCheckCircle, FiAlertCircle, FiTag, FiClock, FiArrowLeft,
    FiRefreshCw
} from "react-icons/fi";
import { LuScan, LuFileHeart, LuFolderHeart, LuDownload } from "react-icons/lu";
import jsPDF from "jspdf";
import "jspdf-autotable";

const API_URL = "http://localhost:8000/api";

interface HealthFile {
    _id: string;
    familyMember: string;
    fileName: string;
    fileUrl: string;
    fileType: 'Report' | 'Scan' | 'Prescription' | 'Other';
    doctorName?: string;
    specialty?: string;
    date: string;
    followUpDate?: string;
    notes?: string;
    createdAt: string;
}

export default function PersonalHealthFile() {
    const [files, setFiles] = useState<HealthFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [uploading, setUploading] = useState(false);

    // Filter states
    const [activeFamilyMember, setActiveFamilyMember] = useState("All");
    const [activeType, setActiveType] = useState("All");
    const [searchQuery, setSearchQuery] = useState("");

    // New File state
    const [newFile, setNewFile] = useState({
        familyMember: "Self",
        fileName: "",
        fileUrl: "",
        fileType: "Report",
        doctorName: "",
        specialty: "",
        date: new Date().toISOString().split('T')[0],
        followUpDate: "",
        notes: ""
    });

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchFiles();
    }, [activeFamilyMember, activeType]);

    const fetchFiles = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            let url = `${API_URL}/health-files?`;
            if (activeFamilyMember !== "All") url += `familyMember=${activeFamilyMember}&`;
            if (activeType !== "All") url += `fileType=${activeType}&`;

            const res = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        setUploading(true);
        try {
            const token = localStorage.getItem("token");
            // Simulate file upload to cloud (in real app, we use Cloudinary/S3)
            const mockFileUrl = "https://images.unsplash.com/photo-1576091160550-217359f4fs08?w=800";

            await axios.post(`${API_URL}/health-files`, {
                ...newFile,
                fileUrl: mockFileUrl
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setShowUploadModal(false);
            fetchFiles();
            setNewFile({
                familyMember: "Self",
                fileName: "",
                fileUrl: "",
                fileType: "Report",
                doctorName: "",
                specialty: "",
                date: new Date().toISOString().split('T')[0],
                followUpDate: "",
                notes: ""
            });
        } catch (err) {
            console.error(err);
            alert("Failed to upload file");
        } finally {
            setUploading(false);
        }
    };

    const deleteFile = async (id: string) => {
        if (!confirm("Are you sure you want to delete this record?")) return;
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/health-files/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setFiles(files.filter(f => f._id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.text("Medoryx - Medical History Summary", 14, 15);
        doc.setFontSize(10);
        doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 22);

        const tableColumn = ["Date", "Member", "Record Name", "Type", "Doctor", "Specialty"];
        const tableRows: any[] = [];

        files.forEach(file => {
            const rowData = [
                new Date(file.date).toLocaleDateString(),
                file.familyMember,
                file.fileName,
                file.fileType,
                file.doctorName || "-",
                file.specialty || "-"
            ];
            tableRows.push(rowData);
        });

        (doc as any).autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: 30,
            theme: 'grid',
            headStyles: { fillColor: [0, 128, 128] }
        });

        doc.save("medical_history_medoryx.pdf");
    };

    const filteredFiles = files.filter(f =>
        f.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.doctorName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.specialty?.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-teal-50 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <button onClick={() => window.history.back()} className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all">
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-teal-900 tracking-tight flex items-center gap-3">
                                <LuFolderHeart className="text-teal-600" /> Medical Locker
                            </h1>
                            <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest mt-1">Personal Health Files (PHF)</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-grow md:w-64">
                            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search records..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-slate-100 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 focus:ring-2 focus:ring-teal-500 transition-all"
                            />
                        </div>
                        <button
                            onClick={exportToPDF}
                            className="p-4 bg-white border border-slate-200 text-slate-600 rounded-2xl hover:bg-teal-600 hover:text-white hover:border-teal-600 transition-all shadow-sm flex items-center gap-2"
                        >
                            <FiDownload /> <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Export History</span>
                        </button>
                        <button
                            onClick={() => setShowUploadModal(true)}
                            className="p-4 bg-teal-600 text-white rounded-2xl hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all flex items-center gap-2"
                        >
                            <FiPlus /> <span className="hidden lg:inline text-xs font-black uppercase tracking-widest">Add Record</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    {/* Sidebar Filters */}
                    <aside className="lg:w-72 flex flex-col gap-8">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Family Profiles</h3>
                            <div className="flex flex-col gap-2">
                                {["All", "Self", "Spouse", "Child", "Parent"].map(member => (
                                    <button
                                        key={member}
                                        onClick={() => setActiveFamilyMember(member)}
                                        className={`w-full text-left p-4 rounded-xl font-bold text-sm transition-all ${activeFamilyMember === member ? 'bg-teal-600 text-white shadow-lg shadow-teal-100' : 'text-slate-500 hover:bg-slate-100'}`}
                                    >
                                        {member}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Record Type</h3>
                            <div className="flex flex-col gap-2">
                                {["All", "Report", "Scan", "Prescription", "Other"].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setActiveType(type)}
                                        className={`w-full text-left p-4 rounded-xl font-bold text-sm transition-all ${activeType === type ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100' : 'text-slate-500 hover:bg-indigo-50/50'}`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Content List */}
                    <section className="flex-grow">
                        {loading ? (
                            <div className="h-96 flex flex-col items-center justify-center gap-4 text-slate-300">
                                <FiRefreshCw className="text-6xl animate-spin text-teal-100" />
                                <p className="font-black uppercase tracking-widest text-xs">Accessing Locker...</p>
                            </div>
                        ) : filteredFiles.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredFiles.map(file => (
                                    <div key={file._id} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
                                        <div className="flex justify-between items-start mb-6">
                                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${file.fileType === 'Scan' ? 'bg-indigo-50 text-indigo-600' : file.fileType === 'Report' ? 'bg-teal-50 text-teal-600' : 'bg-rose-50 text-rose-600'}`}>
                                                {file.fileType === 'Scan' ? <LuScan /> : file.fileType === 'Report' ? <FiFileText /> : <LuFileHeart />}
                                            </div>
                                            <button
                                                onClick={() => deleteFile(file._id)}
                                                className="p-3 bg-red-50 text-red-300 rounded-xl hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                                            >
                                                <FiTrash2 size={18} />
                                            </button>
                                        </div>

                                        <h4 className="text-lg font-black text-slate-900 mb-1">{file.fileName}</h4>
                                        <p className="text-xs font-bold text-slate-400 mb-6 flex items-center gap-2">
                                            <FiCalendar /> {new Date(file.date).toLocaleDateString()} • <FiUser /> {file.familyMember}
                                        </p>

                                        <div className="grid grid-cols-2 gap-4 mb-6">
                                            <div className="bg-slate-50 p-4 rounded-2xl">
                                                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Doctor</span>
                                                <p className="text-xs font-black text-slate-700 truncate">{file.doctorName || "Not Specified"}</p>
                                            </div>
                                            <div className="bg-slate-50 p-4 rounded-2xl">
                                                <span className="text-[8px] font-black uppercase text-slate-400 block mb-1">Specialty</span>
                                                <p className="text-xs font-black text-slate-700 truncate">{file.specialty || "General"}</p>
                                            </div>
                                        </div>

                                        {file.followUpDate && (
                                            <div className="bg-amber-50 p-4 rounded-2xl flex items-center gap-3 mb-6 border border-amber-100">
                                                <FiClock className="text-amber-600" />
                                                <div className="flex-grow">
                                                    <span className="text-[8px] font-black uppercase text-amber-500 block">Follow-up Reminder</span>
                                                    <p className="text-[10px] font-black text-amber-900">{new Date(file.followUpDate).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                        )}

                                        <a
                                            href={file.fileUrl}
                                            target="_blank"
                                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"
                                        >
                                            <LuDownload size={16} /> View Document
                                        </a>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
                                <LuFolderHeart className="text-7xl text-slate-100 mx-auto mb-8" />
                                <h3 className="text-2xl font-black text-slate-400 mb-4">Locker is Empty</h3>
                                <p className="text-slate-400 font-bold max-w-sm mx-auto mb-10">Start uploading your reports and scans to build your lifetime health timeline.</p>
                                <button
                                    onClick={() => setShowUploadModal(true)}
                                    className="px-10 py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 shadow-xl shadow-teal-100 transition-all flex items-center justify-center mx-auto gap-2"
                                >
                                    <FiPlus /> Add First Record
                                </button>
                            </div>
                        )}
                    </section>
                </div>
            </main>

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
                    <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
                        <button
                            onClick={() => setShowUploadModal(false)}
                            className="absolute top-8 right-8 p-3 bg-slate-100 rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all z-10"
                        >
                            <FiX size={24} />
                        </button>

                        <div className="p-12">
                            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
                                <LuDownload className="text-teal-600" /> New Record
                            </h2>

                            <form onSubmit={handleUpload} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Record Name *</label>
                                    <input
                                        required
                                        type="text"
                                        value={newFile.fileName}
                                        onChange={(e) => setNewFile({ ...newFile, fileName: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                        placeholder="e.g. Blood Test - Jan 2026"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Family Member</label>
                                    <select
                                        value={newFile.familyMember}
                                        onChange={(e) => setNewFile({ ...newFile, familyMember: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option>Self</option>
                                        <option>Spouse</option>
                                        <option>Child</option>
                                        <option>Parent</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Record Type</label>
                                    <select
                                        value={newFile.fileType}
                                        onChange={(e) => setNewFile({ ...newFile, fileType: e.target.value as any })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                    >
                                        <option>Report</option>
                                        <option>Scan</option>
                                        <option>Prescription</option>
                                        <option>Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Doctor Name</label>
                                    <input
                                        type="text"
                                        value={newFile.doctorName}
                                        onChange={(e) => setNewFile({ ...newFile, doctorName: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                        placeholder="Dr. Johnson"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Specialty</label>
                                    <input
                                        type="text"
                                        value={newFile.specialty}
                                        onChange={(e) => setNewFile({ ...newFile, specialty: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                        placeholder="Cardiology"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Record Date</label>
                                    <input
                                        type="date"
                                        value={newFile.date}
                                        onChange={(e) => setNewFile({ ...newFile, date: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Next Follow-up</label>
                                    <input
                                        type="date"
                                        value={newFile.followUpDate}
                                        onChange={(e) => setNewFile({ ...newFile, followUpDate: e.target.value })}
                                        className="w-full bg-slate-100 border-none p-4 rounded-xl text-sm font-bold focus:ring-2 focus:ring-teal-500"
                                    />
                                </div>

                                <div className="md:col-span-2 mt-8 flex gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowUploadModal(false)}
                                        className="flex-1 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="flex-[2] py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-700 shadow-xl shadow-teal-100 flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {uploading ? <FiRefreshCw className="animate-spin" /> : <FiUploadCloud />}
                                        {uploading ? "Uploading..." : "Save to Locker"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
        </div>
    );
}
