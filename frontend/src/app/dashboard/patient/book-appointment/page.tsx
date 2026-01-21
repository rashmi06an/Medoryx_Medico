"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { FiCalendar, FiClock, FiMessageSquare, FiCheckCircle, FiArrowLeft } from "react-icons/fi";

const API_URL = "http://localhost:8000/api";

function BookingContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const doctorId = searchParams.get("doctorId");
    const doctorName = searchParams.get("doctorName");

    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [reason, setReason] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleBooking = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const token = localStorage.getItem("token");
            const startTime = new Date(`${date}T${time}`);

            await axios.post(`${API_URL}/appointments`, {
                doctor: doctorId,
                startTime: startTime.toISOString(),
                reason
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setSuccess(true);
            setTimeout(() => {
                router.push("/dashboard/patient");
            }, 3000);
        } catch (err) {
            console.error(err);
            alert("Failed to book appointment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-center">
                <FiCheckCircle className="text-8xl text-green-500 mb-6 animate-bounce" />
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Appointment Booked!</h1>
                <p className="text-gray-600">Your consultation with Dr. {doctorName} has been scheduled.</p>
                <p className="text-sm text-gray-400 mt-4 italic">Redirecting you to dashboard...</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-xl border border-teal-50">
            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-teal-600 mb-8 hover:underline"
            >
                <FiArrowLeft /> Back to Doctors
            </button>

            <h1 className="text-3xl font-bold text-teal-900 mb-2">Book Consultation</h1>
            <p className="text-white0 mb-10">Scheduling with <span className="text-teal-600 font-bold">Dr. {doctorName}</span></p>

            <form onSubmit={handleBooking} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-teal-800 flex items-center gap-2">
                            <FiCalendar /> Preferred Date
                        </label>
                        <input
                            type="date"
                            required
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-teal-800 flex items-center gap-2">
                            <FiClock /> Preferred Time
                        </label>
                        <input
                            type="time"
                            required
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-teal-500 outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-teal-800 flex items-center gap-2">
                        <FiMessageSquare /> Reason for Visit
                    </label>
                    <textarea
                        placeholder="E.g. Regular checkup, Fever, Consultation for recurring pain..."
                        value={reason}
                        required
                        onChange={(e) => setReason(e.target.value)}
                        rows={4}
                        className="w-full p-4 rounded-xl bg-white border-2 border-transparent focus:border-teal-500 outline-none transition-all resize-none"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-teal-600 text-white rounded-2xl font-bold text-lg hover:bg-teal-700 transition shadow-lg shadow-teal-100 disabled:opacity-50"
                >
                    {loading ? "Confirming Booking..." : "Confirm Appointment"}
                </button>
            </form>
        </div>
    );
}

export default function AppointmentBookingPage() {
    return (
        <div className="p-6 bg-white min-h-screen">
            <Suspense fallback={<div className="text-center py-20">Loading booking system...</div>}>
                <BookingContent />
            </Suspense>
        </div>
    );
}
