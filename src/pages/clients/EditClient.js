import { useState, useEffect } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { useSelector } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import axios from "axios";

const EditClient = ({ data }) => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [input, setInput] = useState({
    name: data.name,
    description: data.description,
    address: data.address,
    email: data.email,
    password: "secret123",
  });

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  if (!user) navigate("/register");
  if (!user.isAdmin) navigate("/clients");
  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/clients");
    setInput({
      name: "",
      description: "",
      address: "",
      email: "",
      password: "",
    });
    setError(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/editUser", { id: data.user_id, email: input.email, password: input.password });

      const { data: clients, error } = await supabase
        .from("clients")
        .update({ email: input.email, name: input.name, description: input.description, address: input.address })
        .eq("id", data.id);
      if (error) {
        setError(`update client err: ${error?.message}`);
      } else {
        navigate("/clients");
      }
    } catch (error) {
      setError(`axios err: ${error?.response?.data?.error}`);
    }
  };
  const handleChange = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(null);
  };
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/deleteUser", { id: data.user_id });
      navigate("/clients");
    } catch (error) {
      setError(`axios err: ${error?.response?.data?.error}`);
    }
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
            <div className="col">
              <label htmlFor="password" className="form-label">
                Password:
              </label>
              <input
                required
                type="text"
                className="form-control"
                id="password"
                placeholder="Enter a new password"
                name="password"
                value={input.password}
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
          {error && <p className="text-danger">{error}</p>}
        </form>
      </section>
    );
  }
};

export default EditClient;

export async function getStaticPaths() {
  const { data, error } = await supabase.from("clients").select("*");
  if (error) {
    console.log("error EditClient getStaticPaths,", error);
    return { paths: [], fallback: "blocking" };
  }
  const paths = data.map((item) => ({
    params: { id: `${item.id}` },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data, error } = await supabase.from("clients").select("*").eq("id", `${params.id}`).single();
  if (error) {
    console.log("error EditClient getStaticProps,", error);
    return { props: { data: [] } };
  }

  return { props: { data } };
}
