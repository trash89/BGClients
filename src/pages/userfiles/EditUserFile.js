import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import { axiosInstance } from "../../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import {
  setInput,
  setData,
  setIsLoading,
  clearIsLoading,
  setIsEditing,
  clearIsEditing,
  setError,
  clearError,
  setEdit,
  clearValues,
} from "../../features/userfile/userfileSlice";
import moment from "moment";
import { toast } from "react-toastify";

const EditUserFile = () => {
  const isMounted = useIsMounted();
  const { user } = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  let from = "/userfiles";
  if (location.state) {
    from = location.state.from;
  } else from = "/userfiles";

  const params = useParams();
  const { input, data, isLoading, isEditing, isError, errorText } = useSelector((store) => store.userfile);
  const [myFile, setMyFile] = useState(null);

  useEffect(() => {
    if (!user.isAdmin) {
      navigate(from, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  useEffect(() => {
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const respClients = await axiosInstance.get("/clients");
        try {
          const resp = await axiosInstance.get(`/userfiles/${params.idFile}`);
          const { id, client_id, file_name, file_description, user_id, displayed, updated_at, created_at, last_accessed_at, size, mimetype, signedURL } =
            resp.data.userfile;
          const updated_at_formatted = new moment(updated_at).format("LLLL");
          const created_at_formatted = new moment(created_at).format("LLLL");
          const last_accessed_at_formatted = new moment(last_accessed_at).format("LLLL");
          dispatch(setData(respClients.data));
          dispatch(
            setEdit({
              input: {
                id,
                client_id,
                file_name,
                file_description,
                user_id,
                displayed,
                updated_at: updated_at_formatted,
                created_at: created_at_formatted,
                last_accessed_at: last_accessed_at_formatted,
                size,
                mimetype,
                signedURL,
              },
            })
          );
        } catch (error) {
          console.log(error);
          dispatch(setError(error?.response?.data?.error?.message || error?.message));
          dispatch(setData({}));
        }
      } catch (error) {
        console.log(error);
        dispatch(setError(error?.response?.data?.error?.message || error?.message));
        dispatch(setData({}));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = async (e) => {
    e.preventDefault();
    dispatch(clearValues());
    navigate(from, { replace: true });
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      const resp = await axiosInstance.delete(`/userfiles/${params.idFile}`);
      const file_name = resp?.data?.userfile[0]?.file_name;
      toast.success(`Successfully deteled file ${file_name}`);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      const formData = new FormData();
      formData.append("id", input.id);
      formData.append("client_id", input.client_id);
      formData.append("file_description", input.file_description);
      formData.append("displayed", input.displayed);
      if (myFile && myFile !== "") {
        formData.append("file", myFile);
      }
      const resp = await axiosInstance.patch(`/userfiles/${params.idFile}`, formData, {
        headers: { "Content-Type": `multipart/form-data; boundary=${formData._boundary}` },
      });
      const file_name = resp?.data?.userfile[0]?.file_name;
      toast.success(`Successfully saved file ${file_name}`);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };
  const handleChange = async (e) => {
    dispatch(setInput({ name: e.target.name, value: e.target.value }));
    if (isError) dispatch(clearError());
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  if (user.isAdmin) {
    return (
      <section className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
        <p className="h4 text-capitalize">
          edit a file
          <Link to={from} className="mx-1">
            <i className="fa-solid fa-arrow-left" />
          </Link>
        </p>
        <div className="modal" id="deleteFile">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h4 className="modal-title">Deleting a File</h4>
              </div>
              <div className="modal-body">Are you sure to delete the file {input.file_name} ?</div>
              <div className="modal-footer">
                <button type="button" className="btn btn-danger" data-bs-dismiss="modal" onClick={handleDelete}>
                  Delete
                </button>
                <button type="button" className="btn btn-primary" data-bs-dismiss="modal">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
        <form className="was-validated">
          <div className="mb-3 mt-3">
            <label htmlFor="client_id" className="form-label">
              For the Client:
            </label>
            <select
              className="form-select form-control-sm"
              id="client_id"
              name="client_id"
              value={input.client_id}
              onChange={handleChange}
              disabled={isEditing}
            >
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
            <p className="text-dark mb-1 mt-1">
              File Name:{" "}
              <a href={input.signedURL} target="_blank" rel="noreferrer">
                {input.file_name}
              </a>
            </p>
            <p className="text-dark mb-1 mt-1">
              Type:{input.mimetype}, Size: {input.size}Mb
            </p>
            <p className="text-dark mb-1 mt-1">Created at: {input.created_at}</p>
            <p className="text-dark mb-1 mt-1">Updated at: {input.updated_at}</p>
            <p className="text-dark mb-1 mt-1">Last accessed at: {input.last_accessed_at}</p>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              id="displayed"
              name="displayed"
              value={input.displayed}
              checked={input.displayed}
              onChange={(e) => {
                dispatch(setInput({ name: e.target.name, value: !input.displayed }));
              }}
              disabled={isEditing}
            />
            <label className="form-check-label">Displayed to Client?</label>
          </div>

          <div className="mb-3 mt-3">
            <label htmlFor="file" className="form-label">
              Replace the File:
            </label>
            <input
              type="file"
              className="form-control form-control-sm"
              id="file"
              name="file"
              accept=".pdf"
              onChange={(e) => {
                setMyFile(e.target.files[0]);
              }}
              disabled={isEditing}
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
              disabled={isEditing}
            />
          </div>
          <button type="button" className="btn btn-primary btn-sm me-2" data-bs-toggle="tooltip" title="Cancel" onClick={handleCancel} disabled={isEditing}>
            <i className="fa-solid fa-times" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            title="Delete"
            disabled={isEditing}
            data-bs-toggle="modal"
            data-bs-target="#deleteFile"
            data-bs-keyboard="false"
          >
            <i className="fa-solid fa-trash" />
          </button>
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            data-bs-toggle="tooltip"
            title="Save"
            onClick={handleSave}
            disabled={isEditing || !input.file_description || !input.client_id}
          >
            <i className="fa-solid fa-floppy-disk" />
          </button>
          {isError && <p className="text-danger">{errorText}</p>}
        </form>
        <br />
      </section>
    );
  }
};

export default EditUserFile;
