export default function Footer() {
  return (
    <footer className="navbar navbar-expand-sm bg-success text-white navbar-dark fixed-bottom p-0 m-0">
      <div className="d-flex flex-row flex-fill justify-content-center pe-1">
        <small style={{ fontSize: "0.75rem" }}>
          {"© "} {new Date().getFullYear()}
          {" by "}
          <a href="https://github.com/trash89/" target="_blank" rel="noopener noreferrer" className="text-dark">
            trash89
          </a>
          {". All rights reserved. Built with "}{" "}
          <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-dark">
            React
          </a>
        </small>
      </div>
    </footer>
  );
}
