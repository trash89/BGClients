export default function Copyright() {
  return (
    <footer className="footer">
      {"© "} {new Date().getFullYear()}
      {" by "}
      <a href="https://github.com/trash89/">trash89</a>
      {". All rights reserved. Built with "} <a href="https://reactjs.org/">React</a>
    </footer>
  );
}
