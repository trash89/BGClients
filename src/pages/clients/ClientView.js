import { useSelector } from "react-redux";
import { ClientViewComponent } from "../../components";

const ClientView = () => {
  const { user } = useSelector((store) => store.user);
  return <>{user.isAdmin ? <></> : <ClientViewComponent user={user} />}</>;
};

export default ClientView;
