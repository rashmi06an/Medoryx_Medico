"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type UserRole = "patient" | "doctor" | "pharmacy" | "hospital";

interface User {
  phone: string;
  pin: string;
  role: UserRole;
}

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    if (phone.length !== 10) {
      alert("Enter valid phone number");
      return;
    }

    if (pin.length !== 4) {
      alert("Enter 4-digit PIN");
      return;
    }

    const users: User[] = JSON.parse(
      localStorage.getItem("medoryx_users") || "[]"
    );

    const user = users.find(
      (u) => u.phone === phone && u.pin === pin
    );

    if (!user) {
      alert("Invalid phone number or PIN");
      return;
    }

    localStorage.setItem("currentUser", JSON.stringify(user));
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Login to MEDORYX
        </h2>

        <input
          type="tel"
          placeholder="Phone Number"
          maxLength={10}
          className="w-full mb-4 p-2 border rounded"
          value={phone}
          onChange={(e) =>
            setPhone(e.target.value.replace(/\D/g, ""))
          }
        />

        <input
          type="password"
          placeholder="4-digit PIN"
          maxLength={4}
          inputMode="numeric"
          className="w-full mb-6 p-2 border rounded"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ""))
          }
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Login
        </button>
      </div>
    </div>
  );
}
