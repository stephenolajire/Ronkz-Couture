import * as Yup from "yup"

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const CustomValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(2, "Firstname must be at least 2 characters")
    .max(100, "Firstname must be at most 100 characters")
    .required("Firstname is required"),
  last_name: Yup.string()
    .min(2, "Lastname must be at least 2 characters")
    .max(100, "Lastname must be at most 100 characters")
    .required("Lastname is required"),
  email: Yup.string()
    .email("Invalid email format")
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  whatsapp: Yup.string()
    .min(10, "Whatsapp number must be at least 10 digits")
    .max(15, "Whatsapp number must be at most 15 digits")
    .required("Whatsapp number is required"),
  styleDescription: Yup.string().required("Style description is required"),
  occasion: Yup.string().required("Occasion is required"),
  budget: Yup.string().required("Budget is required"),
  timeline: Yup.string().required("Timeline is required"),
  neck: Yup.string().required("Neck measurement is required"),
  arms: Yup.string().required("Arms measurement is required"),
  shoulders: Yup.string().required("Shoulders measurement is required"),
  chest: Yup.string().required("Chest measurement is required"),
  waist: Yup.string().required("Waist measurement is required"),
  hips: Yup.string().required("Hips measurement is required"),
  inseam: Yup.string().required("Inseam measurement is required"),
  height: Yup.string().required("Height measurement is required"),
  image: Yup.mixed().required("Style image is required"),
  picture: Yup.mixed().required("Personal picture is required"),
});

export default CustomValidationSchema;