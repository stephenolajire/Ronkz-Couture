// App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import UserLayout from "./layout/UserLayout";
import Home from "./pages/user/Home";
import Shop from "./pages/user/Shop";
import Login from "./auth/Login";
import SignUp from "./auth/SignUp";
import ProductDetails from "./pages/user/ProductDetails";
import CustomOrder from "./pages/user/CustomOrder";
import CartPage from "./pages/user/CartPage";
import CheckoutPage from "./pages/user/Checkout";
import ContactPage from "./pages/user/Contact";
import NotFound from "./pages/user/NotFound";
import { StoreProvider } from "./context/GlobalContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ScrollToTop from "./pages/user/ScrollToTop";
import VerifyEmail from "./auth/VerifyEmail";
import ForgotPassword from "./auth/ForgotPassword";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <StoreProvider>
        <Router>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<UserLayout />}>
              <Route index element={<Home />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/detail/:id" element={<ProductDetails />} />
              <Route path="custom-order" element={<CustomOrder />} />
              <Route path="cartpage" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<SignUp />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
          </Routes>
        </Router>
      </StoreProvider>
    </QueryClientProvider>
  );
};

export default App;
