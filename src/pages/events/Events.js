import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIsMounted } from "../../hooks";
import { Progress } from "../../components";
import { supabase } from "../../supabaseClient";

const Events = () => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  const events = [];
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  if (user.isAdmin) {
    return (
      <div className="container p-2 my-2 border border-primary rounded-3">
        <p className="h4 text-capitalize">Events list</p>
        <Link to="/events/newEvent" className="btn btn-outline-primary btn-sm">
          <i className="fa-solid fa-plus" />
        </Link>
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm">
            <thead>
              <tr>
                <th>Action</th>
                <th>Client</th>
                <th>Date</th>
                <th>Event</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {events.map((row) => {
                return (
                  <tr key={row.id}>
                    <td>
                      <Link to={`/events/${row.id}`} className="btn btn-outline-primary btn-sm">
                        <i className="fa-solid fa-pen" />
                      </Link>
                    </td>
                    <td>{row.name}</td>
                    <td>{row.ev_date}</td>
                    <td>{row.ev_name}</td>
                    <td>{row.ev_description}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return <>for events</>;
  }
};

export default Events;

// export async function getServerSideProps({ req, res }) {
//   const user = await getUserOnServer(req, res);
//   let query = supabase.from("events").select("id,client_id,ev_name,ev_description,ev_date,user_id,clients(name)");
//   if (!user.isAdmin) {
//     query = query.eq("user_id", user.id);
//   }
//   const { data, error } = await query;
//   if (error) {
//     console.log("error Events getServerSideProps,", error);
//     return {
//       props: { events: [] },
//     };
//   }
//   return {
//     props: { events: data },
//   };
// }
