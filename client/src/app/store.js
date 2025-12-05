import { configureStore } from "@reduxjs/toolkit";
import productsReducer from "../features/productsSlice";
import cartReducer from "../features/cartSlice";
import userReducer from "../features/userSlice";
import adminReducer from "../features/adminSlice";
import wishlistReducer from "../features/wishlistSlice";
import ordersReducer from "../features/ordersSlice";

export default configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
    user: userReducer,
    admin: adminReducer,
    wishlist: wishlistReducer,
    orders: ordersReducer,
  },
});