import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";
import eventReducer from "./features/event/eventSlice";
import userfileReducer from "./features/userfile/userfileSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    event: eventReducer,
    userfile: userfileReducer,
  },
});
