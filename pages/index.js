import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function Home() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async () => checkUser());
    checkUser();
    return () => {
      authListener?.unsubscribe();
    };
  }, []);
  async function checkUser() {
    const user = supabase.auth.user();
    setUser(user);
  }

  return (
    <div className="container-fluid">
      <Head>
        <title>BG Clients</title>
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
      </main>
    </div>
  );
}
