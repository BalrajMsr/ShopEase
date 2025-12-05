import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderById, clearCurrentOrder } from "../features/ordersSlice";
import Navbar from "../components/Navbar";

export default function OrderDetailsPage() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentOrder, status, error } = useSelector(state => state.orders);
    const { userInfo, profile } = useSelector(state => state.user);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
            return;
        }
        dispatch(fetchOrderById(id));

        return () => {
            dispatch(clearCurrentOrder());
        };
    }, [id, userInfo, dispatch, navigate]);

    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[80vh]">
                    <div className="spinner mb-4"></div>
                    <p className="text-neutral-600">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[80vh]">
                    <div className="text-4xl mb-4">⚠️</div>
                    <h2 className="text-2xl font-bold mb-2">Error Loading Order</h2>
                    <p className="text-neutral-600 mb-6">{error}</p>
                    <button onClick={() => {
                        if (userInfo?.user?.role === 'admin') {
                            navigate('/admin');
                        } else {
                            navigate('/orders');
                        }
                    }} className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-bold">
                        Back to Orders
                    </button>
                </div>
            </div>
        );
    }

    if (!currentOrder) return null;

    const { _id, createdAt, orderStatus, totalAmount, products, shippingAddress, paymentStatus } = currentOrder;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
            <Navbar />
            <div className="max-w-5xl mx-auto px-6 pt-24 pb-12">
                <button onClick={() => {
                    if (userInfo?.user?.role === 'admin') {
                        navigate('/admin');
                    } else {
                        navigate('/orders');
                    }
                }} className="mb-6 flex items-center gap-2 text-neutral-600 hover:text-primary-600 transition-colors font-semibold">
                    <span>←</span> Back to Orders
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8 animate-fade-in-up">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            Order <span className="gradient-text">#{_id.slice(-6)}</span>
                        </h1>
                        <p className="text-neutral-600">
                            Placed on {new Date(createdAt).toLocaleDateString()} at {new Date(createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                    <div className={`px-4 py-2 rounded-full font-bold text-sm border-2 ${orderStatus === 'delivered' ? 'bg-green-100 text-green-700 border-green-200' :
                        orderStatus === 'pending' ? 'bg-yellow-100 text-yellow-700 border-yellow-200' :
                            orderStatus === 'cancelled' ? 'bg-red-100 text-red-700 border-red-200' :
                                'bg-blue-100 text-blue-700 border-blue-200'
                        }`}>
                        {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Order Items */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="glass rounded-3xl p-8 animate-scale-in">
                            <h2 className="text-xl font-bold mb-6">Items Ordered</h2>
                            <div className="space-y-6">
                                {products.map((item, index) => (
                                    <div key={index} className="flex gap-4 items-center p-4 bg-white/50 rounded-xl">
                                        <div className="w-20 h-20 bg-neutral-100 rounded-lg overflow-hidden flex-shrink-0">
                                            {item.product?.images?.[0] ? (
                                                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg">{item.product?.name || 'Product Unavailable'}</h3>
                                            <p className="text-neutral-600">Qty: {item.quantity}</p>
                                        </div>
                                        <div className="font-bold text-lg">
                                            ₹{(item.product?.price || 0) * item.quantity}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Order Summary & Info */}
                    <div className="space-y-6">
                        <div className="glass rounded-3xl p-8 animate-scale-in" style={{ animationDelay: '0.1s' }}>
                            <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                            <div className="space-y-3 pb-6 border-b border-neutral-200">
                                <div className="flex justify-between text-neutral-600">
                                    <span>Subtotal</span>
                                    <span>₹{totalAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Shipping</span>
                                    <span>Free</span>
                                </div>
                                <div className="flex justify-between text-neutral-600">
                                    <span>Tax</span>
                                    <span>Included</span>
                                </div>
                            </div>
                            <div className="flex justify-between text-2xl font-bold mt-6">
                                <span>Total</span>
                                <span className="gradient-text">₹{totalAmount.toFixed(2)}</span>
                            </div>
                            <div className="mt-4 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold text-center border border-green-200">
                                Payment Status: {paymentStatus.toUpperCase()}
                            </div>
                        </div>

                        <div className="glass rounded-3xl p-8 animate-scale-in" style={{ animationDelay: '0.2s' }}>
                            <h2 className="text-xl font-bold mb-4">Shipping Details</h2>
                            <div className="flex items-start gap-3 text-neutral-600">
                                <span className="text-2xl">📍</span>
                                <p className="leading-relaxed">
                                    {shippingAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
