import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Navigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress, TotalRows } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import moment from "moment";
import { dateFormat, downloadAsCsv } from "../../utils/constants";
import { setIsLoading, clearIsLoading, setData, clearValues } from "../../features/event/eventSlice";

const Events = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const { data, isLoading } = useSelector((store) => store.event);
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
        const resp = await axiosInstance.get("/events");
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

  const handleDownloadCsv = () => {
    const columns = [
      { accessor: (item) => item.ev_date, name: "Event Date" },
      { accessor: (item) => item.clients.name, name: "Client Name" },
      { accessor: (item) => item.ev_name, name: "Event Name" },
      { accessor: (item) => item.ev_description, name: "Event Description" },
      { accessor: (item) => item.displayed, name: "Displayed?" },
    ];
    downloadAsCsv(columns, data.events, "Events");
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (!user.isAdmin) {
    return <Navigate to="/clients/clientView" replace={true} />;
  }

  return (
    <div className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">Events list</p>
      <TotalRows link="/events/newEvent" count={data.count} download={handleDownloadCsv} data-bs-toggle="tooltip" title="New Event" />
      <div className="table-responsive">
        <table className="table table-bordered table-hover table-sm">
          <thead className="table-primary">
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Client</th>
              <th>Event</th>
              <th>Description</th>
              <th>Displayed</th>
            </tr>
          </thead>
          <tbody>
            {data?.events?.map((row) => {
              const ev_date_formatted = new moment(row.ev_date).format(dateFormat);
              return (
                <tr key={row.id}>
                  <td>
                    <Link to={`/events/${row.id}`} className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" title="Edit Event">
                      <i className="fa-solid fa-pen" />
                    </Link>
                  </td>
                  <td>{ev_date_formatted}</td>
                  <td>{row.clients.name}</td>
                  <td>{row.ev_name}</td>
                  <td>{row.ev_description}</td>
                  <td>{row.displayed ? "Yes" : "No"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Events;
