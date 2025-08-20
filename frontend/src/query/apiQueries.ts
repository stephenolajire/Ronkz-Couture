// queries/apiQueries.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../hook/api";

// Query Keys
export const QUERY_KEYS = {
  PORTFOLIO_ITEMS: "portfolioItems",
  CATEGORIES: "categories",
  PRODUCTS: "products",
  ORDERS: "orders",
  USER: "user",
} as const;

// Fetch Portfolio Items / Categories
export const usePortfolioItems = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PORTFOLIO_ITEMS],
    queryFn: async () => {
      const response = await api.get("categories");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Fetch Products
export const useProducts = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PRODUCTS],
    queryFn: async () => {
      const response = await api.get("products");
      return response.data;
    },
  });
};

// Fetch User Orders
export const useOrders = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ORDERS, userId],
    queryFn: async () => {
      const response = await api.get(`orders/${userId}`);
      return response.data;
    },
    enabled: !!userId, // Only run if userId exists
  });
};

// Fetch User Profile
export const useUser = (userId?: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.USER, userId],
    queryFn: async () => {
      const response = await api.get(`user/${userId}`);
      return response.data;
    },
    enabled: !!userId,
  });
};

// Create Order Mutation
export const useCreateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderData: any) => {
      const response = await api.post("orders", orderData);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch orders
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
    },
    onError: (error) => {
      console.error("Error creating order:", error);
    },
  });
};

// Update User Profile Mutation
export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      userData,
    }: {
      userId: string;
      userData: any;
    }) => {
      const response = await api.put(`user/${userId}`, userData);
      return response.data;
    },
    onSuccess: (data, variables) => {
      // Update the user cache
      queryClient.setQueryData([QUERY_KEYS.USER, variables.userId], data);
    },
  });
};

// Add to Cart Mutation (if you have a backend cart)
export const useAddToCart = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (cartItem: any) => {
      const response = await api.post("cart", cartItem);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate cart queries if needed
      queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });
};

// Submit Custom Order
export const useSubmitCustomOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (customOrderData: any) => {
      const response = await api.post("custom-orders", customOrderData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customOrders"] });
    },
  });
};
