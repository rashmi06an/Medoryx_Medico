"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff, FiArrowRight, FiLock, FiPhone } from "react-icons/fi";

type UserRole = "patient" | "doctor" | "pharmacy" | "hospital";

interface User {
  phone: string;
  pin: string;
  role: UserRole;
}

import axios from "axios";

// ... existing imports

export default function LoginPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"role" | "credentials">("role");
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles = [
    { id: "patient" as UserRole, title: "Patient", description: "Book appointments & track health", icon: "👤" },
    { id: "doctor" as UserRole, title: "Doctor", description: "Manage patients & consultations", icon: "👨‍⚕️" },
    { id: "pharmacy" as UserRole, title: "Pharmacy", description: "Track orders & prescriptions", icon: "💊" },
    { id: "hospital" as UserRole, title: "Hospital", description: "Manage beds & resources", icon: "🏥" },
  ];

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setStep("credentials");
  };

  const handleLogin = async () => {
    setError("");

    if (phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return;
    }

    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);

    try {
      // Call Real Backend API
      const res = await axios.post("http://localhost:8000/api/auth/login-pin", {
        phone,
        pin
      });

      const { token, role, name } = res.data;

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify({ phone, role, token, name }));

      const dashboardRoutes: Record<string, string> = {
        patient: "/dashboard/patient",
        doctor: "/dashboard/doctor",
        pharmacy: "/dashboard/pharmacy",
        hospital: "/dashboard/hospital",
      };

      router.push(dashboardRoutes[role]);

    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.msg || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <style jsx>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-40px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-15px);
          }
        }

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(0, 128, 128, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(0, 128, 128, 0.5);
          }
        }

        .login-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fffe 0%, #e8f7f6 50%, #f0fffe 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .login-container::before {
          content: "";
          position: absolute;
          top: -50%;
          right: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 128, 128, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          z-index: 0;
        }

        .login-container::after {
          content: "";
          position: absolute;
          bottom: -30%;
          left: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 128, 128, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
          z-index: 0;
        }

        .login-wrapper {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 60px;
          max-width: 1200px;
          width: 100%;
          z-index: 1;
          align-items: center;
        }

        .login-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: slideInLeft 0.8s ease-out;
        }

        .login-visual-icon {
          width: 250px;
          height: 250px;
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.1) 0%, rgba(0, 128, 128, 0.05) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 100px;
          margin-bottom: 30px;
          animation: float 4s ease-in-out infinite;
          border: 2px solid rgba(0, 128, 128, 0.15);
        }

        .login-visual h3 {
          font-size: 24px;
          color: #004d4d;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .login-visual p {
          font-size: 15px;
          color: #666;
          text-align: center;
          line-height: 1.6;
        }

        .login-form-section {
          animation: fadeInUp 0.8s ease-out;
        }

        .login-card {
          background: white;
          border-radius: 20px;
          padding: 40px;
          box-shadow: 0 20px 60px rgba(0, 128, 128, 0.1);
          border: 1px solid rgba(0, 128, 128, 0.1);
          backdrop-filter: blur(10px);
          min-height: 550px;
          display: flex;
          flex-direction: column;
        }

        .login-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 30px;
          justify-content: center;
        }

        .login-logo-image {
          height: 35px;
          width: 120px;
          object-fit: contain;
        }

        .login-logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #008080 0%, #004d4d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .login-heading {
          font-size: 28px;
          font-weight: 800;
          color: #004d4d;
          margin-bottom: 10px;
          text-align: center;
        }

        .login-subtitle {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 30px;
          line-height: 1.6;
        }

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .role-card {
          background: white;
          border: 2px solid rgba(0, 128, 128, 0.1);
          border-radius: 16px;
          padding: 20px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 10px;
        }

        .role-card:hover {
          border-color: #008080;
          background: rgba(0, 128, 128, 0.02);
          transform: translateY(-5px);
          box-shadow: 0 10px 20px rgba(0, 128, 128, 0.05);
        }

        .role-icon {
          font-size: 32px;
          background: rgba(0, 128, 128, 0.05);
          width: 60px;
          height: 60px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 5px;
          transition: all 0.3s ease;
        }

        .role-card:hover .role-icon {
          background: #008080;
          color: white;
          transform: scale(1.1);
        }

        .role-card h4 {
          font-size: 16px;
          font-weight: 700;
          color: #004d4d;
        }

        .role-card p {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-label {
          display: block;
          font-size: 13px;
          font-weight: 700;
          color: #004d4d;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 8px;
        }

        .input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
        }

        .form-input {
          width: 100%;
          padding: 14px 16px 14px 45px;
          border: 2px solid rgba(0, 128, 128, 0.2);
          border-radius: 12px;
          font-size: 15px;
          color: #004d4d;
          background: rgba(0, 128, 128, 0.02);
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .form-input::placeholder {
          color: #999;
        }

        .form-input:focus {
          outline: none;
          border-color: #008080;
          background: rgba(0, 128, 128, 0.05);
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
        }

        .input-icon {
          position: absolute;
          left: 14px;
          color: #008080;
          font-size: 18px;
          pointer-events: none;
        }

        .toggle-pin {
          position: absolute;
          right: 14px;
          cursor: pointer;
          color: #008080;
          font-size: 18px;
          transition: all 0.3s ease;
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .toggle-pin:hover {
          color: #006666;
          transform: scale(1.1);
        }

        .error-message {
          color: #e74c3c;
          font-size: 13px;
          margin-top: 8px;
          padding: 10px;
          background: rgba(231, 76, 60, 0.1);
          border-left: 3px solid #e74c3c;
          border-radius: 4px;
          animation: fadeInUp 0.3s ease-out;
        }

        .form-actions {
          margin-top: 25px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .login-button {
          width: 100%;
          padding: 14px;
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          border: none;
          border-radius: 12px;
          font-size: 16px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .login-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 128, 128, 0.3);
        }

        .back-button {
          width: 100%;
          padding: 12px;
          background: transparent;
          color: #008080;
          border: 2px solid #008080;
          border-radius: 12px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .back-button:hover {
          background: rgba(0, 128, 128, 0.05);
        }

        .signup-link {
          text-align: center;
          margin-top: auto;
          padding-top: 20px;
          font-size: 14px;
          color: #666;
        }

        .signup-link a {
          color: #008080;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .signup-link a:hover {
          color: #006666;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .login-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .login-visual-icon {
            width: 180px;
            height: 180px;
            font-size: 80px;
          }

          .login-card {
            padding: 30px;
            min-height: auto;
          }
        }

        @media (max-width: 600px) {
          .role-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="login-wrapper">
        {/* Left Side - Visual */}
        <div className="login-visual">
          <div className="login-visual-icon">
            {step === "role" ? "🌐" : selectedRole === "patient" ? "👤" : selectedRole === "doctor" ? "👨‍⚕️" : selectedRole === "pharmacy" ? "💊" : "🏥"}
          </div>
          <h3>{step === "role" ? "Join the Network" : `Welcome, ${selectedRole?.charAt(0).toUpperCase()}${selectedRole?.slice(1)}`}</h3>
          <p>
            {step === "role"
              ? "Select your user type to continue your journey into a smarter healthcare ecosystem."
              : `Access your specialized ${selectedRole} dashboard with your secure credentials.`
            }
          </p>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-section">
          <div className="login-card">
            {/* Logo */}
            <div className="login-logo">
              <Image
                src="/medoryx-logo.png"
                alt="Medoryx"
                width={120}
                height={35}
                className="login-logo-image"
              />
              <span className="login-logo-text">Medoryx</span>
            </div>

            {step === "role" ? (
              <>
                <h1 className="login-heading">Who are you?</h1>
                <p className="login-subtitle">Choose your role to get started</p>

                <div className="role-grid">
                  {roles.map((role) => (
                    <div
                      key={role.id}
                      className="role-card"
                      onClick={() => handleRoleSelect(role.id)}
                    >
                      <div className="role-icon">{role.icon}</div>
                      <h4>{role.title}</h4>
                      <p>{role.description}</p>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <h1 className="login-heading">Login</h1>
                <p className="login-subtitle">Enter your phone number and PIN to access your {selectedRole} account</p>

                {/* Demo Credentials Alert - For Project Checker */}
                {selectedRole && ["pharmacy", "doctor", "patient"].includes(selectedRole) && (
                  <div style={{ background: '#f0f9ff', padding: '12px', borderRadius: '8px', border: '1px solid #bae6fd', marginBottom: '20px', fontSize: '13px', color: '#0369a1' }}>
                    <strong style={{ display: 'block', marginBottom: '4px' }}>PROJECT CHECKER DEMO CREDENTIALS:</strong>
                    {selectedRole === 'pharmacy' && (
                      <div>
                        Phone: <strong>1234987654</strong> | PIN: <strong>9876</strong>
                      </div>
                    )}
                    {selectedRole === 'doctor' && (
                      <div>
                        Phone: <strong>9876543201</strong> | PIN: <strong>9856</strong>
                      </div>
                    )}
                    {selectedRole === 'patient' && (
                      <div>
                        Phone: <strong>1234098765</strong> | PIN: <strong>4567</strong>
                      </div>
                    )}
                  </div>
                )}

                {/* Phone Input */}
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <div className="input-wrapper">
                    <FiPhone className="input-icon" />
                    <input
                      type="tel"
                      placeholder="10-digit phone number"
                      maxLength={10}
                      inputMode="numeric"
                      className="form-input"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                    />
                  </div>
                </div>

                {/* PIN Input */}
                <div className="form-group">
                  <label className="form-label">4-Digit PIN</label>
                  <div className="input-wrapper">
                    <FiLock className="input-icon" />
                    <input
                      type={showPin ? "text" : "password"}
                      placeholder="Enter your PIN"
                      maxLength={4}
                      inputMode="numeric"
                      className="form-input"
                      value={pin}
                      onChange={(e) => {
                        setPin(e.target.value.replace(/\D/g, ""));
                        setError("");
                      }}
                    />
                    <button
                      className="toggle-pin"
                      onClick={() => setShowPin(!showPin)}
                      type="button"
                    >
                      {showPin ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>

                {/* Error Message */}
                {error && <div className="error-message">{error}</div>}

                {/* Form Actions */}
                <div className="form-actions">
                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="login-button"
                  >
                    {loading ? "Logging in..." : "Login"}
                    {!loading && <FiArrowRight />}
                  </button>
                  <button
                    className="back-button"
                    onClick={() => setStep("role")}
                    disabled={loading}
                  >
                    Change Role
                  </button>
                </div>
              </>
            )}

            {/* Signup Link */}
            <p className="signup-link">
              Don&apos;t have an account?{" "}
              <a onClick={() => router.push("/signup")}>Sign Up Now</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
