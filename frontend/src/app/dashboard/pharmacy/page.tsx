"use client";

import { FiBox, FiInbox, FiAlertTriangle, FiLogOut } from "react-icons/fi";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function PharmacyDashboard() {
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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-teal-800 tracking-tight">Medico<span className="text-teal-500">.</span></h1>
            <p className="text-sm text-white0">Pharmacy Control Center</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-700">Welcome, {user?.name || "Pharmacist"}</span>
            <button
              onClick={() => {
                localStorage.removeItem("currentUser");
                localStorage.removeItem("token");
                router.push("/");
              }}
              className="flex items-center gap-2 text-sm text-white0 hover:text-red-500 transition-colors"
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="mb-10">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Pharmacy Overview</h2>
          <p className="mt-2 text-lg text-gray-600">Manage inventory, orders, and alerts efficiently.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Action Card: Manage Inventory */}
          <div
            onClick={() => router.push("/dashboard/pharmacy/inventory")}
            className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-2xl transform hover:-tranteal-y-1 transition-all duration-300 cursor-pointer border border-transparent hover:border-teal-50"
          >
            <div className="w-14 h-14 bg-teal-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-teal-600 transition-colors duration-300 shadow-sm">
              <FiBox className="text-2xl text-teal-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-teal-700 transition-colors">Manage Inventory</h3>
            <p className="text-white0 leading-relaxed mb-4">
              Add new medicines, update stock levels, and track batch numbers.
            </p>
            <span className="text-teal-600 font-semibold group-hover:underline flex items-center gap-2 text-sm">
              Open Inventory &rarr;
            </span>
          </div>

          {/* Placeholder Card: Order Requests */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
              <FiInbox className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">Order Requests</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              View and fulfill medicine reservation requests from patients.
            </p>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
          </div>

          {/* Placeholder Card: Expiry Alerts */}
          <div className="group bg-white p-8 rounded-2xl shadow-sm border border-gray-100 opacity-70 hover:opacity-100 transition-opacity duration-300">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6">
              <FiAlertTriangle className="text-2xl text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-400 mb-2">Expiry Alerts</h3>
            <p className="text-gray-400 leading-relaxed mb-4">
              Get notified about medicines nearing their expiry date.
            </p>
            <span className="text-xs font-medium uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded">Coming Soon</span>
          </div>
        </div>
      </main>
    </div>
  );
}
