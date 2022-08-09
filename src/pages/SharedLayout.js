import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, Navbar, Copyright } from "../components";
import Wrapper from "../assets/wrappers/SharedLayout";
const SharedLayout = () => {
  return (
    <Wrapper>
      <main className="principal">
        <SmallSidebar />
        <BigSidebar />
        <div>
          <Navbar />
          <div className="principal-page">
            <Outlet />
          </div>
        </div>
        <Copyright />
      </main>
    </Wrapper>
  );
};
export default SharedLayout;
