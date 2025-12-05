import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { createOrder } from "../features/ordersSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CheckoutPage() {
  const cart = useSelector(s => s.cart);
  const user = useSelector(s => s.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    paymentMethod: "card"
  });

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.18;
  const grandTotal = total + shipping + tax;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlace = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to place an order");
      return navigate("/login");
    }

    try {
      await dispatch(createOrder({
        products: cart.items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        }
      })).unwrap();

      dispatch(clearCart());
      alert("Order placed successfully! 🎉");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert(`Order placement failed: ${err.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Checkout</span>
          </h1>
          <p className="text-neutral-600 text-lg">Complete your order securely</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePlace} className="space-y-6">
              {/* Contact Information */}
              <div className="glass rounded-2xl p-8 animate-scale-in">
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-3xl">📧</span>
                  Contact Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      placeholder="John Doe"
                      className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="john@example.com"
                      className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Phone Number *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="+91 98765 43210"
                      className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="glass rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-3xl">🏠</span>
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Street Address *</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      required
                      rows="3"
                      placeholder="123 Main Street, Apartment 4B"
                      className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-neutral-700">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        placeholder="Mumbai"
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-neutral-700">State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        required
                        placeholder="Maharashtra"
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-neutral-700">ZIP Code *</label>
                      <input
                        type="text"
                        name="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        required
                        placeholder="400001"
                        className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="glass rounded-2xl p-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                  <span className="text-3xl">💳</span>
                  Payment Method
                </h2>

                <div className="space-y-3">
                  <label className="flex items-center gap-4 p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={formData.paymentMethod === "card"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-primary-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">💳</span>
                      <div>
                        <div className="font-semibold">Credit / Debit Card</div>
                        <div className="text-sm text-neutral-600">Visa, Mastercard, Amex</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="upi"
                      checked={formData.paymentMethod === "upi"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-primary-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">📱</span>
                      <div>
                        <div className="font-semibold">UPI Payment</div>
                        <div className="text-sm text-neutral-600">Google Pay, PhonePe, Paytm</div>
                      </div>
                    </div>
                  </label>

                  <label className="flex items-center gap-4 p-4 bg-white rounded-xl cursor-pointer hover:shadow-md transition-shadow">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleChange}
                      className="w-5 h-5 accent-primary-500"
                    />
                    <div className="flex items-center gap-3 flex-1">
                      <span className="text-2xl">💵</span>
                      <div>
                        <div className="font-semibold">Cash on Delivery</div>
                        <div className="text-sm text-neutral-600">Pay when you receive</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="glass rounded-2xl p-8 sticky top-24 animate-slide-in-right">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              {/* Cart Items */}
              <div className="space-y-3 mb-6 max-h-64 overflow-y-auto scrollbar-custom">
                {cart.items.map((item) => (
                  <div key={item.product} className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                    <div className="flex-1">
                      <div className="font-semibold text-sm line-clamp-1">{item.name}</div>
                      <div className="text-xs text-neutral-600">Qty: {item.quantity}</div>
                    </div>
                    <div className="font-bold">₹{item.price * item.quantity}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 mb-6 pt-6 border-t-2 border-neutral-200">
                <div className="flex justify-between">
                  <span className="text-neutral-600">Subtotal</span>
                  <span className="font-semibold">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Shipping</span>
                  <span className="font-semibold">
                    {shipping === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `₹${shipping.toFixed(2)}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-600">Tax (18%)</span>
                  <span className="font-semibold">₹{tax.toFixed(2)}</span>
                </div>

                <div className="border-t-2 border-neutral-200 pt-3">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total</span>
                    <span className="gradient-text">₹{grandTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePlace}
                className="w-full py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl mb-4"
              >
                Place Order
              </button>

              {/* Security Badge */}
              <div className="p-4 bg-green-50 border-2 border-green-200 rounded-xl">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">🔒</span>
                  <span className="font-bold text-green-800">Secure Checkout</span>
                </div>
                <p className="text-xs text-green-700">
                  Your payment information is encrypted and secure
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}