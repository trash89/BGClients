import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/userSlice";
import clientReducer from "./features/client/clientSlice";
import eventReducer from "./features/event/eventSlice";
import userfileReducer from "./features/userfile/userfileSlice";
import clientviewReducer from "./features/clientview/clientviewSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    client: clientReducer,
    event: eventReducer,
    userfile: userfileReducer,
    clientview: clientviewReducer,
  },
});
