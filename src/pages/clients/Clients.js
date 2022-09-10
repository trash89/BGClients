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
    <div className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
      <TotalRows link="/clients/newClient" count={data.count} download={handleDownloadCsv} title="Clients list" />
      <div className="list-group">
        {data?.clients?.map((row) => {
          return (
            <Link to={`/clients/${row.id}`} className="list-group-item btn btn-light btn-sm" data-bs-toggle="tooltip" title="Edit Client" key={row.id}>
              {row.name}, {row.email}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Clients;
