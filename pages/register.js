import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";
import { Logo } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../lib/features/user/userSlice";
import { useRouter } from "next/router";
import { addUserToLocalStorage } from "../lib/utils/localStorage";
import { useIsMounted } from "../lib/hooks";

import { Footer } from "../components";

export default function Register() {
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
  const router = useRouter();

  const loginDemo = async () => {
    await login("demo@demo.com", "secret123");
  };

  const login = async (Username, Password) => {
    const { user: existingUser, session, error } = await supabase.auth.signIn({ email: Username, password: Password });
    if (!error) {
      const { data: localuser, error } = await supabase.from("localusers").select("*").eq("user_id", existingUser.id).single();
      if (!error) {
        const localObject = {
          access_token: session.access_token,
          id: existingUser.id,
          email: existingUser.email,
          isAdmin: localuser.isAdmin,
        };
        addUserToLocalStorage(localObject);
        dispatch(loginUser(localObject));
      } else {
        console.log("error localusers=", error);
      }
    } else {
      console.log("error signIn=", error);
    }
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    if (input.Username && input.Username !== "") {
      if (input.Password && input.Password !== "") {
        const { Username, Password, isMember } = input;
        if (!Password || (!isMember && !Username)) {
          return;
        }
        if (isMember) {
          await login(Username, Password);
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

  useEffect(() => {
    if (user) {
      router.push("/");
    }
    // eslint-disable-next-line
  }, [user]);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      fetch("/api/auth", {
        method: "POST",
        headers: new Headers({ "Content-Type": "application/json" }),
        credentials: "same-origin",
        body: JSON.stringify({ event, session }),
      }).then((res) => res.json());
    });

    return () => {
      authListener.unsubscribe();
    };
  });

  if (!isMounted) return <></>;
  if (isLoading) return <div>loading...</div>;
  return (
    <div className="container mx-auto" style={{ width: "300px" }}>
      <div className="container-fluid p-2 my-4 shadow border border-primary rounded-3">
        <div className="d-flex flex-row justify-content-center align-content-center align-items-center p-0 m-0">
          <Logo />
          <p className="h4 text-center text-capitalize flex-grow-1">BG Clients</p>
        </div>
        <form onSubmit={onSubmit} className="was-validated">
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
        <Footer />
      </div>
    </div>
  );
}

Register.getLayout = function getLayout(page) {
  return <>{page}</>;
};
