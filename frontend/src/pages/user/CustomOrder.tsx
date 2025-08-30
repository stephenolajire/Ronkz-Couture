import React from "react";
import { useFormik } from "formik";
import CustomValidationSchema from "./CustomValidationSchema";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import api from "../../hook/api";

const CustomOrder: React.FC = () => {

  const queryClient = useQueryClient();

  const identity_code = localStorage.getItem("custom_identity") || "";

  const generateIdentityCode = () => {
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 10000);
    return `custom_${timestamp}_${randomNum}`;
  };

  var customIdentity = localStorage.getItem("custom_identity");
  if (!customIdentity) {
    const newIdentity = generateIdentityCode();
    localStorage.setItem("custom_identity", newIdentity);
    customIdentity = newIdentity;
  }

  interface FormValues {
    first_name: string;
    last_name: string;
    email: string;
    whatsapp: string;
    styleDescription: string;
    occasion: string;
    budget: string; // Changed from number to string to match select options
    timeline: string;
    neck: string;
    arms: string;
    shoulders: string;
    chest: string;
    waist: string;
    hips: string;
    inseam: string;
    height: string;
    image: File | null;
    picture: File | null;
    custom_identity?: string;
  }

  const submitCustomOrder = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await api.post("custom-orders/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["custom_order", identity_code] });
    }
  });

  const formik = useFormik<FormValues>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      whatsapp: "",
      styleDescription: "",
      occasion: "",
      budget: "",
      timeline: "",
      neck: "",
      arms: "",
      shoulders: "",
      chest: "",
      waist: "",
      hips: "",
      inseam: "",
      height: "",
      image: null,
      picture: null,
    },
    validationSchema: CustomValidationSchema,
    onSubmit: (values) => {
      const formData = new FormData();

      // Add non-file fields
      Object.entries(values).forEach(([key, value]) => {
        if (
          key !== "image" &&
          key !== "picture" &&
          value !== null &&
          value !== ""
        ) {
          formData.append(key, String(value));
        }
      });

      if (customIdentity) {
        formData.append("custom_identity", customIdentity);
      }

      // Add file fields with proper handling
      if (values.image && values.image instanceof File) {
        formData.append("image", values.image, values.image.name);
      }

      if (values.picture && values.picture instanceof File) {
        formData.append("picture", values.picture, values.picture.name);
      }

      submitCustomOrder.mutate(formData);
    },
  });

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    fieldName: string
  ) => {
    const file = event.currentTarget.files?.[0] || null;
    formik.setFieldValue(fieldName, file);
  };

  const {
    isPending,
    isError,
    isSuccess,
    data: CustomData,
    error,
  } = submitCustomOrder;

  {
    isSuccess && localStorage.setItem("custom_identity", CustomData?.identity_code)
  }

  if (isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Submitting your custom order...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-500 text-center">
          <h2 className="text-xl mb-2">
            Error occurred while submitting your order
          </h2>
          <p className="text-sm">
            {error?.message || "Please try again later"}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl text-green-600 mb-2">
            Order Submitted Successfully!
          </h2>
          <p>
            Your custom order has been created with ID:{" "}
            <strong>{CustomData?.identity_code}</strong>
          </p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-500 hover:bg-yellow-600 px-4 py-2 rounded text-white"
          >
            Create Another Order
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-8 md:px-16 lg:px-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        </div>

        <div className="relative z-10 py-16 md:py-24 lg:py-32 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center leading-tight mb-8">
            <span className="text-white drop-shadow-2xl">Custom</span>
            <span className="text-yellow-500 ml-4 drop-shadow-2xl relative">
              Design
              <div className="absolute -inset-1 bg-yellow-500/20 blur-xl rounded-lg -z-10"></div>
            </span>
          </h1>

          <div className="max-w-4xl">
            <p className="text-lg md:text-xl lg:text-2xl text-gray-300 text-center leading-relaxed font-light">
              Create a{" "}
              <span className="text-yellow-400 font-medium relative">
                one-of-a-kind piece
                {/* <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div> */}
              </span>{" "}
              tailored perfectly to your measurements, style, and{" "}
              <br className="hidden sm:block" />
              vision. Let's bring your{" "}
              <span className="text-yellow-400 font-medium relative">
                dream garment
                {/* <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div> */}
              </span>{" "}
              to life.
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={formik.handleSubmit} encType="multipart/form-data">
        <div className="w-full flex items-center justify-center my-8 md:my-10 lg:my-15 px-4 md:px-0">
          <div className="w-full md:w-[50%]">
            <div className="w-full h-auto">
              {/* Contact Information */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                  Contact Information
                </h3>
                <div className="flex flex-col space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="firstname" className="text-gray-500">
                        Firstname
                      </label>
                      <input
                        id="first_name"
                        name="first_name"
                        type="text"
                        placeholder="Please enter your firstname"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.first_name}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.first_name && formik.touched.first_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.first_name}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="last_name" className="text-gray-500">
                        Lastname
                      </label>
                      <input
                        id="last_name"
                        name="last_name"
                        type="text"
                        placeholder="Please enter your lastname"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.last_name}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.last_name && formik.touched.last_name && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.last_name}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="email" className="text-gray-500">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Please enter your email address"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.email}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.email && formik.touched.email && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.email}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="whatsapp" className="text-gray-500">
                        Whatsapp Number
                      </label>
                      <input
                        id="whatsapp"
                        name="whatsapp"
                        type="tel"
                        placeholder="Please enter your whatsapp number"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.whatsapp}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.whatsapp && formik.touched.whatsapp && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.whatsapp}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Design Information */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                  Design Information
                </h3>
                <div className="flex flex-col space-y-5">
                  <div className="grid grid-cols-1 gap-5">
                    <div>
                      <label
                        htmlFor="styleDescription"
                        className="text-gray-500"
                      >
                        Style Description
                      </label>
                      <textarea
                        id="styleDescription"
                        name="styleDescription"
                        cols={4}
                        rows={3}
                        placeholder="Please write short description for the style"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.styleDescription}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.styleDescription &&
                        formik.touched.styleDescription && (
                          <p className="text-red-500 text-sm mt-1">
                            {formik.errors.styleDescription}
                          </p>
                        )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="occasion" className="text-gray-500">
                        Occasion
                      </label>
                      <select
                        id="occasion"
                        name="occasion"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.occasion}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Occasion</option>
                        <option value="Birthday">Birthday</option>
                        <option value="Funeral">Funeral</option>
                        <option value="Graduation">Graduation</option>
                        <option value="Office">Office</option>
                        <option value="Wedding">Wedding</option>
                        <option value="Other">Other</option>
                      </select>
                      {formik.errors.occasion && formik.touched.occasion && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.occasion}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="budget" className="text-gray-500">
                        Budget
                      </label>
                      <select
                        id="budget"
                        name="budget"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.budget}
                        onBlur={formik.handleBlur}
                      >
                        <option value="">Select Budget</option>
                        <option value="15000-25000">₦15,000 - ₦25,000</option>
                        <option value="25000-30000">₦25,000 - ₦30,000</option>
                        <option value="30000-40000">₦30,000 - ₦40,000</option>
                        <option value="40000-50000">₦40,000 - ₦50,000</option>
                        <option value="50000+">₦50,000 +</option>
                      </select>
                      {formik.errors.budget && formik.touched.budget && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.budget}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="timeline" className="text-gray-500">
                        Timeline
                      </label>
                      <input
                        id="timeline"
                        name="timeline"
                        type="date"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.timeline}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.timeline && formik.touched.timeline && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.timeline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Measurements */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                  Measurements
                </h3>
                <p className="text-gray-500 my-3">
                  Please provide your measurements in inches. If you're unsure,
                  we can schedule a fitting consultation.
                </p>
                <div className="flex flex-col space-y-5">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label htmlFor="chest" className="text-gray-500">
                        Bust/Chest
                      </label>
                      <input
                        id="chest"
                        name="chest"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.chest}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.chest && formik.touched.chest && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.chest}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="waist" className="text-gray-500">
                        Waist
                      </label>
                      <input
                        id="waist"
                        name="waist"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.waist}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.waist && formik.touched.waist && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.waist}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="hips" className="text-gray-500">
                        Hips
                      </label>
                      <input
                        id="hips"
                        name="hips"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.hips}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.hips && formik.touched.hips && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.hips}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="height" className="text-gray-500">
                        Height
                      </label>
                      <input
                        id="height"
                        name="height"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.height}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.height && formik.touched.height && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.height}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    <div>
                      <label htmlFor="inseam" className="text-gray-500">
                        Inseam
                      </label>
                      <input
                        id="inseam"
                        name="inseam"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.inseam}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.inseam && formik.touched.inseam && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.inseam}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="neck" className="text-gray-500">
                        Neck
                      </label>
                      <input
                        id="neck"
                        name="neck"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.neck}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.neck && formik.touched.neck && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.neck}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="arms" className="text-gray-500">
                        Arms
                      </label>
                      <input
                        id="arms"
                        name="arms"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.arms}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.arms && formik.touched.arms && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.arms}
                        </p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="shoulders" className="text-gray-500">
                        Shoulders
                      </label>
                      <input
                        id="shoulders"
                        name="shoulders"
                        type="text"
                        placeholder="inches"
                        className="w-full border border-gray-200 p-2 outline-yellow-500 rounded-lg mt-1"
                        onChange={formik.handleChange}
                        value={formik.values.shoulders}
                        onBlur={formik.handleBlur}
                      />
                      {formik.errors.shoulders && formik.touched.shoulders && (
                        <p className="text-red-500 text-sm mt-1">
                          {formik.errors.shoulders}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Style Image */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                  Style Image
                </h3>
                <p className="text-gray-500 my-3">
                  Please provide the image of the style you want to sew
                </p>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label htmlFor="image" className="text-gray-500">
                      Image
                    </label>
                    <input
                      id="image"
                      name="image"
                      type="file"
                      accept="image/*"
                      className="w-full border border-gray-300 border-dashed flex items-center justify-center px-2 py-10 outline-yellow-500 rounded-lg mt-1"
                      onChange={(event) => handleFileChange(event, "image")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.values.image && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {formik.values.image.name}
                      </p>
                    )}
                    {formik.errors.image && formik.touched.image && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.image}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Personal Image */}
              <div className="border border-gray-200 rounded-xl p-5 mb-5">
                <h3 className="text-gray-900 text-2xl md:text-3xl md:my-5 mt-0 my-3">
                  Personal Image
                </h3>
                <p className="text-gray-500 my-3">
                  Please provide your full picture for reference
                </p>
                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label htmlFor="picture" className="text-gray-500">
                      Picture
                    </label>
                    <input
                      id="picture"
                      name="picture"
                      type="file"
                      accept="image/*"
                      className="w-full border border-gray-300 border-dashed flex items-center justify-center px-2 py-10 outline-yellow-500 rounded-lg mt-1"
                      onChange={(event) => handleFileChange(event, "picture")}
                      onBlur={formik.handleBlur}
                    />
                    {formik.values.picture && (
                      <p className="text-sm text-gray-600 mt-1">
                        Selected: {formik.values.picture.name}
                      </p>
                    )}
                    {formik.errors.picture && formik.touched.picture && (
                      <p className="text-red-500 text-sm mt-1">
                        {formik.errors.picture}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200 p-3 text-center w-full rounded-xl text-lg md:text-xl text-white font-medium"
              >
                {isPending ? "Submitting..." : "Submit Order"}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomOrder;
