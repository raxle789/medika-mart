import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

type TTransactionResult = {
  data: any;
};

const initialState: TTransactionResult = {
  data: {},
};

export const transactionResultSlice = createSlice({
  name: "transaction result slice",
  initialState,
  reducers: {
    setResult: (state, action: PayloadAction<any>) => {
      state.data = action.payload.data;
    },
  },
});

export const { setResult } = transactionResultSlice.actions;
export default transactionResultSlice.reducer;
