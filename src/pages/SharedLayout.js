import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, MenuAppBar, Copyright } from "../components";
const SharedLayout = () => {
  return (
    <main className="principal">
      <SmallSidebar />
      <BigSidebar />
      <div>
        <MenuAppBar />
        <div className="principal-page">
          <Outlet />
          <Copyright />
        </div>
      </div>
    </main>
  );
};
export default SharedLayout;
