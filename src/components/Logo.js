import img from "../assets/images/logo.png";
const Logo = ({ height, width }) => {
  return <img src={img} className="img-fluid" alt="BG Clients" height={height} width={width} />;
};
export default Logo;
