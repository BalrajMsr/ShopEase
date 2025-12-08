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

// Reorder - Add all items from an order to cart
export const reorderItems = createAsyncThunk("orders/reorder", async (orderId, { getState, dispatch }) => {
    const { orders } = getState();

    // Find the order to reorder
    const order = orders.userOrders.find(o => o._id === orderId) || orders.currentOrder;

    if (!order || !order.products || order.products.length === 0) {
        throw new Error("Order not found or has no items");
    }

    // Import addToCart dynamically to avoid circular dependency
    const { addToCart } = await import('./cartSlice');

    // Add each product to cart
    const results = [];
    for (const item of order.products) {
        if (item.product && item.product._id) {
            try {
                const cartItem = {
                    product: item.product._id,
                    name: item.product.name,
                    price: item.product.price,
                    images: item.product.images || [],
                    quantity: item.quantity,
                    stock: item.product.stock
                };
                await dispatch(addToCart(cartItem)).unwrap();
                results.push({ success: true, product: item.product.name });
            } catch (error) {
                results.push({ success: false, product: item.product.name, error: error.message });
            }
        }
    }

    return { orderId, results };
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
