import React, { useState, useMemo, useEffect, useCallback } from "react";
import type { Product } from "../../utils/productData";
import { useStore } from "../../context/storeContext";

interface FilterProps {
  products: Product[];
}

const Filter: React.FC<FilterProps> = ({ products }) => {
  const {
    categories,
    productFilters,
    updateProductFilter,
    clearProductFilters,
  } = useStore();

 const categoryLists = categories;

  // Local state for immediate UI updates
  const [searchTerm, setSearchTerm] = useState(productFilters.search || "");
  const [selectedCategory, setSelectedCategory] = useState(
    productFilters.category || ""
  );
  const [priceRange, setPriceRange] = useState(productFilters.maxPrice || 1000);
  const [isDragging, setIsDragging] = useState(false);

  const { minPrice, maxPrice } = useMemo(() => {
    if (!products || products.length === 0) {
      return { minPrice: 0, maxPrice: 100000 };
    }
    const prices = products.map((product) => product.price);
    return {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
    };
  }, [products]);

  // Initialize price range when products change
  useEffect(() => {
    if (!productFilters.maxPrice && maxPrice > 0) {
      setPriceRange(maxPrice);
      updateProductFilter("maxPrice", maxPrice);
    }
  }, [maxPrice, productFilters.maxPrice, updateProductFilter]);

  interface CategoryData {
    id: number;
    name: string;
    slug: string;
  }

  // Debounced search with longer delay and minimum character requirement
  useEffect(() => {
    // Only trigger search if there are at least 3 characters or if clearing search
    if (searchTerm.length >= 3 || searchTerm.length === 0) {
      const timeoutId = setTimeout(() => {
        updateProductFilter("search", searchTerm || undefined);
      }, 1000); // Increased delay to 1000ms

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, updateProductFilter]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setSelectedCategory(value);
    updateProductFilter("category", value || undefined);
  };

  // Handle price range dragging
  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setPriceRange(value);
    // Don't update store while dragging - only update local state
  };

  const handlePriceMouseDown = () => {
    setIsDragging(true);
  };

  const handlePriceMouseUp = useCallback(() => {
    if (isDragging) {
      setIsDragging(false);
      // Only update store when user finishes dragging
      updateProductFilter("maxPrice", priceRange);
      updateProductFilter("minPrice", minPrice);
    }
  }, [isDragging, priceRange, minPrice, updateProductFilter]);

  // Add event listener for mouse up on document to catch mouse up outside slider
  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mouseup", handlePriceMouseUp);
      document.addEventListener("touchend", handlePriceMouseUp);

      return () => {
        document.removeEventListener("mouseup", handlePriceMouseUp);
        document.removeEventListener("touchend", handlePriceMouseUp);
      };
    }
  }, [isDragging, handlePriceMouseUp]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("");
    setPriceRange(maxPrice);
    clearProductFilters();
  };

  return (
    <div className="pb-5 md:pb-10 lg:pb-15">
      <div className="grid grid-cols-1 md:grid-cols-8 gap-2 md:gap-6">
        <div className="md:col-span-4">
          <label className="block text-gray-700">Search</label>
          <input
            type="search"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="Search for products... (min 2 characters)"
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
          />
          {searchTerm.length > 0 && searchTerm.length < 2 && (
            <p className="text-xs text-gray-500 mt-1">
              Type at least 2 characters to search
            </p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="block text-gray-700">Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="p-3 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-yellow-500"
          >
            <option value="">All Categories</option>
            {categoryLists?.map((category: CategoryData) => (
              <option key={category.id} value={category.slug}>
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
              onMouseDown={handlePriceMouseDown}
              onTouchStart={handlePriceMouseDown}
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

      {/* Clear filters button */}
      <div className="mt-4">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
        >
          Clear Filters
        </button>
      </div>

      {/* Active filters display */}
      {(productFilters.search ||
        productFilters.category ||
        productFilters.maxPrice !== maxPrice) && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600">Active filters:</span>
          {productFilters.search && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              Search: {productFilters.search}
            </span>
          )}
          {productFilters.category && (
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              Category:{" "}
              {
                categoryLists?.find(
                  (cat: CategoryData) => cat.slug === productFilters.category
                )?.name
              }
            </span>
          )}
          {productFilters.maxPrice !== maxPrice && (
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-sm">
              Max Price: ₦{productFilters.maxPrice?.toLocaleString()}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default Filter;
