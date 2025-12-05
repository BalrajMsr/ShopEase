import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserProfile, updateUserProfile } from "../features/userSlice";
import Navbar from "../components/Navbar";

export default function ProfilePage() {
    const { userInfo, profile, status } = useSelector(state => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: ""
    });

    // Redirect if not logged in and fetch profile
    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            dispatch(getUserProfile());
        }
    }, [userInfo, navigate, dispatch]);

    // Update form data when profile is loaded
    useEffect(() => {
        if (profile || userInfo?.user) {
            const data = profile || userInfo?.user;
            setFormData({
                name: data.name || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                address: data.address || "",
                city: data.city || "",
                state: data.state || "",
                zipCode: data.zipCode || ""
            });
        }
    }, [profile, userInfo]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        try {
            await dispatch(updateUserProfile(formData)).unwrap();
            setIsEditing(false);
            alert("Profile updated successfully!");
        } catch (error) {
            alert(`Update failed: ${error.message || 'Please try again'}`);
        }
    };

    const handleCancel = () => {
        const data = profile || userInfo?.user;
        setFormData({
            name: data?.name || "",
            email: data?.email || "",
            phoneNumber: data?.phoneNumber || "",
            address: data?.address || "",
            city: data?.city || "",
            state: data?.state || "",
            zipCode: data?.zipCode || ""
        });
        setIsEditing(false);
    };

    if (!userInfo) return null;

    const getInitials = (name) => {
        if (!name) return "U";
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        My <span className="gradient-text">Profile</span>
                    </h1>
                    <p className="text-neutral-600 text-lg">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl animate-scale-in">
                    {/* Avatar Section */}
                    <div className="flex flex-col md:flex-row items-center gap-6 mb-8 pb-8 border-b border-neutral-200">
                        <div className="w-24 h-24 bg-gradient-primary rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-xl">
                            {getInitials(formData.name || userInfo?.email)}
                        </div>
                        <div className="text-center md:text-left flex-1">
                            <h2 className="text-2xl font-bold mb-1">{formData.name || 'User'}</h2>
                            <p className="text-neutral-600">{formData.email}</p>
                            <div className="mt-3 flex flex-wrap gap-2 justify-center md:justify-start">
                                <span className="px-3 py-1 bg-gradient-accent text-white text-xs font-semibold rounded-full">
                                    Member since {new Date(profile?.createdAt || Date.now()).toLocaleDateString()}
                                </span>
                                {profile?.emailVerified && <span className="px-3 py-1 bg-gradient-warm text-white text-xs font-semibold rounded-full">
                                    Verified Account
                                </span>}
                            </div>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Profile Information */}
                    {status === 'loading' ? (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="spinner mb-4"></div>
                            <p className="text-neutral-600">Loading profile details...</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-xl font-bold mb-4">Personal Information</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Full Name */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Full Name</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.name || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Email Address</label>
                                    <div className="p-4 bg-neutral-100 rounded-xl border-2 border-neutral-200 text-neutral-500">
                                        {formData.email} <span className="text-xs">(Cannot be changed)</span>
                                    </div>
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Phone Number</label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={formData.phoneNumber}
                                            onChange={handleChange}
                                            placeholder="+91 98765 43210"
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.phoneNumber || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">Street Address</label>
                                    {isEditing ? (
                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            rows="2"
                                            placeholder="123 Main Street, Apartment 4B"
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.address || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* City */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">City</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleChange}
                                            placeholder="Mumbai"
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.city || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* State */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">State</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="state"
                                            value={formData.state}
                                            onChange={handleChange}
                                            placeholder="Maharashtra"
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.state || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* ZIP Code */}
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-neutral-700">ZIP Code</label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={formData.zipCode}
                                            onChange={handleChange}
                                            placeholder="400001"
                                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                        />
                                    ) : (
                                        <div className="p-4 bg-white rounded-xl border-2 border-neutral-100">
                                            {formData.zipCode || 'Not provided'}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-4 pt-6 border-t border-neutral-200">
                                    <button
                                        onClick={handleSave}
                                        className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift shadow-xl"
                                    >
                                        Save Changes
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex-1 py-4 bg-white border-2 border-neutral-200 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Account Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                    <div className="card text-center">
                        <div className="text-4xl mb-2">📦</div>
                        <div className="text-3xl font-bold gradient-text">0</div>
                        <div className="text-neutral-600 mt-1">Total Orders</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-2">❤️</div>
                        <div className="text-3xl font-bold gradient-text">0</div>
                        <div className="text-neutral-600 mt-1">Wishlist Items</div>
                    </div>
                    <div className="card text-center">
                        <div className="text-4xl mb-2">⭐</div>
                        <div className="text-3xl font-bold gradient-text">0</div>
                        <div className="text-neutral-600 mt-1">Reviews Written</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
