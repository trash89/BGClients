import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import { defaultPassword } from "../../utils/constants";

const NewEvent = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.user);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState([]);
  const [input, setInput] = useState({
    id: "",
    ev_name: "",
    ev_description: "",
    ev_date: "",
    client_id: -1,
    user_id: "",
  });

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/events");
      return;
    }
    const getData = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get("/clients");
        setClients(resp.data.clients);
        setInput({ ...input, client_id: resp?.data?.clients[0]?.id });
      } catch (error) {
        console.log(error);
        setClients([]);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleChange = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(null);
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/events");
    setError(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axiosInstance.post("/events", {
        client_id: input.client_id,
        ev_name: input.ev_name,
        ev_description: input.ev_description,
        ev_date: input.ev_date,
      });
      navigate("/events");
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  if (!isMounted) return <></>;
  if (isLoading || loading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new event</p>
      <form className="was-validated">
        <div className="row">
          <div className="col">
            <label htmlFor="client_id" className="form-label">
              Client:
            </label>
            <select class="form-select" id="client_id" name="client_id" value={input.client_id} onChange={handleChange}>
              {clients.map((client) => {
                return (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="col">
            <label htmlFor="ev_name" className="form-label">
              Event Name:
            </label>
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
          </div>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="ev_description" className="form-label">
            Event Description:
          </label>
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
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="ev_date" className="form-label">
            Event Date:
          </label>
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
        </div>
        <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel}>
          <i className="fa-solid fa-times" />
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
};

export default NewEvent;
