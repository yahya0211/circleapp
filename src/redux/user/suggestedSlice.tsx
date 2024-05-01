import { PayloadAction, createAsyncThunk, isRejectedWithValue } from "@reduxjs/toolkit";
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

export const getSuggested = createAsyncThunk("suggested", async (_, { rejectWithValue }) => {
  try {
    const response = await API.get(`getSuggested`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    });

    return response.data.data;
  } catch (error) {
    return isRejectedWithValue({ errorMessage: getError(Error) });
  }
});

const suggestedSlice = createSlice({
  name: "suggested",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getSuggested.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(getSuggested.fulfilled, (state, action: PayloadAction<UserProfileType>) => {
      state.data = action.payload;
      state.isLoading = false;
      state.isError = false;
      state.error = "";
    });
    builder.addCase(getSuggested.rejected, (state, action: PayloadAction<any>) => {
      state.data = null;
      state.isLoading = false;
      state.isError = true;
      state.error = action.payload?.errorMessage || "Unkwon Error";
    });
  },
});

export default suggestedSlice.reducer;
