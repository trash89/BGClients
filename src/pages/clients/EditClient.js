import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import {
  setInput,
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setError,
  clearError,
  setEdit,
  clearValues,
} from "../../features/client/clientSlice";
import { toast } from "react-toastify";

const EditClient = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { input, isLoading, isEditing, isError, errorText } = useSelector((store) => store.client);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients", { replace: true });
    }
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.get(`/clients/${params.idClient}`);
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
      <section className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">edit client</p>
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
        <form className="was-validated">
          <div className="form-floating mb-3 mt-3">
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
            <label htmlFor="email">Email:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
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
            <label htmlFor="name">Name:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              required
              type="text"
              className="form-control"
              id="description"
              placeholder="Enter client description"
              name="description"
              value={input.description}
              onChange={handleChange}
              disabled={isEditing}
            />
            <label htmlFor="description">Description:</label>
          </div>
          <div className="form-floating mb-3 mt-3">
            <input
              required
              type="text"
              className="form-control"
              id="address"
              placeholder="Enter client address"
              name="address"
              value={input.address}
              onChange={handleChange}
              disabled={isEditing}
            />
            <label htmlFor="address">Address:</label>
          </div>
          <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
            <i className="fa-solid fa-times" />
          </button>
          <button
            type="button"
            className="btn btn-primary me-2"
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
            className="btn btn-primary me-2"
            data-bs-toggle="tooltip"
            title="Save"
            onClick={handleSave}
            disabled={isEditing || !input.name || !input.description || !input.address}
          >
            <i className="fa-solid fa-floppy-disk" />
          </button>
          {isError && <p className="text-danger">{errorText}</p>}
        </form>
      </section>
    );
  }
};

export default EditClient;
