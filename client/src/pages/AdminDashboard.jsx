import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

// Redux actions
import { fetchProducts, addProduct, updateProduct, deleteProduct } from "../features/productsSlice";
import { fetchAllOrders, updateOrderStatus, fetchAllUsers } from "../features/adminSlice";

// Admin Components
import AdminMetrics from "../components/admin/AdminMetrics";
import AdminProductsTable from "../components/admin/AdminProductsTable";
import AdminOrdersTable from "../components/admin/AdminOrdersTable";
import AdminProductModal from "../components/admin/AdminProductModal";

import { useAlert } from "../context/AlertContext";

export default function AdminDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { showAlert } = useAlert();

  // Redux state
  const user = useSelector(s => s.user.userInfo);
  const { items: products, status: productsStatus } = useSelector(s => s.products);
  const { orders, users, ordersStatus, usersStatus } = useSelector(s => s.admin);

  // Local state
  const [activeTab, setActiveTab] = useState('overview');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Check if user is admin and fetch data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user?.user?.role !== 'admin') {
      showAlert('Access Denied: Admin privileges required', 'error');
      navigate('/');
      return;
    }

    // Fetch all data
    dispatch(fetchProducts());
    dispatch(fetchAllOrders());
    dispatch(fetchAllUsers());
  }, [user, navigate, dispatch]);

  // Calculate comprehensive stats
  const stats = {
    totalProducts: products.length,
    totalOrders: orders.length,
    totalUsers: users.length,
    totalRevenue: orders.reduce((sum, o) => sum + (o.totalAmount || o.total || 0), 0),
    pendingOrders: orders.filter(o => (o.orderStatus || o.status) === 'pending').length,
    completedOrders: orders.filter(o => (o.orderStatus || o.status) === 'delivered').length,
    lowStock: products.filter(p => (p.stock || 0) < 10 && (p.stock || 0) > 0).length,
    conversionRate: users.length > 0 ? ((orders.length / users.length) * 100).toFixed(1) : 0
  };

  // Product CRUD handlers
  const handleAddProduct = () => {
    setModalType('add');
    setSelectedProduct(null);
    setShowModal(true);
  };

  const handleEditProduct = (product) => {
    setModalType('edit');
    setSelectedProduct(product);
    setShowModal(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await dispatch(deleteProduct(productId)).unwrap();
      showAlert('Product deleted successfully!', 'success');
    } catch (error) {
      showAlert(`Delete failed: ${error.message || 'Please try again'}`, 'error');
    }
  };

  const handleSaveProduct = async (formData) => {
    try {
      if (modalType === 'add') {
        await dispatch(addProduct(formData)).unwrap();
        showAlert('Product added successfully!', 'success');
      } else {
        await dispatch(updateProduct({ id: selectedProduct._id, data: formData })).unwrap();
        showAlert('Product updated successfully!', 'success');
      }
      setShowModal(false);
    } catch (error) {
      showAlert(`Save failed: ${error.message || 'Please try again'}`, 'error');
    }
  };

  const handleUpdateOrderStatus = async (orderId, updates) => {
    try {
      await dispatch(updateOrderStatus({ orderId, ...updates })).unwrap();
      // Success feedback is handled by the component
    } catch (error) {
      showAlert(`Update failed: ${error.message || 'Please try again'}`, 'error');
    }
  };

  if (!user || user?.user?.role !== 'admin') return null;

  const loading = productsStatus === 'loading' || ordersStatus === 'loading' || usersStatus === 'loading';

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-purple-50 to-cyan-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-24 pb-12">
        {/* Header */}
        <div className="mb-8 animate-fade-in-up">
          <h1 className="text-4xl md:text-5xl font-bold mb-2">
            <span className="gradient-text">Admin Dashboard</span>
          </h1>
          <p className="text-neutral-600 text-lg">Manage your e-commerce platform with powerful insights</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { value: 'overview', label: 'Overview', icon: '📊' },
            { value: 'products', label: 'Products', icon: '📦', count: products.length },
            { value: 'orders', label: 'Orders', icon: '🛒', count: orders.length },
            { value: 'users', label: 'Users', icon: '👥', count: users.length }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`px-6 py-3 rounded-xl font-semibold transition-all cursor-pointer ${activeTab === tab.value
                ? 'bg-gradient-primary text-white shadow-lg'
                : 'glass hover:bg-white/50'
                }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
              {tab.count !== undefined && (
                <span className="ml-2 px-2 py-0.5 bg-white/20 rounded-full text-xs">
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="spinner mb-4"></div>
            <p className="text-neutral-600 text-lg">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* Metrics */}
                <AdminMetrics stats={stats} />

                {/* Recent Activity */}
                <div className="glass rounded-2xl p-6 animate-fade-in-up">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Recent Orders</h2>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="px-4 py-2 bg-gradient-primary text-white rounded-lg font-semibold hover-lift"
                    >
                      View All →
                    </button>
                  </div>
                  {orders.length === 0 ? (
                    <p className="text-neutral-600 text-center py-8">No orders yet</p>
                  ) : (
                    <div className="space-y-3">
                      {orders.slice(0, 5).map(order => (
                        <div key={order._id} className="flex justify-between items-center p-4 bg-white/50 rounded-xl hover:bg-white/70 transition-colors">
                          <div>
                            <div className="font-semibold">{order.customer || order.user?.name || 'Customer'}</div>
                            <div className="text-sm text-neutral-600">
                              {order.products?.length || order.items || 0} items • {new Date(order.createdAt || order.date).toLocaleDateString()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-bold text-lg">₹{(order.totalAmount || order.total || 0).toFixed(2)}</div>
                            <div className={`text-xs px-3 py-1 rounded-full inline-block ${(order.orderStatus || order.status) === 'delivered' ? 'bg-green-100 text-green-700' :
                              (order.orderStatus || order.status) === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                              {order.orderStatus || order.status}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Top Categories</h3>
                    <div className="space-y-3">
                      {Object.entries(
                        products.reduce((acc, p) => {
                          const cat = p.category || 'Uncategorized';
                          acc[cat] = (acc[cat] || 0) + 1;
                          return acc;
                        }, {})
                      )
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 5)
                        .map(([category, count]) => (
                          <div key={category} className="flex justify-between items-center">
                            <span className="font-semibold">{category}</span>
                            <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-bold">
                              {count} products
                            </span>
                          </div>
                        ))}
                    </div>
                  </div>

                  <div className="glass rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4">Order Status Breakdown</h3>
                    <div className="space-y-3">
                      {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => {
                        const count = orders.filter(o => (o.orderStatus || o.status) === status).length;
                        const percentage = orders.length > 0 ? ((count / orders.length) * 100).toFixed(1) : 0;
                        return (
                          <div key={status} className="space-y-1">
                            <div className="flex justify-between items-center">
                              <span className="font-semibold capitalize">{status}</span>
                              <span className="text-sm text-neutral-600">{count} ({percentage}%)</span>
                            </div>
                            <div className="w-full bg-neutral-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${status === 'delivered' ? 'bg-green-500' :
                                  status === 'pending' ? 'bg-yellow-500' :
                                    status === 'cancelled' ? 'bg-red-500' :
                                      'bg-blue-500'
                                  }`}
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Products Tab */}
            {activeTab === 'products' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Product Management</h2>
                  <button
                    onClick={handleAddProduct}
                    className="px-6 py-3 bg-gradient-primary text-white rounded-xl font-semibold hover-lift shadow-md"
                  >
                    + Add Product
                  </button>
                </div>

                {products.length === 0 ? (
                  <div className="glass rounded-3xl p-12 text-center">
                    <div className="text-6xl mb-4">📦</div>
                    <h2 className="text-2xl font-bold mb-2">No Products Yet</h2>
                    <p className="text-neutral-600 mb-6">Add your first product to get started</p>
                    <button
                      onClick={handleAddProduct}
                      className="px-8 py-4 bg-gradient-primary text-white rounded-xl text-lg font-bold hover-lift shadow-xl"
                    >
                      + Add Product
                    </button>
                  </div>
                ) : (
                  <AdminProductsTable
                    products={products}
                    onEdit={handleEditProduct}
                    onDelete={handleDeleteProduct}
                  />
                )}
              </div>
            )}

            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">Order Management</h2>
                {orders.length === 0 ? (
                  <div className="glass rounded-3xl p-12 text-center">
                    <div className="text-6xl mb-4">🛒</div>
                    <h2 className="text-2xl font-bold mb-2">No Orders Yet</h2>
                    <p className="text-neutral-600">Orders will appear here once customers start purchasing</p>
                  </div>
                ) : (
                  <AdminOrdersTable
                    orders={orders}
                    onUpdateStatus={handleUpdateOrderStatus}
                  />
                )}
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-bold mb-6">User Management</h2>
                {users.length === 0 ? (
                  <div className="glass rounded-3xl p-12 text-center">
                    <div className="text-6xl mb-4">👥</div>
                    <h2 className="text-2xl font-bold mb-2">No Users Yet</h2>
                    <p className="text-neutral-600">Users will appear here once they register</p>
                  </div>
                ) : (
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gradient-primary text-white">
                          <tr>
                            <th className="px-6 py-4 text-left">Name</th>
                            <th className="px-6 py-4 text-left">Email</th>
                            <th className="px-6 py-4 text-left">Role</th>
                            <th className="px-6 py-4 text-left">Joined</th>
                          </tr>
                        </thead>
                        <tbody>
                          {users.map((user, index) => (
                            <tr key={user._id} className={index % 2 === 0 ? 'bg-white/50' : 'bg-white/20'}>
                              <td className="px-6 py-4 font-semibold">{user.name}</td>
                              <td className="px-6 py-4">{user.email}</td>
                              <td className="px-6 py-4">
                                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                                  }`}>
                                  {user.role}
                                </span>
                              </td>
                              <td className="px-6 py-4">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Product Modal */}
      <AdminProductModal
        show={showModal}
        type={modalType}
        product={selectedProduct}
        onClose={() => setShowModal(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}