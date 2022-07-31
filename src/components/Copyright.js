export default function Copyright() {
  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark fixed-bottom">
      {"© "} {new Date().getFullYear()}
      {" by "}
      <a href="https://github.com/trash89/">trash89</a>
      {". All rights reserved. Built with "} <a href="https://reactjs.org/">React</a>
    </nav>
  );
}
