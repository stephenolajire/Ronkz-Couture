import React from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const Links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contact",
      href: "/contact",
    },
    {
      name: "Shop",
      href: "/shop",
    },
  ];
  return (
    <header className="h-auto background shadow-md flex justify-between items-center sm:px-10 md:px-30 md:py-4 lg:px-50 lg:py-4 p-4  sticky top-0 z-50">
      <div className="flex items-center space-x-4">
        <h3 className="text-3xl md:text-4xl font-bold text-yellow-500 h-auto items-center">
          Ronkz Couture
        </h3>
      </div>
      <div>
        {/* Desktop navigation  */}
        <nav className="space-x-4 flex items-center">
          <ul className="space-x-5 hidden md:flex">
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

          <div className="flex md:hidden">
            {isOpen ? (
              <X className="cursor-pointer" onClick={toggleMenu} />
            ) : (
              <Menu className="cursor-pointer" onClick={toggleMenu} />
            )}
          </div>
        </nav>
      </div>
      <div className="hidden md:flex items-center">
        <button>
          <NavLink
            to="/login"
            className="border-yellow-500 border-1 text-yellow-500 px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Login
          </NavLink>
        </button>
        <button>
          <NavLink
            to="/register"
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors ml-2"
          >
            Register
          </NavLink>
        </button>
      </div>

      {/* Mobile navigation */}
      <div
        className={`fixed top-16 right-0 w-full bg-white shadow-lg p-4 md:hidden h-[calc(100vh-4rem)] transition-all duration-1000 ease-in-out ${
          isOpen
            ? "opacity-100 translate-y-0 "
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
        </ul>
      </div>
    </header>
  );
};

export default Navigation;
