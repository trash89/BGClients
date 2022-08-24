import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress, TotalRows } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import { setIsLoading, clearIsLoading, setData, clearValues } from "../../features/userfile/userfileSlice";

const UserFiles = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const { data, isLoading } = useSelector((store) => store.userfile);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
        const resp = await axiosInstance.get("/userfiles");
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
      <p className="h4 text-capitalize">Userfiles list</p>
      <TotalRows link="/userfiles/newFile" count={data?.count} data-bs-toggle="tooltip" title="New File" />
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-primary">
            <tr>
              <th>Action</th>
              <th>Client</th>
              <th>File</th>
              <th>Description</th>
              <th>Displayed</th>
            </tr>
          </thead>
          <tbody>
            {data?.userfiles?.map((row) => {
              return (
                <tr key={row?.id}>
                  <td>
                    <Link to={`/userfiles/${row?.id}`} className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" title="Edit File">
                      <i className="fa-solid fa-pen" />
                    </Link>
                  </td>
                  <td>{row?.clients.name}</td>
                  <td>{row?.file_name}</td>
                  <td>{row?.file_description}</td>
                  <td>{row?.displayed ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserFiles;
