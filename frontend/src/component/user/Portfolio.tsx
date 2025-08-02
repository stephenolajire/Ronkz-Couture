import React, { useState } from "react";
import { Link } from "react-router-dom";

const Portfolio: React.FC = () => {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  const portfolioItems = [
    {
      id: 1,
      title: "Elegant Ankara Collection",
      image: "https://images.unsplash.com/photo-1589571894960-20bbe2828d0a",
      description:
        "A stunning collection of Ankara dresses that blend traditional patterns with modern styles.",
    },
    {
      id: 2,
      title: "Evening Glamour",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
      description: "Sophisticated evening wear that exudes elegance and charm.",
    },
    {
      id: 3,
      title: "Luxury Bridal Gowns",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8",
      description: "Exquisite bridal gowns designed for the modern bride.",
    },
    {
      id: 4,
      title: "Professional Office Wear",
      image: "https://images.unsplash.com/photo-1602810319428-019690571b5b",
      description: "Chic and stylish office wear for the professional woman.",
    },
    {
      id: 5,
      title: "Casual Chic Collection",
      image: "https://images.unsplash.com/photo-1619784299133-f691ffaea42f",
      description: "Effortlessly stylish casual wear for everyday elegance.",
    },
    {
      id: 6,
      title: "Skirt and Blouse",
      image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03",
      description: "A perfect blend of comfort and style for any occasion.",
    },
  ];

  return (
    <div className="h-auto py-15 md:py-20 lg:py-25 bg-gray-100 px-4 sm:px-10 md:px-30 lg:px-50">
      <h1 className="text-2xl md:text-4xl lg:text-6xl font-bold text-gray-900 text-center">
        Our <span className="text-yellow-500">Portfolio</span>
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
        Discover our stunning collection of bespoke designs that blend
        traditional <br /> African elegance with contemporary fashion trends.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
        {portfolioItems.map((item) => (
          <div
            onMouseEnter={() => setHoveredTitle(item.title)}
            onMouseLeave={() => setHoveredTitle(null)}
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-full transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="w-full h-[300px] relative">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-[300px] object-cover"
              />
              {hoveredTitle === item.title && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Link
                    to={`/categories/${item.title.toLowerCase().replace(/\s+/g, "-")}`}
                    className="bg-yellow-500 text-white text-lg md:text-xl px-4 py-2 rounded-2xl hover:bg-yellow-600 transition-colors"
                  >
                    <span className="text-white text-lg font-semibold">
                      View Details
                    </span>
                  </Link>
                </div>
              )}
            </div>
            <div className="p-4">
              <h2 className="text-xl font-semibold text-gray-800">
                {item.title}
              </h2>
              <p className="mt-2 text-gray-600 md:text-lg">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link to="/shop">
          <button className="bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition duration-300">
            View All Designs
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Portfolio;
