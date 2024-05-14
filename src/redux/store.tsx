import { useSelector, TypedUseSelectorHook, useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import detailUserSlice from "./user/detailUserSlice";
import profileSlice from "./user/profileSlice";
import suggestedSlice from "./user/suggestedSlice";
import authSlice from "./auth";

const store = configureStore({
  reducer: {
    detailUser: detailUserSlice,
    profile: profileSlice,
    suggested: suggestedSlice,
    auth: authSlice,
  },
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

export default store;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
