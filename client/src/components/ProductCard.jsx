import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../features/wishlistSlice";

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const { wishlist } = useSelector(s => s.wishlist);

  const [isInWishlist, setIsInWishlist] = useState(false);
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [hoverInterval, setHoverInterval] = useState(null);

  useEffect(() => {
    const isProductInWishlist = wishlist.some(item => item?._id === product?._id);
    setIsInWishlist(isProductInWishlist);
  }, [wishlist, product]);

  const handleAddandRemoveWishlist = (e) => {
    e.preventDefault(); // Prevent navigation if clicked on button
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover-lift transition-all duration-300">
      <div
        className="relative overflow-hidden h-64 bg-gradient-to-br from-purple-100 to-cyan-100"
        onMouseEnter={() => {
          if (product.images?.length > 1) {
            const interval = setInterval(() => {
              setCurrentImgIndex(prev => (prev + 1) % product.images.length);
            }, 1000);
            setHoverInterval(interval);
          }
        }}
        onMouseLeave={() => {
          if (hoverInterval) {
            clearInterval(hoverInterval);
            setHoverInterval(null);
          }
          setCurrentImgIndex(0);
        }}
      >
        <img
          src={product.images?.[currentImgIndex] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-500 hover:scale-110"
        />

        {/* Carousel Indicators */}
        {product.images?.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            {product.images.map((_, idx) => (
              <div
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentImgIndex ? 'bg-primary-600' : 'bg-white/50'}`}
              />
            ))}
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"></div>

        {/* Quick View Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-accent text-white text-xs font-bold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
          Quick View
        </div>
      </div>

      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold gradient-text">₹{product.price}</span>
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <span key={i} className="text-yellow-400 text-sm">★</span>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <Link
            to={`/product/${product._id}`}
            className="flex-1 px-4 py-3 bg-gradient-primary text-white rounded-xl text-sm font-semibold text-center hover:shadow-lg transition-shadow"
          >
            View Details
          </Link>
          <button
            className="px-4 py-3 glass rounded-xl hover:bg-white transition-colors"
            onClick={handleAddandRemoveWishlist}
          >
            <span className="text-xl">{isInWishlist ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}