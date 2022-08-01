import { BrowserRouter, Routes, Route } from "react-router-dom";

import {
  SharedLayout,
  SharedPagesLayout,
  Error,
  Register,
  ProtectedRoute,
  Clients,
  NewClient,
  EditClient,
  Contacts,
  NewContact,
  EditContact,
  Events,
  NewEvent,
  EditEvent,
  Profiles,
  EditProfile,
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

          <Route path="profiles" element={<SharedPagesLayout />}>
            <Route index element={<Profiles />} />
            <Route path=":idProfile" element={<EditProfile />} />
          </Route>

          <Route path="contacts" element={<SharedPagesLayout />}>
            <Route index element={<Contacts />} />
            <Route path=":idContact" element={<EditContact />} />
            <Route path="newcontact" element={<NewContact />} />
          </Route>
          <Route path="events" element={<SharedPagesLayout />}>
            <Route index element={<Events />} />
            <Route path=":idEvent" element={<EditEvent />} />
            <Route path="newevent" element={<NewEvent />} />
          </Route>
        </Route>
        <Route path="register" element={<Register />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
