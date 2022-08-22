import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

import { logoutUser, clearValues } from "../features/user/userSlice";
import { links } from "../utils/links";
import Logo from "./Logo";

export default function Navbar() {
  const [cookies, setCookie, removeCookie] = useCookies();
  const { user: userRedux } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    removeCookie("sb-access-token", { path: "/" });
    removeCookie("sb-refresh-token", { path: "/" });
    dispatch(logoutUser());
    dispatch(clearValues());
    navigate("/register", { replace: true });
    return;
  };

  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark sticky-top p-0 m-0">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <Logo />
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#collapsibleNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse text-align-start" id="collapsibleNavbar">
          <ul className="navbar-nav">
            {userRedux.isAdmin ? (
              <>
                {links.map((page) => {
                  return (
                    <li key={page.id} className="nav-item text-capitalize">
                      <Link to={page.path} className="nav-link">
                        {page.text}
                      </Link>
                    </li>
                  );
                })}
              </>
            ) : (
              <li key="0" className="nav-item text-capitalize">
                <Link to="/clientView" className="nav-link">
                  Client View
                </Link>
              </li>
            )}
          </ul>
          <ul className="nav align-content-start justify-content-sm-start justify-content-md-end flex-sm-grow-1">
            <li className="nav-item dropdown m-0 p-0">
              <Link to="/" className="nav-link dropdown-toggle text-light" role="button" data-bs-toggle="dropdown">
                {userRedux?.email}
              </Link>
              <ul className="dropdown-menu">
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
