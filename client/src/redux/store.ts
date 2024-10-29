import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import userReducer from "./slices/userSlice"; // Adjust the path to your actual userSlice file

// Configure persist settings
const persistConfig = {
  key: "root", // The key for the persisted data
  storage, // Storage engine
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, userReducer);

// Create the store with the persisted reducer
const store = configureStore({
  reducer: {
    user: persistedReducer, // Use the persisted userReducer
  },
});

// Create a persistor
const persistor = persistStore(store);

// Export store and persistor
export { store, persistor };

// Export RootState and AppDispatch types for use in the app
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
