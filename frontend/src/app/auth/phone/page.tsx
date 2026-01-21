"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PhoneAuthPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const sendOtp = () => {
    if (phone.length !== 10) {
      alert("Enter valid 10-digit phone number");
      return;
    }

    // MOCK OTP
    localStorage.setItem("mockOtp", "1234");
    localStorage.setItem("authPhone", phone);

    setOtpSent(true);
    alert("OTP sent: 1234 (mock)");
  };

  const verifyOtp = () => {
    const savedOtp = localStorage.getItem("mockOtp");

    if (otp !== savedOtp) {
      alert("Invalid OTP");
      return;
    }

    router.push("/auth/signup");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-teal-50 w-full max-w-md">
        <h2 className="text-3xl font-black text-center text-teal-950 mb-8">
          Continue with Phone
        </h2>

        {!otpSent ? (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-teal-900 ml-1">Phone Number</label>
              <input
                type="tel"
                placeholder="10-digit phone number"
                className="w-full p-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-teal-900 font-bold"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button
              onClick={sendOtp}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-100 hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Send OTP
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-teal-900 ml-1">One-Time Password</label>
              <input
                type="number"
                placeholder="Enter OTP"
                className="w-full p-4 bg-teal-50/30 border-2 border-teal-50 rounded-2xl focus:outline-none focus:border-teal-600 focus:bg-white transition-all text-teal-900 font-bold"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>

            <button
              onClick={verifyOtp}
              className="w-full bg-teal-600 text-white py-4 rounded-2xl font-black shadow-lg shadow-teal-100 hover:scale-105 active:scale-95 transition-all text-lg"
            >
              Verify OTP
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
