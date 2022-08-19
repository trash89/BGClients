import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { axiosInstance } from "../../axiosInstance";
import { setInput, setIsLoading, clearIsLoading, setData, setError, clearError, clearValues } from "../../features/userfile/userfileSlice";

const NewUserFile = () => {
  const isMounted = useIsMounted();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.user);
  const { input, data, isLoading, isError, errorText } = useSelector((store) => store.userfile);
  const [myFile, setMyFile] = useState(null);

  const handleChange = async (e) => {
    dispatch(setInput({ name: [e.target.name], value: e.target.value }));
    if (isError) dispatch(clearError());
  };

  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate("/userfiles", { replace: true });
    return;
  };

  useEffect(() => {
    dispatch(clearValues());
    if (!user.isAdmin) {
      navigate("/userfiles", { replace: true });
      return;
    }
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.get("/clients");
        dispatch(setData(resp.data));
        if (resp?.data?.clients?.length > 0) {
          dispatch(setInput({ ...input, name: "client_id", value: resp.data.clients[0].id }));
        }
      } catch (error) {
        console.log(error);
        dispatch(setError(error.response.data.error.message));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      const formData = new FormData();
      formData.append("client_id", input.client_id);
      formData.append("file_description", input.file_description);
      formData.append("file", myFile);
      const resp = await axiosInstance.post("/userfiles", formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } });
      //console.log(resp.data);
      navigate("/userfiles", { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error.response.data.error.message));
    } finally {
      dispatch(clearIsLoading());
    }
  };
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new file</p>
      <form className="was-validated" encType="multipart/form-data">
        <div className="mb-3 mt-3">
          <label htmlFor="client_id" className="form-label">
            For the Client:
          </label>
          <select required className="form-select form-control-sm" id="client_id" name="client_id" value={input.client_id} onChange={handleChange}>
            {data?.clients?.map((client) => {
              return (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              );
            })}
          </select>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="file" className="form-label">
            File:
          </label>
          <input
            required
            type="file"
            className="form-control form-control-sm"
            id="file"
            name="file"
            accept=".pdf"
            onChange={(e) => {
              setMyFile(e.target.files[0]);
            }}
          />
        </div>

        <div className="mb-3 mt-3">
          <label htmlFor="file_description" className="form-label">
            File Description:
          </label>
          <textarea
            required
            className="form-control form-control-sm"
            rows="5"
            id="file_description"
            name="file_description"
            value={input.file_description}
            onChange={handleChange}
          />
        </div>

        <button type="button" className="btn btn-primary me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel}>
          <i className="fa-solid fa-times" />
        </button>
        <button
          type="submit"
          className="btn btn-primary me-2"
          data-bs-toggle="tooltip"
          title="Save"
          disabled={!input.file_description || !input.client_id || !myFile}
          onClick={handleSave}
        >
          <i className="fa-solid fa-floppy-disk" />
        </button>
        {isError && <p className="text-danger">{errorText}</p>}
      </form>
    </section>
  );
};

export default NewUserFile;
