import { supabase } from "../../lib/supabaseClient";
import { useDispatch, useSelector } from "react-redux";
import { useIsMounted } from "../../lib/hooks";
import { Progress } from "../../components";
const EditClient = ({ data }) => {
  const isMounted = useIsMounted();
  const { user, isLoading } = useSelector((store) => store.user);
  if (!isMounted) return <></>;
  if (isLoading) return <Progress />;
  if (user.isAdmin) {
    return (
      <div>
        Edit Client
        <div>{data.email}</div>
        <div>{data.name}</div>
      </div>
    );
  } else {
    return <>for clients</>;
  }
};

export default EditClient;

export async function getStaticPaths() {
  const { data, error } = await supabase.from("clients").select("*");
  if (error) {
    console.log("error EditClient getStaticPaths,", error);
    return { paths: [], fallback: false };
  }
  const paths = data.map((item) => ({
    params: { id: `${item.id}` },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data, error } = await supabase.from("clients").select("*").eq("id", `${params.id}`).single();
  if (error) {
    console.log("error EditClient getStaticProps,", error);
    return { props: { data: [] } };
  }
  return { props: { data } };
}
