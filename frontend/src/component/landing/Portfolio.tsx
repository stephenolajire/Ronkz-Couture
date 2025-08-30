import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/GlobalContext";

const Portfolio: React.FC = () => {
  const [hoveredTitle, setHoveredTitle] = useState<string | null>(null);

  const { useCategory } = useStore();
  const { data: portfolioItems, error, isLoading } = useCategory();
  // console.log(portfolioItems)

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error loading portfolio items</div>;
  }

  // Handle empty data state
  if (!portfolioItems || portfolioItems.length === 0) {
    return (
      <div className="h-auto py-15 md:py-20 lg:py-25 bg-gray-100 px-4 sm:px-5 md:px-15 lg:px-25">
        <h1 className="text-2xl md:text-4xl lg:text-6xl text-gray-900 text-center">
          Our <span className="text-yellow-500">Portfolio</span>
        </h1>
        <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
          Discover our stunning collection of bespoke designs that blend
          traditional <br /> African elegance with contemporary fashion trends.
        </p>
        <div className="flex justify-center items-center min-h-[200px]">
          <div className="text-xl text-gray-600">
            No portfolio items available
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-auto py-15 md:py-20 lg:py-25 bg-gray-100 px-4 sm:px-5 md:px-15 lg:px-25">
      <h1 className="text-2xl md:text-4xl lg:text-6xl text-gray-900 text-center">
        Our <span className="text-yellow-500">Portfolio</span>
      </h1>
      <p className="mt-4 text-lg md:text-2xl text-gray-500 text-center">
        Discover our stunning collection of bespoke designs that blend
        traditional <br /> African elegance with contemporary fashion trends.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10">
        {portfolioItems.map((item: any) => (
          <div
            onMouseEnter={() => setHoveredTitle(item.name)}
            onMouseLeave={() => setHoveredTitle(null)}
            key={item.id}
            className="bg-white rounded-lg shadow-md overflow-hidden w-full transition-transform duration-300 ease-in-out hover:scale-105"
          >
            <div className="w-full h-[250px] relative">
              <img
                src={item.image_url}
                alt={item.name}
                className="w-full h-[250px] object-cover"
              />
              {hoveredTitle === item.name && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                  <Link
                    to="/shop"
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
                {item.name}
              </h2>
              <p className="mt-2 text-gray-600 md:text-base">
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
