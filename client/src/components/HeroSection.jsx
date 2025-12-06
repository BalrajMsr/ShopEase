import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <section className="relative pt-32 pb-20 px-6 overflow-hidden">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full blur-[100px] opacity-30 animate-float-slow -z-10"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-cyan-200 rounded-full blur-[120px] opacity-30 animate-float-medium -z-10"></div>

            <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center relative z-10">
                <div className="animate-fade-in-up">
                    <div className="inline-block px-4 py-2 bg-gradient-accent rounded-full text-white text-sm font-semibold mb-6 shadow-lg">
                        🎉 New Collection Available Now
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold leading-tight mb-6">
                        Shop Smarter,
                        <br />
                        <span className="gradient-text">Live Better</span>
                    </h1>
                    <p className="text-xl text-neutral-600 mb-8 leading-relaxed max-w-lg">
                        Experience the future of online shopping with our cutting-edge platform.
                        <span className="font-semibold text-primary-600 block mt-2">Fast, secure, and beautifully designed.</span>
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                        >
                            Start Shopping
                        </button>
                        <button
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            className="px-8 py-4 glass rounded-xl text-lg font-bold hover-lift shadow-lg"
                        >
                            View Products
                        </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-6 mt-12">
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">50K+</div>
                            <div className="text-sm text-neutral-600 mt-1">Happy Customers</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">100K+</div>
                            <div className="text-sm text-neutral-600 mt-1">Products Sold</div>
                        </div>
                        <div className="text-center">
                            <div className="text-3xl font-bold gradient-text">4.9★</div>
                            <div className="text-sm text-neutral-600 mt-1">Average Rating</div>
                        </div>
                    </div>
                </div>

                <div className="relative animate-slide-in-right">
                    <div className="relative z-10">
                        <img
                            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&h=800&fit=crop"
                            alt="Shopping Experience"
                            className="w-full rounded-3xl shadow-2xl hover-lift"
                        />
                        {/* Floating Card */}
                        <div className="absolute -bottom-6 -left-6 glass p-6 rounded-2xl shadow-xl animate-scale-in" style={{ animationDelay: '0.5s' }}>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center text-white text-2xl">
                                    ✓
                                </div>
                                <div>
                                    <div className="font-bold text-lg">Secure Checkout</div>
                                    <div className="text-sm text-neutral-600">256-bit Encryption</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
