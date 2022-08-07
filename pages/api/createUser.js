import { supabase } from "../../lib/supabaseServer";

export default async function registerUser(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;
    if (email) {
      const { data: createdUser, error: errorCreatedUser } = await supabase.auth.api.createUser({
        email: email,
        email_confirm: true,
        password: "secret123",
      });
      if (errorCreatedUser) return res.status(401).json({ error: errorCreatedUser.message });

      const { data: localUser, error: errorLocalUser } = await supabase
        .from("localusers")
        .insert({ user_id: createdUser.id, isAdmin: false }, { returning: "minimal" });
      if (errorLocalUser) {
        const { data: deletedUser, error: errorDeletedUser } = await supabase.auth.api.deleteUser(createdUser.id);
        if (errorDeletedUser) {
          return res.status(401).json({ error: errorDeletedUser.message });
        }
        return res.status(401).json({ error: errorLocalUser.message });
      }
      return res.status(200).json({ user: createdUser });
    } else {
      res.status(401).json({ error: "no email provided for creating the user" });
    }
  } else {
    res.status(401).json({ error: "only POST method is accepted" });
  }
}
