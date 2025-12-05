import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { removeFromCart, fetchCart } from "../features/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function CartPage() {
  const cart = useSelector(s => s.cart);
  const user = useSelector(s => s.user.userInfo);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      dispatch(fetchCart());
    }
  }, [user, dispatch]);

  const total = cart.items.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = total > 500 ? 0 : 50;
  const tax = total * 0.18; // 18% tax
  const grandTotal = total + shipping + tax;

  const goCheckout = () => navigate("/checkout");

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            Shopping <span className="gradient-text">Cart</span>
          </h1>
          <p className="text-neutral-600 text-lg">
            {cart.items.length} {cart.items.length === 1 ? 'item' : 'items'} in your cart
          </p>
        </div>

        {cart.items.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center animate-scale-in">
            <div className="text-6xl mb-6">🛒</div>
            <h2 className="text-3xl font-bold mb-4">Your cart is empty</h2>
            <p className="text-neutral-600 text-lg mb-8">
              Looks like you haven't added anything to your cart yet
            </p>
            <Link
              to="/"
              className="inline-block px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item, index) => (
                <div
                  key={item.product}
                  className="glass rounded-2xl p-6 hover-lift animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-100 to-cyan-100 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">{item.name}</h3>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-2xl font-bold gradient-text">₹{item.price}</span>
                        <span className="text-neutral-600">× {item.quantity}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-neutral-600">Qty:</span>
                          <span className="px-3 py-1 bg-white rounded-lg font-semibold">{item.quantity}</span>
                        </div>
                        <button
                          onClick={() => dispatch(removeFromCart(item.product))}
                          className="px-4 py-2 bg-red-50 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-100 transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold">₹{item.price * item.quantity}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="glass rounded-2xl p-8 sticky top-24 animate-slide-in-right">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-lg">
                    <span className="text-neutral-600">Subtotal</span>
                    <span className="font-semibold">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-neutral-600">Shipping</span>
                    <span className="font-semibold">
                      {shipping === 0 ? (
                        <span className="text-green-600">FREE</span>
                      ) : (
                        `₹${shipping.toFixed(2)}`
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-lg">
                    <span className="text-neutral-600">Tax (18%)</span>
                    <span className="font-semibold">₹{tax.toFixed(2)}</span>
                  </div>

                  <div className="border-t-2 border-neutral-200 pt-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="gradient-text">₹{grandTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping > 0 && (
                  <div className="mb-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-xl">
                    <p className="text-sm text-yellow-800">
                      <span className="font-bold">💡 Tip:</span> Add ₹{(500 - total).toFixed(2)} more to get FREE shipping!
                    </p>
                  </div>
                )}

                <button
                  onClick={goCheckout}
                  className="w-full py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl mb-4"
                >
                  Proceed to Checkout
                </button>

                <Link
                  to="/home"
                  className="block text-center text-primary-600 font-semibold hover:underline"
                >
                  Continue Shopping
                </Link>

                {/* Trust Badges */}
                <div className="mt-8 pt-8 border-t border-neutral-200">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🔒</span>
                      <span className="text-sm text-neutral-600">Secure Checkout</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">↩️</span>
                      <span className="text-sm text-neutral-600">Easy Returns</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">⚡</span>
                      <span className="text-sm text-neutral-600">Fast Delivery</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}