import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress, TotalRows } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import { downloadAsCsv } from "../../utils/constants";
import { setIsLoading, clearIsLoading, setData, clearValues } from "../../features/client/clientSlice";

const Clients = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const { data, isLoading } = useSelector((store) => store.client);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.email, name: "Email" },
      { accessor: (item) => item.name, name: "Name" },
      { accessor: (item) => item.description, name: "Description" },
      { accessor: (item) => item.address, name: "Address" },
    ];
    downloadAsCsv(columns, data.clients, "Clients");
  };

  useEffect(() => {
    if (!user) {
      navigate("/register", { replace: true });
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    dispatch(clearValues());
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.get("/clients");
        dispatch(setData(resp.data));
      } catch (error) {
        console.log(error);
        dispatch(setData({}));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (!user.isAdmin) {
    return <Navigate to="/clients/clientView" replace={true} />;
  }
  return (
    <div className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">Clients list</p>
      <TotalRows link="/clients/newClient" count={data.count} download={handleDownloadCsv} />
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-primary">
            <tr>
              <th>Action</th>
              <th>Email</th>
              <th>Name</th>
              <th>Description</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {data?.clients?.map((row) => {
              return (
                <tr key={row.id}>
                  <td>
                    <Link to={`/clients/${row.id}`} className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" title="Edit Client">
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
};

export default Clients;
