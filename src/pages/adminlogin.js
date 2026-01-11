import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiEye, FiEyeOff } from "react-icons/fi";

const BASE_URL = "https://medicurehospitaldatabase.onrender.com";

export default function AdminLogin() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${BASE_URL}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        setError("");
        alert("Login Successful");
        navigate("/admin/resources");
      } else {
        setError(data.error || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <>
      {/* ===== STYLES ===== */}
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, sans-serif; background: #f9f8f3; }

        .login-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .login-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          text-align: center;
        }

        .login-card h2 {
          margin-bottom: 20px;
          font-size: 22px;
          font-weight: 700;
        }

        .login-form { display: flex; flex-direction: column; gap: 14px; }

        .login-input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          width: 100%;
        }

        .password-wrapper { position: relative; }

        .password-wrapper .eye {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          font-size: 18px;
          color: #666;
        }

        .login-btn {
          padding: 12px;
          background: #4a5d23;
          border: none;
          border-radius: 8px;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          margin-top: 5px;
        }

        .login-btn:hover { opacity: 0.9; }

        .error-text {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .forgot-text {
          font-size: 13px;
          color: #4a5d23;
          text-align: right;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .login-card { padding: 22px; }
          .login-card h2 { font-size: 20px; }
        }

        @media (max-width: 768px) {
          .login-card { max-width: 380px; }
        }
      `}</style>

      {/* ===== UI ===== */}
      <div className="login-wrapper">
        <div className="login-card">
          <h2>Admin Login</h2>

          {error && <div className="error-text">{error}</div>}

          <form onSubmit={handleSubmit} className="login-form">
            <input
              type="email"
              placeholder="Email"
              className="login-input"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />

            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="login-input"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                required
              />
              <span
                className="eye"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>

            <div
              className="forgot-text"
              onClick={() => navigate("/forgotpassword")}
            >
              Forgot Password?
            </div>

            <button type="submit" className="login-btn">
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
