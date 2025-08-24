import React from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import LoginSchema from "./LoginSchema";
import { useMutation } from "@tanstack/react-query";
import api from "../hook/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  access: string;
  refresh: string;
  user?: {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  message?: string;
}

const Login: React.FC = () => {
  const navigate = useNavigate();

  // Move the mutation hook to the component level
  const loginMutation = useMutation({
    mutationKey: ["login"],
    mutationFn: async ({ email, password }: LoginCredentials) => {
      const response = await api.post("login/", {
        email: email,
        password: password,
      });
      return response.data;
    },
    onSuccess: (data: LoginResponse) => {
      // Handle successful login
      console.log("Login successful:", data);

      // Save tokens to localStorage
      if (data.access) {
        localStorage.setItem("accessToken", data.access);
      }

      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }

      // Optionally save user information
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      // Reset form after successful login
      formik.resetForm();

      // Navigate to dashboard or home page
      navigate("/dashboard");
    },
    onError: (error: any) => {
      // Handle login error
      console.error("Login failed:", error);

      // Set form error based on API response
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.response?.data?.detail ||
        "Login failed. Please try again.";

      formik.setStatus({ error: errorMessage });
    },
  });

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values, { setSubmitting, setStatus }) => {
      // Clear previous errors
      setStatus(null);

      try {
        await loginMutation.mutateAsync({
          email: values.email,
          password: values.password,
        });
      } catch (error) {
        console.error("Submission error:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    errors,
    isSubmitting,
    status,
  } = formik;

  // Use mutation loading state instead of formik's isSubmitting for better UX
  const isLoading = loginMutation.isPending || isSubmitting;

  return (
    <div className="min-h-screen w-full flex items-center justify-center py-10 bg-black">
      <div className="flex flex-col space-y-5 w-[85%] md:w-[32%] bg-white border border-white rounded-xl p-4 md:p-8">
        <div className="space-y-3 w-full flex justify-center items-center flex-col">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="logo"
              className="object-cover h-15 w-15 md:h-20 md:w-20 rounded-full"
            />
          </div>
          <h5 className="text-gray-900 text-xl text-center font-bold">
            Welcome Back
          </h5>
          <p className="text-center text-gray-500">
            Sign in to your account to continue shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Display API error message */}
          {status?.error && (
            <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
              {status.error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              Email
            </label>
            <div
              className={`flex rounded-md border ${
                errors.email && touched.email
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2 border-r border-gray-200 flex items-center">
                <Mail size={20} className="text-gray-500" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="Enter your email address"
                disabled={isLoading}
              />
            </div>
            {errors.email && touched.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="password">
              Password
            </label>
            <div
              className={`flex rounded-md border ${
                errors.password && touched.password
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2 border-r border-gray-200 flex items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={values.remember}
                onBlur={handleBlur}
                onChange={handleChange}
                className="mr-2"
                disabled={isLoading}
              />
              <label htmlFor="remember" className="text-sm text-gray-600">
                Remember me
              </label>
            </div>
            <Link
              to="/forgot-password"
              className="text-sm text-yellow-500 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-700">
            Don't have an account yet? Click{" "}
            <Link to="/register" className="text-yellow-500">
              here
            </Link>{" "}
            to sign up
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
