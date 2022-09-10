import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { axiosInstance } from "../axiosInstance";
import { toast } from "react-toastify";
import { useIsMounted } from "../hooks";
import { Link } from "react-router-dom";
import { Progress } from "../components";
import { logoutUser } from "../features/user/userSlice";

import {
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setError,
  clearValues,
  setInput,
  clearError,
  setData,
} from "../features/clientview/clientviewSlice";

function PasswordReset() {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { data, input, isLoading, isEditing, isError, errorText } = useSelector((store) => store.clientview);
  const { user } = useSelector((store) => store.user);

  const getData = async () => {
    dispatch(setIsLoading());
    try {
      if (input.access_token && input.access_token !== "") {
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${input.access_token}`;
        const resp = await axiosInstance.post("/clientview", { id: user.id, email: user.email });
        dispatch(setData(resp.data));
      }
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };
  useEffect(() => {
    dispatch(clearValues());
    dispatch(setInput({ name: "hash", value: window.location.hash }));
    if (input.hash && input.hash !== "") {
      const hashArr = input.hash
        .substring(1)
        .split("&")
        .map((param) => param.split("="));
      let type;
      let accessToken;
      for (const [key, value] of hashArr) {
        if (key === "type") {
          type = value;
        } else if (key === "access_token") {
          accessToken = value;
          dispatch(setInput({ name: "access_token", value: accessToken }));
        }
      }
      if (type !== "recovery" || !accessToken || typeof accessToken === "object") {
        dispatch(setError("Invalid access token or type"));
      }
      if (input.access_token && input.access_token !== "") {
        getData();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (input.hash && input.hash !== "") {
      const hashArr = input.hash
        .substring(1)
        .split("&")
        .map((param) => param.split("="));
      let type;
      let accessToken;
      for (const [key, value] of hashArr) {
        if (key === "type") {
          type = value;
        } else if (key === "access_token") {
          accessToken = value;
          dispatch(setInput({ name: "access_token", value: accessToken }));
        }
      }
      if (type !== "recovery" || !accessToken || typeof accessToken === "object") {
        dispatch(setError("Invalid access token or type"));
      }
      if (input.access_token && input.access_token !== "") {
        getData();
      }
    }
  }, [input.hash, input.access_token]);

  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };
  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate("/clients/clientView", { replace: true });
  };
  const handleSave = async (e) => {
    const logout = () => {
      axiosInstance.defaults.headers.common["Authorization"] = null;
      dispatch(logoutUser());
      dispatch(clearValues());
      navigate("/register", { replace: true });
    };
    e.preventDefault();
    try {
      if (input.access_token && input.access_token !== "" && data.client) {
        dispatch(setIsEditing());
        axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${input.access_token}`;
        await axiosInstance.put(`/clients/${data.client.id}`, {
          id: data.client.id,
          email: data.client.email,
          password1: input.password1,
          password2: input.password2,
          access_token: input.access_token,
        });
        toast.success(`Successfully changed the password!`);
        logout();
      }
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  if (isLoading) return <Progress />;
  if (!isMounted || !input.hash || input.hash === "" || !data.client) return <></>;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
      {isError ? (
        <p className="h6 text-bg-danger">{errorText}</p>
      ) : (
        <>
          <p className="h5">{user.email}</p>
          <p className="h4 text-capitalize">
            Changing the password
            <Link to="/clients/clientView" className="mx-1">
              <i className="fa-solid fa-arrow-left" />
            </Link>
          </p>
          <form className="was-validated">
            <div className="row mb-3 mt-3">
              <div className="col">
                <label htmlFor="password1" className="form-label">
                  Password:
                </label>
                <input
                  autoFocus
                  required
                  type="password"
                  className="form-control"
                  id="password1"
                  name="password1"
                  value={input.password1}
                  onChange={handleChange}
                  disabled={isEditing}
                />
                <label htmlFor="password2" className="form-label">
                  Repeat password:
                </label>
                <input
                  required
                  type="password"
                  className="form-control"
                  id="password2"
                  name="password2"
                  value={input.password2}
                  onChange={handleChange}
                  disabled={isEditing}
                />
              </div>
            </div>
            <button type="button" className="btn btn-primary btn-sm me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
              <i className="fa-solid fa-times" />
            </button>
            <button
              type="button"
              className="btn btn-primary btn-sm me-2"
              data-bs-toggle="tooltip"
              title="Save"
              onClick={handleSave}
              disabled={isEditing || !input.password1 || !input.password2 || input.password1 !== input.password2}
            >
              <i className="fa-solid fa-floppy-disk" />
            </button>
          </form>
        </>
      )}
    </section>
  );
}

export default PasswordReset;
