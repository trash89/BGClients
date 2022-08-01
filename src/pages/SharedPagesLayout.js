import { Outlet } from "react-router-dom";

const SharedPagesLayout = () => {
  return (
    <div className="container-fluid">
      <Outlet />
    </div>
  );
};
export default SharedPagesLayout;
