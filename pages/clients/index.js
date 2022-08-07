import Link from "next/link";

const Clients = () => {
  return (
    <div>
      Clients
      <Link href="/clients/newClient">
        <a>New Client</a>
      </Link>
    </div>
  );
};

export default Clients;
