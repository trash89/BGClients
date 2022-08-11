import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";

const EditClient = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const params = useParams();
  const [error, setError] = useState(null);
  const [data, setData] = useState({});
  const [input, setInput] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    const getData = async () => {
      try {
        const resp = await axiosInstance.get(`/clients/${params.idClient}`);
        console.log(resp);
      } catch (error) {
        console.log(error);
      }
    };
    getData();
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  if (!data || data === []) return <></>;
  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/clients");
    setError(null);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const resp = await axiosInstance.delete("/clients", { id: params.idClient });
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const resp = await axiosInstance.post("/clients", {
        email: input.email,
        password: "secret123",
        name: input.name,
        description: input.description,
        address: input.address,
      });
      navigate("/clients");
    } catch (error) {
      console.log(error);
      setError(error);
    }
  };
  const handleChange = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(null);
  };

  if (user.isAdmin) {
    return (
      <section className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">edit client</p>
        <form className="was-validated">
          <div className="row">
            <div className="col">
              <label htmlFor="email" className="form-label">
                Email:
              </label>
              <input
                required
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter email"
                name="email"
                value={input.email}
                onChange={handleChange}
              />
            </div>
            <div className="col">
              <label htmlFor="name" className="form-label">
                Client Name:
              </label>
              <input
                autoFocus
                required
                type="text"
                className="form-control"
                id="name"
                placeholder="Enter client name"
                name="name"
                value={input.name}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="description" className="form-label">
              Client Description:
            </label>
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
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="address" className="form-label">
              Client Address:
            </label>
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