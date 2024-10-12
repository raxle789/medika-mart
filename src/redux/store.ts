import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import cartSlice from "./features/cart-slice";
import profileSectionSlice from "./features/profile-section";
import cartFetchSlice from "./features/cart-fetch-slice";
// import userDataSlice from "./features/user-data-slice";
// import authSlice from "./features/auth-slice";

const rootReducer = combineReducers({
  cart: cartSlice,
  profileSection: profileSectionSlice,
  cartFetchAuthorized: cartFetchSlice,
});

const persistConfig = {
  key: "medikaMart",
  storage,
  whitelist: ["cart", "profileSection", "cartFetchAuthorized"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
