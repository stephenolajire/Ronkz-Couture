import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserLayout from './layout/UserLayout'
import Home from './pages/user/Home'
import Shop from './pages/user/Shop'
import Login from './auth/Login'
import SignUp from './auth/SignUp'
import ProductDetails from './pages/user/ProductDetails'

const App:React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/detail" element={<ProductDetails />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Routes>
    </Router>
  );
}

export default App
