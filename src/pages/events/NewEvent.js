import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import {
  setInput,
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setData,
  setError,
  clearError,
  clearValues,
} from "../../features/event/eventSlice";

import { toast } from "react-toastify";

const NewEvent = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { input, data, isLoading, isEditing, isError, errorText } = useSelector((store) => store.event);

  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/events", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.get("/clients");
        dispatch(setData(resp.data));
        if (resp?.data?.clients?.length > 0) {
          dispatch(setInput({ ...input, name: "client_id", value: resp.data.clients[0].id }));
        }
      } catch (error) {
        console.log(error);
        dispatch(setError(error?.response?.data?.error?.message || error?.message));
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
    navigate("/events", { replace: true });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      const ev_date_formatted = new Date(input.ev_date).toISOString();
      await axiosInstance.post("/events", {
        client_id: input.client_id,
        ev_name: input.ev_name,
        ev_description: input.ev_description,
        ev_date: ev_date_formatted,
      });
      toast.success(`Successfully saved event ${input.ev_name}`);
      navigate("/events", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new event</p>
      <form className="was-validated">
        <div className="form-floating mb-3 mt-3">
          <select className="form-select" id="client_id" name="client_id" value={input.client_id} onChange={handleChange} disabled={isEditing}>
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
            disabled={isEditing}
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
            disabled={isEditing}
          />
          <label htmlFor="ev_name">Event Name:</label>
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
        <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
          <i className="fa-solid fa-times" />
        </button>
        <button
          type="button"
          className="btn btn-primary me-2"
          data-bs-toggle="tooltip"
          title="Save"
          onClick={handleSave}
          disabled={isEditing || !input.ev_name || !input.ev_description || !input.ev_date || !input.client_id}
        >
          <i className="fa-solid fa-floppy-disk" />
        </button>
        {isError && <p className="text-danger">{errorText}</p>}
      </form>
    </section>
  );
};

export default NewEvent;
