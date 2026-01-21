"use client";

import { FiSearch, FiCalendar, FiFileText, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PatientDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<{ name: string } | null>(null);

  useEffect(() => {
    const userStr = localStorage.getItem("currentUser");
    if (!userStr) {
      router.replace("/");
    } else {
      setUser(JSON.parse(userStr));
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-teal-800 tracking-tight">Medico<span className="text-teal-500">.</span></h1>
            <p className="text-sm text-gray-500">Patient Portal</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Welcome, {user?.name || "Patient"}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-500 transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Your Health Dashboard</h2>
          <p className="mt-2 text-lg text-gray-600">Access medicines, appointments, and records in one place.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Action Card: Find Medicines */}
          <div
            onClick={() => router.push("/dashboard/patient/medicines")}
            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50"
          >
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
              <FiSearch className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">Find Medicines</h3>
            <p className="text-gray-500 leading-relaxed mb-4">
              Real-time availability search across nearby pharmacies. Locate stock instantly.
            </p>
            <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
              Search Now &rarr;
            </span>
          </div>

          {/* Placeholder Card: Appointments */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <FiCalendar className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">My Appointments</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Book consultations with top doctors and manage your schedule.
            </p>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
          </div>

          {/* Placeholder Card: Records */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center mb-6">
              <FiFileText className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">Health Records</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Securely store and access your medical history and prescriptions.
            </p>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
          </div>
        </div>
      </main>
    </div>
  );
}
