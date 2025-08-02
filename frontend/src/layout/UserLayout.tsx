import React from 'react'
import { Outlet } from 'react-router-dom'
import Navigation from '../common/user/Navigation'
import Footer from '../common/user/Footer'

const UserLayout:React.FC = () => {
  return (
    <div>
      <Navigation />
      <Outlet />
      <Footer />
    </div>
  )
}

export default UserLayout

