import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { API } from "../../utils/api";
import getError from "../../utils/GetError";

export const loginAsync = createAsyncThunk("auth/login", async (form: Login, { rejectWithValue }) => {
  try {
    const response = await API.post("login", form);
    localStorage.setItem("jwtToken", response.data.token);

    return response.data.token;
  } catch (error) {
    console.log(error);
  }
});

export const authCheckAsync = createAsyncThunk("auth/check", async (token: string, { rejectWithValue }) => {
  try {
    await API.get("check", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return token as string;
  } catch (error) {
    console.log(error);
    localStorage.removeItem("jwtToken");
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState: {
    isLogin: false,
    token: "",
  },
  reducers: {
    LOGOUT: (state) => {
      state.isLogin = false;
      state.token = "";
    },
  },
  extraReducers(builder) {
    builder.addCase(loginAsync.fulfilled, (state, action) => {
      state.isLogin = true;
      state.token = action.payload;
    });
    builder.addCase(authCheckAsync.fulfilled, (state, action) => {
      state.isLogin = true;
      state.token = action.payload!;
    });
  },
});

export const { LOGOUT } = authSlice.actions;

export default authSlice.reducer;
