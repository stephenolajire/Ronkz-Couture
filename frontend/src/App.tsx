import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import UserLayout from './layout/UserLayout'
import Home from './pages/user/Home'
import Shop from './pages/user/Shop'

const App:React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<UserLayout />}>
          <Route index element={<Home />} />
          <Route path="shop" element={<Shop />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
