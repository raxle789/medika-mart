import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface IInitState {
  section: string;
}

const initialState: IInitState = {
  section: "personal data",
};

export const profileSectionSlice = createSlice({
  name: "profile section slice",
  initialState,
  reducers: {
    setSection: (state, action: PayloadAction<string>) => {
      state.section = action.payload;
    },
  },
});

export const { setSection } = profileSectionSlice.actions;
export default profileSectionSlice.reducer;
