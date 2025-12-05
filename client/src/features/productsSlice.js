import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { productsAPI } from "../api/api";

// Fetch all products
export const fetchProducts = createAsyncThunk("products/fetch", async (q = "") => {
  return await productsAPI.getAll(q);
});

// Fetch product by ID
export const fetchProductById = createAsyncThunk("products/fetchById", async (id) => {
  return await productsAPI.getById(id);
});

// Fetch products by category
export const fetchProductsByCategory = createAsyncThunk("products/fetchByCategory", async (category) => {
  return await productsAPI.getByCategory(category);
});

// Admin: Add product
export const addProduct = createAsyncThunk("products/add", async (productData, { getState }) => {
  const { user } = getState();
  return await productsAPI.create(productData, user.userInfo?.token);
});

// Admin: Update product
export const updateProduct = createAsyncThunk("products/update", async ({ id, data }, { getState }) => {
  const { user } = getState();
  return await productsAPI.update(id, data, user.userInfo?.token);
});

// Admin: Delete product
export const deleteProduct = createAsyncThunk("products/delete", async (id, { getState }) => {
  const { user } = getState();
  await productsAPI.delete(id, user.userInfo?.token);
  return id;
});

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    currentProduct: null,
    status: "idle",
    error: null
  },
  reducers: {
    clearProductsError: (state) => {
      state.error = null;
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.currentProduct = action.payload;
        state.error = null;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Fetch products by category
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
        state.error = null;
      })

      // Add product
      .addCase(addProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update product
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p._id === action.payload._id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?._id === action.payload._id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Delete product
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(p => p._id !== action.payload);
        if (state.currentProduct?._id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { clearProductsError, clearCurrentProduct } = productsSlice.actions;
export default productsSlice.reducer;