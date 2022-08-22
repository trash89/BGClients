import { useSelector } from "react-redux";
import { ClientViewComponent } from "../../components";

const ClientView = () => {
  const { user: userRedux } = useSelector((store) => store.user);
  if (!userRedux.isAdmin) {
    return <ClientViewComponent user={userRedux} />;
  } else {
    return <></>;
  }
};

export default ClientView;
