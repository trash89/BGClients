import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  SharedLayout,
  SharedPagesLayout,
  Error,
  Register,
  ProtectedRoute,
  Clients,
  EditClient,
  NewClient,
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
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
