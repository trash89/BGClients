import { useState, useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";
import { useIsMounted } from "../../lib/hooks";
import { Progress } from "../../components";
import { supabase } from "../../lib/supabaseClient";

const Clients = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const [data, setData] = useState([]);

  async function getData() {
    const { data: clients, error } = await supabase.from("clients").select("*");
    setData(clients);
  }

  useEffect(() => {
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  return (
    <div className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">Clients list</p>
      <Link href="/clients/newClient">
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
            {data.map((row) => {
              return (
                <tr key={row.id}>
                  <td>
                    <Link href="/">
                      <a>
                        <i className="fa-solid fa-pen" />
                      </a>
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
};

export default Clients;
