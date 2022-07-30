import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useSelector } from "react-redux";

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);

  return (
    <div className={isSidebarOpen ? "sidebar-container " : "sidebar-container show-sidebar"}>
      <div className="content">
        <header>
          <Logo />
        </header>
        <NavLinks />
      </div>
    </div>
  );
};
export default BigSidebar;
