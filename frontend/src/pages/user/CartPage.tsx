import { ArrowLeft, Plus, Minus, X, ShoppingBag } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
import { useStore } from "../../context/GlobalContext";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../../hook/api";

const CartPage: React.FC = () => {
  const { useCartItems } = useStore();
  const cart_code = localStorage.getItem("cart_code") || "";

  // Get all the data first
  const { data: cartData, isLoading, error, refetch } = useCartItems(cart_code);
  const queryClient = useQueryClient();

  // Define the mutation hook BEFORE any conditional returns
  const { mutate: UpdateCartQuantity, isPending: isUpdating } = useMutation({
    mutationFn: async ({
      itemId,
      cart_code,
      quantity,
    }: {
      itemId: number;
      cart_code: string;
      quantity: number;
    }) => {
      const response = await api.patch(`/cart-items/`, {
        itemId,
        cart_code,
        quantity,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Item quantity updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["cart_items", cart_code],
      });
    },
    onError: () => {
      toast.error("Failed to update item quantity");
    },
  });

  const { mutate: deleteCartItem, isPending: isDeleting } = useMutation({
    mutationFn: async ({
      productId,
      cart_code,
    }: {
      productId: number;
      cart_code: string;
    }) => {
      const response = await api.delete(`/cart-items/`, {
        data: {
          productId,
          cart_code,
        },
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Item removed from cart ");
      queryClient.invalidateQueries({
        queryKey: ["cart_items", cart_code],
      });
    },
    onError: () => {
      toast.error("Failed to remove item");
    },
  });

  // NOW handle loading and error states after all hooks
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading cart items...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 text-lg">Error loading cart items</p>
          <button
            onClick={() => refetch()}
            className="mt-4 bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Extract cart items and totals from the API response
  const cartItems = cartData?.items || [];
  const totalPrice = cartData?.total_price || 0;
  const itemCount = cartItems.length;

  return (
    <div className="w-full h-auto ">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-black via-gray-900 to-black">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-24 h-24 bg-yellow-500/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-yellow-500/15 rounded-full blur-2xl animate-pulse"></div>
        </div>

        <div className="relative z-10 py-15">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShoppingBag className="text-yellow-500 w-12 h-12 mr-4" />
              <h1 className="text-4xl md:text-6xl font-bold text-white">
                Shopping Cart
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Review your cart items and proceed to checkout
            </p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="py-10 px-4 sm:px-5 md:px-15 lg:px-25 bg-gray-100 h-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 text-black/90">
            <Link
              to="/"
              className="text-black/90 hover:text-black transition-colors"
            >
              <ArrowLeft size={24} />
            </Link>
            <h1 className="md:text-3xl text-2xl font-bold">Shopping Cart</h1>
          </div>

          <div>
            <h3 className="md:text-3xl text-2xl font-semibold">
              {itemCount} {itemCount === 1 ? "Item" : "Items"}
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingBag className="w-24 h-24 text-gray-300 mx-auto mb-6" />
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">
                  Your cart is empty
                </h2>
                <p className="text-gray-500 mb-8 max-w-md mx-auto">
                  You haven't added any custom designs yet. Start creating your
                  perfect garment today!
                </p>
                <button
                  onClick={() => (window.location.href = "/custom-order")}
                  className="bg-yellow-500 hover:bg-yellow-600 px-8 py-3 rounded-lg text-white font-medium transition-colors"
                >
                  Create Custom Design
                </button>
              </div>
            ) : (
              <>
                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="text-left py-4 px-6 font-semibold text-gray-700">
                          Product Details
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">
                          Price
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">
                          Total
                        </th>
                        <th className="text-center py-4 px-6 font-semibold text-gray-700">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item: any) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-6 px-6">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.product.image_url}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.src = "/api/placeholder/80/80";
                                }}
                              />
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {item.product.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  {item.product.category.name}
                                </p>
                                {item.product.measurements && (
                                  <p className="text-gray-400 text-xs">
                                    {item.product.measurements}
                                  </p>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    UpdateCartQuantity({
                                      itemId: item.id,
                                      cart_code,
                                      quantity: item.quantity - 1,
                                    })
                                  }
                                  disabled={isUpdating || item.quantity <= 1}
                                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-12 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    UpdateCartQuantity({
                                      itemId: item.id,
                                      cart_code,
                                      quantity: item.quantity + 1,
                                    })
                                  }
                                  disabled={isUpdating}
                                  className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-center font-semibold">
                            ₦{Number(item.product.price).toLocaleString()}
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-lg">
                            ₦{item.subtotal.toLocaleString()}
                          </td>
                          <td className="py-6 px-6 text-center">
                            <button
                              onClick={() =>
                                deleteCartItem({
                                  productId: item.id,
                                  cart_code,
                                })
                              }
                              disabled={isDeleting}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <X size={20} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile Table - Stacked Layout */}
                <div className="md:hidden">
                  <table className="w-full">
                    <tbody className="divide-y divide-gray-200">
                      {cartItems.map((item: any) => (
                        <tr key={item.id}>
                          <td className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = "/api/placeholder/80/80";
                                  }}
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">
                                        {item.product.name}
                                      </h3>
                                      <p className="text-gray-500 text-sm">
                                        {item.product.category.name}
                                      </p>
                                      <p className="font-semibold mt-1">
                                        ₦
                                        {Number(
                                          item.product.price
                                        ).toLocaleString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() =>
                                        deleteCartItem({
                                          productId: item.id,
                                          cart_code,
                                        })
                                      }
                                      disabled={isDeleting}
                                      className="text-red-500 hover:text-red-700 transition-colors p-1 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                      <X size={20} />
                                    </button>
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                                <div className="flex items-center border border-gray-300 rounded-lg">
                                  <button
                                    onClick={() =>
                                      UpdateCartQuantity({
                                        itemId: item.id,
                                        cart_code,
                                        quantity: item.quantity - 1,
                                      })
                                    }
                                    disabled={isUpdating || item.quantity <= 1}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 py-2 font-semibold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      UpdateCartQuantity({
                                        itemId: item.id,
                                        cart_code,
                                        quantity: item.quantity + 1,
                                      })
                                    }
                                    disabled={isUpdating}
                                    className="p-2 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                <span className="font-bold text-lg">
                                  ₦{item.subtotal.toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 h-fit">
            <h2 className="text-xl font-bold mb-6">Order Summary</h2>

            <table className="w-full mb-6">
              <tbody className="space-y-4">
                <tr>
                  <td className="py-2">Subtotal</td>
                  <td className="py-2 text-right">
                    ₦{totalPrice.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Shipping</td>
                  <td className="py-2 text-right">
                    <p className="text-sm text-gray-500 font-semibold">
                      Pay on delivery
                    </p>
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 font-bold text-lg">Total</td>
                  <td className="py-4 text-right font-bold text-lg">
                    ₦{totalPrice.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <Link to="/checkout">
              <button
                disabled={cartItems.length === 0}
                className="w-full mb-3 bg-yellow-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-yellow-600 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </Link>

            <Link to="/">
              <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                Continue Shopping
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
