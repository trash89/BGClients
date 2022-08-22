import { useEffect } from "react";
import { axiosInstance } from "../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../hooks";
import { Progress } from "../components";
import { setData, setIsLoading, clearIsLoading, setError } from "../features/client/clientSlice";
import moment from "moment";
import { dateFormat } from "../utils/constants";

const ClientViewComponent = ({ user }) => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const { data, isLoading } = useSelector((store) => store.client);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.post("/clientview", { id: user.id, email: user.email });
        dispatch(setData(resp.data));
        console.log(resp.data);
      } catch (error) {
        console.log(error);
        dispatch(setError(error?.response?.data?.error?.message || error?.message));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h5">{data.client.email}</p>
      <p className="h6">{data.client.address}</p>
      <div className="mb-1 mt-1">
        {data.events.length > 0 ? (
          <>
            <p className="h6">Events</p>
            {data.events.map((event) => {
              const ev_date_formatted = new moment(event.ev_date).format(dateFormat);
              return (
                <div className="card" key={event.id}>
                  <div className="card-header">
                    {ev_date_formatted} - {event.ev_name}
                  </div>
                  <div className="card-body">{event.ev_description}</div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-1 mt-1">
        {data.userfiles.length > 0 ? (
          <>
            <p className="h6">Files</p>
            {data.userfiles.map((file) => {
              return (
                <div className="card" key={file.id}>
                  <div className="card-header">{file.file_description}</div>
                  <div className="card-body">
                    <a href={file.signedURL} target="_blank" rel="noreferrer">
                      {file.file_name}
                    </a>
                    {" ,"}
                    {file.size} Mb
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
    </section>
  );
};

export default ClientViewComponent;
