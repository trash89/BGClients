import { useState, useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { useIsMounted } from "../../hooks";
import { dateFormat } from "../../utils/constants";
import { Progress } from "../../components";
import { supabase } from "../../supabaseClient";

const NewClient = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [input, setInput] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });
  if (!isMounted) return <></>;
  //if (loading) return <Progress />;

  if (!user) {
    return <Navigate to="/register" />;
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    if (input.email && input.email !== "") {
      if (input.name && input.name !== "") {
        if (input.description && input.description !== "") {
          if (input.address && input.address !== "") {
            const { user: createdUser, session, error } = await supabase.auth.signUp({ email: input.email, password: "secret" });
          }
        }
      }
    }
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input type="email" className="form-control" id="email" placeholder="Enter email" name="email" />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">
            Client Name:
          </label>
          <input type="text" className="form-control" id="name" placeholder="Enter client name" name="name" />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="description" className="form-label">
            Client Description:
          </label>
          <input type="text" className="form-control" id="description" placeholder="Enter client description" name="description" />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="address" className="form-label">
            Client Address:
          </label>
          <input type="text" className="form-control" id="address" placeholder="Enter client address" name="address" />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewClient;
