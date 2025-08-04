import React from "react";
import ShopHeader from "../../component/shop/ShopHeader";
import Filter from "../../component/shop/Filter";
import ShopCard from "../../component/shop/ShopCard";
import products from "../../utils/productData";
import type { Product } from "../../utils/productData";

const Shop: React.FC = () => {
  return (
    <div className="px-4 sm:px-5 md:px-15 lg:px-25 ">
      <ShopHeader />
      <Filter />
      <div className="pb-5 md:pb-10 lg:pb-15 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {products.map((product: Product) => (
          <ShopCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Shop;
