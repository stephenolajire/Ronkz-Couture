import { ArrowBigLeft } from "lucide-react";
import React from "react";

interface HeaderProp {
  header: string;
  headerTwo: string;
  text: string;
  textTwo: string;
}

const Header: React.FC <HeaderProp> = ({header, headerTwo, text, textTwo}) => {
  return (
    <div className="py-5 md:py-10 lg:py-15 flex flex-col md:flex-row justify-between md:items-center md:justify-center">
      <div className="mb-3 md:mt-3 md:mb-0 hidden">
        <button
          onClick={() => window.history.back()}
          className="bg-yellow-500 text-white px-5 py-2 rounded-md flex items-center space-x-3 hover:bg-yellow-600 transition duration-300"
        >
          <span>
            <ArrowBigLeft />
          </span>
          <span className="text-lg md:text-xl">Back</span>
        </button>
      </div>
      <div>
        <h1 className="text-2xl md:text-4xl lg:text-6xl text-gray-900 text-center">
          {header} <span className="text-yellow-500">{headerTwo}</span>
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
          {text} <br /> {textTwo}
        </p>
      </div>
      <div></div>
    </div>
  );
};

export default Header;
