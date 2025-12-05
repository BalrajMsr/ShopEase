import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authAPI, userAPI } from "../api/api";

// Login user
export const loginUser = createAsyncThunk("user/login", async (data) => {
  return await authAPI.login(data);
});

// Register user
export const registerUser = createAsyncThunk("user/register", async (data) => {
  return await authAPI.register(data);
});

// Get user profile
export const getUserProfile = createAsyncThunk("user/getProfile", async (_, { getState }) => {
  const { user } = getState();
  return await userAPI.getProfile(user.userInfo?.token);
});

// Update user profile
export const updateUserProfile = createAsyncThunk("user/updateProfile", async (data, { getState }) => {
  const { user } = getState();
  return await userAPI.updateProfile(data, user.userInfo?.token);
});

// Update password
export const updatePassword = createAsyncThunk("user/updatePassword", async (data, { getState }) => {
  const { user } = getState();
  return await userAPI.updatePassword(data, user.userInfo?.token);
});

// Delete account
export const deleteAccount = createAsyncThunk("user/deleteAccount", async (_, { getState }) => {
  const { user } = getState();
  return await userAPI.deleteAccount(user.userInfo?.token);
});

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: JSON.parse(localStorage.getItem("userInfo") || "null"),
    profile: null,
    status: "idle",
    error: null
  },
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.profile = null;
      localStorage.removeItem("userInfo");
    },
    clearUserError(state) {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Register
      .addCase(registerUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.userInfo = action.payload;
        state.error = null;
        localStorage.setItem("userInfo", JSON.stringify(action.payload));
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Get profile
      .addCase(getUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(getUserProfile.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update profile
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.profile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.error.message;
      })

      // Update password
      .addCase(updatePassword.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = "succeeded";
        state.error = null;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Delete account
      .addCase(deleteAccount.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = "succeeded";
        state.userInfo = null;
        state.profile = null;
        localStorage.removeItem("userInfo");
        state.error = null;
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  }
});

export const { logout, clearUserError } = userSlice.actions;
export default userSlice.reducer;