import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import axios from "axios";
import { APISERVER } from "../../utils/constants";

const NewClient = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const { user, isLoading } = useSelector((store) => store.user);
  const [error, setError] = useState(null);
  const [input, setInput] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });

  useEffect(() => {
    if (!user.isAdmin) navigate("/clients");
  }, []);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  const handleCancel = async (e) => {
    e.preventDefault();
    navigate("/clients");
    setError(null);
  };
  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const resp = await axios.post(`${APISERVER}/users`, { email: input.email }, { withCredentials: true });
      const { data: client, error: errorClient } = await supabase.from("clients").insert({
        email: input.email,
        name: input.name,
        description: input.description,
        address: input.address,
        localuser_id: resp.data.user.id,
        user_id: resp.data.user.user_id,
      });
      if (errorClient) {
        setError(errorClient);
      } else {
        navigate("/clients");
      }
    } catch (error) {
      setError(error);
    }

    // const { data: createdUser, error: errorCreatedUser } = await supabase.auth.api.createUser({
    //   email: input.email,
    //   email_confirm: true,
    //   password: "secret123",
    // });
    // if (!errorCreatedUser) {
    //   const { data: localUser, error: errorLocalUser } = await supabase.from("localusers").insert({ user_id: createdUser.id, isAdmin: false });
    //   if (!errorLocalUser) {
    //     const { data: client, error } = await supabase.from("clients").insert({
    //       email: input.email,
    //       name: input.name,
    //       description: input.description,
    //       address: input.address,
    //       localuser_id: localUser[0].id,
    //       user_id: localUser[0].user_id,
    //     });
    //     if (error) {
    //       setError(error);
    //     } else {
    //       navigate("/clients");
    //     }
    //   } else {
    //     setError(errorLocalUser);
    //   }
    // } else {
    //   setError(errorCreatedUser);
    // }
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
        {error && <p className="text-center text-danger">{error.message}</p>}
      </form>
    </section>
  );
};

export default NewClient;
