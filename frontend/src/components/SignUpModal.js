import React, { useState, useEffect } from "react";
import axios from "axios";
import { Eye, EyeOff } from 'lucide-react';
import { motion } from "framer-motion";
import {
  auth,
  createUserWithEmailAndPassword,
  updateProfile,
} from "../firebase";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

const API = process.env.REACT_APP_API_URL;

function SignUpModal({ onClose = () => {}, onSuccess = () => {} }) {
  const [step, setStep] = useState("form");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    profilePic: "",
    profileFile: null,
  });

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    let timer;
    if (resendCooldown > 0) {
      timer = setInterval(() => {
        setResendCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const checkRes = await axios.post(`${API}/api/auth/check-email`, { email: formData.email });
      if (checkRes.data.exists) {
        if (checkRes.data.provider === "google") {
          setError("Email is linked to Google. Please sign in using Google.");
          setLoading(false);
          return;
        } else {
          setError("Email already registered. Please sign in.");
          setLoading(false);
          return;
        }
      }

      const user = auth.currentUser;
      const token = user ? await user.getIdToken() : null;

      await axios.post(
        `${API}/api/auth/send-otp`,
        { email: formData.email },
        {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        }
      );

      setStep("otp");
      setShowOtpInput(true);
      setResendCooldown(30);
    } catch (err) {
      setError("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setResendCooldown(30);
      const res = await fetch(`${API}/api/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("OTP resent successfully.");
      } else {
        alert(data.message || "Failed to resend OTP.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const handleVerifyOtp = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/api/auth/verify-otp`, {
        email: formData.email,
        otp,
      });

      if (res.status === 200) {
        let photoURL = "";

        if (formData.profileFile) {
          const storageRef = ref(
            storage,
            `profile_pictures/${Date.now()}_${formData.profileFile.name}`
          );
          const uploadResult = await uploadBytes(storageRef, formData.profileFile);
          photoURL = await getDownloadURL(uploadResult.ref);
        } else if (formData.profilePic) {
          photoURL = formData.profilePic;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        await updateProfile(userCredential.user, {
          displayName: formData.name,
          photoURL,
        });

        const token = await userCredential.user.getIdToken();
        const userData = {
          uid: userCredential.user.uid,
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          photoURL: userCredential.user.photoURL,
          token,
        };

        localStorage.setItem("user", JSON.stringify(userData));
        setStep("done");
        onSuccess(userData);
        onClose();
      } else {
        setError("Invalid OTP");
      }
    } catch (err) {
      setError("OTP verification or account creation failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="backdrop-blur-md bg-white/60 border border-white/30 rounded-2xl p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">Sign Up</h2>

        {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

        {step === "form" && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-70 text-gray-800 placeholder-gray-600 focus:outline-none"
            />
            <input
              type="email"
              name="email"
              placeholder="your@gmail.com"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-70 text-gray-800 placeholder-gray-600 focus:outline-none"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setFormData((prev) => ({ ...prev, password: e.target.value }));
                }}
                placeholder="Your Password"
                required
                className="w-full px-4 py-3 mb-3 rounded-lg bg-white bg-opacity-70 text-gray-800 placeholder-gray-600 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <div className="mb-6">
              <label className="block mb-2 font-semibold">Upload Photos (optional)</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setFormData({ ...formData, profileFile: e.target.files[0] })
                }
                className="w-full px-4 py-2 mb-4 bg-white bg-opacity-70 text-gray-800 rounded-lg"
              />
            </div>

            <button
              onClick={handleSendOtp}
              disabled={loading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-full"
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </>
        )}

        {step === "otp" && (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full px-4 py-3 mb-4 rounded-lg bg-white bg-opacity-70 text-gray-800 placeholder-gray-600 focus:outline-none"
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-full"
            >
              {loading ? "Verifying..." : "Verify & Create Account"}
            </button>

            {showOtpInput && (
              <div className="mt-2 text-center">
                <button
                  className="text-blue-600 font-medium disabled:text-gray-400"
                  disabled={resendCooldown > 0}
                  onClick={handleResendOtp}
                >
                  {resendCooldown > 0
                    ? `Resend OTP in ${resendCooldown}s`
                    : "Resend OTP"}
                </button>
              </div>
            )}
          </>
        )}

        {step === "done" && (
          <p className="text-green-500 text-center">
            ✅ Account created successfully!
          </p>
        )}

        <button
          onClick={onClose}
          className="mt-6 w-full text-gray-700 text-sm hover:underline"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  );
}

export default SignUpModal;
