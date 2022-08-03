import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { Progress } from "../../components";
import { supabase } from "../../supabaseClient";

const Clients = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  useEffect(() => {
    const getClients = async () => {
      const { data, error } = await supabase.from("clients").select();
      console.log(data);
    };

    getClients();
  }, []);

  if (!isMounted) return <></>;
  //if (loading) return <Progress />;

  if (!user) {
    return <Navigate to="/register" />;
  }

  return <div>Clients</div>;
};

export default Clients;
