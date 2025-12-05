import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { adminAPI } from "../api/api";

// Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk("admin/fetchOrders", async (_, { getState }) => {
    const { user } = getState();
    return await adminAPI.getAllOrders(user.userInfo?.token);
});

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk("admin/updateOrderStatus", async ({ orderId, orderStatus, paymentStatus }, { getState }) => {
    const { user } = getState();
    return await adminAPI.updateOrderStatus(orderId, { orderStatus, paymentStatus }, user.userInfo?.token);
});

// Fetch all users (admin)
export const fetchAllUsers = createAsyncThunk("admin/fetchUsers", async (_, { getState }) => {
    const { user } = getState();
    return await adminAPI.getAllUsers(user.userInfo?.token);
});

// Update user role (admin)
export const updateUserRole = createAsyncThunk("admin/updateUserRole", async ({ userId, role }, { getState }) => {
    const { user } = getState();
    return await adminAPI.updateUserRole(userId, role, user.userInfo?.token);
});

// Delete user (admin)
export const deleteUser = createAsyncThunk("admin/deleteUser", async (userId, { getState }) => {
    const { user } = getState();
    await adminAPI.deleteUser(userId, user.userInfo?.token);
    return userId;
});

// Fetch dashboard statistics (admin)
export const fetchDashboardStats = createAsyncThunk("admin/fetchStats", async (_, { getState }) => {
    const { user } = getState();
    return await adminAPI.getDashboardStats(user.userInfo?.token);
});

const adminSlice = createSlice({
    name: "admin",
    initialState: {
        orders: [],
        users: [],
        stats: {
            totalProducts: 0,
            totalOrders: 0,
            totalUsers: 0,
            totalRevenue: 0,
            pendingOrders: 0,
            lowStock: 0
        },
        ordersStatus: "idle",
        usersStatus: "idle",
        statsStatus: "idle",
        error: null
    },
    reducers: {
        clearAdminError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch orders
            .addCase(fetchAllOrders.pending, (state) => {
                state.ordersStatus = "loading";
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.ordersStatus = "succeeded";
                state.orders = action.payload;
                state.error = null;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.ordersStatus = "failed";
                state.error = action.error.message;
            })

            // Update order status
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                const index = state.orders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.orders[index] = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Fetch users
            .addCase(fetchAllUsers.pending, (state) => {
                state.usersStatus = "loading";
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.usersStatus = "succeeded";
                state.users = action.payload;
                state.error = null;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.usersStatus = "failed";
                state.error = action.error.message;
            })

            // Update user role
            .addCase(updateUserRole.fulfilled, (state, action) => {
                const index = state.users.findIndex(u => u._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUserRole.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Delete user
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.users = state.users.filter(u => u._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Fetch stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.statsStatus = "loading";
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.statsStatus = "succeeded";
                state.stats = action.payload;
                state.error = null;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.statsStatus = "failed";
                state.error = action.error.message;
            });
    }
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
