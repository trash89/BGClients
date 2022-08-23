import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { setInput, setIsLoading, clearIsLoading, setError, clearError, setEdit, clearValues } from "../../features/client/clientSlice";

const EditClient = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const { input, isLoading, isError, errorText } = useSelector((store) => store.client);

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
      dispatch(setIsLoading());
      await axiosInstance.delete(`/clients/${params.idClient}`);
      dispatch(clearValues());
      navigate("/clients", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      await axiosInstance.patch(`/clients/${params.idClient}`, {
        id: input.id,
        email: input.email,
        name: input.name,
        description: input.description,
        address: input.address,
        user_id: input.user_id,
        localuser_id: input.localuser_id,
      });
      dispatch(clearValues());
      navigate("/clients", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsLoading());
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
            />
            <label htmlFor="address">Address:</label>
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
            disabled={!input.name || !input.description || !input.address}
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
