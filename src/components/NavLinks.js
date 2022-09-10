import { NavLink } from "react-router-dom";
import { links } from "../utils/links";
import { useSelector } from "react-redux";
import { BsPersonLinesFill } from "react-icons/bs";

const NavLinks = ({ toggleSidebar }) => {
  const { user } = useSelector((store) => store.user);

  return (
    <div className="nav-links">
      {user.isAdmin ? (
        <>
          {links.map((link) => {
            const { text, path, id, icon } = link;
            return (
              <NavLink
                to={path}
                className={({ isActive }) => {
                  return isActive ? "nav-link active" : "nav-link";
                }}
                key={id}
                onClick={toggleSidebar}
              >
                <span className="icon">{icon}</span>
                {text}
              </NavLink>
            );
          })}
        </>
      ) : (
        <>
          <NavLink
            to="/clients/clientView"
            className={({ isActive }) => {
              return isActive ? "nav-link active" : "nav-link";
            }}
            onClick={toggleSidebar}
          >
            <span className="icon">
              <BsPersonLinesFill />
            </span>
            Client
          </NavLink>
        </>
      )}
    </div>
  );
};
export default NavLinks;
