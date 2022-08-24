import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { axiosInstance } from "../../axiosInstance";
import { defaultPassword } from "../../utils/constants";
import { setInput, setIsEditing, clearIsEditing, setError, clearError, clearValues } from "../../features/client/clientSlice";
import { toast } from "react-toastify";

const NewClient = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { input, isEditing, isError, errorText } = useSelector((store) => store.client);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/clients", { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      dispatch(setIsEditing());
      await axiosInstance.post("/clients", {
        email: input.email,
        password: defaultPassword,
        name: input.name,
        description: input.description,
        address: input.address,
      });
      toast.success(`Successfully saved client ${input.name}`);
      navigate("/clients", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };
  if (!isMounted) return <></>;

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
            placeholder="Enter the client name"
            name="name"
            value={input.name}
            onChange={handleChange}
            disabled={isEditing}
          />
          <label htmlFor="name">Name:</label>
        </div>

        <div className="mb-3 mt-3">
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
        <div className="mb-3 mt-3">
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
        <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
          <i className="fa-solid fa-times" />
        </button>
        <button
          type="button"
          className="btn btn-primary me-2"
          data-bs-toggle="tooltip"
          title="Save"
          onClick={handleSave}
          disabled={isEditing || !input.email || !input.name || !input.description || !input.address}
        >
          <i className="fa-solid fa-floppy-disk" />
        </button>
        {isError && <p className="text-danger">{errorText}</p>}
      </form>
    </section>
  );
};

export default NewClient;
