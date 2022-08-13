import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  input: {
    id: "",
    client_id: "",
    ev_name: "",
    ev_description: "",
    ev_date: "",
    user_id: "",
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

export const { setInput, setIsLoading, clearIsLoading, setError, clearError, setData, clearValues, setEdit } = eventSlice.actions;

export default eventSlice.reducer;
