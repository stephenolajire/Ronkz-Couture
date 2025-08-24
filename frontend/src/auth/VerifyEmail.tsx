import { useState, useRef, useEffect } from "react";
import { Mail, Shield, CheckCircle, ArrowLeft} from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../hook/api";

interface VerifyEmailRequest {
  email: string;
  otp: string;
}

interface ResendOTPRequest {
  email: string;
}

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [userEmail, setUserEmail] = useState<string>("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();

  // Get user email from localStorage on component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setUserEmail(savedEmail);
    } else {
      // If no email found, redirect back to signup
      navigate("/register");
    }

    // Focus first input on mount
    inputRefs.current[0]?.focus();
  }, [navigate]);

  // Countdown timer effect
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  // Format time display (MM:SS)
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationKey: ["verifyEmail"],
    mutationFn: async ({ email, otp }: VerifyEmailRequest) => {
      const response = await api.post("verify-email/", {
        email,
        otp,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Email verified successfully:", data);
      setIsVerified(true);
      setError("");
      // Clear the email from localStorage after successful verification
      localStorage.removeItem("userEmail");
    },
    onError: (error: any) => {
      console.error("Email verification failed:", error);
      setError(
        error.response?.data?.message || "Invalid OTP. Please try again."
      );
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
  });

  // Resend OTP mutation
  const resendOTPMutation = useMutation({
    mutationKey: ["resendOTP"],
    mutationFn: async ({ email }: ResendOTPRequest) => {
      const response = await api.post("resend-otp/", {
        email,
      });
      return response.data;
    },
    onSuccess: (data) => {
      console.log("OTP resent successfully:", data);
      setTimeLeft(600); // Reset timer to 10 minutes
      setError("");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    },
    onError: (error: any) => {
      console.error("Resend OTP failed:", error);
      setError(
        error.response?.data?.message ||
          "Failed to resend OTP. Please try again."
      );
    },
  });

  const handleInputChange = (index: number, value: string) => {
    // Handle paste operation
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      const newOtp = [...otp];

      pastedCode.forEach((digit, i) => {
        if (i < 6 && /^\d$/.test(digit)) {
          newOtp[i] = digit;
        }
      });

      setOtp(newOtp);
      setError("");

      // Focus the next empty input or the last one
      const nextIndex = Math.min(pastedCode.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    // Handle single digit input
    if (/^\d$/.test(value) || value === "") {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);
      setError("");

      // Move to next input if digit entered
      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }

    if (e.key === "ArrowRight" && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    if (timeLeft === 0) {
      setError("OTP has expired. Please request a new code.");
      return;
    }

    await verifyEmailMutation.mutateAsync({
      email: userEmail,
      otp: otpString,
    });
  };

  const handleResend = async () => {
    if (timeLeft > 0) {
      return; // Don't resend if time hasn't elapsed
    }

    await resendOTPMutation.mutateAsync({
      email: userEmail,
    });
  };

  const handleGoBack = () => {
    navigate("/register");
  };

  const isLoading = verifyEmailMutation.isPending;
  const isResending = resendOTPMutation.isPending;

  if (isVerified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20 text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-white" />
          </div>

          <h2 className="text-2xl font-bold text-black mb-4">
            Email Verified Successfully!
          </h2>

          <p className="text-gray-500 mb-8">
            Your email has been verified. You can now access your account.
          </p>

          <button
            onClick={() => navigate("/login")}
            className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold text-lg px-8 sm:py-4 py-2  rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
             Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-20">
        {/* Header */}
        <div className="text-center mb-4">
          <button
            onClick={handleGoBack}
            className="absolute top-6 left-6 text-gray-300 hover:text-white transition-colors duration-200"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-black" />
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-black mb-2">
            Verify Your Email
          </h1>

          <p className="text-gray-500 mb-2">We've sent a 6-digit code to</p>

          <div className="flex items-center justify-center gap-2 text-yellow-400 mb-4">
            <Mail className="w-4 h-4" />
            <span className="font-medium">{userEmail || "your email"}</span>
          </div>

          {/* Timer Display */}
          {/* <div className="flex items-center justify-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-gray-400" />
            <span
              className={`font-mono text-lg font-bold ${
                timeLeft <= 60 ? "text-red-400" : "text-gray-300"
              }`}
            >
              {formatTime(timeLeft)}
            </span>
          </div> */}

          {/* {timeLeft === 0 && (
            <p className="text-red-400 text-sm mb-4">
              Code expired. Please request a new one.
            </p>
          )} */}
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <label className="block text-white font-medium mb-4 text-center">
            Enter verification code
          </label>

          <div className="flex gap-3 justify-center mb-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={6}
                value={digit}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={(e) => {
                  e.preventDefault();
                  const pastedData = e.clipboardData.getData("text");
                  handleInputChange(index, pastedData);
                }}
                disabled={timeLeft === 0}
                className={`sm:w-12 sm:h-12 w-7 h-7 text-center text-xl font-bold bg-white bg-opacity-20 border-2 border-gray-300 border-opacity-30 rounded-lg text-gray-500 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 focus:outline-none transition-all duration-200 ${
                  timeLeft === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            You can paste the entire code into any field
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 border-opacity-50 rounded-lg text-red-300 text-sm text-center">
            {error}
          </div>
        )}

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.join("").length !== 6 || timeLeft === 0}
          className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-semibold text-lg px-8 sm:py-4 py-2 rounded-lg hover:from-yellow-500 hover:to-yellow-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:hover:from-yellow-400 disabled:hover:to-yellow-600 mb-4"
        >
          {isLoading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              Verifying...
            </div>
          ) : (
            "Verify Email"
          )}
        </button>

        {/* Resend Code */}
        <div className="text-center">
          <p className="text-gray-500 text-sm mb-2">Didn't receive the code?</p>

          <button
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending}
            className={`font-medium transition-colors duration-200 ${
              timeLeft > 0
                ? "text-gray-500 cursor-not-allowed"
                : "text-yellow-400 hover:text-yellow-300"
            } disabled:opacity-50`}
          >
            {isResending ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </div>
            ) : (
              `Resend Code ${timeLeft > 0 ? `(${formatTime(timeLeft)})` : ""}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
