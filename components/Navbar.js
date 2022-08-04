import React from "react";
import { supabase } from "../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../lib/features/user/userSlice";
import { links } from "../lib/utils/links";
import Logo from "./Logo";
import Link from "next/link";

const Navbar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const MyButton = React.forwardRef(({ onClick, href }, ref) => {
    return (
      <a href={href} onClick={onClick} ref={ref}>
        Logout
      </a>
    );
  });
  const onClick = async () => {
    dispatch(logoutUser());
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top p-0 p-0">
      <div className="container-fluid">
        <Link href="/" className="navbar-brand m-0">
          <a>
            <Logo />
          </a>
        </Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse text-align-start" id="collapsibleNavbar">
          <ul className="navbar-nav">
            {links.map((page) => {
              return (
                <li key={page.id} className="nav-item text-capitalize">
                  <Link href={page.path} className="nav-link">
                    <a>{page.text}</a>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="nav align-content-start justify-content-sm-start justify-content-md-end flex-sm-grow-1">
            <li className="nav-item dropdown m-0 p-0">
              <Link href="/" className="nav-link dropdown-toggle text-light" role="button" data-bs-toggle="dropdown">
                <a>{user?.email}</a>
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link href="/profiles" className="dropdown-item text-capitalize">
                    <a>Profiles</a>
                  </Link>
                </li>
                <li>
                  <Link href="/" className="dropdown-item text-capitalize" passHref>
                    <MyButton />
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default Navbar;
