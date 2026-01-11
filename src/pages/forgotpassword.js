import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const BASE_URL = "https://medicurehospitaldatabase.onrender.com";

export default function AdminResetPassword() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (key, value) => {
    setForm({ ...form, [key]: value });
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password, confirmPassword } = form;

    if (!email || !password || !confirmPassword) {
      return setError("All fields are required");
    }
    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const res = await fetch(`${BASE_URL}/admin/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || "Password reset successfully");
        setForm({ email: "", password: "", confirmPassword: "" });
      } else {
        setError(data.error || "Failed to reset password");
      }
    } catch (err) {
      console.error(err);
      setError("Server error. Please try again.");
    }
  };

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Inter, sans-serif; background: #f9f8f3; }

        .forgot-wrapper {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 16px;
        }

        .forgot-card {
          width: 100%;
          max-width: 420px;
          background: #ffffff;
          padding: 32px;
          border-radius: 14px;
          box-shadow: 0 10px 25px rgba(0,0,0,0.08);
          text-align: center;
        }

        .forgot-card h2 {
          margin-bottom: 20px;
          font-size: 22px;
          font-weight: 700;
        }

        .forgot-form { display: flex; flex-direction: column; gap: 14px; }

        .forgot-input {
          padding: 12px;
          border-radius: 8px;
          border: 1px solid #ddd;
          font-size: 14px;
          width: 100%;
        }

        .forgot-btn {
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

        .forgot-btn:hover { opacity: 0.9; }

        .success-text {
          color: #16a34a;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .error-text {
          color: #dc2626;
          font-size: 14px;
          margin-bottom: 10px;
        }

        .back-login {
          margin-top: 14px;
          font-size: 13px;
          color: #4a5d23;
          cursor: pointer;
        }

        @media (max-width: 480px) {
          .forgot-card { padding: 22px; }
          .forgot-card h2 { font-size: 20px; }
        }

        @media (max-width: 768px) {
          .forgot-card { max-width: 380px; }
        }
      `}</style>

      <div className="forgot-wrapper">
        <div className="forgot-card">
          <h2>Reset Password</h2>

          {message && <div className="success-text">{message}</div>}
          {error && <div className="error-text">{error}</div>}

          <form onSubmit={handleSubmit} className="forgot-form">
            <input
              type="email"
              placeholder="Your Email"
              className="forgot-input"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="New Password"
              className="forgot-input"
              value={form.password}
              onChange={(e) => handleChange("password", e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Confirm Password"
              className="forgot-input"
              value={form.confirmPassword}
              onChange={(e) => handleChange("confirmPassword", e.target.value)}
              required
            />

            <button type="submit" className="forgot-btn">
              Reset Password
            </button>
          </form>

          <div
            className="back-login"
            onClick={() => navigate("/adminlogin")}
          >
            ⬅ Back to Login
          </div>
        </div>
      </div>
    </>
  );
}
