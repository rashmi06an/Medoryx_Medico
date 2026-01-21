"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  FiCalendar, FiUser, FiActivity, FiArrowRight, FiClock, FiChevronDown, FiPlus, FiAlertCircle, FiShoppingBag, FiEdit3
} from "react-icons/fi";
import { LuPill, LuStethoscope, LuFileHeart, LuMapPin, LuLogOut, LuFolderHeart } from "react-icons/lu";

const API_URL = "http://localhost:8000/api";

interface User {
  name: string;
  phone: string;
}

interface Appointment {
  _id: string;
  doctor: { _id: string, name: string };
  startTime: string;
  status: string;
  tokenNumber?: number;
  queueStatus?: string;
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
    <div className="min-h-screen bg-teal-50/30 flex flex-col font-sans mb-10">

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-2xl border-b border-teal-100/50 flex items-center justify-between px-6 md:px-12 z-50">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push('/dashboard/patient')}>
          <div className="w-12 h-12 bg-teal-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-teal-200">
            <FiActivity className="text-2xl" />
          </div>
          <span className="text-3xl font-black text-teal-900 tracking-tighter">Medoryx<span className="text-teal-500">.</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-sm font-black text-teal-900 leading-none mb-1">{user?.name}</span>
            <span className="text-[10px] font-bold text-teal-400 uppercase tracking-widest">Active Patient</span>
          </div>

          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="w-12 h-12 rounded-2xl bg-teal-50 border-2 border-white shadow-sm flex items-center justify-center hover:bg-teal-100 transition-all overflow-hidden"
            >
              <FiUser className="text-xl text-teal-600" />
            </button>

