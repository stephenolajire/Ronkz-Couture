import React, { useMemo} from "react";
import Filter from "../../component/shop/Filter";
import ShopCard from "../../component/shop/ShopCard";
import type { Product } from "../../utils/productData";
import { useStore } from "../../context/storeContext";

const Shop: React.FC = () => {
  const { useProduct } = useStore();
  const { data, isLoading, error } = useProduct();

  // Memoize products to prevent unnecessary re-renders
  const products = useMemo(() => {
    return data?.results || data || [];
  }, [data]);


  // Handle loading state
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-500 text-lg">
          Error loading products: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="">
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black px-4 sm:px-8 md:px-16 lg:px-32 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-yellow-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-48 h-48 bg-yellow-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-px bg-gradient-to-r from-transparent via-yellow-500/30 to-transparent"></div>
        </div>

        <div className="relative z-10 py-16 md:py-24 lg:py-32 flex flex-col items-center">
          {/* Main heading with enhanced styling */}
          <h1 className="text-4xl md:text-6xl lg:text-8xl font-bold text-center leading-tight mb-8">
            <span className="text-white drop-shadow-2xl">Ready-to-Wear</span>
            <span className="text-yellow-500 ml-4 drop-shadow-2xl relative">
              Collection
              <div className="absolute -inset-1 bg-yellow-500/20 blur-xl rounded-lg -z-10"></div>
            </span>
          </h1>

          {/* Enhanced description - Changed from p to div */}
          <div className="max-w-4xl">
            <div className="text-lg md:text-xl lg:text-2xl text-gray-300 text-center leading-relaxed font-light">
              Shop our{" "}
              <span className="text-yellow-400 font-medium relative">
                curated collection of stunning
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
              </span>{" "}
              ready-to-wear pieces, crafted with the{" "}
              <br className="hidden sm:block" />
              finest fabrics and impeccable{" "}
              <span className="text-yellow-400 font-medium relative">
                attention to details
                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-yellow-400 to-transparent"></div>
              </span>{" "}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-3 px-4 sm:px-5 md:px-15 lg:px-25">
        <Filter products={products} />
      </div>

      <div className="pb-5 px-4 sm:px-5 md:px-15 lg:px-25 md:pb-10 lg:pb-15">
        {/* Show message if no products */}
        {products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No products found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4">
            {products.map((product: Product) => (
              <ShopCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;
