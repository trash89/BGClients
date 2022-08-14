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
  Files,
  NewFile,
  EditFile,
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
          <Route path="files" element={<SharedPagesLayout />}>
            <Route index element={<Files />} />
            <Route path=":idFile" element={<EditFile />} />
            <Route path="newfile" element={<NewFile />} />
          </Route>
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
