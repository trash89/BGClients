import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, Navbar, Copyright } from "../components";
const SharedLayout = () => {
  return (
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
  );
};
export default SharedLayout;
