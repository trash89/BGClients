import { supabase } from "../lib/supabaseClient";
import Head from "next/head";

export default function Home({ user }) {
  return (
    <div className="container-fluid">
      <Head>
        <title>BG Clients</title>
      </Head>

      <main>
        <h1>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>
        {user.email}
      </main>
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  const { user, error } = await supabase.auth.api.getUser(req.cookies["sb-access-token"]);
  if (error) {
    return {
      props: {},
      redirect: { destination: "/register" },
    };
  }
  return {
    props: { user },
  };
}
