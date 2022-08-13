import NavLinks from "./NavLinks";
import Logo from "./Logo";
import Wrapper from "../assets/wrappers/BigSidebar";
import { useSelector } from "react-redux";

const BigSidebar = () => {
  const { isSidebarOpen } = useSelector((store) => store.user);

  return (
    <Wrapper>
      <div className={isSidebarOpen ? "sidebar-container " : "sidebar-container show-sidebar"}>
        <div className="content">
          <header className="d-flex flex-row align-items-center">
            <Logo />
            <strong>
              <div className="m-0 p-1">BG Clients</div>
            </strong>
          </header>
          <NavLinks />
        </div>
      </div>
    </Wrapper>
  );
};
export default BigSidebar;
