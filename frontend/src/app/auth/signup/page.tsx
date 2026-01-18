"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { FiEye, FiEyeOff, FiArrowRight, FiLock } from "react-icons/fi";

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
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const phone = localStorage.getItem("authPhone");
    if (!phone) {
      router.push("/");
    }
  }, [router]);

  const handleSignup = () => {
    setError("");

    if (pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return;
    }

    if (confirmPin.length !== 4) {
      setError("Confirm PIN must be exactly 4 digits");
      return;
    }

    if (pin !== confirmPin) {
      setError("PINs do not match");
      return;
    }

    setLoading(true);

    const phone = localStorage.getItem("authPhone");
    if (!phone) return;

    const users: User[] = JSON.parse(
      localStorage.getItem("medoryx_users") || "[]"
    );

    const exists = users.find((u) => u.phone === phone);
    if (exists) {
      setError("User already exists, please login");
      setLoading(false);
      setTimeout(() => router.push("/auth/login"), 1000);
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

    const dashboardRoutes: Record<UserRole, string> = {
      patient: "/dashboard/patient",
      doctor: "/dashboard/doctor",
      pharmacy: "/dashboard/pharmacy",
      hospital: "/dashboard/hospital",
    };

    router.push(dashboardRoutes[role]);
  };

  return (
    <div className="signup-container">
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

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(40px);
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

        .signup-container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #f8fffe 0%, #e8f7f6 50%, #f0fffe 100%);
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .signup-container::before {
          content: "";
          position: absolute;
          top: -50%;
          left: -10%;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0, 128, 128, 0.1) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 8s ease-in-out infinite;
          z-index: 0;
        }

        .signup-container::after {
          content: "";
          position: absolute;
          bottom: -30%;
          right: -5%;
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(0, 128, 128, 0.08) 0%, transparent 70%);
          border-radius: 50%;
          animation: float 10s ease-in-out infinite;
          z-index: 0;
        }

        .signup-wrapper {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 80px;
          max-width: 1200px;
          width: 100%;
          z-index: 1;
          align-items: center;
        }

        .signup-visual {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          animation: slideInRight 0.8s ease-out;
        }

        .signup-visual-icon {
          width: 300px;
          height: 300px;
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.1) 0%, rgba(0, 128, 128, 0.05) 100%);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 120px;
          margin-bottom: 30px;
          animation: float 4s ease-in-out infinite;
          border: 2px solid rgba(0, 128, 128, 0.15);
        }

        .signup-visual h3 {
          font-size: 24px;
          color: #004d4d;
          font-weight: 700;
          margin-bottom: 10px;
        }

        .signup-visual p {
          font-size: 15px;
          color: #666;
          text-align: center;
          line-height: 1.6;
        }

        .signup-form-section {
          animation: fadeInUp 0.8s ease-out;
        }

        .signup-card {
          background: white;
          border-radius: 20px;
          padding: 50px 40px;
          box-shadow: 0 20px 60px rgba(0, 128, 128, 0.1);
          border: 1px solid rgba(0, 128, 128, 0.1);
          backdrop-filter: blur(10px);
        }

        .signup-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 40px;
          justify-content: center;
        }

        .signup-logo-image {
          height: 40px;
          width: auto;
          object-fit: contain;
        }

        .signup-logo-text {
          font-size: 20px;
          font-weight: 800;
          background: linear-gradient(135deg, #008080 0%, #004d4d 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          letter-spacing: -0.5px;
        }

        .signup-heading {
          font-size: 28px;
          font-weight: 800;
          color: #004d4d;
          margin-bottom: 15px;
          text-align: center;
        }

        .signup-subtitle {
          font-size: 14px;
          color: #666;
          text-align: center;
          margin-bottom: 35px;
          line-height: 1.6;
        }

        .form-group {
          margin-bottom: 25px;
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

        .role-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .role-option {
          padding: 14px;
          border: 2px solid rgba(0, 128, 128, 0.2);
          border-radius: 12px;
          background: rgba(0, 128, 128, 0.02);
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
          font-weight: 600;
          color: #004d4d;
          text-align: center;
        }

        .role-option:hover {
          border-color: #008080;
          background: rgba(0, 128, 128, 0.08);
        }

        .role-option.active {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          border-color: #008080;
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
          margin-top: 20px;
          padding: 12px;
          background: rgba(231, 76, 60, 0.1);
          border-left: 3px solid #e74c3c;
          border-radius: 4px;
          animation: fadeInUp 0.3s ease-out;
        }

        .form-actions {
          margin-top: 30px;
        }

        .signup-button {
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

        .signup-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(0, 128, 128, 0.3);
        }

        .signup-button:active:not(:disabled) {
          transform: translateY(0);
        }

        .signup-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .login-link {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }

        .login-link a {
          color: #008080;
          text-decoration: none;
          font-weight: 700;
          transition: all 0.3s ease;
          cursor: pointer;
        }

        .login-link a:hover {
          color: #006666;
          text-decoration: underline;
        }

        @media (max-width: 1024px) {
          .signup-wrapper {
            grid-template-columns: 1fr;
            gap: 40px;
          }

          .signup-visual-icon {
            width: 250px;
            height: 250px;
            font-size: 100px;
          }

          .signup-card {
            padding: 40px 30px;
          }
        }

        @media (max-width: 768px) {
          .signup-card {
            padding: 30px 25px;
          }

          .signup-heading {
            font-size: 24px;
          }

          .signup-visual-icon {
            width: 200px;
            height: 200px;
            font-size: 80px;
            margin-bottom: 20px;
          }

          .signup-visual h3 {
            font-size: 20px;
          }

          .form-input {
            padding: 12px 14px 12px 40px;
            font-size: 14px;
          }

          .signup-button {
            padding: 12px;
            font-size: 14px;
          }

          .role-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      <div className="signup-wrapper">
        {/* Left Side - Form */}
        <div className="signup-form-section">
          <div className="signup-card">
            {/* Logo */}
            <div className="signup-logo">
              <Image
                src="/medoryx-logo.png"
                alt="Medoryx"
                width={150}
                height={40}
                className="signup-logo-image"
              />
              <span className="signup-logo-text">Medoryx</span>
            </div>

            {/* Heading */}
            <h1 className="signup-heading">Complete Signup</h1>
            <p className="signup-subtitle">Select your role and create a secure 4-digit PIN</p>

            {/* Role Selection */}
            <div className="form-group">
              <label className="form-label">Select Your Role</label>
              <div className="role-grid">
                <div
                  className={`role-option ${role === "patient" ? "active" : ""}`}
                  onClick={() => setRole("patient")}
                >
                  👤 Patient
                </div>
                <div
                  className={`role-option ${role === "doctor" ? "active" : ""}`}
                  onClick={() => setRole("doctor")}
                >
                  👨‍⚕️ Doctor
                </div>
                <div
                  className={`role-option ${role === "pharmacy" ? "active" : ""}`}
                  onClick={() => setRole("pharmacy")}
                >
                  💊 Pharmacy
                </div>
                <div
                  className={`role-option ${role === "hospital" ? "active" : ""}`}
                  onClick={() => setRole("hospital")}
                >
                  🏥 Hospital
                </div>
              </div>
            </div>

            {/* PIN Input */}
            <div className="form-group">
              <label className="form-label">Create 4-Digit PIN</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showPin ? "text" : "password"}
                  placeholder="Enter PIN"
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

            {/* Confirm PIN Input */}
            <div className="form-group">
              <label className="form-label">Confirm PIN</label>
              <div className="input-wrapper">
                <FiLock className="input-icon" />
                <input
                  type={showConfirmPin ? "text" : "password"}
                  placeholder="Confirm PIN"
                  maxLength={4}
                  inputMode="numeric"
                  className="form-input"
                  value={confirmPin}
                  onChange={(e) => {
                    setConfirmPin(e.target.value.replace(/\D/g, ""));
                    setError("");
                  }}
                />
                <button
                  className="toggle-pin"
                  onClick={() => setShowConfirmPin(!showConfirmPin)}
                  type="button"
                >
                  {showConfirmPin ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && <div className="error-message">{error}</div>}

            {/* Signup Button */}
            <div className="form-actions">
              <button
                onClick={handleSignup}
                disabled={loading}
                className="signup-button"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <FiArrowRight />}
              </button>
            </div>

            {/* Login Link */}
            <p className="login-link">
              Already have an account?{" "}
              <a onClick={() => router.push("/auth/login")}>Login Here</a>
            </p>
          </div>
        </div>

        {/* Right Side - Visual */}
        <div className="signup-visual">
          <div className="signup-visual-icon">✨</div>
          <h3>Create Your Account</h3>
          <p>Join Medoryx and get access to comprehensive healthcare services tailored to your needs</p>
        </div>
      </div>
    </div>
  );
}
