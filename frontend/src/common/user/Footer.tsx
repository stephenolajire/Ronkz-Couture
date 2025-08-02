import React from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaWhatsapp,
} from "react-icons/fa6";

const Footer: React.FC = () => {
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
    <div className="bg-black/85 text-gray-100 py-15 md:py-20 lg:py-25 px-4 sm:px-10 md:px-30 lg:px-50">
      <div className="flex flex-col md:flex-row justify-between items-start space-y-8 md:space-y-0">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold text-yellow-500 ">
            RonkzCouture
          </h1>
          <p className="mt-4 text-gray-100 text-lg md:text-xl">
            Celebrating the modern African <br /> woman through exquisite
            fashion <br /> that blends traditional elegance with <br />{" "}
            contemporary style.
          </p>
          <div>
            <div className="flex items-center space-x-2 mt-4 text-lg md:text-xl">
              <span>
                <MapPin size={16} />
              </span>
              <span>Ikire Osun State</span>
            </div>
            <div className="flex items-center space-x-2 mt-4 text-lg md:text-xl">
              <span>
                <Phone size={16} />
              </span>
              <span>
                <a href="tel:+2348123456789">+234 812 345 6789</a>
              </span>
            </div>
            <div className="flex items-center space-x-2 mt-4 text-lg md:text-xl">
              <span>
                <Mail size={16} />
              </span>
              <span>
                <a href="mailto:info@ronkzcouture.com">info@ronkzcouture.com</a>
              </span>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            Quick Links
          </h1>
          <ul className="mt-4 space-y-2">
            {Links.map((link, index) => (
              <li
                key={index}
                className="text-gray-100 hover:text-yellow-500 text-lg md:text-xl"
              >
                <Link to={link.href}>{link.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-100">
            Social Media
          </h1>
          <div>
            <div className="flex flex-col  space-y-5 space-x-2 mt-4">
              <a
                href="https://www.facebook.com/ronkzcouture"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-2">
                  <span>
                    <FaFacebook size={16} />
                  </span>
                  <span className="text-lg md:text-xl">Facebook</span>
                </div>
              </a>
              <a
                href="https://www.instagram.com/ronkzcouture"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-2">
                  <span>
                    <FaInstagram size={16} />
                  </span>
                  <span className="text-lg md:text-xl">Instagram</span>
                </div>
              </a>
              <a
                href="https://www.twitter.com/ronkzcouture"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-2">
                  <span>
                    <FaTwitter size={16} />
                  </span>
                  <span className="text-lg md:text-xl">Twitter</span>
                </div>
              </a>
              <a
                href="https://www.twitter.com/ronkzcouture"
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="flex items-center space-x-2">
                  <span>
                    <FaWhatsapp size={16} />
                  </span>
                  <span className="text-lg md:text-xl">WhatsApp</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
      <hr className="border-gray-100 my-10" />
      <div className="text-center text-gray-400 text-lg md:text-xl">
        &copy; {new Date().getFullYear()} RonkzCouture. All rights reserved.
      </div>
    </div>
  );
};

export default Footer;
