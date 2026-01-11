import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  /* ===== Handle Resize ===== */
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===== Logout ===== */
  const handleLogout = () => {
    setSidebarOpen(false);
    localStorage.clear(); // remove token if any
    navigate("/adminlogin"); // change if needed
  };

  /* ===== Close sidebar on mobile when link clicked ===== */
  const handleLinkClick = () => {
    if (isMobile) setSidebarOpen(false);
  };

  return (
    <>
      <style>{`
        body {
          margin: 0;
          font-family: Inter, sans-serif;
        }

        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #f9f8f3;
        }

        /* SIDEBAR */
        .admin-sidebar {
          width: 240px;
          background: #4a5d23;
          color: white;
          padding: 20px;
          transition: transform 0.3s ease;
        }

        .admin-logo {
          font-size: 20px;
          font-weight: bold;
          margin-bottom: 30px;
        }

        .admin-menu a {
          display: block;
          padding: 12px 16px;
          margin-bottom: 10px;
          border-radius: 8px;
          text-decoration: none;
          color: #e5e7eb;
          font-size: 14px;
        }

        .admin-menu a.active {
          background: rgba(255,255,255,0.2);
          color: white;
        }

        .admin-menu a:hover {
          background: rgba(255,255,255,0.15);
        }

        .logout {
          margin-top: 40px;
          background: #7a1d1d;
          padding: 10px;
          border-radius: 8px;
          text-align: center;
          cursor: pointer;
          font-weight: 600;
        }

        /* CONTENT */
        .admin-content {
          flex: 1;
          padding: 30px;
          overflow-y: auto;
        }

        /* MOBILE RESPONSIVE */
        @media (max-width: 768px) {
          .admin-layout {
            flex-direction: column;
          }

          .admin-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            height: 100%;
            width: 220px;
            transform: translateX(${sidebarOpen ? "0" : "-100%"});
            z-index: 1000;
          }

          .admin-content {
            padding: 20px;
          }

          .mobile-topbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background: #4a5d23;
            color: white;
            padding: 12px 20px;
          }

          .hamburger {
            font-size: 24px;
            cursor: pointer;
          }
        }

        /* Desktop: hide mobile topbar */
        @media (min-width: 769px) {
          .mobile-topbar {
            display: none;
          }
        }
      `}</style>

      <div className="admin-layout">
        {/* ===== MOBILE TOPBAR ===== */}
        {isMobile && (
          <div className="mobile-topbar">
            <div>⚙ Admin Panel</div>
            <div
              className="hamburger"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              ☰
            </div>
          </div>
        )}

        {/* ===== SIDEBAR ===== */}
        <aside className="admin-sidebar">
          <div className="admin-logo">⚙ Admin Panel</div>

          <div className="admin-menu">
            <NavLink to="/admin/resources" onClick={handleLinkClick}>
              📄 Resources
            </NavLink>

            {/* Add more later if needed */}
            {/* <NavLink to="/admin/blogs" onClick={handleLinkClick}>
              📝 Blogs
            </NavLink> */}
          </div>

          <div className="logout" onClick={handleLogout}>
            🚪 Logout
          </div>
        </aside>

        {/* ===== CONTENT ===== */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </>
  );
}
