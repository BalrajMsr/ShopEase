import React, { useState, useMemo } from "react";

export default function AdminProductsTable({ products, onEdit, onDelete }) {
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [stockFilter, setStockFilter] = useState('all'); // all, in-stock, low-stock, out-of-stock
    const [sortBy, setSortBy] = useState('name'); // name, price, stock

    // Get unique categories
    const categories = useMemo(() => {
        return ['all', ...new Set(products.map(p => p.category).filter(Boolean))];
    }, [products]);

    // Filter and sort products
    const filteredProducts = useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchQuery) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.category?.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        // Category filter
        if (categoryFilter !== 'all') {
            filtered = filtered.filter(p => p.category === categoryFilter);
        }

        // Stock filter
        if (stockFilter === 'low-stock') {
            filtered = filtered.filter(p => (p.stock || 0) > 0 && (p.stock || 0) < 10);
        } else if (stockFilter === 'out-of-stock') {
            filtered = filtered.filter(p => (p.stock || 0) === 0);
        } else if (stockFilter === 'in-stock') {
            filtered = filtered.filter(p => (p.stock || 0) >= 10);
        }

        // Sort
        filtered.sort((a, b) => {
            switch (sortBy) {
                case 'price-low':
                    return a.price - b.price;
                case 'price-high':
                    return b.price - a.price;
                case 'stock-low':
                    return (a.stock || 0) - (b.stock || 0);
                case 'stock-high':
                    return (b.stock || 0) - (a.stock || 0);
                case 'name':
                default:
                    return a.name.localeCompare(b.name);
            }
        });

        return filtered;
    }, [products, searchQuery, categoryFilter, stockFilter, sortBy]);

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
                            placeholder="Search products..."
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
                        <option value="name">Sort: Name (A-Z)</option>
                        <option value="price-low">Sort: Price (Low-High)</option>
                        <option value="price-high">Sort: Price (High-Low)</option>
                        <option value="stock-low">Sort: Stock (Low-High)</option>
                        <option value="stock-high">Sort: Stock (High-Low)</option>
                    </select>
                </div>

                {/* Category and Stock Filters */}
                <div className="flex flex-wrap gap-3">
                    {/* Category Filter */}
                    <div className="flex gap-2 flex-wrap">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategoryFilter(cat)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${categoryFilter === cat
                                        ? 'bg-gradient-primary text-white shadow-md'
                                        : 'bg-white border-2 border-neutral-200 hover:border-primary-300'
                                    }`}
                            >
                                {cat === 'all' ? 'All Categories' : cat}
                            </button>
                        ))}
                    </div>

                    {/* Stock Filter */}
                    <div className="flex gap-2 flex-wrap ml-auto">
                        {[
                            { value: 'all', label: 'All Stock', icon: '📦' },
                            { value: 'in-stock', label: 'In Stock', icon: '✅' },
                            { value: 'low-stock', label: 'Low Stock', icon: '⚠️' },
                            { value: 'out-of-stock', label: 'Out of Stock', icon: '❌' }
                        ].map(filter => (
                            <button
                                key={filter.value}
                                onClick={() => setStockFilter(filter.value)}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all ${stockFilter === filter.value
                                        ? 'bg-gradient-accent text-white shadow-md'
                                        : 'bg-white border-2 border-neutral-200 hover:border-accent-300'
                                    }`}
                            >
                                <span className="mr-1">{filter.icon}</span>
                                {filter.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results count */}
                <div className="text-sm text-neutral-600">
                    Showing <span className="font-bold text-neutral-800">{filteredProducts.length}</span> of {products.length} products
                </div>
            </div>

            {/* Table */}
            <div className="glass rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gradient-primary text-white">
                            <tr>
                                <th className="px-6 py-4 text-left">Product</th>
                                <th className="px-6 py-4 text-left">Category</th>
                                <th className="px-6 py-4 text-left">Price</th>
                                <th className="px-6 py-4 text-left">Stock</th>
                                <th className="px-6 py-4 text-left">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-neutral-600">
                                        No products found matching your filters
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product, index) => (
                                    <tr key={product._id} className={index % 2 === 0 ? 'bg-white/50' : 'bg-white/20'}>
                                        <td className="px-6 py-4 font-semibold">{product.name}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                                                {product.category || 'N/A'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 font-bold">₹{product.price}</td>
                                        <td className="px-6 py-4">
                                            <span className={`font-semibold ${(product.stock || 0) === 0 ? 'text-red-600' :
                                                    (product.stock || 0) < 10 ? 'text-orange-600' :
                                                        'text-green-600'
                                                }`}>
                                                {product.stock || 0}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${(product.stock || 0) === 0 ? 'bg-red-100 text-red-700' :
                                                    (product.stock || 0) < 10 ? 'bg-orange-100 text-orange-700' :
                                                        'bg-green-100 text-green-700'
                                                }`}>
                                                {(product.stock || 0) === 0 ? 'Out of Stock' :
                                                    (product.stock || 0) < 10 ? 'Low Stock' :
                                                        'In Stock'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => onEdit(product)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded-lg mr-2 hover:bg-blue-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => onDelete(product._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
