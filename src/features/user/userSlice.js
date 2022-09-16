import { createSlice } from "@reduxjs/toolkit";
import { getUserFromLocalStorage, removeUserFromLocalStorage, addUserToLocalStorage } from "../../utils/localStorage";
import { toast } from "react-toastify";

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
      addUserToLocalStorage(payload);
      toast.success(`Hello There ${payload.email}`);
      return { ...state, user: payload, isSidebarOpen: false };
    },
    logoutUser: (state) => {
      removeUserFromLocalStorage();
      return { ...state, user: null, isSidebarOpen: false };
    },
  },
});

export const { toggleSidebar, loginUser, logoutUser, setIsLoading, clearIsLoading, setInput, clearValues, setError, clearError } = userSlice.actions;
export default userSlice.reducer;
