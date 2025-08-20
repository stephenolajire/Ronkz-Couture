import React from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, ShoppingCart, X } from "lucide-react";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [cartOpen, setCartOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const toggleCart = () => {
    setCartOpen(!cartOpen);
  };


  const Links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Shop",
      href: "/shop",
    },
    {
      name: "Custom Order",
      href: "/custom-order",
    },
    {
      name: "Contact",
      href: "/contact",
    },
  ];

  return (
    <header className="h-auto bg-white shadow-md flex justify-between items-center py-2 px-4 sm:px-5 md:px-15 lg:px-25 lg:py-4 sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <img
          src="/logo.png"
          alt="logo"
          className="object-cover h-15 w-15 md:h-20 md:w-20 rounded-full"
        />
      </div>

      <div>
        {/* Desktop navigation */}
        <nav className="space-x-4 flex items-center justify-between">
          <ul className="space-x-8 hidden md:flex">
            {Links.map((link, index) => (
              <li
                key={index}
                className="hover:text-yellow-500 text-lg capitalize"
              >
                <NavLink
                  className={({ isActive }) =>
                    isActive ? "text-yellow-500" : "text-gray-900"
                  }
                  to={link.href}
                >
                  {link.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* Cart Dropdown */}
      <div
        className="relative"
        // onMouseEnter={toggleCart}
        // onMouseLeave={toggleCart}
        onClick={toggleCart}
      >
        {/* Cart Icon */}
        <div className="relative cursor-pointer p-2">
          <div className="bg-yellow-500 text-white absolute h-4 w-4 text-center rounded-full text-[10px] flex items-center justify-center font-bold right-1 top-1">
            3
          </div>
          <ShoppingCart className="text-base md:text-2xl text-gray-900 h-7" />
        </div>

        {/* Dropdown - positioned to connect with cart icon */}
        {cartOpen && (
          <div className="absolute right-0 top-full w-56 bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200 z-50">
            <div className="px-4 py-3 border-b">
              <p className="font-semibold text-gray-800">Your Cart</p>
            </div>

            {/* Cart Items */}
            <Link to="/cartpage">
              <div className="px-4 py-2 flex justify-between text-gray-700">
                <span>Cart Items</span>
                <span className="font-bold text-yellow-600">3</span>
              </div>
            </Link>

            {/* Cart Items */}
            <Link to="/cartpage">
              <div className="px-4 py-2 flex justify-between text-gray-700">
                <span>Custom Cart</span>
                <span className="font-bold text-yellow-600">8</span>
              </div>
            </Link>

            {/* Custom Orders */}
            <div className="px-4 py-2 flex justify-between text-gray-700">
              <span>Custom Orders</span>
              <span className="font-bold text-yellow-600">2</span>
            </div>

            {/* Orders */}
            <div className="px-4 py-2 flex justify-between text-gray-700 border-t">
              <span>Total Orders</span>
              <span className="font-bold text-yellow-600">5</span>
            </div>
          </div>
        )}
      </div>

      {/* Mobile menu toggle */}
      <div className="flex md:hidden">
        {isOpen ? (
          <X
            className="cursor-pointer text-base md:text-2xl h-10"
            onClick={toggleMenu}
          />
        ) : (
          <Menu
            className="cursor-pointer text-base md:text-2xl h-10"
            onClick={toggleMenu}
          />
        )}
      </div>

      {/* Desktop Login/Register buttons */}
      <div className="hidden md:flex items-center space-x-2">
        <NavLink
          to="/login"
          className="border border-yellow-500 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-500 hover:text-white transition-colors"
        >
          Login
        </NavLink>
        <NavLink
          to="/register"
          className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
        >
          Register
        </NavLink>
      </div>

      {/* Mobile navigation */}
      <div
        className={`fixed top-20 right-0 w-full bg-white shadow-lg p-4 md:hidden h-[calc(100vh-5rem)] transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-full pointer-events-none"
        }`}
      >
        <ul className="space-y-4 md:hidden h-full flex flex-col pt-8">
          {Links.map((link, index) => (
            <li
              key={index}
              className="hover:text-yellow-500 text-lg capitalize text-right pr-4"
            >
              <NavLink
                className={({ isActive }) =>
                  isActive ? "text-yellow-500" : "text-gray-900"
                }
                to={link.href}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </NavLink>
            </li>
          ))}
          <li className="hover:text-yellow-500 text-lg capitalize text-right pr-4">
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-gray-900"
              }
              to="/login"
              onClick={() => setIsOpen(false)}
            >
              Login
            </NavLink>
          </li>
          <li className="hover:text-yellow-500 text-lg capitalize text-right pr-4">
            <NavLink
              className={({ isActive }) =>
                isActive ? "text-yellow-500" : "text-gray-900"
              }
              to="/register"
              onClick={() => setIsOpen(false)}
            >
              Register
            </NavLink>
          </li>
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
