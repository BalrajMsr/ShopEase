import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersAPI } from "../api/api";

// Create order
export const createOrder = createAsyncThunk("orders/create", async (orderData, { getState }) => {
    const { user } = getState();
    return await ordersAPI.create(orderData, user.userInfo?.token);
});

// Get user orders
export const fetchUserOrders = createAsyncThunk("orders/fetchUser", async (_, { getState }) => {
    const { user } = getState();
    return await ordersAPI.getUserOrders(user.userInfo?.token);
});

// Get order by ID
export const fetchOrderById = createAsyncThunk("orders/fetchById", async (id, { getState }) => {
    const { user } = getState();
    return await ordersAPI.getById(id, user.userInfo?.token);
});

// Cancel order
export const cancelOrder = createAsyncThunk("orders/cancel", async (id, { getState }) => {
    const { user } = getState();
    return await ordersAPI.cancel(id, user.userInfo?.token);
});

const ordersSlice = createSlice({
    name: "orders",
    initialState: {
        userOrders: [],
        currentOrder: null,
        status: "idle",
        error: null
    },
    reducers: {
        clearOrdersError: (state) => {
            state.error = null;
        },
        clearCurrentOrder: (state) => {
            state.currentOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Create order
            .addCase(createOrder.pending, (state) => {
                state.status = "loading";
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userOrders.push(action.payload);
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Fetch user orders
            .addCase(fetchUserOrders.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchUserOrders.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.userOrders = action.payload;
                state.error = null;
            })
            .addCase(fetchUserOrders.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Fetch order by ID
            .addCase(fetchOrderById.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentOrder = action.payload;
                state.error = null;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Cancel order
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.currentOrder = action.payload;
                const index = state.userOrders.findIndex(o => o._id === action.payload._id);
                if (index !== -1) {
                    state.userOrders[index] = action.payload;
                }
            });
    }
});

export const { clearOrdersError, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
