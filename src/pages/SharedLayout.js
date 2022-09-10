import { Outlet } from "react-router-dom";
import { SmallSidebar, BigSidebar, Navbar, Footer } from "../components";
const SharedLayout = () => {
  return (
    <main className="principal">
      <SmallSidebar />
      <BigSidebar />
      <div className="principal-page">
        <Navbar />
        <div>
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  );
};
export default SharedLayout;
