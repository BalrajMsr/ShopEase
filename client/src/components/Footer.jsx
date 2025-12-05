import React from "react";

export default function Footer() {
    return (
        <footer className="py-12 px-6 bg-neutral-900 text-white">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <h3 className="text-2xl font-bold gradient-text mb-4">ShopEase</h3>
                        <p className="text-neutral-400">Your modern e-commerce destination for premium products and exceptional service.</p>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                            <li><a href="#products" className="hover:text-white transition-colors">Products</a></li>
                            <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Support</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">FAQ</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="font-bold mb-4">Legal</h4>
                        <ul className="space-y-2 text-neutral-400">
                            <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-neutral-800 pt-8 text-center text-neutral-400">
                    <p>© {new Date().getFullYear()} ShopEase. All Rights Reserved. Built with ❤️ Balraj M</p>
                </div>
            </div>
        </footer>
    );
}
