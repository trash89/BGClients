import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { supabase } from "../../supabaseClient";

const Clients = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const [clients, setClients] = useState([]);

  const getData = async () => {
    let query = supabase.from("clients").select("*");
    if (!user.isAdmin) {
      query = query.eq("user_id", user.id);
    }
    const { data, error } = await query;
    if (error) {
      console.log("error Clients=,", error);
      setClients([]);
    }
    setClients(data);
  };
  useEffect(() => {
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  if (user.isAdmin) {
    return (
      <div className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">Clients list</p>
        <Link to="/clients/newClient" className="btn btn-outline-primary btn-sm">
          <i className="fa-solid fa-plus" />
        </Link>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm">
            <thead>
              <tr>
                <th>Action</th>
                <th>Email</th>
                <th>Name</th>
                <th>Description</th>
                <th>Address</th>
              </tr>
            </thead>
            <tbody>
              {clients?.map((row) => {
                return (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/clients/${row.id}`} className="btn btn-outline-primary btn-sm">
                        <i className="fa-solid fa-pen" />
                      </Link>
                    </td>
                    <td>{row.email}</td>
                    <td>{row.name}</td>
                    <td>{row.description}</td>
                    <td>{row.address}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <>for clients</>;
  }
};

export default Clients;
