import { Star } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const Hero: React.FC = () => {
  return (
    <div
      className="relative h-screen"
      style={{
        backgroundImage: "url('/ronkz.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="absolute inset-0"></div>
      <div className="h-full md:w-[60%] w-full flex flex-col justify-center gap-4 sm:gap-5 md:gap-6 px-4 sm:px-10 md:px-30 lg:px-50">
        <div className="p-2 bg-red-200 border-1 border-red-500 rounded-full flex space-x-2 w-fit">
          <Star className="mr-2 text-yellow-500" />
          <p className="text-base md:text-lg">Premium Nigeria Fashion</p>
        </div>
        <div className="">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-white">
            Elegant <br />{" "}
            <span className="text-yellow-500">African Fashion</span>
          </h1>
        </div>
        <div className="">
          <p className="text-lg md:text-2xl text-white font-medium">
            Discover the latest trends in African fashion and elevate your style
            with our premium collections. Shop now and embrace the elegance of
            African couture.
          </p>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-5 space-y-5 flex-wrap md:space-y-0">
          <div className="flex items-center space-x-2">
            <Star className="mr-2 text-yellow-500" />
            <span className="text-yellow-500 font-bold md:text-xl">
              Custom Tailoring
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="mr-2 text-yellow-500" />
            <span className="text-yellow-500 font-bold md:text-xl">
              Bridal Couture
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Star className="mr-2 text-yellow-500" />
            <span className="text-yellow-500 font-bold md:text-xl">
              Premium Fabrics
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between space-x-4 mt-5">
          <Link to="/shop" className="w-[45%]">
            <button className="bg-yellow-500 md:text-2xl text-white py-3 md:py-4 px-4 rounded-lg w-full hover:bg-yellow-600 transition-colors">
              Start Shopping
            </button>
          </Link>

          <Link to="/contact" className="w-[45%]">
            <button className="bg-white border-1 border-yellow-500 md:text-2xl text-yellow-500 py-3 md:py-4 px-4 rounded-lg w-full hover:bg-yellow-600 transition-colors">
              Contact Us
            </button>
          </Link>
        </div>
        <hr className="border-t border-gray-200 my-5" />

        <div className="flex items-center space-x-10 sm:space-x-4 md:space-x-5 space-y-5 md:space-y-0 flex-wrap ">
          <div className="flex items-center flex-col">
            <h3 className="text-yellow-500 font-bold md:text-3xl text-2xl">
              500+
            </h3>
            <p className="text-white font-bold md:text-xl">Happy Clients</p>
          </div>
          <div className="flex items-center flex-col">
            <h3 className="text-yellow-500 font-bold md:text-3xl text-2xl">
              50+
            </h3>
            <p className="text-white font-bold md:text-xl">Bridal Designs</p>
          </div>
          <div className="flex items-center flex-col">
            <h3 className="text-yellow-500 font-bold md:text-3xl text-2xl">
              5+
            </h3>
            <p className="text-white font-bold md:text-xl">
              Years of Experience
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
