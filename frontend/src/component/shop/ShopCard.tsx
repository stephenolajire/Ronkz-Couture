import React from "react";
import type { Product } from "../../utils/productData";
import { Link } from "react-router-dom";

interface ShopCardProps {
  product: Product;
}

const ShopCard: React.FC<ShopCardProps> = ({ product }) => {
  return (
    <Link to={`/product/detail/${product.id}`}>
      <div className="bg-gray-50 shadow-md rounded-lg sm:p-4 hover:shadow-lg transition-shadow duration-300">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-40 md:h-48 object-cover rounded-md mb-2 sm:mb-2.5 md:mb-4"
        />
        <div className="px-2 sm:p-0">
          <h3 className="text-lg font-semibold hidden md:flex">
            {product.name}
          </h3>
          {product.name.length > 15 ? (
            <h3 className="text-lg font-semibold flex md:hidden">
              {product.name.slice(0, 13)} ...
            </h3>
          ) : (
            <h3 className="text-lg font-semibold flex md:hidden">
              {product.name}
            </h3>
          )}
          {product.description.length > 30 ? (
            <p className="text-gray-600">
              {product.description.slice(0, 28)} ...
            </p>
          ) : (
            <p className="text-gray-600">{product.description}</p>
          )}
          <div className="mt-2 sm:mt-2.5 md:mt-4 mb-2 md:mb-0">
            <span className="text-lg font-bold">
              ₦{product.price.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ShopCard;
