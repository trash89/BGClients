import { Link } from "react-router-dom";
import img from "../assets/images/not-found.svg";

const Error = () => {
  return (
    <div className="container">
      <img src={img} alt="not found" width={300} height={300} />
      <h3>Ohh! Page Not Found</h3>
      <p>We can't seem to find the page you're looking for</p>
      <Link to="/">back home</Link>
    </div>
  );
};
export default Error;
