import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

import { supabase } from "../supabaseClient";

import { logoutUser } from "../features/user/userSlice";
import { links } from "../utils/links";
import Logo from "./Logo";

export default function Navbar() {
  const { user: userRedux } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  const logout = async () => {
    dispatch(logoutUser());
    await supabase.auth.signOut();
  };

  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top p-0 p-0">
      <div className="container-fluid">
        <a href="/" className="navbar-brand pb-0 me-0">
          <Logo />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse text-align-start" id="collapsibleNavbar">
          <ul className="navbar-nav">
            {links.map((page) => {
              return (
                <li key={page.id} className="nav-item text-capitalize">
                  <Link to={page.path} className="nav-link">
                    {page.text}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ul className="nav align-content-start justify-content-sm-start justify-content-md-end flex-sm-grow-1">
            <li className="nav-item dropdown m-0 p-0">
              <Link to="/" className="nav-link dropdown-toggle text-light" role="button" data-bs-toggle="dropdown">
                {userRedux?.email}
              </Link>
              <ul className="dropdown-menu">
                <li>
                  <Link to="/profiles" className="dropdown-item text-capitalize">
                    profiles
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="dropdown-item text-capitalize" onClick={logout}>
                    logout
                  </Link>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
