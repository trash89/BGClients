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
    navigate("/userfiles");
    return;
  };

  useEffect(() => {
    if (!user.isAdmin) {
      navigate("/userfiles");
      return;
    }
    dispatch(clearValues());
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
    console.log(data);
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsLoading());
      const formData = new FormData();
      formData.append("client_id", input.client_id);
      formData.append("file_name", input.file_name);
      formData.append("file_description", input.file_description);
      formData.append("files", myFile);
      await axiosInstance.post("/userfiles", formData, { headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` } });
      navigate("/userfiles");
    } catch (error) {
      console.log(error);
      setError(error);
    } finally {
      dispatch(clearIsLoading());
    }
  };
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3">
      <p className="h4 text-capitalize">enter a new file</p>
      <form className="was-validated" encType="multipart/form-data" onSubmit={handleSave}>
        <div className="form-floating mb-3 mt-3">
          <select className="form-select" id="client_id" name="client_id" value={input.client_id} onChange={handleChange}>
            {data?.clients?.map((client) => {
              return (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              );
            })}
          </select>
          <label htmlFor="client_id">Client:</label>
        </div>
        <div className="form-floating mb-3 mt-3">
          <input
            required
            type="text"
            className="form-control"
            id="ev_name"
            placeholder="Enter the file name"
            name="file_name"
            value={input.file_name}
            onChange={handleChange}
          />
          <label htmlFor="ev_name">File Name:</label>
        </div>
        <div className="form-floating mb-3 mt-3">
          <input
            required
            type="text"
            className="form-control"
            id="file_description"
            placeholder="Enter the file description"
            name="file_description"
            value={input.file_description}
            onChange={handleChange}
          />
          <label htmlFor="ev_description">File Description:</label>
        </div>
        <div className="mb-3 mt-3">
          <label htmlFor="ev_description" className="form-label">
            File:
          </label>
          <input
            required
            type="file"
            className="form-control"
            id="file"
            placeholder="Upload the file"
            name="file"
            accept=".pdf"
            onChange={(e) => {
              console.log("e.target.files[0]=", e.target.files[0]);
              setMyFile(e.target.files[0]);
              console.log("myFile=", myFile);
            }}
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
          disabled={!input.file_name || !input.file_description || !input.client_id || !myFile}
        >
          <i className="fa-solid fa-floppy-disk" />
        </button>
        {isError && <p className="text-danger">{errorText}</p>}
      </form>
    </section>
  );
};

export default NewUserFile;
