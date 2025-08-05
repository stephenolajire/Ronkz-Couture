import React, { useState, type FormEvent } from "react";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";


interface FormData {
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    remember: false,
  });
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // Add your API call here
      // const response = await loginUser(formData);
      console.log("Login attempted with:", formData);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // On successful login
      navigate("/dashboard");
    } catch (error) {
      setErrors({
        email: "Invalid credentials",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 w-full flex items-center justify-center py-10">
      <div className="flex flex-col space-y-5 w-[90%] md:w-[32%] bg-white border border-gray-100 shadow-2xl shadow-gray-100 rounded-xl p-4 md:p-8">
        <div className="space-y-3">
          <h3 className="text-yellow-500 text-3xl font-bold text-center">
            Ronks Couture
          </h3>
          <h5 className="text-gray-900 text-xl text-center font-bold">
            Welcome Back
          </h5>
          <p className="text-center text-gray-500">
            Sign in to your account to continue shopping
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              Email
            </label>
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Mail size={20} className="text-gray-500" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email address"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="password">
              Password
            </label>
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mr-2"
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
            Dont have an account yet? click <Link to="/signup" className="text-yellow-500">here</Link> to signup
          </p>
        </form>

        <hr className="pt-5 text-gray-200 w-full" />
        <div className="flex justify-between -mt-4">
          <button className="flex space-x-3 w-[45%] background border border-yellow-200 px-3 py-2 rounded-2xl text-yellow-500 items-center justify-center">
            <span>
              <FaGoogle />
            </span>
            <span>Google</span>
          </button>

          <button className="flex space-x-3 w-[45%] background border border-yellow-200 px-3 py-2 rounded-2xl text-yellow-500 items-center justify-center">
            <span>
              <FaFacebook />
            </span>
            <span>Facebook</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
