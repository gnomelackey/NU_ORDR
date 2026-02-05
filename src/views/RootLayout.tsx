import { NavLink, Outlet } from "react-router-dom";

const navItems = [
  { to: "/", label: "Overview" },
  { to: "/hacking", label: "Hacking" },
  { to: "/pursuit-simulator", label: "Pursuit" },
];

export function RootLayout() {
  return (
    <div className="app-shell">
      <header className="top-bar">
        <div className="brand">
          <span className="brand-mark">NU_ORDR</span>
          <span className="brand-sub">Dystopian Protocol Stack</span>
        </div>
        <nav className="nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link ${isActive ? "nav-link--active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </header>
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <span>Transmission secured. NU_ORDR v0.1</span>
      </footer>
    </div>
  );
}
