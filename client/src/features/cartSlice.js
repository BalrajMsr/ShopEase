import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { cartAPI } from "../api/api";

// Helper to normalize API cart items to local structure
const normalizeCart = (cartData) => {
  if (!cartData || !cartData.items) return [];
  return cartData.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.price,
    images: item.product.images || [item.product.image],
    quantity: item.quantity,
    stock: item.product.stock
  }));
};

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetch", async (_, { getState }) => {
  const { user } = getState();
  if (user.userInfo?.token) {
    const data = await cartAPI.get(user.userInfo.token);
    return normalizeCart(data);
  }
  // For guest, we rely on local state (persisted in localStorage)
  // We don't return anything here that would overwrite local state
  return null;
});

// Add to cart
export const addToCart = createAsyncThunk("cart/add", async (item, { getState }) => {
  const { user } = getState();
  if (user.userInfo?.token) {
    const res = await cartAPI.add(item.product, item.quantity, user.userInfo.token);
    return { type: 'api', data: normalizeCart(res) };
  } else {
    return { type: 'local', data: item };
  }
});

// Remove from cart
export const removeFromCart = createAsyncThunk("cart/remove", async (productId, { getState }) => {
  const { user } = getState();
  if (user.userInfo?.token) {
    const res = await cartAPI.remove(productId, user.userInfo.token);
    return { type: 'api', data: normalizeCart(res) };
  } else {
    return { type: 'local', data: productId };
  }
});

// Clear cart
export const clearCart = createAsyncThunk("cart/clear", async (_, { getState }) => {
  const { user } = getState();
  if (user.userInfo?.token) {
    await cartAPI.clear(user.userInfo.token);
    return { type: 'api', data: [] };
  } else {
    return { type: 'local', data: [] };
  }
});

const initialState = {
  items: JSON.parse(localStorage.getItem("cartItems") || "[]"),
  shippingAddress: "",
  status: "idle",
  error: null
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setShipping(state, action) {
      state.shippingAddress = action.payload;
    },
    // Legacy reducers for direct manipulation if needed, but we use thunks now
    clearCartLocal(state) {
      state.items = [];
      localStorage.removeItem("cartItems");
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.fulfilled, (state, action) => {
        if (action.payload) {
          state.items = action.payload;
          // We don't sync server cart to local storage to avoid conflicts
          // localStorage.setItem("cartItems", JSON.stringify(state.items));
        }
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        if (action.payload.type === 'api') {
          state.items = action.payload.data;
        } else {
          const item = action.payload.data;
          const exist = state.items.find(i => i.product === item.product);
          if (exist) {
            state.items = state.items.map(i => i.product === item.product ? item : i);
          } else {
            state.items.push(item);
          }
          localStorage.setItem("cartItems", JSON.stringify(state.items));
        }
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        if (action.payload.type === 'api') {
          state.items = action.payload.data;
        } else {
          const productId = action.payload.data;
          state.items = state.items.filter(i => i.product !== productId);
          localStorage.setItem("cartItems", JSON.stringify(state.items));
        }
      })

      // Clear Cart
      .addCase(clearCart.fulfilled, (state, action) => {
        state.items = [];
        if (action.payload.type === 'local') {
          localStorage.removeItem("cartItems");
        }
      });
  }
});

export const { setShipping, clearCartLocal } = cartSlice.actions;
export default cartSlice.reducer;