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
          const { user: existingUser, error } = await supabase.auth.signIn({ Username, Password });
          if (!error) {
            const localObject = {
              token: existingUser?.login?.token,
              idProfile: existingUser?.login?.profile?.idProfile,
              Username: existingUser?.login?.profile?.Username,
            };
            addUserToLocalStorage(localObject);
            dispatch(loginUser(localObject));
          }
        } else {
          const { user: createdUser, error } = await supabase.auth.signUp({ Username, Password });
          if (!error) {
            const localObject = {
              token: createdUser?.register?.token,
              idProfile: createdUser?.register?.profile?.idProfile,
              Username: createdUser?.register?.profile?.Username,
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
    const { user: existingUser, error } = await supabase.auth.signIn({ Username: "demo", Password: "secret" });
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
  if (isLoading) return <div>circular progress</div>;
  return (
    <div>
      <form onSubmit={onSubmit}>
        <Logo />
        <h3>{input.isMember ? "Login" : "Register"}</h3>
        <label>Username</label>
        <input autoFocus id="Username" type="text" value={input.Username} onChange={handleUsername} required />
        <label>Password</label>
        <input id="Password" type="password" value={input.Password} onChange={handlePassword} required />

        <button type="submit" className="btn btn-block" disabled={isLoading}>
          {isLoading ? "loading..." : "connect"}
        </button>
        <button type="button" className="btn btn-block" disabled={isLoading} onClick={loginDemo}>
          {isLoading ? "loading..." : "demo app"}
        </button>
        <p>
          {input.isMember ? "Not a member yet?" : "Already a member?"}
          <button type="button" onClick={toggleMember} className="member-btn">
            {input.isMember ? "Register" : "Login"}
          </button>
        </p>
        {/*         
        {loginError && <Typography color="error.main">{loginError.message}</Typography>}
        {registerError && <Typography color="error.main">{registerError.message}</Typography>} */}
      </form>
      <Copyright />
    </div>
  );
}
export default Register;
