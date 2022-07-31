import { Outlet } from "react-router-dom";

const SharedPagesLayout = ({ title = "" }) => {
  return (
    <div className="container-fluid">
      <h4>{title}</h4>
      <Outlet />
    </div>
  );
};
export default SharedPagesLayout;
