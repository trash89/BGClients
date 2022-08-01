import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Logo } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../features/user/userSlice";
import { useNavigate } from "react-router-dom";
import { addUserToLocalStorage } from "../utils/localStorage";
import { useIsMounted } from "../hooks";

import { Copyright } from "../components";

function Register() {
  const isMounted = useIsMounted();
  const [input, setInput] = useState({
    Username: "",
    Password: "",
    isMember: true,
  });
  const [isErrorInput, setIsErrorInput] = useState({
    Username: false,
    Password: false,
    isMember: false,
  });

  const { user, isLoading } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (input.Username && input.Username !== "") {
      if (input.Password && input.Password !== "") {
        const { Username, Password, isMember } = input;
        if (!Password || (!isMember && !Username)) {
          return;
        }
        if (isMember) {
          const { user: existingUser, session, error } = await supabase.auth.signIn({ email: Username, password: Password });
          if (!error) {
            const localObject = {
              token: session?.access_token,
              idProfile: existingUser?.id,
              Username: existingUser?.email,
            };
            addUserToLocalStorage(localObject);
            dispatch(loginUser(localObject));
          }
        } else {
          const { user: createdUser, session, error } = await supabase.auth.signUp({ email: Username, password: Password });
          if (!error) {
            const localObject = {
              token: session?.access_token,
              idProfile: createdUser?.id,
              Username: createdUser?.email,
            };
            addUserToLocalStorage(localObject);
            dispatch(registerUser(localObject));
          }
        }
        return;
      } else {
        setIsErrorInput({ ...isErrorInput, Password: true });
      }
    } else {
      setIsErrorInput({ ...isErrorInput, Username: true });
    }
  };

  const toggleMember = () => {
    setInput({ ...input, isMember: !input.isMember });
  };
  const handleUsername = async (e) => {
    setInput({ ...input, Username: e.target.value });
    if (isErrorInput.Username) setIsErrorInput({ ...isErrorInput, Username: false });
  };
  const handlePassword = async (e) => {
    setInput({ ...input, Password: e.target.value });
    if (isErrorInput.Password) setIsErrorInput({ ...isErrorInput, Password: false });
  };

  const loginDemo = async () => {
    const { user: existingUser, error } = await supabase.auth.signIn({ email: "demo@demo.com", password: "secret123" });
    if (!error) {
      const localObject = {
        token: existingUser?.login?.token,
        idProfile: existingUser?.login?.profile?.idProfile,
        Username: existingUser?.login?.profile?.Username,
      };
      addUserToLocalStorage(localObject);
      dispatch(loginUser(localObject));
    }
  };

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    // eslint-disable-next-line
  }, [user]);

  if (!isMounted) return <></>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div className="container mx-auto" style={{ width: "300px" }}>
      <div className="container-fluid p-2 my-4 shadow border border-primary rounded-3">
        <div className="d-flex justify-content-left align-items-center">
          <Logo />
          <p className="h1 text-capitalize ms-2">BG Clients</p>
        </div>
        <form onSubmit={onSubmit}>
          <p className="h6 text-center text-capitalize pt-2">{input.isMember ? "Login" : "Register"}</p>
          <div className="mb-3 mt-3">
            <label htmlFor="Username" className="form-label">
              Username:
            </label>
            <input autoFocus className="form-control" id="Username" type="email" value={input.Username} onChange={handleUsername} required />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="Password" className="form-label">
              Password:
            </label>
            <input className="form-control" id="Password" type="password" value={input.Password} onChange={handlePassword} required />
          </div>
          <div className="d-flex justify-content-center align-content-center align-items-center">
            <button type="submit" className="btn btn-primary text-capitalize flex-fill m-1" disabled={isLoading}>
              {isLoading ? "loading..." : input.isMember ? "connect" : "register"}
            </button>
            <button type="button" className="btn btn-primary text-capitalize flex-fill m-1" disabled={isLoading} onClick={loginDemo}>
              {isLoading ? "loading..." : "demo"}
            </button>
          </div>
          <div className="text-center text-capitalize">
            {input.isMember ? "Not a member yet?" : "Already a member?"}
            <button type="button" onClick={toggleMember} className="btn btn-link">
              {input.isMember ? "Register" : "Login"}
            </button>
          </div>
          {/*         
        {loginError && <Typography color="error.main">{loginError.message}</Typography>}
        {registerError && <Typography color="error.main">{registerError.message}</Typography>} */}
        </form>
        <Copyright />
      </div>
    </div>
  );
}
export default Register;