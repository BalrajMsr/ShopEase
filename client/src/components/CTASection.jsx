import React from "react";
import { useNavigate } from "react-router-dom";

export default function CTASection({ onGetStarted }) {
    const navigate = useNavigate();

    return (
        <section className="py-20 px-6 bg-gradient-primary text-white relative overflow-hidden">
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
            </div>

            <div className="max-w-4xl mx-auto text-center relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">
                    Ready to Transform Your Shopping Experience?
                </h2>
                <p className="text-xl mb-8 opacity-90">
                    Join ShopEase today and discover a world of premium products, lightning-fast checkout, and exceptional service.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                    <button
                        onClick={onGetStarted}
                        className="px-8 py-4 bg-white text-purple-600 rounded-xl text-lg font-bold hover-lift shadow-2xl"
                    >
                        Get Started Free
                    </button>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-8 py-4 glass-dark rounded-xl text-lg font-bold hover-lift shadow-xl"
                    >
                        Browse Products
                    </button>
                </div>
            </div>
        </section>
    );
}
