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

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      //if (event === "PASSWORD_RECOVERY") setAuthView("update_password");
      //if (event === "USER_UPDATED") setTimeout(() => setAuthView("sign_in"), 1000);
      // Send session to /api/auth route to set the auth cookie.
      // NOTE: this is only needed if you're doing SSR (getServerSideProps)!
      console.log("event=", event, "session=", session);
      fetch("/api/auth", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json());
    });

    return () => {
      authListener.unsubscribe();
    };
  }, []);

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

export async function getServerSideProps({ req, res }) {
  console.log("req=", req, "res=", res);
  const { user, error } = await supabase.auth.api.getUser("ACCESS_TOKEN_JWT");
  console.log("index.js getServerSideProps, user=", user);
  return {
    props: {},
  };
}
// export async function getServerSideProps({ req }) {
//   const { user } = await supabase.auth.api.getUserByCookie(req);

//   if (!user) {
//     return { props: {}, redirect: { destination: "/register" } };
//   }

//   return { props: { user } };
// }
