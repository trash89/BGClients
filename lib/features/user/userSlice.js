import { createSlice } from "@reduxjs/toolkit";
import { getUserFromLocalStorage, removeUserFromLocalStorage } from "../../utils/localStorage";

const initialState = {
  isLoading: false,
  user: getUserFromLocalStorage(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginUser: (state, { payload }) => {
      state.user = payload;
      state.isLoading = false;
    },
    registerUser: (state, { payload }) => {
      state.user = payload;
      state.isLoading = false;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isLoading = false;
      removeUserFromLocalStorage();
    },
  },
});

export const { loginUser, logoutUser, registerUser } = userSlice.actions;
export default userSlice.reducer;
