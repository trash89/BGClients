export default function Copyright() {
  return (
    <footer className="footer">
      {"© "} {new Date().getFullYear()}
      {" by "}
      <a href="https://github.com/trash89/" target="_blank" rel="noreferrer">
        trash89
      </a>
      {". All rights reserved. Built with "}{" "}
      <a href="https://reactjs.org/" target="_blank" rel="noreferrer">
        React
      </a>
    </footer>
  );
}
