import React, { useState, type FormEvent } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { FaFacebook, FaGoogle } from "react-icons/fa";


interface FormData {
  email: string;
  password: string;
  remember: boolean;
  firstName: string;
  lastName: string;
  cpassword: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    remember: false,
    cpassword: ""
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

    if (!formData.firstName || !formData.lastName) {
        newErrors.firstName = "First name cannot be empty"
        newErrors.lastName = "Last name cannot be empty"
    } else if (formData.firstName.length < 2 || formData.lastName.length < 2) {
        newErrors.firstName = "First name must contain atlease 3 letters"
        newErrors.lastName = "Last name must contain atlease 3 letters";
    }

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

    if (formData.password !== formData.cpassword) {
        newErrors.cpassword = "Password do not match"
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
            Create Account
          </h5>
          <p className="text-center text-gray-500">
            Join us and start your fashion journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              First Name
            </label>
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="firstname"
                name="firstName"
                type="text"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.firstName ? "border-red-500" : ""
                }`}
                placeholder="Enter your your name"
              />
            </div>
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              Last Name
            </label>
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="lastname"
                name="lastName"
                type="text"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.lastName ? "border-red-500" : ""
                }`}
                placeholder="Enter your surname"
              />
            </div>
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
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

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="password">
              Confirm Password
            </label>
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                value={formData.cpassword}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.cpassword ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
              />
            </div>
            {errors.cpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>
            )}
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
            Dont have an account yet? click{" "}
            <Link to="/signup" className="text-yellow-500">
              here
            </Link>{" "}
            to signup
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

export default SignUp;
