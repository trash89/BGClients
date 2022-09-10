import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { axiosInstance } from "../axiosInstance";

import { Logo, Footer, Progress } from "../components";
import { loginUser, setIsLoading, clearIsLoading, setInput, setError, clearError } from "../features/user/userSlice";
import { useIsMounted } from "../hooks";

export default function Register() {
  const isMounted = useIsMounted();

  const { user, input, isLoading, isError, errorText } = useSelector((store) => store.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      dispatch(setIsLoading());
      const resp = await axiosInstance.post("/auth/login", { email, password });
      if (resp?.data || resp?.data?.session) {
        const { user, session } = resp.data;
        const localObject = {
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          id: user.id,
          email: user.email,
          isAdmin: user.isAdmin,
        };
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${localObject.access_token}`;
        dispatch(loginUser(localObject));
        navigate("/", { replace: true });
      }
    } catch (error) {
      console.log("error signIn=", error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = input;
    if (!password || !email) {
      return;
    }
    await login(email, password);
  };

  const handleDemo = async (e) => {
    e.preventDefault();
    await login("demo@demo.com", "secret123");
  };

  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };

  useEffect(() => {
    if (user) {
      navigate("/", { replace: true });
    }
    // eslint-disable-next-line
  }, [user]);

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  return (
    <div className="container mx-auto" style={{ width: "300px" }}>
      <div className="container-fluid p-2 my-4 shadow border border-primary rounded-3 bg-success bg-opacity-10">
        <div className="d-flex flex-row justify-content-center align-content-center align-items-center p-0 m-0">
          <Logo />
          <p className="h4 text-center text-capitalize flex-grow-1">BG Clients</p>
        </div>
        <form>
          <p className="h6 text-center text-capitalize pt-2">Login</p>
          <div className="mb-3 mt-3">
            <label htmlFor="email" className="form-label">
              Email:
            </label>
            <input autoFocus className="form-control" id="email" name="email" type="email" value={input.email} onChange={handleChange} required />
          </div>
          <div className="mb-3 mt-3">
            <label htmlFor="password" className="form-label">
              Password:
            </label>
            <input className="form-control" id="password" name="password" type="password" value={input.password} onChange={handleChange} required />
          </div>
          <div className="d-flex justify-content-center align-content-center align-items-center">
            <button
              type="submit"
              className="btn btn-primary text-capitalize flex-fill m-1"
              disabled={isLoading || !input.email || !input.password}
              onClick={handleLogin}
            >
              {isLoading ? "loading..." : "connect"}
            </button>
            <button type="button" className="btn btn-primary text-capitalize flex-fill m-1" disabled={isLoading} onClick={handleDemo}>
              {isLoading ? "loading..." : "demo app"}
            </button>
          </div>
          {isError && <p className="text-center text-danger">{errorText}</p>}
        </form>
        <Footer />
      </div>
    </div>
  );
}
