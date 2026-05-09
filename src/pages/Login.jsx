// pages/Login.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaSignInAlt,
  FaSpinner,
  FaEye,
  FaEyeSlash,
  FaChartLine,
  FaUniversity,
  FaArrowRight,
} from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import Logo from "../assets/hr.jpeg";
import { Image } from "react-bootstrap";

// #7e796c #845554

export default function Login() {
  const { login, loading: authLoading } = useAuth(); // Get loading from auth context
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [localLoading, setLocalLoading] = useState(false); // Local loading state
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalLoading(true);
    setError("");

    try {
      // ✅ Fix: Pass as an object with both email AND password
      const loginData = {
        email: form.email,
        password: form.password,
      };

      console.log("Sending login data:", loginData); // Should show {email: "admin@nmcn.com", password: "..."}

      const res = await login(loginData); // Pass the object

      console.log("Login response:", res);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="login-container vh-100 d-flex align-items-center justify-content-center">
      {/* Background Gradient */}
      <div className="login-bg"></div>

      {/* Animated Shapes */}
      <div className="shape shape-1"></div>
      <div className="shape shape-2"></div>
      <div className="shape shape-3"></div>

      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            {/* Login Card */}
            <div className="login-card animate-slide-up">
              <div className="card-body p-4 p-md-5">
                {/* Logo / Icon */}
                <div className="text-center mb-4">
                  <div className="logo-wrapper animate-bounce">
                    <div className="logo-icon">
                      <Image src={Logo} alt="NMCN Analytics" width="100px" height="100px" />
                    </div>
                  </div>
                  <h2
                    className="fw-bold mt-3 mb-1"
                    style={{
                      color: "#845554",
                      textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                    }}
                  >
                    HRORBN Analytics
                  </h2>
                  <p className="text-muted small">
                    Sign in to continue to  dashboard
                  </p>
                </div>

                {/* Error Alert */}
                {error && (
                  <div
                    className="alert alert-danger d-flex align-items-center animate-shake"
                    style={{ borderRadius: "0.75rem" }}
                  >
                    <FaSignInAlt className="me-2" size={14} />
                    <div className="flex-grow-1">{error}</div>
                  </div>
                )}

                {/* Login Form */}
                <form onSubmit={handleSubmit}>
                  {/* Email Field */}
                  <div className="mb-3">
                    <label className=" form-label fw-semibold ">
                       Email Address
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-light border-end-0"
                        style={{ borderRadius: "0.75rem 0 0 0.75rem" }}
                      >
                        <FaEnvelope className="text-muted" size={16} />
                      </span>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        className="form-control border-start-0 bg-light"
                        style={{
                          borderRadius: "0 0.75rem 0.75rem 0",
                          padding: "0.75rem",
                        }}
                        placeholder="admin@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                        autoFocus
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="mb-4">
                    <label className="form-label fw-semibold ">
                     Password
                    </label>
                    <div className="input-group">
                      <span
                        className="input-group-text bg-light border-end-0"
                        style={{ borderRadius: "0.75rem 0 0 0.75rem" }}
                      >
                        <FaLock className="text-muted" size={16} />
                      </span>
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        id="password"
                        className="form-control border-start-0 bg-light"
                        style={{
                          borderRadius: "0 0.75rem 0.75rem 0",
                          padding: "0.75rem",
                        }}
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                      />
                      <button
                        type="button"
                        className="btn btn-light border"
                        style={{ borderRadius: "0.75rem", marginLeft: "-1px" }}
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <FaEyeSlash size={16} />
                        ) : (
                          <FaEye size={16} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 mb-3"
                    disabled={localLoading || authLoading} // Disable if either is loading
                    style={{
                      borderRadius: "0.75rem",
                      background:
                        "linear-gradient(135deg, #845554  0%, #7e796c 100%)",
                      border: "none",
                      fontWeight: "bold",
                      transition: "transform 0.3s ease",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.transform = "translateY(-2px)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.transform = "translateY(0)")
                    }
                  >
                    {localLoading || authLoading ? (
                      <>
                        <FaSpinner className="fa-spin me-2" size={16} />
                        Signing in...
                      </>
                    ) : (
                      <>
                        Sign In
                        <FaArrowRight className="ms-2" size={14} />
                      </>
                    )}
                  </button>
                </form>

                {/* Footer */}
                <div className="text-center mt-4">
                  <small className="text-muted">
                    &copy; 2025 HRORBN Analytics Platform
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-10px);
          }
          75% {
            transform: translateX(10px);
          }
        }

        @keyframes float {
          0%,
          100% {
            transform: translateY(0) translateX(0);
          }
          25% {
            transform: translateY(-20px) translateX(10px);
          }
          50% {
            transform: translateY(-10px) translateX(20px);
          }
          75% {
            transform: translateY(-30px) translateX(-10px);
          }
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .login-container {
          position: relative;
          overflow: hidden;
        }

        .login-bg {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #7e796c 0%, #845554 100%);
          z-index: -2;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.1);
          z-index: -1;
        }

        .shape-1 {
          width: 300px;
          height: 300px;
          top: -100px;
          right: -100px;
          animation: float 20s ease-in-out infinite;
        }

        .shape-2 {
          width: 200px;
          height: 200px;
          bottom: 50px;
          left: -80px;
          animation: float 15s ease-in-out infinite reverse;
        }

        .shape-3 {
          width: 150px;
          height: 150px;
          bottom: 150px;
          right: 50px;
          animation: float 18s ease-in-out infinite;
        }

        .login-card {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-radius: 1.5rem;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          transition: transform 0.3s ease;
        }

        .login-card:hover {
          transform: translateY(-5px);
        }

        .logo-wrapper {
          display: inline-block;
        }

        .logo-icon {
          width: 70px;
          height: 70px;
          background: linear-gradient(135deg, #b3d8ad 0%, #845554 100%);
          border-radius: 1rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto;
          box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }

        .logo-icon svg {
          color: white;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-bounce {
          animation: bounce 2s ease-in-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        .form-control:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
          border-color: #b3d8ad;
        }

        .form-control:focus + .input-group-text,
        .input-group:focus-within .input-group-text {
          border-color: #b3d8ad;
        }

        .demo-credentials {
          transition: all 0.3s ease;
        }

        .demo-credentials:hover {
          background-color: #e9ecef !important;
        }

        code {
          background: white;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          color: #b3d8ad;
        }

        @media (max-width: 768px) {
          .login-card {
            margin: 1rem;
          }

          .shape-1 {
            width: 200px;
            height: 200px;
          }

          .shape-2 {
            width: 150px;
            height: 150px;
          }

          .shape-3 {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>
    </div>
  );
}
