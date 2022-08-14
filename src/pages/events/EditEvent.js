import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { setInput, setData, setIsLoading, clearIsLoading, setError, clearError, setEdit, clearValues } from "../../features/event/eventSlice";

const EditEvent = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const { input, data, isLoading, isError, errorText } = useSelector((store) => store.event);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients");
      return;
    }
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const respClients = await axiosInstance.get("/clients");
        const resp = await axiosInstance.get(`/events/${params.idEvent}`);
        const { id, client_id, ev_name, ev_description, ev_date, user_id, displayed } = resp.data.event;
        dispatch(setData(respClients.data));
        dispatch(
          setEdit({
            input: {
              id,
              client_id,
              ev_name,
              ev_description,
              ev_date,
              user_id,
              displayed,
            },
          })
        );
      } catch (error) {
        console.log(error);
        dispatch(setError(error.response.data.error.message));
        dispatch(setData({}));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
  }, []);

  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate("/events");
    return;
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      await axiosInstance.delete(`/events/${params.idEvent}`);
      dispatch(clearValues());
      navigate("/events");
    } catch (error) {
      console.log(error);
      dispatch(setError(error.response.data.error.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      await axiosInstance.patch(`/events/${params.idEvent}`, {
        id: input.id,
        client_id: input.client_id,
        ev_name: input.ev_name,
        ev_description: input.ev_description,
        ev_date: input.ev_date,
        user_id: input.user_id,
        displayed: input.displayed,
      });
      dispatch(clearValues());
      navigate("/events");
      return;
    } catch (error) {
      console.log(error);
      dispatch(setError(error.response.data.error.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };
  const handleChange = async (e) => {
    console.log({ name: e.target.name, value: e.target.value });
    dispatch(setInput({ name: e.target.name, value: e.target.value }));

    if (isError) dispatch(clearError());
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

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
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="displayed"
              name="displayed"
              value={input.displayed}
              checked={input.displayed}
              onChange={(e) => {
                console.log(e.target.value);
                dispatch(setInput({ name: e.target.name, value: !e.target.value }));
              }}
            />
            <label className="form-check-label">Displayed?</label>
          </div>
          {input.displayed ? "true" : "false"}
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
          {isError && <p className="text-danger">{errorText}</p>}
        </form>
      </section>
    );
  }
};

export default EditEvent;
