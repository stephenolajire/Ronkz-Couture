// App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider } from './context/StoreContext'; // Update path as needed
import UserLayout from './layout/UserLayout';
import Home from './pages/user/Home';
import Shop from './pages/user/Shop';
import Login from './auth/Login';
import SignUp from './auth/SignUp';
import ProductDetails from './pages/user/ProductDetails';
import CustomOrder from './pages/user/CustomOrder';
import CartPage from './pages/user/CartPage';
import CheckoutPage from './pages/user/Checkout';

const App: React.FC = () => {
  return (
    <StoreProvider>
      <Router>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="shop" element={<Shop />} />
            <Route path="product/detail" element={<ProductDetails />} />
            <Route path="custom-order" element={<CustomOrder />} />
            <Route path="cartpage" element={<CartPage />} />
            <Route path="checkout" element={<CheckoutPage />} />
          </Route>
          
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<SignUp />} />
        </Routes>
      </Router>
    </StoreProvider>
  );
};

export default App;