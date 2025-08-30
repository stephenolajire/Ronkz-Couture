import React, { useMemo } from "react";
import {
  Trash2,
  Edit,
  Eye,
  ShoppingBag,
  Calendar,
  DollarSign,
  Ruler,
} from "lucide-react";
import { useStore } from "../../context/GlobalContext";

interface CustomOrderProduct {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  styleDescription: string;
  occasion: string;
  budget: string;
  timeline: string;
  neck: number;
  arms: number;
  shoulders: number;
  chest: number;
  waist: number;
  hips: number;
  inseam: number;
  height: number;
  image_url?: string;
  picture_url?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

interface CustomOrderItem {
  id: number;
  product: CustomOrderProduct;
  created_at: string;
  updated_at: string;
}

const CustomCart: React.FC = () => {
  const identity_code = localStorage.getItem("custom_identity") || "";

  const { useCustomOrder, useDeleteCustomOrder } = useStore();
  const { data, isLoading, error } = useCustomOrder(identity_code);

  const cartItems = useMemo(() => {
    return data?.items || data || [];
  }, [data]);

  // console.log("Custom Cart Items:", cartItems);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const { mutate: deleteCustomOrder } = useDeleteCustomOrder(identity_code, "");

  const handleDelete = (identity_code: string, itemId: string) => {
    deleteCustomOrder(itemId, identity_code);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="text-red-500 text-xl mb-4">Error loading cart</div>
            <p className="text-gray-600 mb-4">
              {error?.message || "Something went wrong while loading your cart"}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-white font-medium transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header Section */}
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
                Custom Cart
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Review your custom design orders and track their progress
            </p>
          </div>
        </div>
      </div>

      {/* Cart Content */}
      <div className="py-15 w-full px-2 sm:px-5 md:px-15">
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
          <div className="w-full mx-auto px-2 sm:px-5 md:px-15">
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Your Custom Orders ({cartItems.length})
              </h2>
              <p className="text-gray-600">
                Manage and track your custom design orders
              </p>
            </div>

            <div className="grid gap-6">
              {cartItems.map((item: CustomOrderItem) => {
                const product = item.product;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                  >
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-yellow-500 rounded-lg hidden items-center justify-center md:flex">
                            <span className="text-white font-bold text-lg">
                              {product?.first_name?.charAt(0) || "N"}
                              {product?.last_name?.charAt(0) || "A"}
                            </span>
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">
                              {product?.first_name || "N/A"}{" "}
                              {product?.last_name || ""}
                            </h3>
                            <p className="text-gray-500 text-sm">
                              Order ID: {product?.id || "N/A"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              product?.status || "pending"
                            )}`}
                          >
                            {product?.status
                              ? product.status.charAt(0).toUpperCase() +
                                product.status.slice(1)
                              : "Pending"}
                          </span>
                          <button
                            className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors"
                            title="Remove from cart"
                            onClick={() => {
                              const confirmed = window.confirm(
                                "Are you sure you want to remove this item from your cart?"
                              );

                              if (confirmed) {
                                handleDelete(identity_code, product.id);
                              }
                            }}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Design Details */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Eye className="w-4 h-4 mr-2 text-yellow-500" />
                            Design Details
                          </h4>
                          <div className="space-y-2 text-sm">
                            <div>
                              <span className="text-gray-500">
                                Style Description:
                              </span>
                              <p className="text-gray-900">
                                {product?.styleDescription || "N/A"}
                              </p>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Occasion:</span>
                              <span className="text-gray-900">
                                {product?.occasion || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Budget:</span>
                              <span className="text-gray-900">
                                {product?.budget || "N/A"}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              <span className="text-gray-500">Timeline:</span>
                              <span className="text-gray-900">
                                {product?.timeline
                                  ? formatDate(product.timeline)
                                  : "N/A"}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Measurements */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900 flex items-center">
                            <Ruler className="w-4 h-4 mr-2 text-yellow-500" />
                            Measurements
                          </h4>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                              <span className="text-gray-500">Chest:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.chest || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Waist:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.waist || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Hips:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.hips || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Height:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.height || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Arms:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.arms || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Shoulders:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.shoulders || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Neck:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.neck || "N/A"}"
                              </span>
                            </div>
                            <div>
                              <span className="text-gray-500">Inseam:</span>
                              <span className="text-gray-900 ml-1">
                                {product?.inseam || "N/A"}"
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Images */}
                        <div className="space-y-3">
                          <h4 className="font-semibold text-gray-900">
                            Images
                          </h4>
                          <div className="grid grid-cols-2 gap-3">
                            {product?.image_url && (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                  Style Reference
                                </p>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                  <img
                                    src={product.image_url}
                                    alt="Style reference"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                            {product?.picture_url && (
                              <div className="space-y-2">
                                <p className="text-xs text-gray-500">
                                  Personal Photo
                                </p>
                                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                  <img
                                    src={product.picture_url}
                                    alt="Personal reference"
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Contact Info */}
                      <div className="mt-6 pt-4 border-t border-gray-100">
                        <div className="flex flex-wrap items-center justify-between text-sm text-gray-600">
                          <div className="flex items-center space-x-4">
                            <span>📧 {product?.email || "N/A"}</span>
                            <span>📱 {product?.whatsapp || "N/A"}</span>
                          </div>
                          <div className="text-xs text-gray-400">
                            Created: {formatDate(item.created_at)}
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex flex-wrap gap-3">
                        <button className="flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-700 transition-colors">
                          <Edit className="w-4 h-4 mr-2" />
                          Edit Order
                        </button>
                        {product?.status?.toLowerCase() === "pending" && (
                          <button className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors">
                            Confirm Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            {cartItems.length > 0 && (
              <div className="mt-12 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Cart Summary
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {cartItems.length}
                    </div>
                    <div className="text-gray-600 text-sm">Total Items</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {
                        cartItems.filter(
                          (item: CustomOrderItem) =>
                            item.product?.status?.toLowerCase() === "pending"
                        ).length
                      }
                    </div>
                    <div className="text-gray-600 text-sm">Pending Orders</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {
                        cartItems.filter(
                          (item: CustomOrderItem) =>
                            item.product?.status?.toLowerCase() === "completed"
                        ).length
                      }
                    </div>
                    <div className="text-gray-600 text-sm">Completed</div>
                  </div>
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={() => (window.location.href = "/custom-order")}
                    className="flex-1 bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-white font-medium transition-colors"
                  >
                    Add New Design
                  </button>
                  <button className="flex-1 bg-gray-900 hover:bg-gray-800 px-6 py-3 rounded-lg text-white font-medium transition-colors">
                    Contact Designer
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomCart;
