import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import moment from "moment";
import { dateFormat } from "../../utils/constants";

const Events = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get("/events");
        setEvents(resp.data.events);
      } catch (error) {
        console.log(error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loading) return <Progress />;
  if (user.isAdmin) {
    return (
      <div className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">Events list</p>
        <Link to="/events/newEvent" className="btn btn-outline-primary btn-sm">
          <i className="fa-solid fa-plus" />
        </Link>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm">
            <thead className="table-primary">
              <tr>
                <th>Action</th>
                <th>Date</th>
                <th>Client</th>
                <th>Event</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {events?.map((row) => {
                const ev_date_formatted = new moment(row.ev_date).format(dateFormat);
                return (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/events/${row.id}`} className="btn btn-outline-primary btn-sm">
                        <i className="fa-solid fa-pen" />
                      </Link>
                    </td>
                    <td>{ev_date_formatted}</td>
                    <td>{row.clients.name}</td>
                    <td>{row.ev_name}</td>
                    <td>{row.ev_description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <>for events</>;
  }
};

export default Events;
