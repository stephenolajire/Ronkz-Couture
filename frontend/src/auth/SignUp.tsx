import React from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import signUpSchema from "./signUpSchema";
import { useMutation } from "@tanstack/react-query";
import api from "../hook/api";

interface SignUpValues {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  cpassword: string;
}

interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // Sign up mutation hook
  const signUpMutation = useMutation({
    mutationKey: ["signup"],
    mutationFn: async ({
      email,
      password,
      firstName,
      lastName,
    }: SignUpCredentials) => {
      const response = await api.post("register/", {
        email: email,
        password: password,
        first_name: firstName,
        last_name: lastName,
      });
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Handle successful registration
      console.log("Registration successful:", data);

      // Save user email to localStorage
      localStorage.setItem("userEmail", variables.email);

      // Reset the form
      formik.resetForm();

      // Navigate to verification page
      navigate("/verify-email");
    },
    onError: (error) => {
      // Handle registration error
      console.error("Registration failed:", error);
    },
  });

  const formik = useFormik<SignUpValues>({
    initialValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      cpassword: "",
    },
    validationSchema: signUpSchema,
    onSubmit: async (values, { setSubmitting}) => {
      try {
        await signUpMutation.mutateAsync({
          email: values.email,
          password: values.password,
          firstName: values.firstName,
          lastName: values.lastName,
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
    errors,
    handleBlur,
    touched,
    isSubmitting,
  } = formik;

  // Use mutation loading state for better UX
  const isLoading = signUpMutation.isPending || isSubmitting;

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
            <label className="text-gray-700 block" htmlFor="firstname">
              First Name
            </label>
            <div
              className={`flex rounded-md border ${
                errors.firstName && touched.firstName
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2 border-r border-gray-200 flex items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="firstname"
                name="firstName"
                type="text"
                value={values.firstName}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="Enter your first name"
                disabled={isLoading}
              />
            </div>
            {errors.firstName && touched.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="lastname">
              Last Name
            </label>
            <div
              className={`flex rounded-md border ${
                errors.lastName && touched.lastName
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2 border-r border-gray-200 flex items-center">
                <User size={20} className="text-gray-500" />
              </span>
              <input
                id="lastname"
                name="lastName"
                type="text"
                value={values.lastName}
                onBlur={handleBlur}
                onChange={handleChange}
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="Enter your last name"
                disabled={isLoading}
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
                onChange={handleChange}
                onBlur={handleBlur}
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

          <div className="space-y-2">
            <label className="text-gray-700 block" htmlFor="cpassword">
              Confirm Password
            </label>
            <div
              className={`flex rounded-md border ${
                errors.cpassword && touched.cpassword
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <span className="px-3 py-2 border-r border-gray-200 flex items-center">
                <Lock size={20} className="text-gray-500" />
              </span>
              <input
                id="cpassword"
                name="cpassword"
                type="password"
                value={values.cpassword}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full px-3 py-2 outline-none rounded-r-md"
                placeholder="Confirm your password"
                disabled={isLoading}
              />
            </div>
            {errors.cpassword && touched.cpassword && (
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
            {isLoading ? "Signing up..." : "Sign Up"}
          </button>

          <p className="text-center text-gray-700">
            Already have an account? Click{" "}
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
