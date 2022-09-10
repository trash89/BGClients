import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";

const Error = () => {
  return (
    <div className="d-flex flex-column justify-content-center align-content-center align-items-center">
      <h3>Ohh! Page Not Found</h3>
      <p>We can't seem to find the page you're looking for</p>
      <img src={img} alt="not found" className="w-25 h-25" />
      <Link to="/">back home</Link>
    </div>
  );
};
export default Error;
