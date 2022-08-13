import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";

const EditEvent = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({});
  const [input, setInput] = useState({
    id: "",
    client_id: "",
    ev_name: "",
    ev_description: "",
    ev_date: "",
    user_id: "",
  });

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients");
      return;
    }
    const getData = async () => {
      setLoading(true);
      try {
        const respClients = await axiosInstance.get("/clients");
        setData(respClients.data);
        const resp = await axiosInstance.get(`/events/${params.idEvent}`);
        const { id, client_id, ev_name, ev_description, ev_date, user_id } = resp.data.event;
        setInput({
          id,
          client_id,
          ev_name,
          ev_description,
          ev_date,
          user_id,
        });
      } catch (error) {
        console.log(error);
        setError(error);
        setData({});
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || loading) return <Progress />;

  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/events");
    setError(null);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axiosInstance.delete(`/events/${params.idEvent}`);
      navigate("/events");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);

      const resp = await axiosInstance.patch(`/events/${params.idEvent}`, {
        id: input.id,
        client_id: input.client_id,
        ev_name: input.ev_name,
        ev_description: input.ev_description,
        ev_date: input.ev_date,
        user_id: input.user_id,
      });
      navigate("/events");
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  if (user.isAdmin) {
    return (
      <section className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">edit event</p>
        <form className="was-validated">
          <div className="form-floating mb-3 mt-3">
            <select className="form-select" id="client_id" name="client_id" value={input.client_id} onChange={handleChange}>
              {data?.clients?.map((client) => {
                return (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                );
              })}
            </select>
            <label htmlFor="client_id">Client:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              required
              type="date"
              className="form-control"
              id="ev_date"
              placeholder="Enter the event date"
              name="ev_date"
              value={input.ev_date}
              onChange={handleChange}
            />
            <label htmlFor="ev_date">Event Date:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              required
              type="text"
              className="form-control"
              id="ev_name"
              placeholder="Enter the event name"
              name="ev_name"
              value={input.ev_name}
              onChange={handleChange}
            />
            <label htmlFor="ev_name">Event Name:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              required
              type="text"
              className="form-control"
              id="ev_description"
              placeholder="Enter the event description"
              name="ev_description"
              value={input.ev_description}
              onChange={handleChange}
            />
            <label htmlFor="ev_description">Event Description:</label>
          </div>
          <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel}>
            <i className="fa-solid fa-times" />
          </button>
          <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Delete" onClick={handleDelete}>
            <i className="fa-solid fa-trash" />
          </button>

          <button
            type="button"
            className="btn btn-primary me-2"
            data-bs-toggle="tooltip"
            title="Save"
            onClick={handleSave}
            disabled={!input.ev_name || !input.ev_description || !input.ev_date || !input.client_id}
          >
            <i className="fa-solid fa-floppy-disk" />
          </button>
          {error && <p className="text-center text-danger">{error.message}</p>}
        </form>
      </section>
    );
  }
};

export default EditEvent;