            {showProfileMenu && (
              <div className="absolute top-16 right-0 w-72 bg-white rounded-[2.5rem] shadow-2xl border border-teal-50 p-6 z-[60] animate-fade-in shadow-teal-200/50">
                <div className="flex items-center gap-4 mb-6 pb-6 border-b border-teal-50">
                  <div className="w-12 h-12 rounded-2xl bg-teal-600 flex items-center justify-center text-white font-black text-xl">
                    {user?.name?.charAt(0)}
                  </div>
                  <div>
                    <p className="text-lg font-black text-teal-900 leading-tight">{user?.name}</p>
                    <p className="text-xs font-bold text-teal-400">{user?.phone}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <button onClick={() => router.push('/dashboard/patient/profile')} className="w-full text-left p-4 rounded-2xl hover:bg-teal-50 text-teal-700 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3">
                    <FiUser className="text-lg" /> Account Settings
                  </button>
                  <button onClick={() => { localStorage.clear(); router.push('/'); }} className="w-full text-left p-4 rounded-2xl hover:bg-red-50 text-red-500 font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3">
                    <LuLogOut className="text-lg" /> Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="mt-32 max-w-7xl mx-auto px-6 w-full flex flex-col gap-10">

        {/* Top Section: Welcome & Important Banner */}
        <div className="flex flex-col lg:flex-row gap-8 items-stretch">

          {/* Welcome Card */}
          <div className="flex-grow bg-white p-12 rounded-[3.5rem] shadow-xl shadow-teal-100/50 border border-teal-50 flex flex-col justify-center relative overflow-hidden group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-teal-50 rounded-full blur-3xl group-hover:bg-teal-100 transition-colors"></div>
            <h1 className="text-4xl md:text-5xl font-black text-teal-950 mb-4 tracking-tighter">
              Hello, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-xl text-teal-600/70 font-medium max-w-lg mb-8">
              Welcome back to your health center. Everything you need for a healthier life is right here.
            </p>
            <div className="flex gap-4">
              <button onClick={() => router.push('/dashboard/patient/book-appointment')} className="bg-teal-600 text-white font-black px-8 py-4 rounded-2xl shadow-lg shadow-teal-200 hover:bg-teal-700 hover:scale-105 active:scale-95 transition-all flex items-center gap-2">
                <FiPlus className="text-xl" /> Book Consultation
              </button>
            </div>
          </div>

          {/* Conditional Next Appointment Banner */}
          <div className={`lg:w-[400px] p-12 rounded-[3.5rem] flex flex-col justify-center transition-all ${nextAppointment ? 'bg-teal-900 border-none shadow-2xl shadow-teal-950/20 text-white' : 'bg-white border border-teal-100 shadow-xl shadow-teal-50 text-teal-900'}`}>
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${nextAppointment ? 'bg-white/10 text-white' : 'bg-teal-50 text-teal-600'}`}>
                <FiCalendar />
              </div>
              <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${nextAppointment ? 'text-teal-300' : 'text-teal-400'}`}>Upcoming Visit</span>
            </div>

            {loading ? (
              <div className="animate-pulse flex flex-col gap-3">
                <div className="h-8 bg-white/10 rounded-lg w-3/4"></div>
                <div className="h-4 bg-white/5 rounded-lg w-1/2"></div>
              </div>
            ) : nextAppointment ? (
              <div className="animate-fade-in">
                <h3 className="text-2xl font-black mb-2 leading-tight">Dr. {nextAppointment.doctor?.name}</h3>
                <div className="flex items-center gap-4 text-sm font-bold text-teal-200 mb-6">
                  <span className="flex items-center gap-1.5"><FiClock /> {new Date(nextAppointment.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="w-1.5 h-1.5 bg-teal-500 rounded-full"></span>
                  <span>{new Date(nextAppointment.startTime).toLocaleDateString()}</span>
                </div>
                {nextAppointment.tokenNumber && (
                  <div className="mb-6 flex flex-col gap-2 bg-teal-800/50 p-4 rounded-2xl border border-teal-700/50">
                    <div className="flex justify-between items-center text-xs font-black uppercase tracking-[0.1em] text-teal-300">
                      <span>Your Token</span>
                      <span className="bg-teal-500 text-white px-2 py-0.5 rounded-lg">LIVE</span>
                    </div>
                    <span className="text-4xl font-black text-white">#{nextAppointment.tokenNumber}</span>
                  </div>
                )}
                <button onClick={() => router.push('/dashboard/patient/appointments')} className="text-xs font-black uppercase tracking-widest text-teal-400 hover:text-white transition-colors flex items-center gap-2 group">
                  View Live Queue <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            ) : (
              <div>
                <h3 className="text-2xl font-black mb-2 leading-tight text-teal-900">Health Checkup</h3>
                <p className="text-sm font-bold text-teal-500 mb-6 leading-relaxed">No scheduled appointments. Prevention is better than cure.</p>
                <button onClick={() => router.push('/dashboard/patient/doctors')} className="text-xs font-black uppercase tracking-widest text-teal-600 hover:text-teal-800 transition-colors flex items-center gap-2 group">
                  Find a doctor <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Stats Bar */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-indigo-600 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-200 text-white group hover:scale-[1.02] transition-all cursor-pointer overflow-hidden relative" onClick={() => router.push('/dashboard/patient/digitizer')}>
            <div className="relative z-10">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-2 block">AI Health Digitizer</span>
              <h4 className="text-2xl font-black mb-1">OCR Enabled</h4>
              <p className="text-xs font-bold opacity-80">Digitize your records instantly</p>
            </div>
            <FiEdit3 className="absolute -bottom-4 -right-4 text-9xl opacity-10 group-hover:scale-110 transition-transform" />
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100 border border-teal-50 flex items-center gap-6 group hover:border-teal-200 transition-all">
            <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center text-rose-500 text-3xl group-hover:bg-rose-500 group-hover:text-white transition-all">
              <LuPill />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 block">Active Meds</span>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black text-slate-900">4</h4>
                <span className="text-xs font-bold text-slate-400">Next due at 8 PM</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100 border border-teal-50 flex items-center gap-6 group hover:border-teal-200 transition-all">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-4xl group-hover:bg-teal-600 group-hover:text-white transition-all">
              <FiActivity />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1 block">Health Score</span>
              <div className="flex items-baseline gap-2">
                <h4 className="text-3xl font-black text-slate-900">Great</h4>
                <span className="text-xs font-bold text-teal-500 flex items-center gap-1">Stable <FiActivity /></span>
              </div>
            </div>
          </div>
        </section>

        {/* Action Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          {/* Card: Medicines */}
          <div onClick={() => router.push('/dashboard/patient/medicines')} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100/30 border border-teal-50 group hover:shadow-2xl hover:border-teal-100 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <LuPill />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-2">Medications</h3>
            <p className="text-sm font-bold text-teal-600/70 leading-relaxed">Search inventory and check live pharmacy availability.</p>
          </div>

          {/* Card: Marketplace */}
          <div onClick={() => router.push('/marketplace')} className="bg-orange-50/50 p-8 rounded-[2.5rem] shadow-xl shadow-orange-100/30 border border-orange-100 group hover:shadow-2xl hover:border-orange-200 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-orange-500 text-3xl mb-8 group-hover:bg-orange-500 group-hover:text-white transition-all shadow-sm">
              <FiShoppingBag />
            </div>
            <h3 className="text-xl font-black text-orange-950 mb-2">Marketplace</h3>
            <p className="text-sm font-bold text-orange-600/70 leading-relaxed">Save up to 80% on near-expiry genuine medicines.</p>
          </div>

          {/* Card: Medical Locker (PHF) */}
          <div onClick={() => router.push('/dashboard/patient/phf')} className="bg-teal-50/50 p-8 rounded-[2.5rem] shadow-xl shadow-teal-100/30 border border-teal-100 group hover:shadow-2xl hover:border-teal-200 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <LuFolderHeart />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-2">My Locker</h3>
            <p className="text-sm font-bold text-teal-600/70 leading-relaxed">Secure storage for reports, scans, and prescriptions.</p>
          </div>

          {/* Card: Hospital Beds */}
          <div onClick={() => router.push('/dashboard/patient/beds')} className="bg-rose-50/50 p-8 rounded-[2.5rem] shadow-xl shadow-rose-100/30 border border-rose-100 group hover:shadow-2xl hover:border-rose-200 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-rose-500 text-3xl mb-8 group-hover:bg-rose-500 group-hover:text-white transition-all shadow-sm">
              <FiActivity size={32} />
            </div>
            <h3 className="text-xl font-black text-rose-950 mb-2">Hospital Beds</h3>
            <p className="text-sm font-bold text-rose-600/70 leading-relaxed">Real-time ICU, Ventilator, and NICU tracker.</p>
          </div>

          {/* Card: Doctors */}
          <div onClick={() => router.push('/dashboard/patient/doctors')} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100/30 border border-teal-50 group hover:shadow-2xl hover:border-teal-100 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <LuStethoscope />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-2">Specialists</h3>
            <p className="text-sm font-bold text-teal-600/70 leading-relaxed">Book physical or virtual visits with certified experts.</p>
          </div>

          {/* Card: Appointments */}
          <div onClick={() => router.push('/dashboard/patient/appointments')} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100/30 border border-teal-50 group hover:shadow-2xl hover:border-teal-100 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <LuFileHeart />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-2">My History</h3>
            <p className="text-sm font-bold text-teal-600/70 leading-relaxed">Centralized records for appointments and prescriptions.</p>
          </div>

          {/* Card: Prescription Digitizer */}
          <div onClick={() => router.push('/dashboard/patient/digitizer')} className="bg-indigo-50/50 p-8 rounded-[2.5rem] shadow-xl shadow-indigo-100/30 border border-indigo-100 group hover:shadow-2xl hover:border-indigo-200 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-indigo-600 text-3xl mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
              <FiEdit3 />
            </div>
            <h3 className="text-xl font-black text-indigo-950 mb-2">AI Digitizer</h3>
            <p className="text-sm font-bold text-indigo-600/70 leading-relaxed">Convert handwritten prescriptions to digital data.</p>
          </div>

          {/* Card: Pharmacies */}
          <div onClick={() => router.push('/dashboard/patient/pharmacies')} className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-teal-100/30 border border-teal-50 group hover:shadow-2xl hover:border-teal-100 hover:-translate-y-2 transition-all cursor-pointer">
            <div className="w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center text-teal-600 text-3xl mb-8 group-hover:bg-teal-600 group-hover:text-white transition-all shadow-sm">
              <LuMapPin />
            </div>
            <h3 className="text-xl font-black text-teal-950 mb-2">Pharmacies</h3>
            <p className="text-sm font-bold text-teal-600/70 leading-relaxed">Find authorized retail fronts and get directions for pickup.</p>
          </div>

        </div>

        {/* Emergency Floating Area */}
        <div className="bg-red-50 p-8 md:p-12 rounded-[3.5rem] border border-red-100 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl shadow-red-200/20">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-red-600 rounded-3xl flex items-center justify-center text-white text-2xl shadow-lg shadow-red-200">
              <FiAlertCircle />
            </div>
            <div>
              <h3 className="text-xl font-black text-red-900">Need Urgent Help?</h3>
              <p className="text-red-600/70 font-bold">Access rapid emergency response in just one click.</p>
            </div>
          </div>
          <button
            onClick={() => alert("Connecting to Medico Emergency Center...")}
            className="bg-red-600 text-white font-black px-10 py-5 rounded-2xl shadow-xl shadow-red-300 hover:bg-red-700 hover:scale-105 active:scale-95 transition-all text-sm uppercase tracking-widest whitespace-nowrap"
          >
            Call Emergency 102
          </button>
        </div>

      </main>

      {/* Custom Styles */}
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
