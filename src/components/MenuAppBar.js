import { useState } from "react";
import { supabase } from "../supabaseClient";
import { removeUserFromLocalStorage } from "../utils/localStorage";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { links, userLinks } from "../utils/links";
import Logo from "./Logo";

const MenuAppBar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top">
      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <Logo />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="collapsibleNavbar">
          <ul className="navbar-nav">
            {links.map((page) => {
              return (
                <li key={page.id} className="nav-item">
                  <a className="nav-link" href={page.path}>
                    {page.text}
                  </a>
                </li>
              );
            })}
            <li className="nav-item dropdown">
              <a className="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                {user.Username}
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="/">
                    profiles
                  </a>
                </li>
                <li>
                  <a
                    className="dropdown-item"
                    href="/"
                    onClick={async () => {
                      await supabase.auth.signOut();
                      removeUserFromLocalStorage();
                    }}
                  >
                    Logout
                  </a>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default MenuAppBar;
