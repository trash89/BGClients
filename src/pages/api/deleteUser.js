import { supabase, getUserOnServer } from "../../lib/supabaseServer";

export default async function deleteUser(req, res) {
  if (req.method === "POST") {
    const user = await getUserOnServer(req, res);
    if (user.isAdmin) {
      const { id } = req.body;
      if (id) {
        const { data: client, error: errorClient } = await supabase.from("clients").delete().eq("user_id", id);
        if (errorClient) {
          return res.status(401).json({ error: `client delete:${errorClient.message}` });
        }
        const { data: localUser, error: errorLocalUserDelete } = await supabase.from("localusers").delete().eq("user_id", id);
        if (errorLocalUserDelete) {
          return res.status(401).json({ error: `localUser delete:${errorLocalUserDelete.message}` });
        }

        const { data: deleteUser, error: errorDeleteUser } = await supabase.auth.api.deleteUser(id);
        if (errorDeleteUser) return res.status(401).json({ error: `deleteUser:${errorDeleteUser.message}` });

        return res.status(200).json({ user: deleteUser });
      } else {
        res.status(401).json({ error: "no id provided for deleting the user" });
      }
    } else {
      res.status(401).json({ error: "only POST method is accepted" });
    }
  } else {
    res.status(401).json({ error: "only admin users allowed" });
  }
}
