import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, updatePassword, deleteAccount } from "../features/userSlice";
import Navbar from "../components/Navbar";

export default function SettingsPage() {
    const user = useSelector(state => state.user.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [settings, setSettings] = useState({
        emailNotifications: true,
        smsNotifications: false,
        orderUpdates: true,
        promotionalEmails: true,
        newsletter: false,
        twoFactorAuth: false,
        savePaymentMethods: true,
        darkMode: false
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    // Redirect if not logged in
    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    const handleToggle = (setting) => {
        setSettings({ ...settings, [setting]: !settings[setting] });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert("New passwords don't match!");
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        try {
            await dispatch(updatePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            })).unwrap();
            alert("Password changed successfully!");
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            alert(err || "Failed to update password");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            try {
                await dispatch(deleteAccount()).unwrap();
                navigate('/');
                alert("Account deleted successfully");
            } catch (err) {
                alert(err || "Failed to delete account");
            }
        }
    };

    if (!user) return null;

    const ToggleSwitch = ({ enabled, onToggle }) => (
        <button
            onClick={onToggle}
            className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${enabled ? 'bg-gradient-primary' : 'bg-neutral-300'
                }`}
        >
            <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
            />
        </button>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
            <Navbar />

            <div className="max-w-4xl mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        <span className="gradient-text">Settings</span>
                    </h1>
                    <p className="text-neutral-600 text-lg">Manage your account preferences</p>
                </div>

                {/* Notifications Settings */}
                <div className="glass rounded-3xl p-8 shadow-2xl mb-6 animate-scale-in">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-3xl">🔔</span>
                        Notifications
                    </h2>

                    <div className="space-y-4">
                        {[
                            { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                            { key: 'smsNotifications', label: 'SMS Notifications', desc: 'Receive notifications via SMS' },
                            { key: 'orderUpdates', label: 'Order Updates', desc: 'Get updates about your orders' },
                            { key: 'promotionalEmails', label: 'Promotional Emails', desc: 'Receive special offers and deals' },
                            { key: 'newsletter', label: 'Newsletter', desc: 'Subscribe to our weekly newsletter' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                                <div>
                                    <div className="font-semibold">{item.label}</div>
                                    <div className="text-sm text-neutral-600">{item.desc}</div>
                                </div>
                                <ToggleSwitch
                                    enabled={settings[item.key]}
                                    onToggle={() => handleToggle(item.key)}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security Settings */}
                <div className="glass rounded-3xl p-8 shadow-2xl mb-6 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-3xl">🔒</span>
                        Security
                    </h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                            <div>
                                <div className="font-semibold">Two-Factor Authentication</div>
                                <div className="text-sm text-neutral-600">Add an extra layer of security</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.twoFactorAuth}
                                onToggle={() => handleToggle('twoFactorAuth')}
                            />
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                            <div>
                                <div className="font-semibold">Save Payment Methods</div>
                                <div className="text-sm text-neutral-600">Securely save cards for faster checkout</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.savePaymentMethods}
                                onToggle={() => handleToggle('savePaymentMethods')}
                            />
                        </div>
                    </div>

                    {/* Change Password */}
                    <div className="border-t border-neutral-200 pt-6">
                        <h3 className="text-lg font-bold mb-4">Change Password</h3>
                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-neutral-700">Current Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-neutral-700">New Password</label>
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-neutral-700">Confirm New Password</label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    required
                                    className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift shadow-xl"
                            >
                                Update Password
                            </button>
                        </form>
                    </div>
                </div>

                {/* Preferences */}
                <div className="glass rounded-3xl p-8 shadow-2xl mb-6 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
                        <span className="text-3xl">⚙️</span>
                        Preferences
                    </h2>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white/50 rounded-xl">
                            <div>
                                <div className="font-semibold">Dark Mode</div>
                                <div className="text-sm text-neutral-600">Switch to dark theme (Coming soon)</div>
                            </div>
                            <ToggleSwitch
                                enabled={settings.darkMode}
                                onToggle={() => handleToggle('darkMode')}
                            />
                        </div>
                    </div>
                </div>

                {/* Danger Zone */}
                <div className="glass rounded-3xl p-8 shadow-2xl border-2 border-red-200 animate-scale-in" style={{ animationDelay: '0.3s' }}>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-red-600">
                        <span className="text-3xl">⚠️</span>
                        Danger Zone
                    </h2>

                    <div className="p-4 bg-red-50 rounded-xl border-2 border-red-200 mb-4">
                        <div className="font-semibold text-red-800 mb-2">Delete Account</div>
                        <div className="text-sm text-red-700 mb-4">
                            Once you delete your account, there is no going back. Please be certain.
                        </div>
                        <button
                            onClick={handleDeleteAccount}
                            className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                        >
                            Delete My Account
                        </button>
                    </div>
                </div>

                {/* Save Button */}
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={() => alert("Settings saved successfully!")}
                        className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                    >
                        Save All Settings
                    </button>
                </div>
            </div>
        </div>
    );
}
