export default function Copyright() {
  const currDate = new Date().getFullYear();
  return (
    <nav className="navbar navbar-expand-sm bg-primary navbar-dark fixed-bottom justify-content-center p-0 p-0">
      © {currDate} by
      <a href="https://github.com/trash89/" target="_blank" rel="noopener noreferrer" className="text-info ms-1">
        trash89
      </a>
      . All rights reserved. Built with
      <a href="https://reactjs.org/" target="_blank" rel="noopener noreferrer" className="text-info ms-1">
        React
      </a>
    </nav>
  );
}
