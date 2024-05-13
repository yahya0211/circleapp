import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import getError from "../../utils/GetError";
import { API } from "../../utils/api";

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

export const getProfile = createAsyncThunk("profile", async (_, { rejectWithValue }) => {
  try {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
      throw new Error("JWT token not found in local storage");
    }

    const decodeToken = jwtToken.split(".")[1];
    const userData = JSON.parse(atob(decodeToken));
    const idUser = userData?.User?.id;
    const id = idUser;

    const response = await API.get(`findByUserId/${id}`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return rejectWithValue({ errorMessage: getError(Error) });
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
      state.error = action.payload?.errorMessage || "Unknwon Error Occured";
    });
  },
});

export default profileSlice.reducer;
