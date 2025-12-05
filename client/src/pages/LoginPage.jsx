import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../features/userSlice";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      let userData;
      if (isSignUp) {
        userData = await dispatch(registerUser({ name, email, password })).unwrap();
      } else {
        userData = await dispatch(loginUser({ email, password })).unwrap();
      }

      if (userData?.user?.role === 'admin') {
        navigate("/admin");
      } else {
        navigate("/home");
      }
    } catch (err) {
      alert("Login failed. This is a demo - backend may not be running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50 flex items-center justify-center p-6">
      {/* Background Decorations */}
      <div className="absolute top-20 right-10 w-72 h-72 bg-gradient-accent rounded-full blur-3xl opacity-20 animate-float"></div>
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-gradient-primary rounded-full blur-3xl opacity-20 animate-float" style={{ animationDelay: '1s' }}></div>

      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Left Side - Branding */}
        <div className="hidden lg:block animate-fade-in-up">
          <Link to="/" className="inline-block mb-8">
            <h1 className="text-5xl font-bold gradient-text">ShopEase</h1>
          </Link>

          <h2 className="text-4xl font-bold mb-6">
            Welcome to the Future of
            <br />
            <span className="gradient-text">Online Shopping</span>
          </h2>

          <p className="text-xl text-neutral-600 mb-8 leading-relaxed">
            Join thousands of happy customers enjoying a seamless, secure, and delightful shopping experience.
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <div className="font-bold text-lg">Secure Payments</div>
                <div className="text-neutral-600">Bank-level encryption</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-accent rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <div className="font-bold text-lg">Fast Delivery</div>
                <div className="text-neutral-600">2-3 business days</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-warm rounded-full flex items-center justify-center text-white text-xl">
                ✓
              </div>
              <div>
                <div className="font-bold text-lg">24/7 Support</div>
                <div className="text-neutral-600">Always here to help</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="glass rounded-3xl p-8 md:p-12 shadow-2xl animate-slide-in-right">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold gradient-text mb-2">
              {isSignUp ? "Create Account" : "Welcome Back!"}
            </h2>
            <p className="text-neutral-600">
              {isSignUp
                ? "Sign up to start your shopping journey"
                : "Sign in to continue shopping"}
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold mb-2 text-neutral-700">Full Name</label>
                <input
                  type="text"
                  placeholder="John Doe"
                  className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-700">Email</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 text-neutral-700">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
              />
            </div>

            {!isSignUp && (
              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 accent-primary-500" />
                  <span className="text-neutral-600">Remember me</span>
                </label>
                <a href="#" className="text-primary-600 font-semibold hover:underline">
                  Forgot password?
                </a>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </span>
              ) : (
                isSignUp ? "Create Account" : "Sign In"
              )}
            </button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-600">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">🔍</span>
                Google
              </button>
              <button
                type="button"
                className="px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors flex items-center justify-center gap-2"
              >
                <span className="text-xl">📘</span>
                Facebook
              </button>
            </div>

            <div className="text-center text-neutral-600 pt-4">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-primary-600 font-semibold hover:underline"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </button>
            </div>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <Link
              to="/"
              className="text-center block text-primary-600 font-semibold hover:underline"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}