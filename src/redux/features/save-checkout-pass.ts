import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitState {
  authorized: boolean;
}

const initialState: IInitState = {
  authorized: false,
};

export const saveCheckoutSlice = createSlice({
  name: "save checkout slice",
  initialState,
  reducers: {
    setCheckoutPass: (state, action: PayloadAction<boolean>) => {
      state.authorized = action.payload;
    },
  },
});

export const { setCheckoutPass } = saveCheckoutSlice.actions;
export default saveCheckoutSlice.reducer;
