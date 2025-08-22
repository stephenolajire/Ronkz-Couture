import React, { useState } from "react";
import { BsExclamation } from "react-icons/bs";
import BuyCustomConfirmation from "../../component/shop/BuyCustomConfirmation";
import { useParams } from "react-router-dom";
import { useStore } from "../../context/StoreContext";
import Rating from "../../component/shop/Rating";

const ProductDetails: React.FC = () => {
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const { useProductDetail } = useStore();

  // Early return if no id
  if (!id) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Invalid Product ID
          </h2>
          <p className="text-gray-600 mb-4">
            No product ID provided in the URL.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const { data: product, isLoading, error } = useProductDetail(id);

  const toggleConfirmation = () => {
    setOpenConfirmation(!openConfirmation);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Product Not Found
          </h2>
          <p className="text-gray-600 mb-4">
            Sorry, we couldn't find the product you're looking for.
          </p>
          <button
            onClick={() => window.history.back()}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-5 md:px-15 lg:px-25">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6 lg:gap-10 mt-5 h-auto mb-10 md:items-stretch">
        <div className="w-full min-h-[400px] md:min-h-[600px]">
          <img
            src={product.image_url || "/ronkz.jpg"}
            alt={`${product.name || "Product"} image`}
            className="h-auto w-full object-cover rounded-2xl"
          />
        </div>

        <div className="flex flex-col space-y-3 min-h-[400px] md:min-h-[600px]">
          <div className="background w-fit rounded-full border border-gray-200 shadow shadow-gray-200">
            <p className="text-gray-700 py-1 px-2 text-center">
              {product.category?.name || "Gown"}
            </p>
          </div>

          <div>
            <h1 className="text-gray-900 capitalize text-2xl md:text-4xl">
              {product.name || "Latest Ankara Fashion Gown"}
            </h1>
          </div>

          <div>
            <h2 className="text-2xl md:text-4xl font-medium">
              ₦ {product.price?.toLocaleString()}
            </h2>
          </div>

          <div className="flex flex-row md:space-x-4 sm:space-x-3 space-x-2 items-center w-full background shadow shadow-gray-200 p-2 rounded-full">
            <span>
              <BsExclamation size={20} className="text-gray-500" />
            </span>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg">
              {product.deliveryInfo ||
                "Order this and get it delivered the next day"}
            </p>
          </div>

          <div>
            <h3 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
              Description
            </h3>
            <p className="text-base md:text-lg text-gray-500">
              {product.description}
            </p>
          </div>

          {product.measurements && (
            <div>
              <h3 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
                Measurements
              </h3>
              <ul className="flex flex-wrap space-x-3 space-y-3 text-gray-500 font-bold md:text-lg capitalize">
                {product.measurements
                  .split(/[;,]/) // Split by semicolon or comma
                  .map((measurement: string, index: number) => {
                    const trimmed = measurement.trim();
                    if (!trimmed) return null;

                    // Clean formatting - add space before units if missing
                    const formatted = trimmed.replace(
                      /(\d)([a-zA-Z])/g,
                      "$1 $2"
                    );

                    return <li key={index}>{formatted}</li>;
                  })}
              </ul>
            </div>
          )}

          <div>
            <h3 className="text-gray-900 font-semibold text-2xl md:text-3xl mb-2">
              Shipping Fee
            </h3>
            <p className="text-base md:text-lg text-gray-500">
              {product.shippingInfo || "Payment on delivery to the bus driver"}
            </p>
          </div>

          <div className="flex justify-between items-center w-full gap-4">
            <button
              className="bg-yellow-500 hover:bg-yellow-600 p-3 flex-1 text-center text-gray-50 rounded-xl transition-colors duration-200"
              aria-label="Add product to cart"
            >
              Add to Cart
            </button>

            <button
              onClick={toggleConfirmation}
              className="bg-gray-500 hover:bg-gray-600 p-3 flex-1 text-center text-gray-50 rounded-xl transition-colors duration-200"
              aria-label="Create custom order"
            >
              Custom Order
            </button>
          </div>
        </div>
      </div>

      {openConfirmation && <BuyCustomConfirmation close={toggleConfirmation} />}

      <div>
        <Rating />
      </div>
    </div>
  );
};

export default ProductDetails;
