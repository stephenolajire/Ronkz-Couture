import React from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import LoginSchema from "./LoginSchema";

// interface FormData {
//   email: string;
//   password: string;
//   remember: boolean;
// }

const Login: React.FC = () => {
  const {
    values,
    handleChange,
    handleSubmit,
    handleBlur,
    touched,
    errors,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      remember: false,
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        // Simulate an API call for login
        console.log("Logging in with values:", values);
        // Here you would typically handle the login logic, e.g., API call
        // await api.login(values);
        alert("Login successful!");
      } catch (error) {
        console.error("Login failed:", error);
      }
    },
  });

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
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}
                placeholder="Enter your email address"
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
            <div className="flex rounded-md border border-gray-200">
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="password"
                name="password"
                type="password"
                value={values.password}
                onBlur={handleBlur}
                onChange={handleChange}
                className={`w-full px-3 py-2 outline-none ${
                  errors.password && touched.password ? "border-red-500" : ""
                }`}
                placeholder="Enter your password"
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
            disabled={isSubmitting}
            className={`w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-center text-gray-700">
            Dont have an account yet? click{" "}
            <Link to="/register" className="text-yellow-500">
              here
            </Link>{" "}
            to signup
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
