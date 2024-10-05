import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitState {
  uid?: string | null;
  email?: string | null;
  displayName?: string | null;
}

const initialState: IInitState = {
  uid: "",
  email: "",
  displayName: null,
};

export const authSlice = createSlice({
  name: "auth slice",
  initialState,
  reducers: {
    setIsLogin: (state, action: PayloadAction<IInitState>) => {
      state.uid = action.payload.uid;
      state.email = action.payload.email;
      state.displayName = action.payload.displayName;
    },
  },
});

export const { setIsLogin } = authSlice.actions;
export default authSlice.reducer;
