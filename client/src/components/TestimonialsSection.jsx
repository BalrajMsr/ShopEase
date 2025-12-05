import React from "react";

export default function TestimonialsSection({ testimonials }) {
    return (
        <section id="testimonials" className="py-20 px-6 bg-gradient-dark text-white">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        What Our <span className="text-cyan-400">Customers Say</span>
                    </h2>
                    <p className="text-xl text-neutral-300">Join thousands of satisfied shoppers</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial, index) => (
                        <div
                            key={index}
                            className="glass-dark p-8 rounded-2xl hover-lift"
                        >
                            <div className="flex gap-1 mb-4">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <span key={i} className="text-yellow-400 text-xl">★</span>
                                ))}
                            </div>
                            <p className="text-lg mb-6 leading-relaxed">"{testimonial.content}"</p>
                            <div>
                                <div className="font-bold text-lg">{testimonial.name}</div>
                                <div className="text-neutral-400 text-sm">{testimonial.role}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
