import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/productsSlice";

// Import section components
import Footer from "../components/Footer";
import LoginModal from "../components/LoginModal";
import CTASection from "../components/CTASection";
import HeroSection from "../components/HeroSection";
import FeaturesSection from "../components/FeaturesSection";
import ProductsSection from "../components/ProductsSection";
import ProfileDropdown from "../components/ProfileDropdown";
import TestimonialsSection from "../components/TestimonialsSection";

export default function LandingPage() {
  const productsItems = useSelector(s => s.products.items);
  const user = useSelector(s => s.user.userInfo);
  const products = [...productsItems].sort(() => Math.random() - 0.5);

  const [scrolled, setScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAddToCart = (product) => {
    dispatch(addToCart({
      product: product?._id,
      name: product.name,
      price: product.price,
      images: product.images,
      quantity: 1
    }));
    navigate("/cart");
  };

  const features = [
    {
      icon: "⚡",
      title: "Lightning Fast Checkout",
      description: "Complete your purchase in seconds with our streamlined checkout process and saved payment methods."
    },
    {
      icon: "🔒",
      title: "Bank-Level Security",
      description: "Your data is protected with 256-bit encryption and PCI DSS compliant payment processing."
    },
    {
      icon: "🎨",
      title: "Beautiful Interface",
      description: "Enjoy a stunning, modern UI designed with the latest web technologies and best practices."
    },
    {
      icon: "📦",
      title: "Fast Delivery",
      description: "Get your orders delivered quickly with real-time tracking and multiple shipping options."
    },
    {
      icon: "💳",
      title: "Flexible Payments",
      description: "Pay your way with credit cards, digital wallets, and buy now, pay later options."
    },
    {
      icon: "🌟",
      title: "Premium Support",
      description: "24/7 customer support ready to help you with any questions or concerns."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Verified Buyer",
      content: "The shopping experience is incredible! Fast, secure, and the UI is absolutely gorgeous.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Tech Enthusiast",
      content: "Best e-commerce platform I've used. The checkout process is seamless and super fast.",
      rating: 5
    },
    {
      name: "Emma Williams",
      role: "Fashion Blogger",
      content: "Love the modern design and smooth animations. Shopping here is a pleasure!",
      rating: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50 text-neutral-800 overflow-x-hidden">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold gradient-text">ShopEase</h1>

          <nav className={`${isMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row absolute md:relative top-16 md:top-0 left-0 md:left-auto w-full md:w-auto bg-white md:bg-transparent p-6 md:p-0 gap-6 md:gap-8 shadow-lg md:shadow-none`}>
            <a href="#features" className="hover:text-primary-600 transition-colors font-medium">Features</a>
            <a href="#products" className="hover:text-primary-600 transition-colors font-medium">Products</a>
            <a href="#testimonials" className="hover:text-primary-600 transition-colors font-medium">Reviews</a>
            <a href="#contact" className="hover:text-primary-600 transition-colors font-medium">Contact</a>
          </nav>

          <div className="flex items-center gap-3">
            {/* Conditional rendering: Show Profile Dropdown if logged in, otherwise Show Sign In button */}
            {user ? (
              <ProfileDropdown user={user.user || user} />
            ) : (
              <button
                onClick={() => setIsPopupOpen(true)}
                className="px-6 py-2.5 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md"
              >
                Sign In
              </button>
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-white/50 transition-colors"
            >
              <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <FeaturesSection features={features} />

      {/* Products Section */}
      <ProductsSection products={products} onAddToCart={handleAddToCart} />

      {/* Testimonials Section */}
      <TestimonialsSection testimonials={testimonials} />

      {/* CTA Section */}
      <CTASection onGetStarted={() => {
        if (user) {
          navigate('/home');
        } else {
          setIsPopupOpen(true);
        }
      }} />

      {/* Footer */}
      <Footer />

      {/* Login Modal */}
      <LoginModal isOpen={isPopupOpen} onClose={() => setIsPopupOpen(false)} />
    </div>
  );
}