import React, { useState, useRef, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";
import api from "../hook/api";

interface ForgotPasswordProps {
  onBackToLogin?: () => void;
  onPasswordChangeSuccess?: () => void;
  className?: string;
}

interface SendOtpResponse {
  message: string;
  success: boolean;
}

interface VerifyOtpResponse {
  message: string;
  success: boolean;
  token?: string;
}

interface ChangePasswordResponse {
  message: string;
  success: boolean;
}

type Step = "email" | "otp" | "password" | "success";

// API functions
const sendOtp = async (email: string): Promise<SendOtpResponse> => {
  const response = await api.post("/send-otp/", { email });
  return response.data;
};

const verifyOtp = async (
  email: string,
  otp: string
): Promise<VerifyOtpResponse> => {
  const response = await api.post("/verify-otp/", { email, otp });
  return response.data;
};

const changePassword = async (
  email: string,
  password: string
): Promise<ChangePasswordResponse> => {
  // Set authorization header for this request
  const response = await api.post("/reset-password/", { email, password });
  return response.data;
};

// Validation schemas
const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address")
    .required("Email address is required"),
});

const otpSchema = Yup.object().shape({
  otp: Yup.string()
    .matches(/^\d{6}$/, "Please enter a valid 6-digit code")
    .required("Verification code is required"),
});

const passwordSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
});

