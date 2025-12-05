import React from "react";
import { useNavigate } from "react-router-dom";

export default function LoginModal({ isOpen, onClose }) {
    const navigate = useNavigate();

    if (!isOpen) return null;

    const handleSignInClick = () => {
        onClose();
        navigate('/login');
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-md rounded-2xl p-8 relative animate-slide-in-top shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 text-2xl font-bold"
                >
                    ✕
                </button>

                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold gradient-text mb-2">Welcome Back!</h2>
                    <p className="text-neutral-600">Sign in to continue your shopping journey</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleSignInClick}
                        className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift shadow-xl"
                    >
                        Go to Sign In Page
                    </button>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-neutral-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-neutral-600">Quick Demo Access</span>
                        </div>
                    </div>

                    <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-xl">
                        <p className="text-sm text-purple-800 text-center">
                            <span className="font-bold">💡 Demo Tip:</span> Click "Go to Sign In Page" for full authentication features
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
