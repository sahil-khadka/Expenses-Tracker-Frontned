import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
const OtpVerification = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "your email";
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [focused, setFocused] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [shake, setShake] = useState(false);
  const inputs = useRef([]);

  // Countdown timer for resend
  useEffect(() => {
    if (resendTimer === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setResendTimer((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setError("");
    if (value && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) inputs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputs.current[index + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (text.length === 6) {
      setOtp(text.split(""));
      inputs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      triggerShake();
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await axios.post(
        "https://expenses-tracker-backend-86b9.onrender.com/api/verify-otp",
        {
          email: email,
          otp: code,
        },
      );

      console.log("OTP verification success:", data);
      setSuccess(true);
    } catch (error) {
      setError("Network error. Please try again.");
      triggerShake();
    } finally {
      setLoading(false);
    }
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleResend = () => {
    if (!canResend) return;
    setCanResend(false);
    setResendTimer(30);
    setOtp(Array(6).fill(""));
    setError("");
    inputs.current[0]?.focus();
    // TODO: call resend API
  };

  const allFilled = otp.every((d) => d !== "");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@400;500;600&display=swap');

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(18px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shake {
          0%,100% { transform: translateX(0); }
          20%      { transform: translateX(-8px); }
          40%      { transform: translateX(8px); }
          60%      { transform: translateX(-5px); }
          80%      { transform: translateX(5px); }
        }
        @keyframes pulse-ring {
          0%   { box-shadow: 0 0 0 0 rgba(45,106,63,0.25); }
          70%  { box-shadow: 0 0 0 8px rgba(45,106,63,0); }
          100% { box-shadow: 0 0 0 0 rgba(45,106,63,0); }
        }
        @keyframes checkmark {
          from { stroke-dashoffset: 50; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes successFade {
          from { opacity:0; transform: scale(0.85); }
          to   { opacity:1; transform: scale(1); }
        }

        .otp-card {
          animation: fadeUp 0.45s ease both;
        }
        .otp-row {
          animation: ${shake ? "shake 0.45s ease" : "none"};
        }
        .otp-input {
          width: 52px;
          height: 62px;
          border-radius: 12px;
          border: 2px solid transparent;
          background: #f2f2f2;
          font-family: 'DM Sans', sans-serif;
          font-size: 24px;
          font-weight: 600;
          color: #1a1a1a;
          text-align: center;
          outline: none;
          transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
          caret-color: #2d6a3f;
          -moz-appearance: textfield;
        }
        .otp-input::-webkit-outer-spin-button,
        .otp-input::-webkit-inner-spin-button { -webkit-appearance: none; }
        .otp-input.focused {
          border-color: #2d6a3f;
          background: #fff;
          animation: pulse-ring 1.4s ease infinite;
        }
        .otp-input.filled {
          border-color: #2d6a3f;
          background: #edf5ef;
        }
        .otp-input.error-state {
          border-color: #e53e3e;
          background: #fff5f5;
        }
        .submit-btn {
          width: 100%;
          padding: 14px;
          border-radius: 12px;
          border: none;
          font-family: 'DM Sans', sans-serif;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: 0.3px;
          cursor: pointer;
          transition: background 0.2s, transform 0.1s, opacity 0.2s;
        }
        .submit-btn:active { transform: scale(0.985); }
        .success-overlay {
          animation: successFade 0.4s ease both;
        }
      `}</style>

      <div
        style={{
          width: "100vw",
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background:
            "linear-gradient(135deg, #f0f7f1 0%, #ffffff 60%, #e8f4ea 100%)",
          fontFamily: "'DM Sans', sans-serif",
          padding: 20,
          boxSizing: "border-box",
        }}
      >
        {/* Decorative blobs */}
        <div
          style={{
            position: "fixed",
            top: -80,
            left: -80,
            width: 320,
            height: 320,
            borderRadius: "50%",
            background: "rgba(45,106,63,0.07)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "fixed",
            bottom: -60,
            right: -60,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "rgba(45,106,63,0.06)",
            pointerEvents: "none",
          }}
        />

        <div
          className="otp-card"
          style={{
            width: "100%",
            maxWidth: 440,
            background: "#fff",
            borderRadius: 24,
            padding: "44px 48px",
            boxShadow: "0 4px 40px rgba(0,0,0,0.09)",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* Top accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 4,
              background: "linear-gradient(90deg, #2d6a3f, #52a067)",
              borderRadius: "24px 24px 0 0",
            }}
          />

          {success ? (
            <div
              className="success-overlay"
              style={{ textAlign: "center", padding: "20px 0" }}
            >
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: "50%",
                  background: "#edf5ef",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 20px",
                }}
              >
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
                  <circle cx="18" cy="18" r="18" fill="#2d6a3f" />
                  <polyline
                    points="10,18 15,24 26,12"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="2.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray="50"
                    style={{
                      animation: "checkmark 0.4s 0.1s ease both",
                      strokeDashoffset: 0,
                    }}
                  />
                </svg>
              </div>
              <h2
                style={{
                  margin: "0 0 8px",
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#1a1a1a",
                  fontFamily: "'DM Serif Display', serif",
                }}
              >
                Verified!
              </h2>
              <p style={{ margin: 0, color: "#888", fontSize: 14 }}>
                Redirecting you to your dashboard…
              </p>
            </div>
          ) : (
            <>
              <div style={{ textAlign: "center", marginBottom: 32 }}>
                <div
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    background: "#edf5ef",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px",
                  }}
                >
                  <svg
                    width="26"
                    height="26"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2d6a3f"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="4" width="20" height="16" rx="3" />
                    <polyline points="2,4 12,13 22,4" />
                  </svg>
                </div>
                <h1
                  style={{
                    margin: "0 0 8px",
                    fontSize: 26,
                    fontWeight: 400,
                    fontFamily: "'DM Serif Display', serif",
                    fontStyle: "italic",
                    color: "#2d6a3f",
                    letterSpacing: "-0.3px",
                  }}
                >
                  Check your inbox
                </h1>
                <p
                  style={{
                    margin: 0,
                    fontSize: 13.5,
                    color: "#888",
                    lineHeight: 1.6,
                  }}
                >
                  We sent a 6-digit code to
                  <br />
                  <strong style={{ color: "#444" }}>{email}</strong>
                </p>
              </div>

              {/* OTP inputs */}
              <form onSubmit={handleSubmit}>
                <div
                  className="otp-row"
                  style={{
                    display: "flex",
                    gap: 10,
                    justifyContent: "center",
                    marginBottom: 24,
                  }}
                  onPaste={handlePaste}
                >
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => (inputs.current[i] = el)}
                      className={[
                        "otp-input",
                        focused === i ? "focused" : "",
                        digit && focused !== i ? "filled" : "",
                        error && !digit ? "error-state" : "",
                      ].join(" ")}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleChange(i, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(i, e)}
                      onFocus={() => {
                        setFocused(i);
                        setError("");
                      }}
                      onBlur={() => setFocused(null)}
                      autoFocus={i === 0}
                    />
                  ))}
                </div>

                {/* Error */}
                {error && (
                  <p
                    style={{
                      margin: "0 0 16px",
                      textAlign: "center",
                      fontSize: 13,
                      color: "#e53e3e",
                      fontWeight: 500,
                      animation: "fadeUp 0.2s ease",
                    }}
                  >
                    {error}
                  </p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                  style={{
                    background: allFilled && !loading ? "#2d6a3f" : "#a8c5af",
                    color: "#fff",
                    marginBottom: 20,
                    cursor: allFilled && !loading ? "pointer" : "not-allowed",
                  }}
                  onMouseEnter={(e) => {
                    if (allFilled && !loading)
                      e.currentTarget.style.background = "#245534";
                  }}
                  onMouseLeave={(e) => {
                    if (allFilled && !loading)
                      e.currentTarget.style.background = "#2d6a3f";
                  }}
                >
                  {loading ? "Verifying…" : "Verify Code"}
                </button>
              </form>

              {/* Resend */}
              <p
                style={{
                  textAlign: "center",
                  fontSize: 13,
                  color: "#999",
                  margin: 0,
                }}
              >
                Didn't receive it?{" "}
                {canResend ? (
                  <span
                    onClick={handleResend}
                    style={{
                      color: "#2d6a3f",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    Resend code
                  </span>
                ) : (
                  <span style={{ color: "#bbb" }}>
                    Resend in{" "}
                    <strong style={{ color: "#666" }}>{resendTimer}s</strong>
                  </span>
                )}
              </p>

              {/* Back */}
              <p
                style={{
                  textAlign: "center",
                  marginTop: 16,
                  fontSize: 13,
                  color: "#999",
                  marginBottom: 0,
                }}
              >
                <span
                  onClick={() => navigate("/login")}
                  style={{
                    color: "#2d6a3f",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ← Back to Login
                </span>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default OtpVerification;
