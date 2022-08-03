import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { Progress } from "../../components";

const Clients = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  if (!isMounted) return <></>;
  //if (loading) return <Progress />;

  if (!user) {
    return <Navigate to="/register" />;
  }

  return <div>Clients</div>;
};

export default Clients;
