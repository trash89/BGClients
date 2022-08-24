import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  isEditing: false,
  input: {
    id: 0,
    client_id: 0,
    file_name: "",
    file_description: "",
    user_id: "",
    displayed: false,
    updated_at: "",
    created_at: "",
    last_accessed_at: "",
    size: "",
    mimetype: "",
    signedURL: "",
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
  userfileSlice.actions;

export default userfileSlice.reducer;
