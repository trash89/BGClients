import { useEffect } from "react";
import { axiosInstance } from "../axiosInstance";
import { useSelector, useDispatch } from "react-redux";
import { useIsMounted } from "../hooks";
import { Progress } from "../components";
import { setData, setIsLoading, clearIsLoading, setIsEditing, clearIsEditing, setError, clearValues } from "../features/clientview/clientviewSlice";
import moment from "moment";
import { dateFormat } from "../utils/constants";
import { toast } from "react-toastify";

const ClientViewComponent = ({ user }) => {
  const isMounted = useIsMounted();
  const dispatch = useDispatch();

  const { data, isLoading, isEditing } = useSelector((store) => store.clientview);

  useEffect(() => {
    dispatch(clearValues());
    const getData = async () => {
      dispatch(setIsLoading());
      try {
        const resp = await axiosInstance.post("/clientview", { id: user.id, email: user.email });
        dispatch(setData(resp.data));
      } catch (error) {
        console.log(error);
        dispatch(setError(error?.response?.data?.error?.message || error?.message));
      } finally {
        dispatch(clearIsLoading());
      }
    };
    getData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    try {
      dispatch(setIsEditing());
      await axiosInstance.put(`/clients/${data?.client?.id}`, { email: data.client?.email });
      toast.success("Password recovery email has been sent.");
    } catch (error) {
      console.log(error);
      dispatch(setError(error?.response?.data?.error?.message || error?.message));
    } finally {
      dispatch(clearIsEditing());
    }
  };

  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;

  return (
    <section className="container p-2 my-2 border border-primary rounded-3 bg-success bg-opacity-10">
      <div className="d-flex">
        <div className="flex-grow-1">
          <p className="h5">{data.client?.email}</p>
        </div>
        <div className="flex-shrink-1">
          <button
            type="button"
            className="btn btn-primary btn-sm me-2"
            title="Change Password"
            disabled={isEditing}
            data-bs-toggle="modal"
            data-bs-target="#resetPassword"
            data-bs-keyboard="false"
          >
            <i className="fa-solid fa-key"></i>
          </button>
        </div>
      </div>
      <div className="modal" id="resetPassword">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h4 className="modal-title">Change Password</h4>
            </div>
            <div className="modal-body">Are you sure to change the password ?</div>
            <div className="modal-body">A reset link will be sent to your email address.</div>
            <div className="modal-footer">
              <button type="button" className="btn btn-primary btn-sm" data-bs-dismiss="modal" onClick={handleSend}>
                Send
              </button>
              <button type="button" className="btn btn-secondary btn-sm" data-bs-dismiss="modal">
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
      <p className="h6">{data.client?.address}</p>
      <div className="mb-1 mt-1">
        {data.events?.length > 0 ? (
          <>
            <p className="h6">Events</p>
            {data.events?.map((event) => {
              const ev_date_formatted = new moment(event?.ev_date).format(dateFormat);
              return (
                <div className="card" key={event?.id}>
                  <div className="card-header">
                    {ev_date_formatted} - {event?.ev_name}
                  </div>
                  <div className="card-body">{event?.ev_description}</div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
      <div className="mb-1 mt-1">
        {data.userfiles?.length > 0 ? (
          <>
            <p className="h6">Files</p>
            {data.userfiles?.map((file) => {
              return (
                <div className="card" key={file?.id}>
                  <div className="card-header">{file?.file_description}</div>
                  <div className="card-body">
                    <a href={file?.signedURL} target="_blank" rel="noopener noreferrer">
                      {file?.file_name}
                    </a>
                  </div>
                </div>
              );
            })}
          </>
        ) : (
          <></>
        )}
      </div>
      <br />
    </section>
  );
};

export default ClientViewComponent;
