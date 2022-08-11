import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
//import { supabase } from "../supabaseClient";
import axios from "axios";
import { useCookies } from "react-cookie";

import { Logo, Copyright, Progress } from "../components";
import { loginUser } from "../features/user/userSlice";
import { addUserToLocalStorage } from "../utils/localStorage";
import { useIsMounted } from "../hooks";
import { APISERVER } from "../utils/constants";

export default function Register() {
  const [cookies, setCookie] = useCookies();
  const isMounted = useIsMounted();
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [isErrorInput, setIsErrorInput] = useState({
    email: false,
    password: false,
  });
  const [error, setError] = useState(null);

  const { user, isLoading } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const resp = await axios.post(`${APISERVER}/auth/login`, { email, password });
      const { user, session } = resp.data;
      setCookie("sb-access-token", session.access_token, { path: "/" });
      setCookie("sb-refresh-token", session.refresh_token, { path: "/" });
      const localObject = {
        access_token: session.access_token,
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
      };
      addUserToLocalStorage(localObject);
      dispatch(loginUser(localObject));
    } catch (error) {
      setError(error);
      console.log("error signIn localuser=", error);
    }

    // const { user, session, error } = await supabase.auth.signIn({ email, password });
    // if (!error) {
    //   const { data: localUser, error: errorLocalUser } = await supabase.from("localusers").select("isAdmin").eq("user_id", user.id).single();
    //   if (!errorLocalUser) {
    //     const localObject = {
    //       access_token: session.access_token,
    //       id: user.id,
    //       email: user.email,
    //       isAdmin: localUser.isAdmin,
    //     };
    //     addUserToLocalStorage(localObject);
    //     dispatch(loginUser(localObject));
    //   } else {
    //     setError(errorLocalUser);
    //     console.log("error signIn localuser=", errorLocalUser);
    //   }
    // } else {
    //   setError(error);
    //   console.log("error signIn=", error);
    // }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (input.email && input.email !== "") {
      if (input.password && input.password !== "") {
        const { email, password } = input;
        if (!password || !email) {
          return;
        }
        await login(email, password);
        return;
      } else {
        setIsErrorInput({ ...isErrorInput, password: true });
        if (error) setError(null);
      }
    } else {
      setIsErrorInput({ ...isErrorInput, email: true });
      if (error) setError(null);
    }
  };

  const handleEmail = async (e) => {
    setInput({ ...input, email: e.target.value });
    if (isErrorInput.email) setIsErrorInput({ ...isErrorInput, email: false });
    if (error) setError(null);
  };
  const handlePassword = async (e) => {
    setInput({ ...input, password: e.target.value });
    if (isErrorInput.password) setIsErrorInput({ ...isErrorInput, password: false });
    if (error) setError(null);
  };

  useEffect(() => {
    if (user) {
      navigate("/clients");
    }
    // eslint-disable-next-line
  }, [user]);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  return (
    <div className="container mx-auto" style={{ width: "300px" }}>
      <div className="container-fluid p-2 my-4 shadow border border-primary rounded-3">
        <div className="d-flex flex-row justify-content-center align-content-center align-items-center p-0 m-0">
          <Logo />
          <p className="h4 text-center text-capitalize flex-grow-1">BG Clients</p>
        </div>
        <form onSubmit={onSubmit}>
          <p className="h6 text-center text-capitalize pt-2">Login</p>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input autoFocus className="form-control" id="email" type="email" value={input.email} onChange={handleEmail} required />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input className="form-control" id="Password" type="password" value={input.password} onChange={handlePassword} required />
          </div>
          <div className="d-flex justify-content-center align-content-center align-items-center">
            <button type="submit" className="btn btn-primary text-capitalize flex-fill m-1" disabled={isLoading}>
              {isLoading ? "loading..." : "connect"}
            </button>
          </div>
          {error && <p className="text-center text-danger">{error.message}</p>}
        </form>
        <Copyright />
      </div>
    </div>
  );
}
