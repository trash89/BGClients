import { useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import {
  setInput,
  setData,
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setError,
  clearError,
  setEdit,
  clearValues,
} from "../../features/event/eventSlice";
import { toast } from "react-toastify";

const EditEvent = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let from = "/events";
  if (location.state) {
    from = location.state.from;
  } else from = "/events";

  const params = useParams();
  const { input, data, isLoading, isEditing, isError, errorText } = useSelector((store) => store.event);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      dispatch(clearValues());
      dispatch(setIsLoading());
      try {
        const respClients = await axiosInstance.get("/clients");
        try {
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
          dispatch(setError(error?.response?.data?.error?.message || error?.message));
          dispatch(setData({}));
        }
      } catch (error) {
        console.log(error);
        dispatch(setError(error?.response?.data?.error?.message || error?.message));
        dispatch(setData({}));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate(from, { replace: true });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      await axiosInstance.delete(`/events/${params.idEvent}`);
      dispatch(clearValues());
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      await axiosInstance.patch(`/events/${params.idEvent}`, {
        id: input.id,
        client_id: input.client_id,
        ev_name: input.ev_name,
        ev_description: input.ev_description,
        ev_date: input.ev_date,
        user_id: input.user_id,
        displayed: input.displayed,
      });
      toast.success(`Successfully saved event ${input.ev_name}`);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };
  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (user.isAdmin) {
    return (
      <section className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
        <p className="h4 text-capitalize">
          edit event
          <Link to={from} className="mx-1">
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </p>
        <div className="modal" id="deleteEvent">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Deleting Event</h4>
              </div>
              <div className="modal-body">Are you sure to delete the event {input.ev_name} ?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                  Delete
                </button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="was-validated">
          <div className="mb-3 mt-3">
            <label htmlFor="client_id" className="form-label">
              Client:
            </label>
            <select className="form-select" id="client_id" name="client_id" value={input.client_id} onChange={handleChange} disabled={isEditing}>
              {data?.clients?.map((client) => {
                return (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                );
              })}
            </select>
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
              disabled={isEditing}
            />
          </div>
          <div className="mb-3 mt-3">
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
              disabled={isEditing}
            />
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
                dispatch(setInput({ name: e.target.name, value: !input.displayed }));
              }}
              disabled={isEditing}
            />
            <label className="form-check-label">Displayed?</label>
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="ev_description" className="form-label">
              Event Description:
            </label>
            <textarea
              required
              className="form-control form-control-sm"
              rows="5"
              id="ev_description"
              name="ev_description"
              value={input.ev_description}
              onChange={handleChange}
              disabled={isEditing}
            />
          </div>
          <button type="button" className="btn btn-primary btn-sm me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
            <i className="fa-solid fa-times" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            title="Delete"
            disabled={isEditing}
            data-bs-toggle="modal"
            data-bs-target="#deleteEvent"
            data-bs-keyboard="false"
          >
            <i className="fa-solid fa-trash" />
          </button>

          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            data-bs-toggle="tooltip"
            title="Save"
            onClick={handleSave}
            disabled={isEditing || !input.ev_name || !input.ev_description || !input.ev_date || !input.client_id}
          >
            <i className="fa-solid fa-floppy-disk" />
          </button>
          {isError && <p className="text-danger">{errorText}</p>}
        </form>
        <br />
      </section>
    );
  }
};

export default EditEvent;
