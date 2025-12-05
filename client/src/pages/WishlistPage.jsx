import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addToCart } from "../features/cartSlice";
import { fetchWishlist, removeFromWishlist } from "../features/wishlistSlice";
import Navbar from "../components/Navbar";

export default function WishlistPage() {
    const user = useSelector(state => state.user.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Get wishlist from Redux
    const { wishlist, status: loading } = useSelector(state => state.wishlist);

    // Redirect if not logged in and fetch wishlist
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(fetchWishlist());
        }
    }, [user, navigate, dispatch]);

    const handleRemoveFromWishlist = async (productId) => {
        try {
            await dispatch(removeFromWishlist(productId)).unwrap();
        } catch (error) {
            alert(`Failed to remove item: ${error.message || 'Please try again'}`);
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({
            product: product._id,
            name: product.name,
            price: product.price,
            images: product.images,
            quantity: 1
        }));
        navigate("/cart");
    };

    const handleMoveAllToCart = () => {
        wishlist.forEach(product => {
            if (product.stock && product.stock > 0) {
                dispatch(addToCart({
                    product: product._id,
                    name: product.name,
                    price: product.price,
                    images: product.images || [product.image],
                    quantity: 1
                }));
            }
        });
        navigate("/cart");
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up flex justify-between items-center">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-2">
                            My <span className="gradient-text">Wishlist</span>
                        </h1>
                        <p className="text-neutral-600 text-lg">
                            {wishlist.length} {wishlist.length === 1 ? 'item' : 'items'} saved
                        </p>
                    </div>
                    {wishlist.length > 0 && (
                        <button
                            onClick={handleMoveAllToCart}
                            className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md hidden md:block"
                        >
                            Add All to Cart
                        </button>
                    )}
                </div>

                {/* Wishlist Content */}
                {loading === 'loading' ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="spinner mb-4"></div>
                        <p className="text-neutral-600 text-lg">Loading your wishlist...</p>
                    </div>
                ) : wishlist?.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center animate-scale-in">
                        <div className="text-6xl mb-4">❤️</div>
                        <h2 className="text-2xl font-bold mb-2">Your Wishlist is Empty</h2>
                        <p className="text-neutral-600 mb-6">
                            Save items you love to buy them later
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Mobile: Add All to Cart Button */}
                        <button
                            onClick={handleMoveAllToCart}
                            className="w-full mb-6 px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md md:hidden"
                        >
                            Add All to Cart
                        </button>

                        {/* Wishlist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((product, index) => (
                                <div
                                    key={product._id}
                                    className="bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group animate-scale-in"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Product Image */}
                                    <div className="relative overflow-hidden h-64 bg-gradient-to-br from-purple-100 to-cyan-100">
                                        <img
                                            src={product.images?.[0] || product.image || 'https://via.placeholder.com/300'}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        {(!product.stock || product.stock === 0) && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="px-4 py-2 bg-red-500 text-white font-bold rounded-full">
                                                    Out of Stock
                                                </span>
                                            </div>
                                        )}
                                        {/* Remove Button */}
                                        <button
                                            onClick={() => handleRemoveFromWishlist(product._id)}
                                            className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-50 transition-colors group"
                                        >
                                            <span className="text-red-500 text-xl">✕</span>
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.name}</h3>

                                        {/* Rating */}
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <span
                                                        key={i}
                                                        className={`text-sm ${i < Math.floor(product.rating)
                                                            ? 'text-yellow-400'
                                                            : 'text-neutral-300'
                                                            }`}
                                                    >
                                                        ★
                                                    </span>
                                                ))}
                                            </div>
                                            <span className="text-sm text-neutral-600">({product.rating})</span>
                                        </div>

                                        {/* Price */}
                                        <div className="text-2xl font-bold gradient-text mb-4">
                                            ₹{product.price.toFixed(2)}
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => navigate(`/product/${product._id}`)}
                                                className="flex-1 px-4 py-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors"
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                disabled={!product.inStock}
                                                className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all ${product.inStock
                                                    ? 'bg-gradient-primary text-white hover:shadow-lg'
                                                    : 'bg-neutral-200 text-neutral-500 cursor-not-allowed'
                                                    }`}
                                            >
                                                {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Wishlist Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                            <div className="card text-center">
                                <div className="text-4xl mb-2">❤️</div>
                                <div className="text-3xl font-bold gradient-text">{wishlist.length}</div>
                                <div className="text-neutral-600 mt-1">Saved Items</div>
                            </div>
                            <div className="card text-center">
                                <div className="text-4xl mb-2">✓</div>
                                <div className="text-3xl font-bold gradient-text">
                                    {wishlist.filter(p => p.stock && p.stock > 0).length}
                                </div>
                                <div className="text-neutral-600 mt-1">In Stock</div>
                            </div>
                            <div className="card text-center">
                                <div className="text-4xl mb-2">💰</div>
                                <div className="text-3xl font-bold gradient-text">
                                    ₹{wishlist.reduce((sum, p) => sum + p.price, 0).toFixed(2)}
                                </div>
                                <div className="text-neutral-600 mt-1">Total Value</div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
