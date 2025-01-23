import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TCheckoutData } from "@/components/header";

const initialState: TCheckoutData = {
  data: [],
};

export const checkoutSlice = createSlice({
  name: "checkout slice",
  initialState,
  reducers: {
    setFillItem: (state, action: PayloadAction<TCheckoutData>) => {
      // console.log("checkoutSlicePayload: ", action.payload);
      state.data = action.payload.data;
    },
    setEmptyItem: (state, action: PayloadAction<string>) => {
      state.data?.splice(0, state.data.length);
    },
  },
});

export const { setFillItem, setEmptyItem } = checkoutSlice.actions;
export default checkoutSlice.reducer;
