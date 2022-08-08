import { supabase } from "../../lib/supabaseServer";

export default async function editUser(req, res) {
  if (req.method === "POST") {
    const { id, email, password } = req.body;
    if (email) {
      const { data: editUser, error: errorEditUser } = await supabase.auth.api.updateUserById({
        email: email,
        email_confirm: true,
        password: password,
      });
      if (errorEditUser) return res.status(401).json({ error: `editUser:${errorEditUser.message}` });

      const { data: localUser, error: errorLocalUserSelect } = await supabase.from("localusers").select("*").eq("user_id", editUser.id).single();
      if (errorLocalUserSelect) {
        return res.status(401).json({ error: `localUser select:${errorLocalUserSelect.message}` });
      }
      return res.status(200).json({ user: localUser });
    } else {
      res.status(401).json({ error: "no email provided for editing the user" });
    }
  } else {
    res.status(401).json({ error: "only POST method is accepted" });
  }
}
