import { BsPersonLinesFill, BsJournals } from "react-icons/bs";
import { FaWpforms, FaProjectDiagram } from "react-icons/fa";
import { ImProfile } from "react-icons/im";

const links = [
  { id: 0, text: "clients", path: "clients", icon: <BsPersonLinesFill /> },
  { id: 1, text: "contacts", path: "contacts", icon: <FaProjectDiagram /> },
  { id: 2, text: "events", path: "events", icon: <FaWpforms /> },
];

export { links };
