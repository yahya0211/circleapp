import { PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import getError from "../../utils/GetError";
import { API } from "../../utils/api";

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

export const getDetailUser = createAsyncThunk("detailUser", async (userId: string, { rejectWithValue }) => {
  try {
    const response = await API.get("findByUserId/" + userId, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return rejectWithValue({ errorMessage: getError(Error) });
  }
});

const detailUserSlice = createSlice({
  name: "detailUser",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getDetailUser.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getDetailUser.fulfilled, (state, action: PayloadAction<UserProfileType>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.error = "";
    });
    builder.addCase(getDetailUser.rejected, (state, action: PayloadAction<any>) => {
      state.data = null;
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.errorMessage || "Unkwon Error Occured";
    });
  },
});

export default detailUserSlice.reducer;
