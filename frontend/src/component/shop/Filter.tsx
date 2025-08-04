import React from "react";

const Filter: React.FC = () => {

    const categoryLists = [
        { id: 1, name: "Ankara" },
        { id: 2, name: "Bridal" },
        { id: 3, name: "Evening" },
        { id: 4, name: "Office Wear" },
        { id: 5, name: "Casual" },
    ];

    const [searchTerm, setSearchTerm] = React.useState("");
    // const [selectedCategory, setSelectedCategory] = React.useState("");

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
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
        <input type="range" min="0" max="1000" className="mt-2 w-full " />
      </div>
    </div>
  );
};

export default Filter;
