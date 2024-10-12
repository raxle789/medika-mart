import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitState {
  authorized: boolean;
}

const initialState: IInitState = {
  authorized: true,
};

export const cartFetchSlice = createSlice({
  name: "cart fetch slice",
  initialState,
  reducers: {
    setAuthorized: (state, action: PayloadAction<boolean>) => {
      state.authorized = action.payload;
    },
  },
});

export const { setAuthorized } = cartFetchSlice.actions;
export default cartFetchSlice.reducer;
