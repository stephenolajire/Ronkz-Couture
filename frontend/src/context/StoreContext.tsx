// StoreContext.tsx
import { createContext, useState, useContext, type ReactNode } from "react";
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import api from "../hook/api";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
  },
});

// Query Keys
export const QUERY_KEYS = {
  PORTFOLIO_ITEMS: "portfolioItems",
  CATEGORIES: "categories",
  PRODUCTS: "products",
  ORDERS: "orders",
  USER: "user",
  CART: "cart",
  CUSTOM_ORDERS: "customOrders",
} as const;

// Types
interface User {
  id: string;
  name: string;
  email: string;
  // Add other user properties as needed
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  // Add other cart item properties as needed
}

interface StoreContextType {
  // State
  user: User | null;
  setUser: (user: User | null) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;

  // Query Functions
  usePortfolioItems: () => any;
  useProducts: () => any;
  useOrders: (userId?: string) => any;
  useUserProfile: (userId?: string) => any;

  // Mutation Functions
  useCreateOrder: () => any;
  useUpdateUser: () => any;
  useAddToCart: () => any;
  useSubmitCustomOrder: () => any;

  // Helper functions
  addToLocalCart: (item: CartItem) => void;
  removeFromLocalCart: (itemId: string) => void;
  updateLocalCartItem: (itemId: string, updates: Partial<CartItem>) => void;
  clearLocalCart: () => void;

  // Direct API access if needed
  api: typeof api;
  queryClient: QueryClient;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

// Custom hook that works with your current import pattern
const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStore must be used within a StoreProvider");
  }

  // Create the query hooks within the component context
  const usePortfolioItems = () => {
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

  const useProducts = () => {
    return useQuery({
      queryKey: [QUERY_KEYS.PRODUCTS],
      queryFn: async () => {
        const response = await api.get("products");
        return response.data;
      },
    });
  };

  const useOrders = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.ORDERS, userId],
      queryFn: async () => {
        const response = await api.get(`orders/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  };

  const useUserProfile = (userId?: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.USER, userId],
      queryFn: async () => {
        const response = await api.get(`user/${userId}`);
        return response.data;
      },
      enabled: !!userId,
    });
  };

  const useCreateOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (orderData: any) => {
        const response = await api.post("orders", orderData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ORDERS] });
      },
      onError: (error) => {
        console.error("Error creating order:", error);
      },
    });
  };

  const useUpdateUser = () => {
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
        queryClient.setQueryData([QUERY_KEYS.USER, variables.userId], data);
      },
    });
  };

  const useAddToCart = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (cartItem: any) => {
        const response = await api.post("cart", cartItem);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CART] });
      },
    });
  };

  const useSubmitCustomOrder = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: async (customOrderData: any) => {
        const response = await api.post("custom-orders", customOrderData);
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.CUSTOM_ORDERS] });
      },
    });
  };

  return {
    ...context,
    usePortfolioItems,
    useProducts,
    useOrders,
    useUserProfile,
    useCreateOrder,
    useUpdateUser,
    useAddToCart,
    useSubmitCustomOrder,
  };
};

const StoreProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Local cart management functions
  const addToLocalCart = (item: CartItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((cartItem) => cartItem.id === item.id);
      if (existingItem) {
        return prevCart.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromLocalCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateLocalCartItem = (itemId: string, updates: Partial<CartItem>) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      )
    );
  };

  const clearLocalCart = () => {
    setCart([]);
  };

  const value = {
    // State
    user,
    setUser,
    cart,
    setCart,
    loading,
    setLoading,

    // Local cart management
    addToLocalCart,
    removeFromLocalCart,
    updateLocalCartItem,
    clearLocalCart,

    // Direct access
    api,
    queryClient,

    // Note: The query hooks will be added by the useStore hook
    usePortfolioItems: () => {}, // Placeholder - will be overridden by useStore
    useProducts: () => {},
    useOrders: () => {},
    useUserProfile: () => {},
    useCreateOrder: () => {},
    useUpdateUser: () => {},
    useAddToCart: () => {},
    useSubmitCustomOrder: () => {},
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
    </QueryClientProvider>
  );
};

export { StoreProvider };
export default useStore; // This maintains your current import pattern
