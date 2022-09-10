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
    <div className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
      <TotalRows link="/userfiles/newFile" count={data?.count} title="Userfiles list" />
      <ul className="list-group">
        {data?.userfiles?.map((row) => {
          return (
            <Link to={`/userfiles/${row.id}`} className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" title="Edit Userfile" key={row.id}>
              {row?.clients.name}, {row?.file_name}, {row?.file_description}, {row?.displayed ? "Yes" : "No"}
            </Link>
          );
        })}
      </ul>
      <br />
    </div>
  );
};

export default UserFiles;
