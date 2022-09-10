import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  SharedLayout,
  SharedPagesLayout,
  Error,
  Register,
  PasswordReset,
  ProtectedRoute,
  Clients,
  EditClient,
  NewClient,
  ClientView,
  Events,
  NewEvent,
  EditEvent,
  UserFiles,
  NewUserFile,
  EditUserFile,
} from "./pages";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <SharedLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Clients />} />

          <Route path="clients" element={<SharedPagesLayout />}>
            <Route index element={<Clients />} />
            <Route path="clientView" element={<ClientView />} />
            <Route path=":idClient" element={<EditClient />} />
            <Route path="newclient" element={<NewClient />} />
          </Route>
          <Route path="events" element={<SharedPagesLayout />}>
            <Route index element={<Events />} />
            <Route path=":idEvent" element={<EditEvent />} />
            <Route path="newevent" element={<NewEvent />} />
          </Route>
          <Route path="userfiles" element={<SharedPagesLayout />}>
            <Route index element={<UserFiles />} />
            <Route path=":idFile" element={<EditUserFile />} />
            <Route path="newfile" element={<NewUserFile />} />
          </Route>
          <Route path="passwordReset" element={<PasswordReset />} />
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
      <ToastContainer position="top-center" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
