import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

import { useSelector } from "react-redux";
import { useIsMounted } from "../../lib/hooks";
import { Progress } from "../../components";
import { supabase } from "../../lib/supabaseClient";

const NewEvent = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const router = useRouter();
  const [error, setError] = useState(null);
  const [input, setInput] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (!user) router.push("/register");
  if (!user.isAdmin) router.push("/events");

  const handleCancel = async (e) => {
    e.preventDefault();
    router.push("/events");
    setInput({
      name: "",
      description: "",
      address: "",
      email: "",
    });
    setError(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post("/api/createUser", { email: input.email });
      const { data, error } = await supabase.from("clients").insert({
        email: input.email,
        name: input.name,
        description: input.description,
        address: input.address,
        localuser_id: resp.data.user.id,
        user_id: resp.data.user.user_id,
      });
      if (error) {
        setError(`insert clients err: ${error?.message}`);
      } else {
        router.push("/events");
      }
    } catch (error) {
      setError(`axios err: ${error?.response?.data?.error}`);
    }
  };
  const handleChange = async (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
    if (error) setError(null);
  };
  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new client</p>
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
        {error && <p className="text-danger">{error}</p>}
      </form>
    </section>
  );
};

export default NewEvent;
