import { supabase } from "../supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../features/user/userSlice";
import { links } from "../utils/links";
import Logo from "./Logo";
import { Link } from "react-router-dom";

const MenuAppBar = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top pt-0 pb-0">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
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
                  <Link to={page.path} className="nav-link">
                    {page.text}
                  </Link>
                </li>
              );
            })}
            <li>
              <div className="d-flex">
                <a
                  href="/"
                  className="nav-link"
                  onClick={async () => {
                    dispatch(logoutUser());
                    await supabase.auth.signOut();
                  }}
                >
                  {user.Username}
                </a>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};
export default MenuAppBar;
