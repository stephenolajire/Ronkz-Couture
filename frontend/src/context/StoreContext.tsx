// StoreContext.tsx
import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../hook/api";
import { useQuery } from "@tanstack/react-query";

export const QUERY_KEYS = {
  CATEGORIES: "categories",
  PRODUCTS: "products",
  PRODUCT_DETAIL: "product_detail",
} as const;

interface ProductFilters {
  category?: string;
  search?: string;
  ordering?: string;
  minPrice?: number;
  maxPrice?: number;
}

interface StoreContextType {
  api: typeof api;
  useCategory: () => any;
  useProduct: () => any;
  useProductDetail: (productId: string) => any;

  categories: any[];
  productLists: any[];

  // Filter state
  productFilters: ProductFilters;
  setProductFilters: (filters: ProductFilters) => void;
  updateProductFilter: (
    key: keyof ProductFilters,
    value: string | number | undefined
  ) => void;
  clearProductFilters: () => void;
}

export const StoreContext = createContext<StoreContextType | undefined>(
  undefined
);

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }
  return context;
};

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  // Filter state management
  const [productFilters, setProductFilters] = useState<ProductFilters>({});

  const updateProductFilter = (
    key: keyof ProductFilters,
    value: string | number | undefined
  ) => {
    setProductFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearProductFilters = () => {
    setProductFilters({});
  };

  // fetch categories
  const useCategory = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.CATEGORIES],
      queryFn: async () => {
        const response = await api.get("categories");
        return response.data;
      },
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
    });
  };

  const { data: categories } = useCategory();

  // fetch products with filters
  const useProduct = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.PRODUCTS, productFilters],
      queryFn: async () => {
        let url = "products";
        const params = new URLSearchParams();

        if (productFilters?.category) {
          params.append("category", productFilters.category);
        }
        if (productFilters?.search) {
          params.append("search", productFilters.search);
        }
        if (productFilters?.ordering) {
          params.append("ordering", productFilters.ordering);
        }
        if (productFilters?.minPrice !== undefined) {
          params.append("min_price", productFilters.minPrice.toString());
        }
        if (productFilters?.maxPrice !== undefined) {
          params.append("max_price", productFilters.maxPrice.toString());
        }

        if (params.toString()) {
          url += `?${params.toString()}`;
        }

        const response = await api.get(url);
        return response.data;
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    });
  };

  const { data: productLists } = useProduct();

  //   fetch product details
  const useProductDetail = (productId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.PRODUCT_DETAIL, productId],
      queryFn: async () => {
        const response = await api.get(`product/${productId}`);
        return response.data;
      },
      enabled: !!productId,
    });
  };

  const value: StoreContextType = {
    api,
    useCategory,
    useProduct,
    productFilters,
    setProductFilters,
    updateProductFilter,
    clearProductFilters,
    useProductDetail,
    categories,
    productLists
  };

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
};
