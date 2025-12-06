import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders, cancelOrder } from "../features/ordersSlice";
import Navbar from "../components/Navbar";
import { useAlert } from "../context/AlertContext";

export default function OrdersPage() {
    const user = useSelector(state => state.user.userInfo);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showAlert, showConfirm } = useAlert();

    // Get orders from Redux
    const { userOrders: orders, orderStatus: loading, error } = useSelector(state => state.orders);
    const [filter, setFilter] = useState('all'); // all, pending, delivered, cancelled

    const handleCancelOrder = async (orderId) => {
        const confirmed = await showConfirm(
            'Are you sure you want to cancel this order?',
            'Cancel Order'
        );

        if (confirmed) {
            try {
                await dispatch(cancelOrder(orderId)).unwrap();
                showAlert('Order cancelled successfully', 'success');
            } catch (err) {
                showAlert(`Failed to cancel order: ${err.message}`, 'error');
            }
        }
    };

    // Redirect if not logged in and fetch orders
    useEffect(() => {
        if (!user) {
            navigate('/login');
        } else {
            dispatch(fetchUserOrders());
        }
    }, [user, navigate, dispatch]);

    const getStatusColor = (orderStatus) => {
        switch (orderStatus) {
            case 'delivered': return 'bg-green-100 text-green-700 border-green-200';
            case 'pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'cancelled': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-neutral-100 text-neutral-700 border-neutral-200';
        }
    };

    const getStatusIcon = (orderStatus) => {
        switch (orderStatus) {
            case 'delivered': return '✓';
            case 'pending': return '⏳';
            case 'cancelled': return '✕';
            default: return '📦';
        }
    };

    console.log(orders);

    const filteredOrders = filter === 'all'
        ? orders
        : orders?.filter(order => order.orderStatus === filter);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-6 pt-24 pb-12">
                {/* Header */}
                <div className="mb-8 animate-fade-in-up">
                    <h1 className="text-4xl md:text-5xl font-bold mb-2">
                        My <span className="gradient-text">Orders</span>
                    </h1>
                    <p className="text-neutral-600 text-lg">Track and manage your orders</p>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {[
                        { value: 'all', label: 'All Orders', icon: '📦' },
                        { value: 'pending', label: 'Pending', icon: '⏳' },
                        { value: 'delivered', label: 'Delivered', icon: '✓' },
                        { value: 'cancelled', label: 'Cancelled', icon: '✕' }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setFilter(tab.value)}
                            className={`px-6 py-3 rounded-xl font-semibold transition-all ${filter === tab.value
                                ? 'bg-gradient-primary text-white shadow-lg'
                                : 'bg-white hover:bg-neutral-50'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Orders List */}
                {loading === 'loading' ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="spinner mb-4"></div>
                        <p className="text-neutral-600 text-lg">Loading your orders...</p>
                    </div>
                ) : filteredOrders?.length === 0 ? (
                    <div className="glass rounded-3xl p-12 text-center">
                        <div className="text-6xl mb-4">📦</div>
                        <h2 className="text-2xl font-bold mb-2">No Orders Found</h2>
                        <p className="text-neutral-600 mb-6">
                            {filter === 'all'
                                ? "You haven't placed any orders yet"
                                : `No ${filter} orders found`}
                        </p>
                        <button
                            onClick={() => navigate('/home')}
                            className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                        >
                            Start Shopping
                        </button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {filteredOrders?.map((order, index) => (
                            <div
                                key={order._id}
                                className="glass rounded-2xl p-6 hover-lift animate-scale-in"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                {/* Order Header */}
                                <div className="flex flex-wrap justify-between items-start gap-4 mb-6 pb-6 border-b border-neutral-200">
                                    <div>
                                        <h3 className="text-xl font-bold mb-2">Order #{order._id?.slice(-8) || order._id}</h3>
                                        <p className="text-neutral-600">
                                            Placed on {new Date(order.createdAt || order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <div className={`inline-block px-4 py-2 rounded-full border-2 font-semibold ${getStatusColor(order.orderStatus)}`}>
                                            <span className="mr-2">{getStatusIcon(order.orderStatus)}</span>
                                            {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                                        </div>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="space-y-3 mb-6">
                                    {(order.products || []).map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center p-3 bg-white/50 rounded-xl">
                                            <div>
                                                <div className="font-semibold">{item.product?.name || item.name || 'Product'}</div>
                                                <div className="text-sm text-neutral-600">Quantity: {item.quantity}</div>
                                            </div>
                                            <div className="font-bold">₹{(item.price || item.product?.price || 0).toFixed(2)}</div>
                                        </div>
                                    ))}
                                </div>

                                {/* Order Footer */}
                                <div className="flex flex-wrap justify-between items-center gap-4 pt-6 border-t border-neutral-200">
                                    <div>
                                        <div className="text-sm text-neutral-600">Total Amount</div>
                                        <div className="text-2xl font-bold gradient-text">₹{(order.totalAmount || order.total || 0).toFixed(2)}</div>
                                    </div>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => navigate(`/orders/${order._id}`)}
                                            className="p-3 bg-white border-2 border-neutral-200 rounded-xl font-semibold hover:bg-neutral-50 transition-colors text-blue-600"
                                            title="View Details"
                                        >
                                            📄
                                        </button>
                                        {order.orderStatus === 'delivered' && (
                                            <button className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md">
                                                Reorder
                                            </button>
                                        )}
                                        {order.orderStatus === 'pending' && (
                                            <button
                                                onClick={() => handleCancelOrder(order._id)}
                                                className="px-6 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Order Stats */}
                {!loading && orders.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                        <div className="card text-center">
                            <div className="text-4xl mb-2">📦</div>
                            <div className="text-3xl font-bold gradient-text">{orders.length}</div>
                            <div className="text-neutral-600 mt-1">Total Orders</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-2">✓</div>
                            <div className="text-3xl font-bold gradient-text">
                                {orders.filter(o => o.orderStatus === 'delivered').length}
                            </div>
                            <div className="text-neutral-600 mt-1">Delivered</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-2">💰</div>
                            <div className="text-3xl font-bold gradient-text">
                                ₹{orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0).toFixed(2)}
                            </div>
                            <div className="text-neutral-600 mt-1">Total Spent</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
