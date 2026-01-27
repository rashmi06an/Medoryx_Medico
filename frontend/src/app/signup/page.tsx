"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiEye, FiEyeOff, FiArrowRight, FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { API_BASE_URL } from "@/config/api";

type UserRole = "patient" | "doctor" | "pharmacy" | "hospital";

interface SignupData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: UserRole;
  pin: string;
  confirmPin: string;
}

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "role" | "pin">("details");
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState<SignupData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "patient",
    pin: "",
    confirmPin: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const validateDetails = () => {
    if (!formData.firstName.trim()) {
      setError("First name is required");
      return false;
    }
    if (!formData.lastName.trim()) {
      setError("Last name is required");
      return false;
    }
    if (!formData.email.trim()) {
      setError("Email is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length !== 10) {
      setError("Please enter a valid 10-digit phone number");
      return false;
    }
    return true;
  };

  const validatePin = () => {
    if (formData.pin.length !== 4) {
      setError("PIN must be exactly 4 digits");
      return false;
    }
    if (formData.confirmPin.length !== 4) {
      setError("Please confirm your PIN");
      return false;
    }
    if (formData.pin !== formData.confirmPin) {
      setError("PINs do not match");
      return false;
    }
    return true;
  };

  const handleNextStep = async () => {
    if (step === "details") {
      if (validateDetails()) {
        setStep("role");
      }
    } else if (step === "role") {
      setStep("pin");
    }
  };

  const handleSignup = async () => {
    if (!validatePin()) {
      return;
    }

    setLoading(true);

    try {
      // Call Real Backend API
      const res = await axios.post(`${API_BASE_URL}/auth/register`, {
        phone: formData.phone,
        pin: formData.pin,
        role: formData.role,
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email
      });

      const { token, role } = res.data;

      // Store token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("currentUser", JSON.stringify({
        phone: formData.phone,
        role,
        token,
        name: `${formData.firstName} ${formData.lastName}`
      }));

      // Route to appropriate dashboard
      const dashboardRoutes: Record<UserRole, string> = {
        patient: "/dashboard/patient",
        doctor: "/dashboard/doctor",
        pharmacy: "/dashboard/pharmacy",
        hospital: "/dashboard/hospital",
      };

      router.push(dashboardRoutes[role as UserRole]);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.msg || "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-bg"></div>

      <div className="signup-wrapper">
        {/* Logo */}
        <div className="signup-header">
          <Image
            src="/medoryx-logo.png"
            alt="Medoryx"
            width={200}
            height={60}
            className="signup-logo"
          />
        </div>

        <div className="signup-form-container">
          {/* Step Indicator */}
          <div className="step-indicator">
            <div className={`step ${step === "details" ? "active" : step === "role" || step === "pin" ? "completed" : ""}`}>
              <span>1</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === "role" ? "active" : step === "pin" ? "completed" : ""}`}>
              <span>2</span>
            </div>
            <div className="step-line"></div>
            <div className={`step ${step === "pin" ? "active" : ""}`}>
              <span>3</span>
            </div>
          </div>

          {/* Form Title */}
          <div className="form-header">
            {step === "details" && (
              <>
                <h1>Create Your Account</h1>
                <p>Enter your personal details to get started</p>
              </>
            )}
            {step === "role" && (
              <>
                <h1>Choose Your Role</h1>
                <p>Select how you&apos;ll use Medoryx</p>
              </>
            )}
            {step === "pin" && (
              <>
                <h1>Create Your PIN</h1>
                <p>Set a 4-digit PIN for secure access</p>
              </>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <p>{error}</p>
            </div>
          )}

          {/* Step 1: User Details */}
          {step === "details" && (
            <div className="form-section">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName">First Name *</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="John"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastName">Last Name *</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Doe"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="9876543210"
                  maxLength={10}
                  value={formData.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "");
                    setFormData((prev) => ({
                      ...prev,
                      phone: value,
                    }));
                    setError("");
                  }}
                  className="form-input"
                />
              </div>

              <button
                onClick={handleNextStep}
                className="btn-continue"
                disabled={loading}
              >
                Continue <FiArrowRight />
              </button>

              <div className="form-footer">
                <p>
                  Already have an account?{" "}
                  <button
                    onClick={() => router.push("/auth/login")}
                    className="link-button"
                  >
                    Log In
                  </button>
                </p>
              </div>
            </div>
          )}

          {/* Step 2: Role Selection */}
          {step === "role" && (
            <div className="form-section">
              <div className="roles-grid">
                {[
                  {
                    value: "patient" as UserRole,
                    label: "Patient",
                    description: "Book appointments and manage health",
                    icon: "🏥",
                  },
                  {
                    value: "doctor" as UserRole,
                    label: "Doctor",
                    description: "Manage appointments and patients",
                    icon: "👨‍⚕️",
                  },
                  {
                    value: "pharmacy" as UserRole,
                    label: "Pharmacy",
                    description: "Manage prescriptions and inventory",
                    icon: "💊",
                  },
                  {
                    value: "hospital" as UserRole,
                    label: "Hospital",
                    description: "Manage facilities and operations",
                    icon: "🏨",
                  },
                ].map((role) => (
                  <div
                    key={role.value}
                    className={`role-card ${formData.role === role.value ? "selected" : ""
                      }`}
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        role: role.value,
                      }));
                    }}
                  >
                    <div className="role-icon">{role.icon}</div>
                    <h3>{role.label}</h3>
                    <p>{role.description}</p>
                    {formData.role === role.value && (
                      <div className="role-check">✓</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="button-group">
                <button
                  onClick={() => setStep("details")}
                  className="btn-back"
                  disabled={loading}
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  onClick={handleNextStep}
                  className="btn-continue"
                  disabled={loading}
                >
                  Continue <FiArrowRight />
                </button>
              </div>
            </div>
          )}

          {/* Step 3: PIN Creation */}
          {step === "pin" && (
            <div className="form-section">
              <div className="role-display">
                <p>
                  You&apos;re signing up as: <strong>{formData.role.toUpperCase()}</strong>
                </p>
              </div>

              <div className="form-group">
                <label htmlFor="pin">Create 4-Digit PIN *</label>
                <div className="password-input-group">
                  <input
                    type={showPin ? "text" : "password"}
                    id="pin"
                    name="pin"
                    placeholder="••••"
                    maxLength={4}
                    inputMode="numeric"
                    value={formData.pin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({
                        ...prev,
                        pin: value,
                      }));
                      setError("");
                    }}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPin">Confirm PIN *</label>
                <div className="password-input-group">
                  <input
                    type={showConfirmPin ? "text" : "password"}
                    id="confirmPin"
                    name="confirmPin"
                    placeholder="••••"
                    maxLength={4}
                    inputMode="numeric"
                    value={formData.confirmPin}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setFormData((prev) => ({
                        ...prev,
                        confirmPin: value,
                      }));
                      setError("");
                    }}
                    className="form-input"
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPin(!showConfirmPin)}
                  >
                    {showConfirmPin ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
              </div>

              <div className="pin-info">
                <p>💡 Use this PIN to sign in later. Make sure to remember it!</p>
              </div>

              <div className="button-group">
                <button
                  onClick={() => setStep("role")}
                  className="btn-back"
                  disabled={loading}
                >
                  <FiArrowLeft /> Back
                </button>
                <button
                  onClick={handleSignup}
                  className="btn-signup"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .signup-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #f8fffe 0%, #e8f7f6 50%, #f0fffe 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
        }

        .signup-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(
            circle at 20% 30%,
            rgba(0, 128, 128, 0.08) 0%,
            transparent 50%
          );
          pointer-events: none;
        }

        .signup-wrapper {
          position: relative;
          z-index: 1;
          width: 100%;
          max-width: 550px;
          background: white;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0, 128, 128, 0.15);
          overflow: hidden;
          animation: slideInUp 0.5s ease-out;
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .signup-header {
          padding: 30px 20px;
          text-align: center;
          border-bottom: 1px solid rgba(0, 128, 128, 0.1);
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.02) 0%, rgba(0, 128, 128, 0.01) 100%);
        }

        .signup-logo {
          height: 50px;
          width: auto;
          object-fit: contain;
        }

        .signup-form-container {
          padding: 40px;
        }

        .step-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 40px;
        }

        .step {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 16px;
          background: #f0fffe;
          color: #666;
          border: 2px solid #ddd;
          position: relative;
          z-index: 1;
          transition: all 0.3s ease;
        }

        .step.active {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          border-color: #008080;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
        }

        .step.completed {
          background: #008080;
          color: white;
          border-color: #008080;
        }

        .step-line {
          flex: 1;
          height: 2px;
          background: #ddd;
          margin: 0 10px;
          position: relative;
        }

        .step.completed ~ .step-line {
          background: #008080;
        }

        .form-header {
          text-align: center;
          margin-bottom: 30px;
        }

        .form-header h1 {
          font-size: 28px;
          color: #004d4d;
          font-weight: 800;
          margin-bottom: 10px;
        }

        .form-header p {
          font-size: 15px;
          color: #666;
        }

        .error-message {
          background: #fee;
          border: 1px solid #fcc;
          color: #c33;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 20px;
          font-size: 14px;
          animation: slideInUp 0.3s ease-out;
        }

        .form-section {
          animation: fadeIn 0.3s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
        }

        .form-group {
          margin-bottom: 20px;
        }

        .form-group label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #004d4d;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          padding: 12px 16px;
          border: 2px solid #ddd;
          border-radius: 8px;
          font-size: 15px;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .form-input:focus {
          outline: none;
          border-color: #008080;
          box-shadow: 0 0 0 3px rgba(0, 128, 128, 0.1);
        }

        .password-input-group {
          position: relative;
          display: flex;
          align-items: center;
        }

        .password-input-group .form-input {
          width: 100%;
          padding-right: 45px;
        }

        .password-toggle {
          position: absolute;
          right: 12px;
          background: none;
          border: none;
          cursor: pointer;
          color: #666;
          font-size: 18px;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s;
        }

        .password-toggle:hover {
          color: #008080;
        }

        .roles-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 30px;
        }

        .role-card {
          padding: 20px;
          border: 2px solid #ddd;
          border-radius: 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .role-card:hover {
          border-color: #008080;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.1);
          transform: translateY(-2px);
        }

        .role-card.selected {
          background: linear-gradient(135deg, rgba(0, 128, 128, 0.05) 0%, rgba(0, 128, 128, 0.02) 100%);
          border-color: #008080;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.15);
        }

        .role-icon {
          font-size: 40px;
          margin-bottom: 10px;
        }

        .role-card h3 {
          font-size: 16px;
          font-weight: 700;
          color: #004d4d;
          margin-bottom: 8px;
        }

        .role-card p {
          font-size: 12px;
          color: #666;
          line-height: 1.4;
        }

        .role-check {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          background: #008080;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        .role-display {
          background: rgba(0, 128, 128, 0.05);
          border: 1px solid rgba(0, 128, 128, 0.2);
          padding: 15px;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: center;
        }

        .role-display p {
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        .role-display strong {
          color: #008080;
          font-weight: 700;
        }

        .pin-info {
          background: #f0fffe;
          border: 1px solid rgba(0, 128, 128, 0.2);
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 25px;
          font-size: 13px;
          color: #666;
        }

        .button-group {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .btn-continue,
        .btn-back,
        .btn-signup {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          font-family: inherit;
        }

        .btn-continue,
        .btn-signup {
          background: linear-gradient(135deg, #008080 0%, #006666 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.3);
        }

        .btn-continue:hover:not(:disabled),
        .btn-signup:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 25px rgba(0, 128, 128, 0.4);
        }

        .btn-back {
          background: transparent;
          color: #008080;
          border: 2px solid #008080;
        }

        .btn-back:hover:not(:disabled) {
          background: #f0fffe;
          box-shadow: 0 4px 15px rgba(0, 128, 128, 0.15);
        }

        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .form-footer {
          text-align: center;
          margin-top: 20px;
          font-size: 14px;
          color: #666;
        }

        .form-footer p {
          margin: 0;
        }

        .link-button {
          background: none;
          border: none;
          color: #008080;
          font-weight: 700;
          cursor: pointer;
          text-decoration: underline;
          transition: color 0.3s;
          font-size: 14px;
          font-family: inherit;
        }

        .link-button:hover {
          color: #006666;
        }

        @media (max-width: 600px) {
          .signup-form-container {
            padding: 25px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .roles-grid {
            grid-template-columns: 1fr;
          }

          .button-group {
            grid-template-columns: 1fr;
          }

          .form-header h1 {
            font-size: 24px;
          }

          .step-indicator {
            margin-bottom: 30px;
          }
        }
      `}</style>
    </div>
  );
}
