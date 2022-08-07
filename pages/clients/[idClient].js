import { supabase } from "../../lib/supabaseClient";
const EditClient = ({ client }) => {
  return (
    <div>
      Edit Client
      <div>{client.email}</div>
      <div>{client.name}</div>
    </div>
  );
};

export default EditClient;

export async function getStaticPaths() {
  const { data: clients, error } = await supabase.from("clients").select("*");
  if (error) {
    console.log("error EditClient getStaticPaths,", error);
    return { paths: [], fallback: false };
  }
  const paths = clients.map((client) => ({
    params: { idClient: `${client.id}` },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const { data: client, error } = await supabase.from("clients").select("*").eq("id", `${params.idClient}`).single();
  if (error) {
    console.log("error EditClient getStaticProps,", error);
    return { props: { client: [] } };
  }
  return { props: { client } };
}
