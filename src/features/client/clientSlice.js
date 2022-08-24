import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isEditing: false,
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

const clientSlice = createSlice({
  name: "client",
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
    setInput: (state, { payload: { name, value } }) => {
      state.input[name] = value;
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

export const { setInput, setIsLoading, clearIsLoading, setIsEditing, clearIsEditing, setError, clearError, setData, clearValues, setEdit } =
  clientSlice.actions;

export default clientSlice.reducer;
