import Link from "next/link";
import img from "../assets/images/not-found.svg";
import Image from "next/image";
const Error = () => {
  return (
    <div className="container">
      <Image src={img} alt="not found" width={300} height={300} />
      <h3>Ohh! Page Not Found</h3>
      <p>We can&apos;t seem to find the page you&apos;re looking for</p>
      <Link href="/">back home</Link>
    </div>
  );
};
export default Error;
