import { ArrowLeft, Plus, Minus, X, ShoppingBag } from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const initialCartItems = [
  {
    id: 1,
    image: "ronkz.jpg",
    name: "Ankara Couture",
    price: 15000,
    quantity: 1,
  },
  {
    id: 2,
    image: "ronkz.jpg",
    name: "Ankara Couture",
    price: 18000,
    quantity: 1,
  },
  {
    id: 3,
    image: "ronkz.jpg",
    name: "Ankara Couture",
    price: 10000,
    quantity: 2,
  },
];

const CartPage: React.FC = () => {
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems((items) =>
      items.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 2000;
  const total = subtotal + shipping;

  return (
    <div className="w-full h-auto min-h-screen">
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
                Cart Page
              </h1>
            </div>
            <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto">
              Review your cart items and proceed to checkout
            </p>
          </div>
        </div>
      </div>

      <div className="py-10 px-4 sm:px-5 md:px-15 lg:px-25 bg-gray-100 min-h-screen">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4 text-black/90">
            <button className="text-black/90 hover:text-black transition-colors">
              <ArrowLeft size={24} />
            </button>
            <h1 className="md:text-3xl text-2xl font-bold">Shopping Cart</h1>
          </div>

          <div>
            <h3 className="md:text-3xl text-2xl font-semibold">
              {cartItems.length} Items
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Cart Items Table */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {cartItems.length === 0 ? (
              <div className="p-12 text-center text-gray-500">
                <p className="text-lg">Your cart is empty</p>
                <p className="text-sm mt-2">Add some items to get started!</p>
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
                      {cartItems.map((item) => (
                        <tr
                          key={item.id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="py-6 px-6">
                            <div className="flex items-center space-x-4">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                              />
                              <div>
                                <h3 className="font-semibold text-lg">
                                  {item.name}
                                </h3>
                                <p className="text-gray-500 text-sm">
                                  Premium Quality
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6">
                            <div className="flex items-center justify-center">
                              <div className="flex items-center border border-gray-300 rounded-lg">
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity - 1)
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Minus size={16} />
                                </button>
                                <span className="px-4 py-2 font-semibold min-w-12 text-center">
                                  {item.quantity}
                                </span>
                                <button
                                  onClick={() =>
                                    updateQuantity(item.id, item.quantity + 1)
                                  }
                                  className="p-2 hover:bg-gray-100 transition-colors"
                                >
                                  <Plus size={16} />
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="py-6 px-6 text-center font-semibold">
                            ₦{item.price.toLocaleString()}
                          </td>
                          <td className="py-6 px-6 text-center font-bold text-lg">
                            ₦{(item.price * item.quantity).toLocaleString()}
                          </td>
                          <td className="py-6 px-6 text-center">
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-red-500 hover:text-red-700 transition-colors p-2 hover:bg-red-50 rounded-lg"
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
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start space-x-4">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="w-20 h-20 object-cover rounded-lg border border-gray-200"
                                />
                                <div className="flex-1">
                                  <div className="flex items-start justify-between">
                                    <div>
                                      <h3 className="font-semibold text-lg">
                                        {item.name}
                                      </h3>
                                      <p className="text-gray-500 text-sm">
                                        Premium Quality
                                      </p>
                                      <p className="font-semibold mt-1">
                                        ₦{item.price.toLocaleString()}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => removeItem(item.id)}
                                      className="text-red-500 hover:text-red-700 transition-colors p-1"
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
                                      updateQuantity(item.id, item.quantity - 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                  >
                                    <Minus size={16} />
                                  </button>
                                  <span className="px-4 py-2 font-semibold">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateQuantity(item.id, item.quantity + 1)
                                    }
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                  >
                                    <Plus size={16} />
                                  </button>
                                </div>
                                <span className="font-bold text-lg">
                                  ₦
                                  {(
                                    item.price * item.quantity
                                  ).toLocaleString()}
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
                    ₦{subtotal.toLocaleString()}
                  </td>
                </tr>
                <tr>
                  <td className="py-2">Shipping</td>
                  <td className="py-2 text-right">
                    ₦{shipping.toLocaleString()}
                  </td>
                </tr>
                <tr className="border-t border-gray-200">
                  <td className="py-4 font-bold text-lg">Total</td>
                  <td className="py-4 text-right font-bold text-lg">
                    ₦{total.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>

            <Link to="/checkout">
              <button
                disabled={cartItems.length === 0}
                className="w-full mb-3 bg-amber-500 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Proceed to Checkout
              </button>
            </Link>

            <button className="w-full bg-gray-100 text-gray-700 py-3 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
