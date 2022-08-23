import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  input: {
    id: "",
    name: "",
    description: "",
    address: "",
    email: "",
    localuser_id: "",
    user_id: "",
  },
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
    setInput: (state, { payload: { name, value } }) => {
      state.input[name] = value;
      return { ...state };
    },
    clearValues: () => {
      return { ...initialState };
    },
    setEdit: (state, { payload }) => {
      return { ...state, ...payload };
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

export const { setInput, setIsLoading, clearIsLoading, setError, clearError, setData, clearValues, setEdit } = clientviewSlice.actions;

export default clientviewSlice.reducer;
