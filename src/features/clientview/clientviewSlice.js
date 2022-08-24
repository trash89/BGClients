import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isEditing: false,
  data: {},
  isError: false,
  errorText: "",
};

const clientviewSlice = createSlice({
  name: "clientview",
  initialState,
  reducers: {
    setIsLoading: (state) => {
      return { ...state, isLoading: true };
    },
    clearIsLoading: (state) => {
      return { ...state, isLoading: false };
    },
    setIsEditing: (state) => {
      return { ...state, isEditing: true };
    },
    clearIsEditing: (state) => {
      return { ...state, isEditing: false };
    },
    clearValues: () => {
      return { ...initialState };
    },
    setData: (state, { payload }) => {
      return { ...state, data: payload };
    },
    setError: (state, { payload }) => {
      return { ...state, isError: true, errorText: payload };
    },
    clearError: (state) => {
      return { ...state, isError: false, errorText: "" };
    },
  },
});

export const { setIsLoading, clearIsLoading, setIsEditing, clearIsEditing, setError, clearError, setData, clearValues } = clientviewSlice.actions;

export default clientviewSlice.reducer;
