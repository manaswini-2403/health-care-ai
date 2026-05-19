import { Link, useLocation } from "react-router-dom";

function Navbar({ theme, toggleTheme }) {
  const location = useLocation();

  const getLinkClass = (path) => {
    return location.pathname === path ? "activeRoute" : "";
  };

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <h2>💗 HealthApp</h2>
      </Link>

      <div className="navbar-links">
        <Link to="/" className={getLinkClass("/")}>Home</Link>
        <Link to="/records" className={getLinkClass("/records")}>Vitals Records</Link>
        <Link to="/doctor" className={getLinkClass("/doctor")}>Consult Doctor</Link>
        <Link to="/medicine" className={getLinkClass("/medicine")}>Order Medicine</Link>
        <Link to="/settings" className={getLinkClass("/settings")}>Settings</Link>
        
        {/* Dynamic Theme Toggle Button */}
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          title={theme === "light" ? "Switch to Dark Mode" : "Switch to Light Mode"}
          aria-label="Toggle theme"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;