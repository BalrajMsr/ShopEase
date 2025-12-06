import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileDropdown from "./ProfileDropdown";
import Logo from "../assets/shop_ease_logo.png";

export default function Navbar() {
  const cart = useSelector(state => state.cart);
  const user = useSelector(state => state.user.userInfo);
  const count = cart.items.reduce((s, i) => s + i.quantity, 0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 outline-none focus:outline-none ${scrolled ? 'glass shadow-lg' : 'bg-white/80 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to={user?.user?.role === 'admin' ? "/admin" : "/home"} className="flex items-center gap-2">
          <img className="w-10 h-10" src={Logo} alt="shop ease logo" />
          <h1 className="text-2xl font-bold gradient-text">ShopEase</h1>
        </Link>

        <div className="flex items-center gap-6">
          <Link
            to="/cart"
            className="relative group flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-white/50 transition-all"
          >
            <span className="text-2xl group-hover:scale-110 transition-transform">🛒</span>
            <span className="font-semibold hidden sm:inline">Cart</span>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-warm text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg animate-pulse-glow">
                {count}
              </span>
            )}
          </Link>

          {/* Conditional rendering: Show Profile Dropdown if logged in, otherwise Show Sign In button */}
          {user ? (
            <ProfileDropdown user={user.user || user} />
          ) : (
            <Link
              to="/login"
              className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}