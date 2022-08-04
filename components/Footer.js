export default function Footer() {
  const currDate = new Date().getFullYear();
  return (
    <footer className="navbar navbar-expand-sm bg-primary navbar-dark fixed-bottom justify-content-center p-0 p-0">
      © {currDate} by
      <a href="https://github.com/trash89/" target="_blank" rel="noopener noreferrer" className="text-info ms-1">
        trash89
      </a>
      . All rights reserved. Built with
      <a href="https://nextjs.org/" target="_blank" rel="noopener noreferrer" className="text-info ms-1">
        Next.js
      </a>
    </footer>
  );
}
