import Image from "next/image";
import img from "../public/logo.png";
const Logo = () => {
  return <Image src={img} className="img-fluid" alt="journal" height={25} width={25} />;
};
export default Logo;
