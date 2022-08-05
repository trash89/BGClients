import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  const router = useRouter();
  const { user } = useSelector((store) => store.user);

  useEffect(() => {
    if (!user) {
      router.push("/register");
    }
  });

  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
