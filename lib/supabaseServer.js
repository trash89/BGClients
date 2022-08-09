import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE;
export const supabase = createClient(supabaseUrl, supabaseServiceKey);

export async function getUserOnServer(req, res) {
  const { user, error: errorUser } = await supabase.auth.api.getUserByCookie(req, res);
  if (errorUser) return null;
  const { data: localUser, error: errorLocalUser } = await supabase.from("localusers").select("isAdmin").eq("user_id", user.id).single();
  if (errorLocalUser) return null;
  return { ...user, isAdmin: localUser.isAdmin };
}
