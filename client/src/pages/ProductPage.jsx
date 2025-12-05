import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cartSlice";
import Navbar from "../components/Navbar";
import { addToWishlist, fetchWishlist, removeFromWishlist } from "../features/wishlistSlice";
import { fetchProductById } from "../features/productsSlice";
import { useSelector } from "react-redux";

export default function ProductPage() {
  const { id } = useParams();

  const { currentProduct, status } = useSelector((state) => state.products);
  const { wishlist } = useSelector((state) => state.wishlist);

  const [qty, setQty] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlist, setIsWishlist] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        dispatch(fetchProductById(id));
        dispatch(fetchWishlist());
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    })();
  }, [id]);

  useEffect(() => {
    if (wishlist && currentProduct) {
      const isWishlist = wishlist?.some((item) => item?._id === currentProduct?._id);
      if (isWishlist) {
        setIsWishlist(true);
      } else {
        setIsWishlist(false);
      }
    }
  }, [wishlist, currentProduct]);

  if (!currentProduct || status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4 mx-auto"></div>
          <p className="text-neutral-600 text-lg">Loading product details...</p>
        </div>
      </div>
    );
  }

  const handleAdd = () => {
    dispatch(addToCart({
      product: currentProduct._id,
      name: currentProduct.name,
      price: currentProduct.price,
      images: currentProduct.images,
      quantity: qty
    }));
    navigate("/cart");
  };

  const handleAddandRemoveWishlist = (product) => {
    if (isWishlist) {
      dispatch(removeFromWishlist(product._id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const images = currentProduct.images || ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=800&fit=crop"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 px-4 py-2 glass rounded-xl hover:bg-white transition-colors flex items-center gap-2 font-semibold"
        >
          <span>←</span> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="animate-fade-in-up">
            <div className="bg-white rounded-3xl p-8 shadow-xl mb-4">
              <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-100 to-cyan-100 aspect-square">
                <img
                  src={images[selectedImage]}
                  alt={currentProduct.name}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                />
              </div>
            </div>

            {/* Thumbnail Gallery */}
            {images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto scrollbar-custom">
                {images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === index
                      ? 'border-primary-500 shadow-lg scale-110'
                      : 'border-neutral-200 hover:border-primary-300'
                      }`}
                  >
                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="animate-slide-in-right">
            <div className="glass rounded-3xl p-8 shadow-xl">
              <div className={`inline-block px-4 py-1 text-white text-sm font-bold rounded-full mb-4 ${currentProduct.stock > 0 ? 'bg-gradient-accent' : 'bg-red-500'
                }`}>
                {currentProduct.stock > 0 ? 'In Stock' : 'Out of Stock'}
              </div>

              <h1 className="text-4xl font-bold mb-4">{currentProduct.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <span className="text-neutral-600">(128 reviews)</span>
              </div>

              <div className="text-5xl font-bold gradient-text mb-6">
                ₹{currentProduct.price}
              </div>

              <p className="text-neutral-700 text-lg leading-relaxed mb-8">
                {currentProduct.description || "Experience premium quality with this exceptional product. Crafted with attention to detail and designed to exceed your expectations."}
              </p>

              {/* Quantity Selector */}
              <div className="mb-8">
                <label className="block text-sm font-bold mb-3 text-neutral-700">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    disabled={currentProduct.stock === 0}
                    className="w-12 h-12 bg-white rounded-xl font-bold text-xl hover:bg-neutral-100 transition-colors shadow-md disabled:opacity-50"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    value={qty}
                    min="1"
                    max={currentProduct.stock}
                    onChange={(e) => setQty(Math.min(currentProduct.stock, Math.max(1, Number(e.target.value))))}
                    disabled={currentProduct.stock === 0}
                    className="w-20 h-12 text-center border-2 border-neutral-200 rounded-xl font-bold text-lg focus:border-primary-500 focus:outline-none disabled:opacity-50"
                  />
                  <button
                    onClick={() => setQty(Math.min(currentProduct.stock, qty + 1))}
                    disabled={currentProduct.stock === 0 || qty >= currentProduct.stock}
                    className="w-12 h-12 bg-white rounded-xl font-bold text-xl hover:bg-neutral-100 transition-colors shadow-md disabled:opacity-50"
                  >
                    +
                  </button>
                </div>
                {currentProduct.stock > 0 && currentProduct.stock < 10 && (
                  <p className="text-red-500 text-sm mt-2">Only {currentProduct.stock} left in stock!</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mb-8">
                <button
                  onClick={handleAdd}
                  disabled={currentProduct.stock === 0}
                  className={`flex-1 px-8 py-4 rounded-xl text-lg font-bold shadow-xl transition-all ${currentProduct.stock > 0
                    ? 'bg-gradient-primary text-white hover-lift'
                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                    }`}
                >
                  {currentProduct.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
                </button>
                <button className="px-6 py-4 glass rounded-xl hover:bg-white transition-colors" onClick={() => handleAddandRemoveWishlist(currentProduct)}>
                  <span className="text-2xl">{isWishlist ? '❤️' : '🤍'}</span>
                </button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                  <span className="text-2xl">🚚</span>
                  <div>
                    <div className="font-bold text-sm">Free Shipping</div>
                    <div className="text-xs text-neutral-600">On orders over ₹500</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                  <span className="text-2xl">🔒</span>
                  <div>
                    <div className="font-bold text-sm">Secure Payment</div>
                    <div className="text-xs text-neutral-600">100% protected</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                  <span className="text-2xl">↩️</span>
                  <div>
                    <div className="font-bold text-sm">Easy Returns</div>
                    <div className="text-xs text-neutral-600">30-day guarantee</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-white/50 rounded-xl">
                  <span className="text-2xl">⚡</span>
                  <div>
                    <div className="font-bold text-sm">Fast Delivery</div>
                    <div className="text-xs text-neutral-600">2-3 business days</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}