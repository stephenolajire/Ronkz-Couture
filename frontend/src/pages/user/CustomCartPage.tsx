import React from "react";
import {
  Trash2,
  Edit,
  Eye,
  ShoppingBag,
  Calendar,
  DollarSign,
  Ruler,
} from "lucide-react";

interface CustomOrderItem {
  id: string;
  identity_code: string;
  first_name: string;
  last_name: string;
  email: string;
  whatsapp: string;
  styleDescription: string;
  occasion: string;
  budget: string;
  timeline: string;
  neck: string;
  arms: string;
  shoulders: string;
  chest: string;
  waist: string;
  hips: string;
  inseam: string;
  height: string;
  image?: string;
  picture?: string;
  status: "pending" | "in_progress" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
}

const cartItems: CustomOrderItem[] = [
    {
      id: "1",
      identity_code: "ID001",
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      whatsapp: "+1234567890",
      styleDescription: "Casual Wear",
      occasion: "Birthday",
      budget: "$100",
      timeline: "2 weeks",
      neck: "15",
      arms: "16",
      shoulders: "18",
      chest: "40",
      waist: "32",
      hips: "38",
      inseam: "30",
      height: "5'10",
      image: "/port1.jpeg",
      picture: "/port1.jpeg",
      status: "pending",
      created_at: "2023-01-01",
      updated_at: "2023-01-01",
    },
    {
      id: "2",
      identity_code: "ID002",
      first_name: "Jane",
      last_name: "Smith",
      email: "jane.smith@example.com",
      whatsapp: "+0987654321",
      styleDescription: "Formal Wear",
      occasion: "Wedding",
      budget: "$200",
      timeline: "1 month",
      neck: "14",
      arms: "15",
      shoulders: "17",
      chest: "36",
      waist: "28",
      hips: "34",
      inseam: "28",
      height: "5'6",
      image: "/port2.jpeg",
      picture: "/port2.jpeg",
      status: "in_progress",
      created_at: "2023-01-02",
      updated_at: "2023-01-02",
    },
    {
      id: "3",
      identity_code: "ID003",
      first_name: "Alice",
      last_name: "Johnson",
      email: "alice.johnson@example.com",
      whatsapp: "+1122334455",
      styleDescription: "Sport Wear",
      occasion: "Gym",
      budget: "$80",
      timeline: "1 week",
      neck: "16",
      arms: "17",
      shoulders: "19",
      chest: "42",
      waist: "34",
      hips: "40",
      inseam: "32",
      height: "5'8",
      image: "/ronkz.jpg",
      picture: "/ronkz.jpg",
      status: "completed",
      created_at: "2023-01-03",
      updated_at: "2023-01-03",
    },
  ];

const CustomCart: React.FC = () => {
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
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

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="flex items-center justify-center h-64">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
//             <span className="ml-3 text-lg text-gray-600">
//               Loading your cart...
//             </span>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   if (isError) {
//     return (
//       <div className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-6xl mx-auto px-4">
//           <div className="text-center">
//             <div className="text-red-500 text-xl mb-4">Error loading cart</div>
//             <p className="text-gray-600 mb-4">
//               {error?.message || "Something went wrong while loading your cart"}
//             </p>
//             <button
//               onClick={() => window.location.reload()}
//               className="bg-yellow-500 hover:bg-yellow-600 px-6 py-3 rounded-lg text-white font-medium transition-colors"
//             >
//               Try Again
//             </button>
//           </div>
//         </div>
//       </div>
//     );
//   }

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
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {item.first_name.charAt(0)}
                            {item.last_name.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900">
                            {item.first_name} {item.last_name}
                          </h3>
                          <p className="text-gray-500 text-sm">
                            Order ID: {item.identity_code}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                        >
                          {item.status.charAt(0).toUpperCase() +
                            item.status.slice(1)}
                        </span>
                        <button
                          //   onClick={() => handleDeleteOrder(item.id)}
                          //   disabled={deleteOrderMutation.isPending}
                          className="text-red-500 hover:text-red-700 disabled:opacity-50 p-2 rounded-lg hover:bg-red-50 transition-colors"
                          title="Remove from cart"
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
                            <span className="text-gray-500">Style:</span>
                            <p className="text-gray-900">
                              {item.styleDescription}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Occasion:</span>
                            <span className="text-gray-900">
                              {item.occasion}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <DollarSign className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Budget:</span>
                            <span className="text-gray-900">{item.budget}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span className="text-gray-500">Timeline:</span>
                            <span className="text-gray-900">
                              {formatDate(item.timeline)}
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
                              {item.chest}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Waist:</span>
                            <span className="text-gray-900 ml-1">
                              {item.waist}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Hips:</span>
                            <span className="text-gray-900 ml-1">
                              {item.hips}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Height:</span>
                            <span className="text-gray-900 ml-1">
                              {item.height}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Arms:</span>
                            <span className="text-gray-900 ml-1">
                              {item.arms}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Shoulders:</span>
                            <span className="text-gray-900 ml-1">
                              {item.shoulders}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Neck:</span>
                            <span className="text-gray-900 ml-1">
                              {item.neck}"
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-500">Inseam:</span>
                            <span className="text-gray-900 ml-1">
                              {item.inseam}"
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Images */}
                      <div className="space-y-3">
                        <h4 className="font-semibold text-gray-900">Images</h4>
                        <div className="grid grid-cols-2 gap-3">
                          {item.image && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">
                                Style Reference
                              </p>
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                <img
                                  src={item.image}
                                  alt="Style reference"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </div>
                          )}
                          {item.picture && (
                            <div className="space-y-2">
                              <p className="text-xs text-gray-500">
                                Personal Photo
                              </p>
                              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden border">
                                <img
                                  src={item.picture}
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
                          <span>📧 {item.email}</span>
                          <span>📱 {item.whatsapp}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                          Created: {formatDate(item.created_at)}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-4 flex flex-wrap gap-3">
                      <button className="flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors">
                        <Eye className="w-4 h-4 mr-2" />
                        View Details
                      </button>
                      <button className="flex items-center px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-yellow-700 transition-colors">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit Order
                      </button>
                      {item.status === "pending" && (
                        <button className="flex items-center px-4 py-2 bg-green-100 hover:bg-green-200 rounded-lg text-green-700 transition-colors">
                          Confirm Order
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
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
                        cartItems.filter((item) => item.status === "pending")
                          .length
                      }
                    </div>
                    <div className="text-gray-600 text-sm">Pending Orders</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {
                        cartItems.filter((item) => item.status === "completed")
                          .length
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
