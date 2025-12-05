import React from "react";

export default function FeaturesSection({ features }) {
    return (
        <section id="features" className="py-20 px-6 bg-white/50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16 animate-fade-in-up">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Why Choose <span className="gradient-text">ShopEase</span>?
                    </h2>
                    <p className="text-xl text-neutral-600 max-w-2xl mx-auto">
                        We've built the ultimate shopping platform with features that matter most to you
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="card hover-lift group"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                            <p className="text-neutral-600 leading-relaxed">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
