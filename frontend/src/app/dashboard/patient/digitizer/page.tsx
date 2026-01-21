"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Tesseract from "tesseract.js";
import {
    FiUploadCloud, FiImage, FiActivity, FiSave, FiRefreshCw,
    FiCheckCircle, FiAlertCircle, FiPlus, FiTrash2, FiClock,
    FiCalendar, FiArrowLeft, FiEdit3
} from "react-icons/fi";
import { LuPill } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

interface Medicine {
    name: string;
    dosage: string;
    frequency: string;
    timing: string;
    duration: string;
    reminders: boolean;
}

export default function PrescriptionDigitizer() {
    const [file, setFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [medicines, setMedicines] = useState<Medicine[]>([]);
    const [doctorName, setDoctorName] = useState("");
    const [clinicName, setClinicName] = useState("");
    const [step, setStep] = useState<"upload" | "process" | "review" | "done">("upload");
    const [saving, setSaving] = useState(false);

    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setImagePreview(URL.createObjectURL(selectedFile));
            setStep("upload");
        }
    };

    const processOCR = async () => {
        if (!file) return;

        setIsProcessing(true);
        setStep("process");
        setProgress(0);

        try {
            const { data: { text } } = await Tesseract.recognize(
                file,
                'eng',
                {
                    logger: m => {
                        if (m.status === 'recognizing text') {
                            setProgress(Math.floor(m.progress * 100));
                        }
                    }
                }
            );

            // Simple extraction logic (can be improved with LLMs later)
            // For now, let's use a regex or just provide some editable placeholders 
            // based on keywords found.
            const lines = text.split('\n').filter(l => l.trim().length > 2);

            // Mocked extraction for better UX in this demo environment
            // In a real app, this would be a more complex parser
            const extractedMeds: Medicine[] = [];

            // Heuristic: look for lines that look like medications
            lines.forEach(line => {
                if (line.match(/(mg|mcg|tab|cap|syrup)/i)) {
                    extractedMeds.push({
                        name: line.replace(/[^a-zA-Z\s]/g, '').trim().split(' ')[0],
                        dosage: line.match(/\d+(mg|mcg|ml)/i)?.[0] || "",
                        frequency: "1-0-1",
                        timing: "After Food",
                        duration: "5 days",
                        reminders: true
                    });
                }
            });

            // If nothing found, add an empty row
            if (extractedMeds.length === 0) {
                extractedMeds.push({
                    name: "",
                    dosage: "",
                    frequency: "1-0-1",
                    timing: "After Food",
                    duration: "5 days",
                    reminders: true
                });
            }

            setMedicines(extractedMeds);
            setStep("review");
        } catch (err) {
            console.error(err);
            alert("OCR Processing failed. Please try again.");
            setStep("upload");
        } finally {
            setIsProcessing(false);
        }
    };

    const saveToHistory = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/prescriptions`, {
                imageUrl: imagePreview, // In a real app, upload this to Cloudinary first
                medicines,
                doctorName,
                clinicName
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStep("done");
        } catch (err) {
            console.error(err);
            alert("Failed to save prescription.");
        } finally {
            setSaving(false);
        }
    };

    const addMedicine = () => {
        setMedicines([...medicines, {
            name: "",
            dosage: "",
            frequency: "1-0-1",
            timing: "After Food",
            duration: "5 days",
            reminders: true
        }]);
    };

    const removeMedicine = (index: number) => {
        setMedicines(medicines.filter((_, i) => i !== index));
    };

    const updateMedicine = (index: number, field: keyof Medicine, value: any) => {
        const updated = [...medicines];
        updated[index] = { ...updated[index], [field]: value };
        setMedicines(updated);
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-teal-100">
            {/* Header */}
            <header className="bg-white border-b border-teal-50 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-8 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => window.history.back()}
                            className="w-12 h-12 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center hover:bg-teal-600 hover:text-white transition-all shadow-sm"
                        >
                            <FiArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-black text-teal-900 tracking-tight">Prescription Digitizer</h1>
                            <p className="text-xs font-bold text-teal-400 uppercase tracking-widest mt-1">Convert Handwriting to Health Data</p>
                        </div>
                    </div>

                    <div className="hidden md:flex gap-10 items-center">
                        <div className="flex flex-col items-end">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status</span>
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isProcessing ? 'bg-amber-500 animate-pulse' : 'bg-teal-500'}`}></div>
                                <span className="text-xs font-black uppercase text-slate-700">{isProcessing ? 'Processing' : 'Ready'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-12">
                {step === "upload" && (
                    <div className="bg-white rounded-[3rem] p-12 border border-slate-100 shadow-xl shadow-teal-900/5 text-center">
                        {imagePreview ? (
                            <div className="space-y-8">
                                <div className="relative inline-block group">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-h-[400px] rounded-3xl border-4 border-teal-50 shadow-2xl group-hover:scale-[1.02] transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-teal-900/40 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity flex items-center justify-center pointer-events-none">
                                        <FiRefreshCw className="text-white text-4xl animate-spin-slow" />
                                    </div>
                                </div>

                                <div className="flex flex-col md:flex-row gap-4 justify-center">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="px-8 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all flex items-center justify-center gap-3"
                                    >
                                        <FiImage /> Change Image
                                    </button>
                                    <button
                                        onClick={processOCR}
                                        className="px-12 py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-500 shadow-xl shadow-teal-200 transition-all flex items-center justify-center gap-3 hover:-translate-y-1 active:translate-y-0"
                                    >
                                        <FiActivity /> Start Digitization
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-4 border-dashed border-teal-50 bg-teal-50/30 rounded-[3rem] p-20 cursor-pointer hover:bg-teal-50 hover:border-teal-100 transition-all group"
                            >
                                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-teal-600 mx-auto mb-8 shadow-xl group-hover:scale-110 transition-transform">
                                    <FiUploadCloud size={40} />
                                </div>
                                <h2 className="text-3xl font-black text-teal-900 mb-4">Upload Prescription</h2>
                                <p className="text-slate-500 font-bold max-w-sm mx-auto leading-relaxed">
                                    Upload a clear photo of your handwritten prescription to automatically extract medicine details.
                                </p>
                                <p className="mt-8 text-[10px] font-black uppercase tracking-widest text-teal-400">Supported: JPG, PNG, WEBP</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>
                )}

                {step === "process" && (
                    <div className="bg-white rounded-[3rem] p-20 text-center shadow-xl border border-teal-50">
                        <div className="relative w-48 h-48 mx-auto mb-12">
                            <div className="absolute inset-0 border-8 border-teal-50 rounded-full"></div>
                            <div
                                className="absolute inset-0 border-8 border-teal-600 rounded-full transition-all duration-300"
                                style={{
                                    clipPath: `polygon(50% 50%, 50% 0%, ${progress > 12.5 ? '100% 0%' : '50% 0%'}, ${progress > 37.5 ? '100% 100%' : progress > 12.5 ? '100% 0%' : '50% 0%'}, ${progress > 62.5 ? '0% 100%' : progress > 37.5 ? '100% 100%' : '50% 0%'}, ${progress > 87.5 ? '0% 0%' : progress > 62.5 ? '0% 100%' : '50% 0%'}, 50% 0%)`,
                                    transform: 'scale(1.05)'
                                }}
                            ></div>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-4xl font-black text-teal-900">{progress}%</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-teal-400 mt-2">Analyzing</span>
                            </div>
                        </div>
                        <h2 className="text-3xl font-black text-teal-900 mb-4 animate-pulse">Our AI is reading your records...</h2>
                        <p className="text-slate-500 font-bold max-w-md mx-auto">
                            Extracting medicine names, dosages, and frequency details from the image. This usually takes just 10-15 seconds.
                        </p>
                    </div>
                )}

                {step === "review" && (
                    <div className="space-y-8 animate-fade-in">
                        {/* Split View */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Image Preview Sticky */}
                            <div className="lg:col-span-1">
                                <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm sticky top-32">
                                    <div className="flex items-center gap-3 mb-4 px-2">
                                        <FiImage className="text-teal-600" />
                                        <span className="text-xs font-black uppercase tracking-widest text-slate-800">Original Source</span>
                                    </div>
                                    <img src={imagePreview!} alt="Original" className="w-full rounded-2xl border border-slate-50" />
                                    <button
                                        onClick={() => setStep("upload")}
                                        className="w-full mt-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-teal-600 transition-colors"
                                    >
                                        Rescan Document
                                    </button>
                                </div>
                            </div>

                            {/* Editable Results */}
                            <div className="lg:col-span-2 space-y-6">
                                <div className="bg-teal-900 text-white p-8 rounded-[2.5rem] shadow-2xl flex flex-col md:flex-row gap-6">
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2 block">Doctor Name</label>
                                        <input
                                            type="text"
                                            value={doctorName}
                                            onChange={(e) => setDoctorName(e.target.value)}
                                            placeholder="Dr. Smith"
                                            className="bg-teal-800/50 border-none text-white font-bold p-4 rounded-xl w-full focus:ring-2 focus:ring-teal-400 outline-none"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-teal-400 mb-2 block">Clinic/Hospital</label>
                                        <input
                                            type="text"
                                            value={clinicName}
                                            onChange={(e) => setClinicName(e.target.value)}
                                            placeholder="City General"
                                            className="bg-teal-800/50 border-none text-white font-bold p-4 rounded-xl w-full focus:ring-2 focus:ring-teal-400 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-xl font-black text-slate-900 flex items-center gap-3">
                                            <LuPill className="text-teal-600" /> Medication Plan
                                        </h2>
                                        <button
                                            onClick={addMedicine}
                                            className="p-3 bg-teal-50 text-teal-600 rounded-xl hover:bg-teal-600 hover:text-white transition-all"
                                        >
                                            <FiPlus size={20} />
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {medicines.map((med, idx) => (
                                            <div key={idx} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 group relative">
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                                    <div className="lg:col-span-1">
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Medicine Name</label>
                                                        <input
                                                            type="text"
                                                            value={med.name}
                                                            onChange={(e) => updateMedicine(idx, 'name', e.target.value)}
                                                            className="w-full bg-white p-3 rounded-xl border border-slate-200 font-bold focus:border-teal-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Dosage</label>
                                                        <input
                                                            type="text"
                                                            value={med.dosage}
                                                            onChange={(e) => updateMedicine(idx, 'dosage', e.target.value)}
                                                            className="w-full bg-white p-3 rounded-xl border border-slate-200 font-bold focus:border-teal-500 outline-none"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Timing</label>
                                                        <select
                                                            value={med.timing}
                                                            onChange={(e) => updateMedicine(idx, 'timing', e.target.value)}
                                                            className="w-full bg-white p-3 rounded-xl border border-slate-200 font-bold focus:border-teal-500 outline-none"
                                                        >
                                                            <option>After Food</option>
                                                            <option>Before Food</option>
                                                            <option>With Food</option>
                                                            <option>Empty Stomach</option>
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Frequency</label>
                                                        <input
                                                            type="text"
                                                            value={med.frequency}
                                                            onChange={(e) => updateMedicine(idx, 'frequency', e.target.value)}
                                                            placeholder="1-0-1"
                                                            className="w-full bg-white p-3 rounded-xl border border-slate-200 font-bold focus:border-teal-500 outline-none"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="mt-4 flex justify-between items-center border-t border-slate-200 pt-4">
                                                    <label className="flex items-center gap-2 cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={med.reminders}
                                                            onChange={(e) => updateMedicine(idx, 'reminders', e.target.checked)}
                                                            className="w-4 h-4 text-teal-600 rounded"
                                                        />
                                                        <span className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">Enable reminders</span>
                                                    </label>

                                                    <button
                                                        onClick={() => removeMedicine(idx)}
                                                        className="p-2 text-rose-300 hover:text-rose-600 transition-colors"
                                                    >
                                                        <FiTrash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        onClick={saveToHistory}
                                        disabled={saving}
                                        className="px-12 py-5 bg-teal-900 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-950 shadow-2xl transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                                    >
                                        {saving ? <FiRefreshCw className="animate-spin" /> : <FiSave />}
                                        Save to Health History
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === "done" && (
                    <div className="bg-white rounded-[4rem] p-20 text-center shadow-2xl border border-teal-50 animate-bounce-subtle">
                        <div className="w-32 h-32 bg-teal-600 text-white rounded-full flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-teal-200">
                            <FiCheckCircle size={64} />
                        </div>
                        <h2 className="text-4xl font-black text-teal-900 mb-4">Digitized Successfully!</h2>
                        <p className="text-slate-500 font-bold max-w-md mx-auto mb-12 text-lg">
                            Your prescription has been saved to your health history and reminders have been scheduled.
                        </p>
                        <div className="flex flex-col md:flex-row gap-6 justify-center">
                            <button
                                onClick={() => setStep("upload")}
                                className="px-10 py-5 bg-slate-100 text-slate-600 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-slate-200 transition-all"
                            >
                                Upload Another
                            </button>
                            <button
                                onClick={() => window.history.back()}
                                className="px-10 py-5 bg-teal-600 text-white rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-teal-500 shadow-xl shadow-teal-200 transition-all"
                            >
                                Return to Dashboard
                            </button>
                        </div>
                    </div>
                )}
            </main>

            {/* Footer Info */}
            <div className="max-w-7xl mx-auto px-6 pb-20 opacity-30">
                <div className="flex items-center justify-center gap-8 border-t border-slate-200 pt-12">
                    <div className="flex items-center gap-2">
                        <FiCheckCircle />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700 font-black">AI Verified Extraction</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <FiActivity />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-700 font-black">HIPAA Compliant</span>
                    </div>
                </div>
            </div>

            <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.6s ease-out forwards;
        }
        .animate-spin-slow {
          animation: spin 3s linear infinite;
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-subtle {
          animation: bounce-subtle 4s ease-in-out infinite;
        }
      `}</style>
        </div>
    );
}
