import * as Yup from "yup";

const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{6,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .matches(emailRegex, "Invalid email format")
    .required("Email is required"),
  password: Yup.string()
    .matches(passwordRegex, "Password must contain at least 6 characters, including letters and numbers")
    .required("Password is required"),
});

export default loginSchema;
