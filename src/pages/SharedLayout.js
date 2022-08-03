import { Outlet } from "react-router-dom";
import { MenuAppBar, Copyright } from "../components";
const SharedLayout = () => {
  return (
    <main className="container-fluid">
      {/* <SmallSidebar />
      <BigSidebar /> */}
      <MenuAppBar />
      <Outlet />
      <Copyright />
    </main>
  );
};
export default SharedLayout;
