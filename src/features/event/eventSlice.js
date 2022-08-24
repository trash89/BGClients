import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isEditing: false,
  input: {
    id: 0,
    client_id: 0,
    ev_name: "",
    ev_description: "",
    ev_date: "",
    user_id: "",
    displayed: false,
  },
  data: {},
  isError: false,
  errorText: "",
};

const eventSlice = createSlice({
  name: "event",
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

export const { setInput, setIsLoading, clearIsLoading, setIsEditing, clearIsEditing, setError, clearError, setData, clearValues, setEdit } = eventSlice.actions;

export default eventSlice.reducer;
