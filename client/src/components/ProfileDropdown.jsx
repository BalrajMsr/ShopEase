import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../features/userSlice";

export default function ProfileDropdown({ user }) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        setIsOpen(false);
        navigate('/');
    };

    const menuItems = [
        { icon: "👤", label: "My Profile", action: () => navigate('/profile') },
        { icon: "📦", label: "My Orders", action: () => navigate('/orders') },
        { icon: "❤️", label: "Wishlist", action: () => navigate('/wishlist') },
        { icon: "⚙️", label: "Settings", action: () => navigate('/settings') },
        { icon: "🚪", label: "Logout", action: handleLogout, danger: true }
    ];

    // Get user initials for avatar
    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Profile Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-4 py-2 rounded-xl hover:bg-white/50 transition-all group"
            >
                {/* Avatar */}
                <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md group-hover:scale-110 transition-transform">
                    {getInitials(user?.name || user?.email)}
                </div>

                {/* User Name (hidden on mobile) */}
                <div className="hidden md:block text-left">
                    <div className="font-semibold text-sm leading-tight">
                        {user?.name || user?.email?.split('@')[0] || 'User'}
                    </div>
                    <div className="text-xs text-neutral-600">View Profile</div>
                </div>

                {/* Dropdown Arrow */}
                <svg
                    className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-64 glass rounded-2xl shadow-2xl overflow-hidden animate-scale-in z-50 !bg-[rgba(255,255,255,1)]">
                    {/* User Info Header */}
                    <div className="p-4 bg-gradient-primary text-white">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-white font-bold">
                                {getInitials(user?.name || user?.email)}
                            </div>
                            <div>
                                <div className="font-bold">{user?.name || 'User'}</div>
                                <div className="text-sm opacity-90">{user?.email || 'user@example.com'}</div>
                            </div>
                        </div>
                    </div>

                    {/* Menu Items */}
                    <div className="p-2">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => {
                                    item.action();
                                    setIsOpen(false);
                                }}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer ${item.danger
                                    ? 'hover:bg-red-50 text-red-600'
                                    : 'hover:bg-gray-200'
                                    }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
