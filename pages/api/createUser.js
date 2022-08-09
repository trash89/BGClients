import { supabase, getUserOnServer } from "../../lib/supabaseServer";

export default async function registerUser(req, res) {
  if (req.method === "POST") {
    const user = await getUserOnServer(req, res);
    if (user.isAdmin) {
      const { email } = req.body;
      if (email) {
        const { data: createdUser, error: errorCreatedUser } = await supabase.auth.api.createUser({
          email: email,
          email_confirm: true,
          password: "secret123",
        });
        if (errorCreatedUser) return res.status(401).json({ error: `createdUser:${errorCreatedUser.message}` });

        const { error: errorLocalUser } = await supabase.from("localusers").insert({ user_id: createdUser.id, isAdmin: false }, { returning: "minimal" });
        if (errorLocalUser) {
          return res.status(401).json({ error: `localUser:${errorLocalUser.message}` });
        }
        const { data: localUser, error: errorLocalUserSelect } = await supabase.from("localusers").select("*").eq("user_id", createdUser.id).single();
        if (errorLocalUserSelect) {
          return res.status(401).json({ error: `localUser select:${errorLocalUserSelect.message}` });
        }
        return res.status(200).json({ user: localUser });
      } else {
        res.status(401).json({ error: "no email provided for creating the user" });
      }
    } else {
      res.status(401).json({ error: "only POST method is accepted" });
    }
  } else {
    res.status(401).json({ error: "only admin users allowed" });
  }
}
