import React from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useFormik } from "formik";
import signUpSchema from "./signUpSchema";

interface SignUpValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cpassword: string;
}

const onSubmit = async (values: SignUpValues) => {
  try {
    // Simulate an API call for sign-up
    console.log("Signing up with values:", values);
    // Here you would typically handle the sign-up logic, e.g., API call
    // await api.signUp(values);
    alert("Sign-up successful!");
  } catch (error) {
    console.error("Signup failed:", error);
  }
};

const SignUp: React.FC = () => {
  const {
    values,
    handleChange,
    handleSubmit,
    errors,
    handleBlur,
    // resetForm,
    touched,
    isSubmitting,
  } = useFormik({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      cpassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit,
  });

  return (
    <div className="min-h-screen bg-black w-full flex items-center justify-center py-10">
      <div className="flex flex-col space-y-5 w-[85%] md:w-[32%] bg-white rounded-2xl p-4 md:p-8">
        <div className="space-y-3 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-4">
            <img
              src="/logo.png"
              alt="logo"
              className="object-cover h-15 w-15 md:h-20 md:w-20 rounded-full"
            />
          </div>
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
            <div className={`flex rounded-md border border-gray-200 ${
                  errors.firstName && touched.firstName ? "border border-red-500" : ""
                }`}>
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="firstname"
                name="firstName"
                type="text"
                value={values.firstName}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter your your name"
              />
            </div>
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              Last Name
            </label>
            <div className={`flex rounded-md border border-gray-200 ${
                  errors.lastName && touched.lastName ? "border-red-500" : ""
                }`}>
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="lastname"
                name="lastName"
                type="text"
                value={values.lastName}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter your surname"
              />
            </div>
            {errors.lastName && touched.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="email">
              Email
            </label>
            <div className={`flex rounded-md border border-gray-200 ${
                  errors.email && touched.email ? "border-red-500" : ""
                }`}>
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Mail size={20} className="text-gray-500" />
              </span>
              <input
                id="email"
                name="email"
                type="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 outline-none"
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
            <div className={`flex rounded-md border border-gray-200 ${
                  errors.password && touched.password ? "border-red-500" : ""
                }`}>
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
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter your password"
              />
            </div>
            {errors.password && touched.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="password">
              Confirm Password
            </label>
            <div className={`flex rounded-md border border-gray-200 ${
                  errors.cpassword && touched.cpassword ? "border-red-500" : ""
                }`}>
              <span className="px-3 py-2 border-r border-gray-200 items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                value={values.cpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 outline-none"
                placeholder="Enter your password"
              />
            </div>
            {errors.cpassword && touched.cpassword && (
              <p className="text-red-500 text-sm mt-1">{errors.cpassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-yellow-500 text-white py-2 rounded-md hover:bg-yellow-600 transition-colors ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-700">
            Already have an account? click{" "}
            <Link to="/login" className="text-yellow-500">
              here
            </Link>{" "}
            to login
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
