import { createSlice } from "@reduxjs/toolkit";
import { getUserFromLocalStorage, removeUserFromLocalStorage, addUserToLocalStorage } from "../../utils/localStorage";

const initialState = {
  isSidebarOpen: false,
  isLoading: false,
  input: {
    email: "",
    password: "",
  },
  user: getUserFromLocalStorage(),
  isError: false,
  errorText: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      state.isLoading = true;
    },
    clearIsLoading: (state) => {
      state.isLoading = false;
    },
    setInput: (state, { payload: { name, value } }) => {
      state.input[name] = value;
    },
    clearValues: () => {
      return { ...initialState };
    },
    setError: (state, { payload }) => {
      return { ...state, isError: true, errorText: payload };
    },
    clearError: (state) => {
      return { ...state, isError: false, errorText: "" };
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    loginUser: (state, { payload }) => {
      //state.user = payload;
      //state.isSidebarOpen = false;
      addUserToLocalStorage(payload);
      return { ...state, user: payload, isSidebarOpen: false };
    },
    logoutUser: (state) => {
      //state.user = null;
      //state.isSidebarOpen = false;
      removeUserFromLocalStorage();
      return { ...state, user: null, isSidebarOpen: false };
    },
  },
});

export const { toggleSidebar, loginUser, logoutUser, setIsLoading, clearIsLoading, setInput, clearValues, setError, clearError } = userSlice.actions;
export default userSlice.reducer;
