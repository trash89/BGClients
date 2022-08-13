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
  status: "pending",
  isEditing: false,
  editId: "",
};

const clientSlice = createSlice({
  name: "client",
  initialState,
  reducers: {
    setInput: (state, { payload: { name, value } }) => {
      state.input[name] = value;
    },
    clearValues: () => {
      return initialState;
    },
    setEdit: (state, { payload }) => {
      return { ...state, isEditing: true, ...payload };
    },
  },
});

export const { setInput, clearValues, setEdit } = clientSlice.actions;

export default clientSlice.reducer;
