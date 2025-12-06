import api from "./axios";

// Helper function to get auth headers
const getAuthHeaders = (token) => ({
    headers: { Authorization: `Bearer ${token}` }
});

// ============================================
// AUTH API
// ============================================
export const authAPI = {
    login: async (credentials) => {
        const response = await api.post("/auth/login", credentials);
        return response.data;
    },

    register: async (userData) => {
        const response = await api.post("/auth/register", userData);
        return response.data;
    }
};

// ============================================
// PRODUCTS API
// ============================================
export const productsAPI = {
    getAll: async (query = "") => {
        const response = await api.get(`/products?q=${query}`);
        return response.data;
    },

    getById: async (id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },

    getByCategory: async (category) => {
        const response = await api.get(`/products?category=${category}`);
        return response.data;
    },

    create: async (productData, token) => {
        const response = await api.post("/products", productData, getAuthHeaders(token));
        return response.data;
    },

    update: async (id, productData, token) => {
        const response = await api.put(`/products/${id}`, productData, getAuthHeaders(token));
        return response.data;
    },

    delete: async (id, token) => {
        const response = await api.delete(`/products/${id}`, getAuthHeaders(token));
        return response.data;
    }
};

// ============================================
// ORDERS API
// ============================================
export const ordersAPI = {
    create: async (orderData, token) => {
        const response = await api.post("/orders", orderData, getAuthHeaders(token));
        return response.data;
    },

    getUserOrders: async (token) => {
        const response = await api.get("/orders/myorders", getAuthHeaders(token));
        return response.data;
    },

    getAll: async (token) => {
        const response = await api.get("/orders", getAuthHeaders(token));
        return response.data;
    },

    getById: async (id, token) => {
        const response = await api.get(`/orders/${id}`, getAuthHeaders(token));
        return response.data;
    },

    updateStatus: async (id, statusData, token) => {
        const response = await api.patch(`/orders/${id}`, statusData, getAuthHeaders(token));
        return response.data;
    },

    cancel: async (id, token) => {
        const response = await api.patch(`/orders/${id}/cancel`, {}, getAuthHeaders(token));
        return response.data;
    }
};

// ============================================
// CART API
// ============================================
export const cartAPI = {
    get: async (token) => {
        const response = await api.get("/cart", getAuthHeaders(token));
        return response.data;
    },

    add: async (productId, quantity, token) => {
        const response = await api.post("/cart/add", { productId, quantity }, getAuthHeaders(token));
        return response.data;
    },

    remove: async (productId, token) => {
        const response = await api.post("/cart/remove", { productId }, getAuthHeaders(token));
        return response.data;
    },

    clear: async (token) => {
        const response = await api.post("/cart/clear", {}, getAuthHeaders(token));
        return response.data;
    },

    getCount: async (token) => {
        const response = await api.get("/cart/count", getAuthHeaders(token));
        return response.data;
    }
};

// ============================================
// WISHLIST API
// ============================================
export const wishlistAPI = {
    get: async (token) => {
        const response = await api.get("/wishlist/me", getAuthHeaders(token));
        return response.data;
    },

    add: async (product, token) => {
        const response = await api.post("/wishlist/add", { product }, getAuthHeaders(token));
        return response.data;
    },

    remove: async (productId, token) => {
        const response = await api.post("/wishlist/remove", { productId }, getAuthHeaders(token));
        return response.data;
    },

    clear: async (token) => {
        const response = await api.post("/wishlist/clear", {}, getAuthHeaders(token));
        return response.data;
    },

    getCount: async (token) => {
        const response = await api.get("/wishlist/count", getAuthHeaders(token));
        return response.data;
    }
};

// ============================================
// USER API
// ============================================
export const userAPI = {
    getProfile: async (token) => {
        const response = await api.get("/users/profile", getAuthHeaders(token));
        return response.data;
    },

    updateProfile: async (userData, token) => {
        const response = await api.put("/users/profile", userData, getAuthHeaders(token));
        return response.data;
    },

    updatePassword: async (passwordData, token) => {
        const response = await api.put("/users/password", passwordData, getAuthHeaders(token));
        return response.data;
    },

    deleteAccount: async (token) => {
        const response = await api.delete("/users/me", getAuthHeaders(token));
        return response.data;
    },

    getAll: async (token) => {
        const response = await api.get("/users", getAuthHeaders(token));
        return response.data;
    },

    getById: async (id, token) => {
        const response = await api.get(`/users/${id}`, getAuthHeaders(token));
        return response.data;
    },

    delete: async (id, token) => {
        const response = await api.delete(`/users/${id}`, getAuthHeaders(token));
        return response.data;
    },

    updateRole: async (id, role, token) => {
        const response = await api.patch(`/users/${id}/role`, { role }, getAuthHeaders(token));
        return response.data;
    },

    getCount: async (token) => {
        const response = await api.get("/users/count", getAuthHeaders(token));
        return response.data;
    },

    getStats: async (token) => {
        const response = await api.get("/users/stats", getAuthHeaders(token));
        return response.data;
    },

    getDashboardStats: async (token) => {
        const response = await api.get("/users/dashboard-stats", getAuthHeaders(token));
        return response.data;
    }
};

// ============================================
// ADMIN API (Aggregated admin operations)
// ============================================
export const adminAPI = {
    // Orders
    getAllOrders: ordersAPI.getAll,
    updateOrderStatus: ordersAPI.updateStatus,

    // Users
    getAllUsers: userAPI.getAll,
    updateUserRole: userAPI.updateRole,
    deleteUser: userAPI.delete,

    // Products
    createProduct: productsAPI.create,
    updateProduct: productsAPI.update,
    deleteProduct: productsAPI.delete,

    // Stats
    getDashboardStats: userAPI.getDashboardStats,
    getUserStats: userAPI.getStats
};

export default {
    auth: authAPI,
    products: productsAPI,
    orders: ordersAPI,
    cart: cartAPI,
    wishlist: wishlistAPI,
    user: userAPI,
    admin: adminAPI
};
