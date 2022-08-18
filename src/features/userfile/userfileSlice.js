import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  input: {
    id: 0,
    client_id: 0,
    file_name: "",
    file_description: "",
    bucketId: "",
    user_id: "",
    displayed: false,
  },
  data: {},
  isError: false,
  errorText: "",
};

const userfileSlice = createSlice({
  name: "userfile",
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

export const { setInput, setIsLoading, clearIsLoading, setError, clearError, setData, clearValues, setEdit } = userfileSlice.actions;

export default userfileSlice.reducer;
