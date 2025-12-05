import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { wishlistAPI } from "../api/api";

// Get wishlist
export const fetchWishlist = createAsyncThunk("wishlist/fetch", async (_, { getState }) => {
    const { user } = getState();
    return await wishlistAPI.get(user.userInfo?.token);
});

// Add to wishlist
export const addToWishlist = createAsyncThunk("wishlist/add", async (product, { getState }) => {
    const { user } = getState();
    return await wishlistAPI.add(product, user.userInfo?.token);
});

// Remove from wishlist
export const removeFromWishlist = createAsyncThunk("wishlist/remove", async (productId, { getState }) => {
    const { user } = getState();
    return await wishlistAPI.remove(productId, user.userInfo?.token);
});

// Clear wishlist
export const clearWishlist = createAsyncThunk("wishlist/clear", async (_, { getState }) => {
    const { user } = getState();
    return await wishlistAPI.clear(user.userInfo?.token);
});

// Get wishlist count
export const fetchWishlistCount = createAsyncThunk("wishlist/count", async (_, { getState }) => {
    const { user } = getState();
    return await wishlistAPI.getCount(user.userInfo?.token);
});

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState: {
        wishlist: [],
        count: 0,
        status: "idle",
        error: null
    },
    reducers: {
        clearWishlistError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch wishlist
            .addCase(fetchWishlist.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchWishlist.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.wishlist = action.payload.products || [];
                state.error = null;
            })
            .addCase(fetchWishlist.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.error.message;
            })

            // Add to wishlist
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload.products || [];
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Remove from wishlist
            .addCase(removeFromWishlist.fulfilled, (state, action) => {
                state.wishlist = action.payload.products || [];
            })
            .addCase(removeFromWishlist.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Clear wishlist
            .addCase(clearWishlist.fulfilled, (state) => {
                state.wishlist = [];
            })
            .addCase(clearWishlist.rejected, (state, action) => {
                state.error = action.error.message;
            })

            // Fetch count
            .addCase(fetchWishlistCount.fulfilled, (state, action) => {
                state.count = action.payload.itemCount || 0;
            });
    }
});

export const { clearWishlistError } = wishlistSlice.actions;
export default wishlistSlice.reducer;
