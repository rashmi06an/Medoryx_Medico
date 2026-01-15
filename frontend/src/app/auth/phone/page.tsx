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
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Continue with Phone
        </h2>

        {!otpSent ? (
          <>
            <input
              type="tel"
              placeholder="10-digit phone number"
              className="w-full mb-4 p-2 border rounded"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
            />

            <button
              onClick={sendOtp}
              className="w-full bg-blue-600 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        ) : (
          <>
            <input
              type="number"
              placeholder="Enter OTP"
              className="w-full mb-4 p-2 border rounded"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />

            <button
              onClick={verifyOtp}
              className="w-full bg-green-600 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}
      </div>
    </div>
  );
}
