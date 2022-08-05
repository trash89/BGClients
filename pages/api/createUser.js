import { supabase } from "../../lib/supabaseServer";

export default async function registerUser(req, res) {
  const { email, password } = req.body;
  const { data: user, error } = await supabase.auth.api.createUser({
    email: "user@email.com",
    email_confirm: true,
    password: "password",
  });

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json({ user: user });
}
