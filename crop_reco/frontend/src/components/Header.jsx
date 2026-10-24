import { Link } from "react-router-dom";
import "../style/Header.css";

export default function Header() {
  return (
    <div className="header">
      <p>
        Get a crop recommendation in seconds —{" "}
        <Link to="/predict">enter your soil and climate details</Link>.
      </p>
    </div>
  );
}