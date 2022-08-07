import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";

import { useIsMounted } from "../../lib/hooks";
import { dateFormat } from "../../lib/utils/constants";
import { Progress } from "../../components";
import { supabase } from "../../lib/supabaseClient";

const NewClient = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const router = useRouter();
  const [input, setInput] = useState({
    name: "",
    description: "",
    address: "",
    email: "",
  });
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (!user) {
    router.push("/register");
  }
  const onSubmit = async (e) => {
    e.preventDefault();

    if (input.email && input.email !== "") {
      if (input.name && input.name !== "") {
        if (input.description && input.description !== "") {
          if (input.address && input.address !== "") {
            try {
              const resp = await axios.post("/api/createUser", { email: input.email, password: "secret123" });
              console.log(resp.data);
              const { data, error } = await supabase
                .from("clients")
                .insert([{ email: input.email, name: input.name, description: input.description, address: input.address, localuser_id: resp.data.user.id }]);
              if (error) {
                console.log(error);
              }
            } catch (error) {
              console.log(error);
            }
          }
        }
      }
    }
  };
  return (
    <div className="container p-2 my-2 border border-primary rounded-3">
      <p class="h4 text-capitalize">New Client</p>
      <form onSubmit={onSubmit}>
        <div className="mb-3 mt-3">
          <label htmlFor="email" className="form-label">
            Email:
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            placeholder="Enter email"
            name="email"
            value={input.email}
            onChange={(e) => setInput({ ...input, email: e.target.value })}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="name" className="form-label">
            Client Name:
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            placeholder="Enter client name"
            name="name"
            value={input.name}
            onChange={(e) => setInput({ ...input, name: e.target.value })}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="description" className="form-label">
            Client Description:
          </label>
          <input
            type="text"
            className="form-control"
            id="description"
            placeholder="Enter client description"
            name="description"
            value={input.description}
            onChange={(e) => setInput({ ...input, description: e.target.value })}
          />
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="address" className="form-label">
            Client Address:
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter client address"
            name="address"
            value={input.address}
            onChange={(e) => setInput({ ...input, address: e.target.value })}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </div>
  );
};

export default NewClient;
