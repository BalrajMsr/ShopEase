import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { clearCart } from "../features/cartSlice";
import { createOrder } from "../features/ordersSlice";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import api from "../api/axios";

// Replace with your actual publishable key
const stripePromise = loadStripe("pk_test_51SbCfQLMvTNMOpE0KGw6JfUKAkZH1j1oBDa9vxd7tczdoKYtXu70Xb5aOb315cUXPTHDcHgOclp6rdkD0nP3Pggu00RPf6xhXh");

const StripePaymentForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: window.location.origin,
      },
      redirect: "if_required",
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      onSuccess(paymentIntent.id);
    } else {
      setMessage("Payment failed or processing.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <PaymentElement />
      {message && <div className="text-red-500 mt-2 text-sm">{message}</div>}
      <button
        disabled={isLoading || !stripe || !elements}
        className="w-full py-4 mt-6 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
      >
        {isLoading ? "Processing..." : "Pay Now"}
      </button>
    </form>
  );
};

import { useAlert } from "../context/AlertContext";

export default function CheckoutPage() {
  const cart = useSelector(s => s.cart);
  const user = useSelector(s => s.user.userInfo);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { showAlert } = useAlert();

  const [clientSecret, setClientSecret] = useState("");
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

  useEffect(() => {
    if (cart.items.length > 0 && user?.token) {
      api.post("/orders/create-payment-intent", {
        products: cart.items.map(i => ({ product: i.product, quantity: i.quantity }))
      }, {
        headers: { Authorization: `Bearer ${user.token}` }
      })
        .then(res => setClientSecret(res.data.clientSecret))
        .catch(err => console.error("Stripe Intent Error:", err));
    }
  }, [cart.items, user?.token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async (extraData = {}) => {
    if (!user) {
      showAlert("Please login to place an order", "warning");
      return navigate("/login");
    }

    try {
      const resultAction = await dispatch(createOrder({
        products: cart.items.map(i => ({ product: i.product, quantity: i.quantity })),
        shippingAddress: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`,
        customerInfo: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        },
        paymentStatus: extraData.paymentStatus || "pending",
        paymentIntentId: extraData.paymentIntentId
      }));

      const newOrder = resultAction.payload;

      dispatch(clearCart());
      showAlert("Order placed successfully! 🎉", "success", "Woohoo!");
      if (newOrder && newOrder._id) {
        navigate(`/orders/${newOrder._id}`);
      } else {
        // Fallback if ID is missing for some reason
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
      showAlert(`Order placement failed: ${err.message || 'Unknown error'}`, "error");
    }
  };

  const onStripeSuccess = (paymentIntentId) => {
    handlePlaceOrder({ paymentStatus: "paid", paymentIntentId });
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
            <div className="space-y-6">
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
                        <div className="font-semibold">Online Payment</div>
                        <div className="text-sm text-neutral-600">Credit/Debit Card, UPI, Netbanking</div>
                      </div>
                    </div>
                  </label>

                  {formData.paymentMethod === 'card' && clientSecret && (
                    <div className="p-4 bg-white/50 rounded-xl border-2 border-purple-100">
                      <Elements stripe={stripePromise} options={{ clientSecret }}>
                        <StripePaymentForm onSuccess={onStripeSuccess} />
                      </Elements>
                    </div>
                  )}

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
                        <div className="text-sm text-neutral-600">Pay when you receive (Status: Pending)</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
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

              {formData.paymentMethod !== 'card' && (
                <button
                  onClick={() => handlePlaceOrder()}
                  className="w-full py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl mb-4"
                >
                  Place Order
                </button>
              )}

              {formData.paymentMethod === 'card' && (
                <p className="text-sm text-center text-neutral-500 mb-4">Complete payment in the form</p>
              )}

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
    </div >
  );
}