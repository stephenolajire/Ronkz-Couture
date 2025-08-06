import React, { useState, useMemo } from "react";
import type { Product } from "../../utils/productData";

interface FilterProps {
  products: Product[];
}

const Filter: React.FC<FilterProps> = ({ products }) => {
  const { minPrice, maxPrice } = useMemo(() => {
    const prices = products.map((product) => product.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  const categoryLists = [
    { id: 1, name: "Ankara" },
    { id: 2, name: "Bridal" },
    { id: 3, name: "Evening" },
    { id: 4, name: "Office Wear" },
    { id: 5, name: "Casual" },
  ];

  const [searchTerm, setSearchTerm] = React.useState("");
  // const [selectedCategory, setSelectedCategory] = React.useState("");
  const [priceRange, setPriceRange] = useState(1000);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPriceRange(Number(event.target.value));
  };

  return (
    <div className="pb-5 md:pb-10 lg:pb-15 grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-6">
      <div className="md:col-span-4">
        <label className="block text-gray-700">Search</label>
        <input
          type="search"
          value={searchTerm}
          onChange={handleSearchChange}
          placeholder="Search for products..."
          className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
        />
      </div>
      <div className="md:col-span-2">
        <label className="block text-gray-700">Category</label>
        <select className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500">
          <option value="">All Categories</option>
          {categoryLists.map((category) => (
            <option
              //   onClick={() => setSelectedCategory(category.name)}
              key={category.id}
              value={category.name}
            >
              {category.name}
            </option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <label className="block text-gray-700">Price Range</label>
        <div className="space-y-2">
          <input
            type="range"
            min={minPrice}
            max={maxPrice}
            value={priceRange}
            onChange={handlePriceChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-sm text-gray-500">
            <span>₦{minPrice.toLocaleString()}</span>
            <span>₦{priceRange.toLocaleString()}</span>
            <span>₦{maxPrice.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
