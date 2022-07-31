import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, MenuAppBar, Copyright } from "../components";
const SharedLayout = () => {
  return (
    <div className="container-fluid">
      {/* <SmallSidebar />
      <BigSidebar /> */}
      <MenuAppBar />
      <Outlet />
      <Copyright />
    </div>
  );
};
export default SharedLayout;
