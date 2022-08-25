const USER = "USER";
const dateFormat = "DD/MM/YYYY";
const defaultPassword = "secret123";

let APISERVER = "http://localhost:5000/api/v1";
if (process.env.NODE_ENV === "production") {
  APISERVER = "https://bgclients.herokuapp.com/api/v1";
}

const escapeCsvCell = (cell) => {
  if (cell == null) {
    return "";
  }
  const sc = cell.toString().trim();
  if (sc === "" || sc === '""') {
    return sc;
  }
  if (sc.includes('"') || sc.includes(",") || sc.includes("\n") || sc.includes("\r")) {
    return '"' + sc.replace(/"/g, '""') + '"';
  }
  return sc;
};

const makeCsvData = (columns, data) => {
  return data.reduce((csvString, rowItem) => {
    return csvString + columns.map(({ accessor }) => escapeCsvCell(accessor(rowItem))).join(",") + "\r\n";
  }, columns.map(({ name }) => escapeCsvCell(name)).join(",") + "\r\n");
};

const downloadAsCsv = (columns, data, filename) => {
  const csvData = makeCsvData(columns, data);
  const csvFile = new Blob([csvData], { type: "text/csv" });
  const downloadLink = document.createElement("a");

  downloadLink.display = "none";
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
};

export { USER, dateFormat, APISERVER, defaultPassword, downloadAsCsv };
