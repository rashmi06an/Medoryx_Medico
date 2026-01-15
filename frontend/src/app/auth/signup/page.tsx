"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type UserRole = "patient" | "doctor" | "pharmacy" | "hospital";

interface User {
  phone: string;
  role: UserRole;
  pin: string;
}

export default function SignupPage() {
  const router = useRouter();

  const [role, setRole] = useState<UserRole>("patient");
  const [pin, setPin] = useState("");
  const [confirmPin, setConfirmPin] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("authPhone");
    if (!phone) {
      router.push("/");
    }
  }, [router]);

  const handleSignup = () => {
    if (pin.length !== 4 || confirmPin.length !== 4) {
      alert("PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      alert("PIN does not match");
      return;
    }

    const phone = localStorage.getItem("authPhone");
    if (!phone) return;

    const users: User[] = JSON.parse(
      localStorage.getItem("medoryx_users") || "[]"
    );

    const exists = users.find((u) => u.phone === phone);
    if (exists) {
      alert("User already exists, please login");
      router.push("/auth/login");
      return;
    }

    const newUser: User = {
      phone,
      role,
      pin,
    };

    users.push(newUser);
    localStorage.setItem("medoryx_users", JSON.stringify(users));
    localStorage.setItem("currentUser", JSON.stringify(newUser));

    localStorage.removeItem("authPhone");
    localStorage.removeItem("mockOtp");

    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow w-full max-w-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Complete Signup
        </h2>

        <label className="block mb-2 text-sm font-medium">
          Select Role
        </label>

        <select
          className="w-full mb-4 p-2 border rounded"
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
        >
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="pharmacy">Pharmacy</option>
          <option value="hospital">Hospital</option>
        </select>

        <input
          type="password"
          placeholder="Create 4-digit PIN"
          maxLength={4}
          inputMode="numeric"
          className="w-full mb-3 p-2 border rounded"
          value={pin}
          onChange={(e) =>
            setPin(e.target.value.replace(/\D/g, ""))
          }
        />

        <input
          type="password"
          placeholder="Confirm PIN"
          maxLength={4}
          inputMode="numeric"
          className="w-full mb-6 p-2 border rounded"
          value={confirmPin}
          onChange={(e) =>
            setConfirmPin(e.target.value.replace(/\D/g, ""))
          }
        />

        <button
          onClick={handleSignup}
          className="w-full bg-blue-600 text-white py-2 rounded"
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
