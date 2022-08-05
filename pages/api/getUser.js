import { supabase } from "../../lib/supabaseClient";

// Example of how to verify and get user data server-side.
const getUser = async (req, res) => {
  console.log("req.headers=", req.headers);
  const token = req.headers.token;
  console.log("token=", token);
  const { data: user, error } = await supabase.auth.api.getUser(token);

  if (error) return res.status(401).json({ error: error.message });
  return res.status(200).json(user);
};

export default getUser;
