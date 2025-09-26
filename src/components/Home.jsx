import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { List, Box, People, BarChart } from "react-bootstrap-icons"; // Bootstrap icons
import "../styles/Home.css";
const navItems = [
  { href: "/", label: "Menu", icon: <List size={18} /> },
  { href: "/orders", label: "Orders", icon: <Box size={18} /> },
  { href: "/agents", label: "Agents", icon: <People size={18} /> },
  { href: "/reports", label: "Reports", icon: <BarChart size={18} /> },
];

const Home = ({ children }) => {
  const navigate = useNavigate();
  let user = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch {}

  const displayName = user?.name || user?.fullName || "Distributor";
  const displayEmail = user?.email || user?.username || "admin@dms.app";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/signin");
  };

  return (
    <div className="d-flex min-vh-100">
      {/* Sidebar */}
      <div className="border-end bg-light" style={{ width: "250px" }}>
        {/* Sidebar Header */}
        <div className="d-flex align-items-center gap-2 px-3 py-3 border-bottom">
          
          <h5>DISTRIBUTOR</h5>
        </div>

        {/* Sidebar Nav */}
        <div className="p-3">
          <ul className="nav flex-column">
            {navItems.map((item) => (
              <li className="nav-item" key={item.href}>
                <NavLink
                  to={item.href}
                  className={({isActive})=>`nav-link d-flex align-items-center gap-2 rounded ${ isActive ? "active" : "text-dark"} nav-hover`}
                >
                  {item.icon}
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Sidebar Footer */}
        <div className="mt-auto p-3 border-top">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center gap-2">
              <div className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px" }}>
                DT
              </div>
              <div>
                <div className="small fw-medium">{displayName}</div>
                <div className="small text-muted">{displayEmail}</div>
              </div>
            </div>
            <button className="btn btn-outline-secondary btn-sm" onClick={handleLogout}>Logout</button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1">
        <Outlet/>
      </div>
    </div>
  );
}

export default Home;