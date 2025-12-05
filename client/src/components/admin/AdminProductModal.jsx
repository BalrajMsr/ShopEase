import React from "react";

export default function AdminProductModal({ show, type, product, onClose, onSave }) {
    const [formData, setFormData] = React.useState({
        name: '',
        description: '',
        price: '',
        category: '',
        stock: '',
        images: ['']
    });

    React.useEffect(() => {
        if (product && type === 'edit') {
            setFormData({
                name: product.name,
                description: product.description || '',
                price: product.price,
                category: product.category || '',
                stock: product.stock || 0,
                images: product.images || ['']
            });
        } else {
            setFormData({
                name: '',
                description: '',
                price: '',
                category: '',
                stock: '',
                images: ['']
            });
        }
    }, [product, type]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-2xl rounded-2xl p-8 relative animate-scale-in shadow-2xl max-h-[90vh] overflow-y-auto">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors text-neutral-600 text-2xl font-bold"
                >
                    ✕
                </button>

                <h2 className="text-3xl font-bold gradient-text mb-6">
                    {type === 'add' ? 'Add New Product' : 'Edit Product'}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-700">Product Name *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="Enter product name"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-700">Description</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            rows="3"
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors resize-none"
                            placeholder="Enter product description"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-semibold mb-2 text-neutral-700">Price (₹) *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                required
                                className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="0.00"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2 text-neutral-700">Stock Quantity *</label>
                            <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                required
                                className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                                placeholder="0"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-700">Category *</label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            required
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                        >
                            <option value="">Select Category</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Home & Living">Home & Living</option>
                            <option value="Sports">Sports</option>
                            <option value="Books">Books</option>
                            <option value="Beauty">Beauty</option>
                            <option value="Toys">Toys</option>
                            <option value="Food">Food & Beverages</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-2 text-neutral-700">Image URL</label>
                        <input
                            type="url"
                            value={formData.images[0]}
                            onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                            className="w-full p-4 border-2 border-neutral-200 rounded-xl focus:border-primary-500 focus:outline-none transition-colors"
                            placeholder="https://example.com/image.jpg"
                        />
                        <p className="text-xs text-neutral-500 mt-1">Enter a valid image URL</p>
                    </div>

                    <div className="flex gap-4 pt-6 border-t border-neutral-200">
                        <button
                            type="submit"
                            className="flex-1 py-4 bg-gradient-primary text-white rounded-xl font-bold text-lg hover-lift shadow-xl"
                        >
                            {type === 'add' ? '+ Add Product' : '💾 Save Changes'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 bg-white border-2 border-neutral-200 rounded-xl font-bold text-lg hover:bg-neutral-50 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
