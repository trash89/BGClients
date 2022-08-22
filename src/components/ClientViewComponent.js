import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../hooks";
import { Progress } from "../components";
import { setInput, setIsLoading, clearIsLoading, setError, clearError, setEdit, clearValues } from "../features/client/clientSlice";

const ClientViewComponent = ({ user }) => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { input, isLoading, isError, errorText } = useSelector((store) => store.client);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.post("/clientview", { id: user.id, email: user.email });
        console.log(resp.data);
      } catch (error) {
        console.log(error);
        dispatch(setError(error.response.data.error.message));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <div>
      Client view component, user={user.email} {user.id}
    </div>
  );
};

export default ClientViewComponent;
