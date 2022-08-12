import { Link } from "react-router-dom";

const TotalRows = ({ link, count, download = "" }) => {
  return (
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <span>
        {link !== "" && (
          <Link to={link} className="btn btn-outline-primary btn-sm">
            <i className="fa-solid fa-plus" />
          </Link>
        )}
      </span>
      {download !== "" && (
        <button type="button" className="btn btn-outline-primary btn-sm" data-bs-toggle="tooltip" title="CSV Download" onClick={download}>
          <i className="fa-solid fa-file-csv"></i>
        </button>
      )}
      <span>{count} rows</span>
    </div>
  );
};

export default TotalRows;
