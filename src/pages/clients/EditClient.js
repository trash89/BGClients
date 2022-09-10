import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress, TotalRows } from "../../components";
import { defaultPassword, dateFormat } from "../../utils/constants";
import {
  setInput,
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setError,
  clearError,
  setEdit,
  setData,
  clearValues,
} from "../../features/client/clientSlice";
import { toast } from "react-toastify";
import moment from "moment";

const EditClient = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const params = useParams();

  const { input, data, isLoading, isEditing, isError, errorText } = useSelector((store) => store.client);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.get(`/clients/${params.idClient}`);
        dispatch(setData({ events: resp.data.events, userfiles: resp.data.userfiles }));
        const { id, name, description, address, email, localuser_id, user_id } = resp.data.client;
        dispatch(
          setEdit({
            input: {
              id,
              name,
              description,
              address,
              email,
              localuser_id,
              user_id,
            },
          })
        );
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
    navigate("/clients", { replace: true });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      await axiosInstance.delete(`/clients/${params.idClient}`);
      toast.success(`Successfully deleted client ${input.name}...`);
      navigate("/clients", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      await axiosInstance.put(`/clients/${params.idClient}`, { password: defaultPassword });
      toast.success(`Successfully resetted the password for client ${input.name}...`);
      navigate("/clients", { replace: true });
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
      await axiosInstance.patch(`/clients/${params.idClient}`, {
        id: input.id,
        email: input.email,
        name: input.name,
        description: input.description,
        address: input.address,
        user_id: input.user_id,
        localuser_id: input.localuser_id,
      });
      toast.success(`Successfully saved client ${input.name}...`);
      navigate("/clients", { replace: true });
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
          edit client
          <Link to={"/clients"} className="mx-1">
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </p>
        <div className="modal" id="deleteClient">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Deleting Client</h4>
              </div>
              <div className="modal-body">Are you sure to delete the client {input.name} ?</div>
              <div className="modal-body">All Events,Files and details associated with this client will be deleted too !!!</div>
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
        <div className="modal" id="resetClient">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Resetting the password for a client</h4>
              </div>
              <div className="modal-body">Are you sure to reset the password for client {input.name} ?</div>
              <div className="modal-body">His default password will be {defaultPassword}</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleReset}>
                  Reset
                </button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="was-validated">
          <div className="row mb-3 mt-3">
            <div className="col">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                autoFocus
                required
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                value={input.email}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
            <div className="col">
              <label htmlFor="name" className="form-label">
                Name:
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter client name"
                name="name"
                value={input.name}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
          </div>
          <div className="row mb-3 mt-3">
            <div className="col">
              <label htmlFor="description" className="form-label">
                Client Description:
              </label>
              <textarea
                required
                className="form-control form-control-sm"
                rows="5"
                id="description"
                name="description"
                value={input.description}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
            <div className="col">
              <label htmlFor="address" className="form-label">
                Client Address:
              </label>
              <textarea
                required
                className="form-control form-control-sm"
                rows="5"
                id="address"
                name="address"
                value={input.address}
                onChange={handleChange}
                disabled={isEditing}
              />
            </div>
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
            data-bs-target="#deleteClient"
            data-bs-keyboard="false"
          >
            <i className="fa-solid fa-trash" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            title="Reset Password"
            disabled={isEditing}
            data-bs-toggle="modal"
            data-bs-target="#resetClient"
            data-bs-keyboard="false"
          >
            <i className="fa-solid fa-unlock-keyhole"></i>
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            data-bs-toggle="tooltip"
            title="Save"
            onClick={handleSave}
            disabled={isEditing || !input.name || !input.description || !input.address}
          >
            <i className="fa-solid fa-floppy-disk" />
          </button>
          <div className="row mb-3 mt-3">
            <div className="col">
              <TotalRows link="/events/newEvent" count={data?.events?.count} title="Events" state={{ from: location.pathname, client_id: input.id }} />
              <ul className="list-group">
                {data?.events?.events?.map((row) => {
                  const ev_date_formatted = new moment(row.ev_date).format(dateFormat);
                  return (
                    <Link
                      to={`/events/${row.id}`}
                      state={{ from: location.pathname, client_id: input.id }}
                      className="list-group-item btn btn-light btn-sm"
                      data-bs-toggle="tooltip"
                      title="Edit Event"
                      key={row.id}
                    >
                      {ev_date_formatted}, {row.ev_name}, {row.ev_description},{row.displayed ? "Yes" : "No"}
                    </Link>
                  );
                })}
              </ul>
            </div>
            <div className="col">
              <TotalRows link="/userfiles/newFile" count={data?.userfiles?.count} title="Files" state={{ from: location.pathname, client_id: input.id }} />
              <ul className="list-group">
                {data?.userfiles?.userfiles?.map((row) => {
                  return (
                    <Link
                      to={`/userfiles/${row.id}`}
                      state={{ from: location.pathname, client_id: input.id }}
                      className="list-group-item btn btn-light btn-sm"
                      data-bs-toggle="tooltip"
                      title="Edit Userfile"
                      key={row.id}
                    >
                      {row.file_name}, {row.file_description},{row.displayed ? "Yes" : "No"}
                    </Link>
                  );
                })}
              </ul>
            </div>
          </div>
          {isError && <p className="text-danger">{errorText}</p>}
        </form>
        <br />
      </section>
    );
  }
};

export default EditClient;
