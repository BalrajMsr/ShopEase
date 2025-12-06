import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function AdminOrdersTable({ orders, onUpdateStatus }) {

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
    const [sortBy, setSortBy] = useState('date-new'); // date-new, date-old, amount-high, amount-low

    // Filter and sort orders
    const filteredOrders = useMemo(() => {
        let filtered = [...orders];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(o =>
                o._id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (o.customer || o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Status filter
        if (statusFilter !== 'all') {
            filtered = filtered.filter(o => (o.orderStatus || o.status) === statusFilter);
        }

        // Date filter
        const now = new Date();
        if (dateFilter === 'today') {
            filtered = filtered.filter(o => {
                const orderDate = new Date(o.createdAt || o.date);
                return orderDate.toDateString() === now.toDateString();
            });
        } else if (dateFilter === 'week') {
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(o => new Date(o.createdAt || o.date) >= weekAgo);
        } else if (dateFilter === 'month') {
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            filtered = filtered.filter(o => new Date(o.createdAt || o.date) >= monthAgo);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'date-new':
                    return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
                case 'date-old':
                    return new Date(a.createdAt || a.date) - new Date(b.createdAt || b.date);
                case 'amount-high':
                    return (b.totalAmount || b.total || 0) - (a.totalAmount || a.total || 0);
                case 'amount-low':
                    return (a.totalAmount || a.total || 0) - (b.totalAmount || b.total || 0);
                default:
                    return 0;
            }
        });

        return filtered;
    }, [orders, searchQuery, statusFilter, dateFilter, sortBy]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'delivered':
                return 'bg-green-100 text-green-700';
            case 'pending':
                return 'bg-yellow-100 text-yellow-700';
            case 'processing':
                return 'bg-blue-100 text-blue-700';
            case 'shipped':
                return 'bg-purple-100 text-purple-700';
            case 'cancelled':
                return 'bg-red-100 text-red-700';
            default:
                return 'bg-neutral-100 text-neutral-700';
        }
    };

    const statusOptions = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'pending', label: 'Pending', count: orders.filter(o => (o.orderStatus || o.status) === 'pending').length },
        { value: 'processing', label: 'Processing', count: orders.filter(o => (o.orderStatus || o.status) === 'processing').length },
        { value: 'shipped', label: 'Shipped', count: orders.filter(o => (o.orderStatus || o.status) === 'shipped').length },
        { value: 'delivered', label: 'Delivered', count: orders.filter(o => (o.orderStatus || o.status) === 'delivered').length },
        { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => (o.orderStatus || o.status) === 'cancelled').length }
    ];

    const handleViewOrder = (orderId) => {
        navigate(`orders/${orderId}`);
    };

    return (
        <div>
            {/* Filters */}
            <div className="mb-6 space-y-4">
                {/* Search and Sort */}
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Search by order ID or customer..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full p-3 pl-10 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">🔍</span>
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="p-3 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors cursor-pointer"
                    >
                        <option value="date-new">Sort: Newest First</option>
                        <option value="date-old">Sort: Oldest First</option>
                        <option value="amount-high">Sort: Amount (High-Low)</option>
                        <option value="amount-low">Sort: Amount (Low-High)</option>
                    </select>
                </div>

                {/* Status Filter Tabs */}
                <div className="flex flex-wrap gap-2">
                    {statusOptions.map(status => (
                        <button
                            key={status.value}
                            onClick={() => setStatusFilter(status.value)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${statusFilter === status.value
                                ? 'bg-gradient-primary text-white shadow-md'
                                : 'bg-white border-2 border-neutral-200 hover:border-primary-300'
                                }`}
                        >
                            {status.label}
                            <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                                {status.count}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Date Filter */}
                <div className="flex gap-2">
                    {[
                        { value: 'all', label: 'All Time' },
                        { value: 'today', label: 'Today' },
                        { value: 'week', label: 'Last 7 Days' },
                        { value: 'month', label: 'Last 30 Days' }
                    ].map(filter => (
                        <button
                            key={filter.value}
                            onClick={() => setDateFilter(filter.value)}
                            className={`px-4 py-2 rounded-lg font-semibold transition-all ${dateFilter === filter.value
                                ? 'bg-gradient-accent text-white shadow-md'
                                : 'bg-white border-2 border-neutral-200 hover:border-accent-300'
                                }`}
                        >
                            {filter.label}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <div className="text-sm text-neutral-600">
                    Showing <span className="font-bold text-neutral-800">{filteredOrders.length}</span> of {orders.length} orders
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-primary text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">Order ID</th>
                                <th className="px-6 py-4 text-left">Customer</th>
                                <th className="px-6 py-4 text-left">Date</th>
                                <th className="px-6 py-4 text-left">Items</th>
                                <th className="px-6 py-4 text-left">Total</th>
                                <th className="px-6 py-4 text-left">Order Status</th>
                                <th className="px-6 py-4 text-left">Payment Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.length === 0 ? (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-neutral-600">
                                        No orders found matching your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredOrders.map((order, index) => (
                                    <tr key={order._id} className={index % 2 === 0 ? 'bg-white/50' : 'bg-white/20'}>
                                        <td className="px-6 py-4 font-mono text-sm">#{order._id.slice(-6)}</td>
                                        <td className="px-6 py-4 font-semibold">{order.customer || order.user?.name || 'Customer'}</td>
                                        <td className="px-6 py-4">{new Date(order.createdAt || order.date).toLocaleDateString()}</td>
                                        <td className="px-6 py-4">{order.products?.length || order.items || 0}</td>
                                        <td className="px-6 py-4 font-bold">₹{(order.totalAmount || order.total || 0).toFixed(2)}</td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.orderStatus || order.status}
                                                onChange={(e) => onUpdateStatus(order._id, { orderStatus: e.target.value })}
                                                className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${getStatusColor(order.orderStatus || order.status)}`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="processing">Processing</option>
                                                <option value="shipped">Shipped</option>
                                                <option value="delivered">Delivered</option>
                                                <option value="cancelled">Cancelled</option>
                                            </select>
                                        </td>
                                        <td className="px-6 py-4">
                                            <select
                                                value={order.paymentStatus || 'pending'}
                                                onChange={(e) => onUpdateStatus(order._id, { paymentStatus: e.target.value })}
                                                className={`px-3 py-1 rounded-full text-sm font-semibold cursor-pointer ${(order.paymentStatus === 'paid') ? 'bg-green-100 text-green-700' :
                                                    order.paymentStatus === 'failed' ? 'bg-red-100 text-red-700' :
                                                        order.paymentStatus === 'refunded' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-yellow-100 text-yellow-700'
                                                    }`}
                                            >
                                                <option value="pending">Pending</option>
                                                <option value="paid">Paid</option>
                                                <option value="failed">Failed</option>
                                                <option value="refunded">Refunded</option>
                                            </select>
                                        </td>

                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleViewOrder(order._id)}
                                                className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors"
                                                title="View Order Details"
                                            >
                                                📄
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div >
        </div >
    );
}
