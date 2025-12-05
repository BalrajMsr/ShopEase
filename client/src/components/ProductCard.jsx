import React from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addToWishlist, removeFromWishlist } from "../features/wishlistSlice";

export default function ProductCard({ product }) {

  const dispatch = useDispatch();
  const { wishlist } = useSelector(s => s.wishlist);

  const [isInWishlist, setIsInWishlist] = React.useState(false);

  React.useEffect(() => {
    const isProductInWishlist = wishlist.some(item => item?._id === product?._id);
    setIsInWishlist(isProductInWishlist);
  }, [wishlist]);

  const handleAddandRemoveWishlist = (product) => {
    if (isInWishlist) {
      dispatch(removeFromWishlist(product?._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };


  return (
    <div className="group bg-white rounded-2xl shadow-lg overflow-hidden hover-lift transition-all duration-300">
      <div className="relative overflow-hidden h-64 bg-gradient-to-br from-purple-100 to-cyan-100">
        <img
          src={product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>

        {/* Quick View Badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-accent text-white text-xs font-bold rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
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
          <button className="px-4 py-3 glass rounded-xl hover:bg-white transition-colors">
            <span className="text-xl" onClick={() => handleAddandRemoveWishlist(product)}>{isInWishlist ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}