import { supabase } from "../supabaseClient";
import { useSelector } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { links } from "../utils/links";
import Logo from "./Logo";

const MenuAppBar = () => {
  const { user } = useSelector((store) => store.user);
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
                <li key={page.id} className="nav-item text-capitalize">
                  <a className="nav-link" href={page.path}>
                    {page.text}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="d-flex">
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle bg-primary text-white" href="/" role="button" data-bs-toggle="dropdown">
              {user.Username}
            </a>
            <ul className="dropdown-menu">
              <li>
                <a className="dropdown-item text-capitalize" href="/profiles">
                  profiles
                </a>
              </li>
              <li>
                <a
                  className="dropdown-item text-capitalize"
                  href="/"
                  onClick={async () => {
                    await supabase.auth.signOut();
                    logoutUser();
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
};
export default MenuAppBar;
