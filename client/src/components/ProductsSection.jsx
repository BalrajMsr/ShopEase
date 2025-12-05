import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductsSection({ products, onAddToCart }) {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    // Auto-scroll functionality
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer || products.length === 0) return;

        let scrollInterval;
        let isScrolling = false;
        let scrollDirection = 1; // 1 for right, -1 for left

        const startAutoScroll = () => {
            scrollInterval = setInterval(() => {
                if (!isScrolling && scrollContainer) {
                    const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
                    const currentScroll = scrollContainer.scrollLeft;

                    // Change direction at the ends
                    if (currentScroll >= maxScroll - 10) {
                        scrollDirection = -1;
                    } else if (currentScroll <= 10) {
                        scrollDirection = 1;
                    }

                    // Smooth scroll
                    scrollContainer.scrollBy({
                        left: scrollDirection * 2,
                        behavior: 'smooth'
                    });
                }
            }, 30);
        };

        // Pause auto-scroll on hover
        const handleMouseEnter = () => {
            isScrolling = true;
        };

        const handleMouseLeave = () => {
            isScrolling = false;
        };

        scrollContainer.addEventListener('mouseenter', handleMouseEnter);
        scrollContainer.addEventListener('mouseleave', handleMouseLeave);

        startAutoScroll();

        return () => {
            clearInterval(scrollInterval);
            if (scrollContainer) {
                scrollContainer.removeEventListener('mouseenter', handleMouseEnter);
                scrollContainer.removeEventListener('mouseleave', handleMouseLeave);
            }
        };
    }, [products]);

    return (
        <section id="products" className="py-20 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Featured <span className="gradient-text">Products</span>
                    </h2>
                    <p className="text-xl text-neutral-600">Discover our handpicked collection of premium items</p>
                </div>

                <div className="relative">
                    {/* Auto-scroll indicator */}
                    {products.length > 0 && (
                        <div className="absolute -top-8 right-0 flex items-center gap-2 text-sm text-neutral-600 z-10">
                            <span className="animate-pulse">🔄</span>
                            <span>Auto-scrolling • Hover to pause</span>
                        </div>
                    )}

                    <div
                        ref={scrollContainerRef}
                        className="flex gap-6 overflow-x-auto scrollbar-custom pb-6"
                    >
                        {products.length === 0 ? (
                            <div className="w-full text-center py-12">
                                <div className="text-6xl mb-4">📦</div>
                                <p className="text-xl text-neutral-600">Loading amazing products...</p>
                            </div>
                        ) : (
                            [...products].map((product, index) => (
                                <div
                                    key={index}
                                    className="min-w-[280px] bg-white rounded-2xl shadow-lg overflow-hidden hover-lift group flex-shrink-0"
                                >
                                    <div className="relative overflow-hidden h-64 bg-gradient-to-br from-purple-100 to-cyan-100">
                                        <img
                                            src={product.images?.[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute top-4 right-4 px-3 py-1 bg-gradient-warm text-white text-xs font-bold rounded-full shadow-lg">
                                            New
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="font-bold text-lg mb-2 line-clamp-1">{product.name}</h3>
                                        <div className="flex items-center justify-between">
                                            <span className="text-2xl font-bold gradient-text">₹{product.price}</span>
                                            <button
                                                onClick={() => onAddToCart(product)}
                                                className="px-4 py-2 bg-gradient-primary text-white rounded-lg text-sm font-semibold hover:shadow-lg transition-shadow"
                                            >
                                                Add to Cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {products.length > 0 && (
                    <div className="text-center mt-12">
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                        >
                            View All Products
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
