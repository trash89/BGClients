import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { setInput, setEdit, clearValues } from "../../features/client/clientSlice";

const EditClient = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { input, isLoading: isLoadingClient } = useSelector((store) => store.client);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients");
      return;
    }
    const getData = async () => {
      setLoading(true);
      try {
        const resp = await axiosInstance.get(`/clients/${params.idClient}`);
        const { id, name, description, address, email, localuser_id, user_id } = resp.data.client;
        dispatch(
          setEdit({
            editId: id,
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
        setError(error);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading || isLoadingClient || loading) return <Progress />;

  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    setError(null);
    navigate("/clients");
    return;
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const resp = await axiosInstance.delete(`/clients/${params.idClient}`);
      dispatch(clearValues());
      navigate("/clients");
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
      const resp = await axiosInstance.patch(`/clients/${params.idClient}`, {
        id: input.id,
        email: input.email,
        name: input.name,
        description: input.description,
        address: input.address,
        user_id: input.user_id,
        localuser_id: input.localuser_id,
      });
      dispatch(clearValues());
      navigate("/clients");
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChange = async (e) => {
    dispatch(setInput({ name: [e.target.name], value: e.target.value }));
    if (error) setError(null);
  };

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
          {error && <p className="text-center text-danger">{error.message}</p>}
        </form>
      </section>
    );
  }
};

export default EditClient;
