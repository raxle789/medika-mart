import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { TUserDoc } from "@/lib/firebase.utils";

// interface IInitState {
//   uid?: string | null;
//   email?: string | null;
//   displayName?: string | null;
// }

const initialState: TUserDoc = {
  username: "",
  email: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  city: "",
  phoneNumber: "",
};

export const userDataSlice = createSlice({
  name: "user data slice",
  initialState,
  reducers: {
    setUserData: (state, action: PayloadAction<TUserDoc>) => {
      state.username = action.payload.username;
      state.email = action.payload.email;
      state.dateOfBirth = action.payload.dateOfBirth;
      state.gender = action.payload.gender;
      state.address = action.payload.address;
      state.city = action.payload.city;
      state.phoneNumber = action.payload.phoneNumber;
    },
  },
});

export const { setUserData } = userDataSlice.actions;
export default userDataSlice.reducer;
