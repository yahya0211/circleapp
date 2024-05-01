import { PayloadAction, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import getError from "../../utils/GetError";
import { API } from "../../utils/api";

import { jwtDecode } from "jwt-decode";
const jwtToken = localStorage.getItem("jwtToken");

type initialStateT = {
  data: UserProfileType | null;
  isLoading: boolean;
  isError: boolean;
  error: string;
};

const initialState: initialStateT = {
  data: null,
  isLoading: true,
  isError: false,
  error: "",
};

interface JWTPayload {
  id: string;
}

export const getProfile = createAsyncThunk("profile", async (_, { rejectWithValue }) => {
  const getToken = () => {
    if (jwtToken) {
      const decodeToken: JWTPayload = jwtDecode(jwtToken);
      const idToken = decodeToken.id;
      return idToken;
    } else {
      return null;
    }
  };
  try {
    const id = getToken();
    const response = await API.get(`findByUserId/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return isRejectedWithValue({ errorMessage: getError(Error) });
  }
});

const profileSlice = createSlice({
  name: "profile",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getProfile.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getProfile.fulfilled, (state, action: PayloadAction<UserProfileType>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.error = "";
    });
    builder.addCase(getProfile.rejected, (state, action: PayloadAction<any>) => {
      state.data = null;
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.errorMessage || "Unkwon Error";
    });
  },
});

export default profileSlice.reducer;
