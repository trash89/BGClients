import { Outlet } from "react-router-dom";

const SharedPagesLayout = ({ title = "" }) => {
  return <Outlet />;
};
export default SharedPagesLayout;
