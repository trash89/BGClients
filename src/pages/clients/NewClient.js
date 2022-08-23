import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import { defaultPassword } from "../../utils/constants";
import { setInput, setIsLoading, clearIsLoading, setError, clearError, clearValues } from "../../features/client/clientSlice";

const NewClient = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { input, isLoading, isError, errorText } = useSelector((store) => store.client);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients", { replace: true });
    }
  }, [user]);

  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate("/clients", { replace: true });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      await axiosInstance.post("/clients", {
        email: input.email,
        password: defaultPassword,
        name: input.name,
        description: input.description,
        address: input.address,
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
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new client</p>
      <form className="was-validated">
        <div className="form-floating mb-3 mt-3">
          <input
            autoFocus
            required
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter the email"
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
            placeholder="Enter the client name"
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
            placeholder="Enter the client description"
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
            placeholder="Enter the client address"
            name="address"
            value={input.address}
            onChange={handleChange}
          />
          <label htmlFor="address">Address:</label>
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
          disabled={!input.email || !input.name || !input.description || !input.address}
        >
          <i className="fa-solid fa-floppy-disk" />
        </button>
        {isError && <p className="text-danger">{errorText}</p>}
      </form>
    </section>
  );
};

export default NewClient;
