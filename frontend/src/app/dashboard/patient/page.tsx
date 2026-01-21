"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiSearch, FiCalendar, FiFileText, FiLogOut, FiPlusCircle,
  FiMapPin, FiUser, FiActivity, FiArrowRight, FiClock, FiShield, FiHeart, FiChevronDown
} from "react-icons/fi";
import { LuPill, LuStethoscope, LuFileHeart, LuMapPin } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

interface User {
  name: string;
  phone: string;
}

interface Appointment {
  _id: string;
  doctor: { name: string };
  startTime: string;
  status: string;
}

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.replace("/");
      return;
    }
    const userData = JSON.parse(userStr);
    setUser(userData);

    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/appointments/patient`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const upcoming = res.data.data
          .filter((a: any) => a.status === 'confirmed' || a.status === 'pending')
          .sort((a: any, b: any) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

        setNextAppointment(upcoming || null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start py-10 px-4 md:px-0">

      {/* Main Container / Card Window */}
      <div className="w-full max-w-[1000px] bg-white rounded-[3rem] shadow-2xl shadow-teal-200/60 overflow-hidden flex flex-col relative min-h-[90vh]">

        {/* Navigation Bar */}
        <nav className="h-20 flex items-center justify-between px-10 md:px-14 border-b border-teal-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" className="w-8 h-8 text-teal-600" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L3 7V17L12 22L21 17V7L12 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M12 22V12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M21 7L12 12L3 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span className="text-3xl font-black text-teal-800 tracking-tight">Medoryx</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 bg-teal-50/50 p-1 rounded-full group hover:bg-teal-100/50 transition-all border border-transparent hover:border-teal-50"
            >
              <div className="w-10 h-10 rounded-full bg-teal-600 flex items-center justify-center text-white scale-90 group-hover:scale-100 transition-transform">
                <FiUser className="text-xl" />
              </div>
              <FiChevronDown className="text-teal-400 mr-2" />
            </button>

            {showProfileMenu && (
              <div className="absolute top-14 right-0 w-64 bg-white rounded-3xl shadow-2xl border border-teal-50 p-6 z-50 animate-fade-in">
                <p className="text-[10px] font-black text-teal-300 uppercase tracking-widest mb-2">Patient Profile</p>
                <p className="text-lg font-black text-teal-900 leading-none mb-1">{user?.name}</p>
                <p className="text-sm font-medium text-teal-500 mb-6">{user?.phone}</p>
                <div className="space-y-2">
                  <button onClick={() => router.push('/dashboard/patient/profile')} className="w-full text-left p-4 rounded-2xl hover:bg-teal-50 text-teal-700 font-bold text-xs uppercase transition-all">My Settings</button>
                  <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full text-left p-4 rounded-2xl hover:bg-red-50 text-red-500 font-bold text-xs uppercase transition-all">Logout</button>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Content Body */}
        <main className="flex-grow p-10 md:p-16 flex flex-col items-center gap-14">

          {/* Welcome Card */}
          <section className="w-full bg-[#FFFFFF] rounded-[3.5rem] p-12 md:p-16 flex flex-col items-center text-center shadow-inner">
            <h1 className="text-3xl md:text-5xl font-black text-teal-900 mb-6 tracking-tight">
              Welcome, {user?.name || "Guest"}
            </h1>

            <div className="max-w-2xl text-teal-500 font-medium text-lg md:text-xl leading-relaxed mb-10">
              {loading ? "Loading health summary..." : nextAppointment ? (
                <>Your next appointment with <span className="text-teal-600 font-black">Dr. {nextAppointment.doctor?.name}</span> is confirmed. Keep your health journey on track.</>
              ) : (
                <>No Booked Appointments. Your health deserves consistent attention. Engage with our certified specialists for next checkup.</>
              )}
            </div>

            <button
              onClick={() => router.push('/dashboard/patient/doctors')}
              className="bg-teal-600 hover:bg-teal-700 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-xl shadow-teal-200 active:scale-95 text-lg"
            >
              Access Specialists
            </button>
          </section>

          {/* Services Grid */}
          <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10">

            {/* Medication */}
            <div
              onClick={() => router.push('/dashboard/patient/medicines')}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-tranteal-y-2 transition-all cursor-pointer border border-transparent hover:border-teal-50 group flex flex-col gap-6"
            >
              <div className="flex justify-between items-start">
                <LuPill className="text-5xl text-teal-500 group-hover:scale-110 transition-transform" />
                <span className="bg-teal-50 text-teal-600 text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg border border-teal-100">v2.0 Beta</span>
              </div>
              <div>
                <h3 className="text-2xl font-black text-teal-900 mb-2">Medication</h3>
                <p className="text-teal-500 font-medium">Check live stock availability in our partner pharmacy network</p>
              </div>
            </div>

            {/* Specialists */}
            <div
              onClick={() => router.push('/dashboard/patient/doctors')}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-tranteal-y-2 transition-all cursor-pointer border border-transparent hover:border-teal-50 group flex flex-col gap-6"
            >
              <LuStethoscope className="text-5xl text-teal-500 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-2xl font-black text-teal-900 mb-2">Specialists</h3>
                <p className="text-teal-500 font-medium">Schedule physical or digital visits with board-certified doctors</p>
              </div>
            </div>

            {/* Health Records */}
            <div
              onClick={() => router.push('/dashboard/patient/appointments')}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-tranteal-y-2 transition-all cursor-pointer border border-transparent hover:border-teal-50 group flex flex-col gap-6"
            >
              <LuFileHeart className="text-5xl text-teal-500 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-2xl font-black text-teal-900 mb-2">Health Records</h3>
                <p className="text-teal-500 font-medium">Access your centralized history, reports, and digital scripts</p>
              </div>
            </div>

            {/* Pharmacy Locations */}
            <div
              onClick={() => router.push('/dashboard/patient/pharmacies')}
              className="bg-white p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl hover:-tranteal-y-2 transition-all cursor-pointer border border-transparent hover:border-teal-50 group flex flex-col gap-6"
            >
              <LuMapPin className="text-5xl text-teal-500 group-hover:scale-110 transition-transform" />
              <div>
                <h3 className="text-2xl font-black text-teal-900 mb-2">Pharmacy Locations</h3>
                <p className="text-teal-500 font-medium">Navigate to authorized medical retail fronts for pickups</p>
              </div>
            </div>

          </div>
        </main>

        {/* Footer Emergency Button */}
        <div className="mt-auto px-10 md:px-14 py-8 flex justify-end">
          <button
            onClick={() => alert("Calling Emergency 102...")}
            className="bg-teal-600 hover:bg-teal-700 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest shadow-lg active:scale-95 transition-all"
          >
            Emergency 102 - Medico
          </button>
        </div>

      </div>

      <style jsx global>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