const ForgotPassword: React.FC<ForgotPasswordProps> = ({
  onBackToLogin,
  onPasswordChangeSuccess,
  className = "",
}) => {
  const [currentStep, setCurrentStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);

  const otpRefs = useRef<HTMLInputElement[]>([]);
  const navigate = useNavigate();

  // Timer for resend OTP - Fixed NodeJS namespace error
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  // Email form
  const emailFormik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: emailSchema,
    onSubmit: (values) => {
      setEmail(values.email);
      sendOtpMutation.mutate(values.email);
    },
  });

  // OTP form
  const otpFormik = useFormik({
    initialValues: {
      otp: "",
    },
    validationSchema: otpSchema,
    onSubmit: (values) => {
      verifyOtpMutation.mutate({ email, otp: values.otp });
    },
  });

  // Password form
  const passwordFormik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: passwordSchema,
    onSubmit: (values) => {
      changePasswordMutation.mutate({
        email,
        password: values.password,
      });
    },
  });

  // TanStack Query mutations
  const sendOtpMutation = useMutation({
    mutationFn: sendOtp,
    onSuccess: () => {
      setCurrentStep("otp");
      setResendTimer(60); // 60 seconds cooldown
      otpFormik.resetForm();
    },
    onError: (error: Error) => {
      console.error("Send OTP error:", error);
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: ({ email, otp }: { email: string; otp: string }) =>
      verifyOtp(email, otp),
    onSuccess: (data) => {
      if (data.token) {
        setCurrentStep("password");
        passwordFormik.resetForm();
      }
    },
    onError: (error: Error) => {
      console.error("Verify OTP error:", error.message);
      // Clear OTP inputs on error
      otpFormik.setFieldValue("otp", "");
      if (otpRefs.current[0]) {
        otpRefs.current[0].focus();
      }
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      changePassword(email, password),
    onSuccess: () => {
      setCurrentStep("success");
      onPasswordChangeSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Change password error:", error.message);
    },
  });

  // OTP handling functions
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const currentOtp = otpFormik.values.otp.split("");
    while (currentOtp.length < 6) currentOtp.push("");

    currentOtp[index] = value;
    const newOtp = currentOtp.join("");
    otpFormik.setFieldValue("otp", newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      if (otpRefs.current[index + 1]) {
        otpRefs.current[index + 1].focus();
      }
    }
  };


  const backToLogin = () => {
    navigate("/login");
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const currentOtp = otpFormik.values.otp.split("");
      while (currentOtp.length < 6) currentOtp.push("");

      if (!currentOtp[index] && index > 0) {
        if (otpRefs.current[index - 1]) {
          otpRefs.current[index - 1].focus();
        }
      }
    }
  };

  const handleOtpPaste = ( e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text");
    if (pastedData.length === 6) {
      otpFormik.setFieldValue("otp", pastedData);
    } else {
      // Handle invalid paste
      console.error("Invalid OTP pasted");
    }
  };

  const handleResendOtp = () => {
    if (resendTimer === 0) {
      sendOtpMutation.mutate(email);
    }
  };

  // Email Step
  if (currentStep === "email") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className={`max-w-md mx-auto bg-white rounded-lg shadow-md p-6 ${className}`}
        >
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Forgot your password?
            </h1>
            <p className="text-gray-600">
              Enter your email address and we'll send you a 6-digit verification
              code.
            </p>
          </div>

          <form onSubmit={emailFormik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  {...emailFormik.getFieldProps("email")}
                  placeholder="Enter your email address"
                  className={`w-full pl-10 pr-3 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    (emailFormik.touched.email && emailFormik.errors.email) ||
                    sendOtpMutation.isError
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={sendOtpMutation.isPending}
                />
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
              </div>
              {emailFormik.touched.email && emailFormik.errors.email && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {emailFormik.errors.email}
                </div>
              )}
              {sendOtpMutation.isError && (
                <div className="mt-1 flex items-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {sendOtpMutation.error
                    ? "User with that email does not exist"
                    : "Failed to send OTP"}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={sendOtpMutation.isPending || !emailFormik.isValid}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {sendOtpMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Sending...
                </>
              ) : (
                "Send verification code"
              )}
            </button>
          </form>

          {onBackToLogin && (
            <div className="mt-6 text-center">
              <button
                onClick={onBackToLogin}
                className="text-amber-600 hover:text-amber-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // OTP Step
  if (currentStep === "otp") {
    const otpDigits = otpFormik.values.otp.split("");
    while (otpDigits.length < 6) otpDigits.push("");

    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className={`max-w-md mx-auto bg-white rounded-lg shadow-md p-6 ${className}`}
        >
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Mail className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Enter verification code
            </h1>
            <p className="text-gray-600 mb-2">
              We've sent a 6-digit code to{" "}
              <span className="font-medium text-gray-900">{email}</span>
            </p>
          </div>

          <form onSubmit={otpFormik.handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3 text-center">
                Verification Code
              </label>
              <div className="flex gap-2 justify-center">
                {otpDigits.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => {
                      if (el) otpRefs.current[index] = el;
                    }}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    onPaste={(e) => handleOtpPaste(e)}
                    className={`w-12 h-12 text-center text-lg font-semibold border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                      (otpFormik.touched.otp && otpFormik.errors.otp) ||
                      verifyOtpMutation.isError
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                    disabled={verifyOtpMutation.isPending}
                  />
                ))}
              </div>
              {otpFormik.touched.otp && otpFormik.errors.otp && (
                <div className="mt-2 flex items-center justify-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {otpFormik.errors.otp}
                </div>
              )}
              {verifyOtpMutation.isError && (
                <div className="mt-2 flex items-center justify-center gap-1 text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  {verifyOtpMutation.error?.message ||
                    "Invalid verification code"}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={verifyOtpMutation.isPending || !otpFormik.isValid}
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {verifyOtpMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Verifying...
                </>
              ) : (
                "Verify code"
              )}
            </button>
          </form>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600 mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendOtp}
              disabled={resendTimer > 0 || sendOtpMutation.isPending}
              className="text-amber-600 hover:text-amber-800 font-medium text-sm disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {resendTimer > 0 ? `Resend in ${resendTimer}s` : "Resend code"}
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={() => setCurrentStep("email")}
              className="text-gray-600 hover:text-gray-800 font-medium text-sm flex items-center justify-center gap-1 mx-auto transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Change email address
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Password Step
  if (currentStep === "password") {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <div
          className={`max-w-md mx-auto bg-white rounded-lg shadow-md p-6 ${className}`}
        >
          <div className="text-center mb-6">
            <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
              <Lock className="w-8 h-8 text-amber-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Create new password
            </h1>
            <p className="text-gray-600">
              Choose a strong password for your account.
            </p>
          </div>

          <form onSubmit={passwordFormik.handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...passwordFormik.getFieldProps("password")}
                  placeholder="Enter new password"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    passwordFormik.touched.password &&
                    passwordFormik.errors.password
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={changePasswordMutation.isPending}
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordFormik.touched.password &&
                passwordFormik.errors.password && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordFormik.errors.password}
                  </p>
                )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  {...passwordFormik.getFieldProps("confirmPassword")}
                  placeholder="Confirm new password"
                  className={`w-full pl-10 pr-10 py-2 border rounded-md focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors ${
                    passwordFormik.touched.confirmPassword &&
                    passwordFormik.errors.confirmPassword
                      ? "border-red-500"
                      : "border-gray-300"
                  }`}
                  disabled={changePasswordMutation.isPending}
                />
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {passwordFormik.touched.confirmPassword &&
                passwordFormik.errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">
                    {passwordFormik.errors.confirmPassword}
                  </p>
                )}
            </div>

            {changePasswordMutation.isError && (
              <div className="flex items-center gap-1 text-red-600 text-sm">
                <AlertCircle className="w-4 h-4" />
                {changePasswordMutation.error?.message ||
                  "Failed to change password"}
              </div>
            )}

            <button
              type="submit"
              disabled={
                changePasswordMutation.isPending || !passwordFormik.isValid
              }
              className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md font-medium transition-colors flex items-center justify-center gap-2"
            >
              {changePasswordMutation.isPending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  Changing password...
                </>
              ) : (
                "Change password"
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Success Step
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div
        className={`max-w-md mx-auto bg-white rounded-lg shadow-md p-6 ${className}`}
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center w-16 h-16 bg-amber-100 rounded-full mb-4">
            <CheckCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Password changed successfully!
          </h1>
          <p className="text-gray-600 mb-6">
            Your password has been updated. You can now sign in with your new
            password.
          </p>

          <button
            onClick={backToLogin}
            className="w-full bg-amber-600 hover:bg-amber-700 text-white py-2 px-4 rounded-md font-medium transition-colors"
          >
            Back to login
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
