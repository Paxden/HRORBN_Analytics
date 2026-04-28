// layouts/DashboardLayout.jsx
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ExamModal from "../components/ExamModal";
import { useState, useEffect } from "react";
import api from "../api/Auth";
import {
  FaChartLine,
  FaUpload,
  FaSignOutAlt,
  FaExchangeAlt,
  FaTachometerAlt,
  FaFileAlt,
  FaChartBar,
  FaUniversity,
  FaChevronLeft,
  FaChevronRight,
  FaSpinner,
  FaUserCircle,
  FaBell,
  FaSearch,
} from "react-icons/fa";
import { MdAnalytics, MdCompare } from "react-icons/md";
import Logo from "../assets/nmcn.jpeg";
import { Image } from "react-bootstrap";

// #78a372 #32803e

export default function DashboardLayout() {
  const { user, logout, selectedExam, setSelectedExam } = useAuth();
  // eslint-disable-next-line no-unused-vars
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [exams, setExams] = useState([]);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Show modal if no exam selected
  useEffect(() => {
    if (!selectedExam) {
      setShowModal(true);
    }
  }, [selectedExam]);

  // Fetch exams for dropdown
  useEffect(() => {
    fetchExams();
  }, []);

  // Handle responsive sidebar
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(true);
        setMobileOpen(false);
      } else {
        setSidebarCollapsed(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exams");
      let examsList = res.data.exams || res.data || [];
      setExams(examsList);
    } catch (err) {
      console.error("Failed to fetch exams", err);
    } finally {
      setLoading(false);
    }
  };

  const handleExamSelected = (exam) => {
    setSelectedExam(exam);
    setShowModal(false);
  };

  const toggleSidebar = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarCollapsed(!sidebarCollapsed);
    }
  };

  const menuItems = [
    {
      path: "/dashboard",
      icon: <FaTachometerAlt />,
      label: "Dashboard",
      end: true,
    },
    { path: "/dashboard/results", icon: <FaFileAlt />, label: "Results" },
    { path: "/dashboard/analytics", icon: <MdAnalytics />, label: "Analytics" },
    { path: "/dashboard/compare", icon: <MdCompare />, label: "Compare Exams" },
    { path: "/dashboard/upload", icon: <FaUpload />, label: "Upload" },
  ];

  return (
    <>
      <ExamModal
        show={showModal}
        onExamSelected={handleExamSelected}
         onClose={() => setShowModal(false)}
        exams={exams}
      />

      <div className="dashboard-layout d-flex vh-100 bg-light">
        {/* Sidebar Overlay for Mobile */}
        {isMobile && mobileOpen && (
          <div
            className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
            style={{ zIndex: 1040 }}
            onClick={() => setMobileOpen(false)}
          />
        )}

        {/* Sidebar - White Theme */}
        <div
          className={`sidebar bg-white shadow-lg transition-sidebar ${
            isMobile
              ? mobileOpen
                ? "open"
                : "closed"
              : sidebarCollapsed
                ? "collapsed"
                : ""
          }`}
          style={{
            width: sidebarCollapsed && !isMobile ? "80px" : "280px",
            transition: "width 0.3s ease-in-out",
            zIndex: 1045,
            position: isMobile ? "fixed" : "relative",
            left: isMobile && !mobileOpen ? "-280px" : "0",
          }}
        >
          {/* Sidebar Header */}
          <div
            className={`p-3 border-bottom border-secondary d-flex align-items-center ${
              sidebarCollapsed && !isMobile
                ? "justify-content-center"
                : "justify-content-between"
            }`}
          >
            {(!sidebarCollapsed || isMobile) && (
              <div className="d-flex gap-2 align-items-center gx-2">
                <div
                  className="bg-success rounded-3 p-2 d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <Image src={Logo} width="50px" alt="NMCN SaaS" />
                </div>
                <div className="ms-3">
                  <h6 className="fw-bold mb-0 text-dark">NMCN</h6>
                  <small className="text-muted">Exam Analysis</small>
                </div>
              </div>
            )}

            {!isMobile && (
              <button
                onClick={toggleSidebar}
                className="btn btn-link text-dark p-0"
                style={{ textDecoration: "none" }}
              >
                {sidebarCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
              </button>
            )}

            {isMobile && mobileOpen && (
              <button
                onClick={toggleSidebar}
                className="btn btn-link text-dark p-0"
                style={{ textDecoration: "none" }}
              >
                <FaChevronLeft size={20} />
              </button>
            )}
          </div>

          {/* Navigation Menu */}
          <nav className="flex-grow-1 p-3" style={{ overflowY: "auto" }}>
            <div className="mb-4">
              {(!sidebarCollapsed || isMobile) && (
                <small
                  className="text-muted text-uppercase d-block mb-2"
                  style={{ fontSize: "0.65rem", letterSpacing: "0.5px" }}
                >
                  Main Menu
                </small>
              )}
              {menuItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `d-flex align-items-center gap-3 px-3 py-2 rounded-3 mb-1 text-decoration-none transition-all ${
                      isActive
                        ? "bg-success text-white shadow-sm"
                        : "text-dark hover-bg-light"
                    }`
                  }
                  onClick={() => isMobile && setMobileOpen(false)}
                  title={sidebarCollapsed && !isMobile ? item.label : ""}
                >
                  <span style={{ fontSize: "1.1rem", minWidth: "20px" }}>
                    {item.icon}
                  </span>
                  {(!sidebarCollapsed || isMobile) && <span>{item.label}</span>}
                </NavLink>
              ))}
            </div>
          </nav>

          {/* Logout Button */}
          <div className="p-3 border-top border-secondary">
            <button
              onClick={logout}
              className={`btn btn-outline-danger w-100 d-flex align-items-center gap-2 rounded-3 ${
                sidebarCollapsed && !isMobile ? "justify-content-center" : ""
              }`}
              style={{ transition: "all 0.3s ease" }}
              title={sidebarCollapsed && !isMobile ? "Logout" : ""}
            >
              <FaSignOutAlt />
              {(!sidebarCollapsed || isMobile) && <span>Logout</span>}
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content d-flex flex-column flex-grow-1">
          {/* Top Navbar */}
          <nav className="bg-white shadow-sm px-3 px-md-4 py-2 d-flex align-items-center justify-content-between">
            <div className="d-flex align-items-center gap-3">
              <button
                onClick={toggleSidebar}
                className="btn btn-link text-dark p-0 d-flex align-items-center"
                style={{
                  textDecoration: "none",
                  width: "32px",
                  height: "32px",
                }}
              >
                <FaChartLine size={20} />
              </button>
            </div>

            <div className="d-flex align-items-center gap-3">
              {/* Exam Selector */}
              <div className="d-flex align-items-center gap-2">
                <button
                  className="d-flex align-items-center btn btn-outline-success btn-sm"
                  onClick={() => setShowModal(true)}
                  style={{ borderRadius: "0.5rem" }}
                >
                  <FaExchangeAlt className="me-1" size={12} /> Change
                </button>
              </div>

              {/* User Dropdown */}
              <div className="dropdown">
                <button
                  className="btn btn-link text-dark text-decoration-none d-flex align-items-center gap-2 p-0"
                  data-bs-toggle="dropdown"
                >
                  <div
                    className="bg-success rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "36px", height: "36px" }}
                  >
                    <FaUserCircle className="text-white" size={20} />
                  </div>
                  <span className="d-none d-md-inline fw-semibold small">
                    {user?.email?.split("@")[0] || "User"}
                  </span>
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end shadow-sm border-0 mt-2"
                  style={{ borderRadius: "0.75rem" }}
                >
                  <li>
                    <a className="dropdown-item" href="/dashboard/profile">
                      Profile
                    </a>
                  </li>
                  <li>
                    <a className="dropdown-item" href="/dashboard/settings">
                      Settings
                    </a>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item text-danger"
                      onClick={logout}
                      href="#"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          {/* Content Area */}
          <div className="flex-grow-1 p-3 p-md-4 overflow-auto">
            {!selectedExam ? (
              <div className="d-flex justify-content-center align-items-center h-100">
                <div className="text-center">
                  {loading ? (
                    <FaSpinner
                      className="fa-spin mb-3"
                      size={48}
                      style={{ color: "#667eea" }}
                    />
                  ) : (
                    <>
                      <div
                        className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                        style={{ width: "80px", height: "80px" }}
                      >
                        <FaFileAlt size={40} className="text-muted" />
                      </div>
                      <h5 className="fw-bold mb-2">No Exam Selected</h5>
                      <p className="text-muted mb-4">
                        Please select or upload an exam to continue.
                      </p>
                      <button
                        onClick={() => setShowModal(true)}
                        className="btn btn-success px-4"
                        style={{ borderRadius: "0.75rem" }}
                      >
                        Select Exam
                      </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <Outlet />
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS */}
      <style>{`
        .dashboard-layout {
          overflow: hidden;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          box-shadow: 2px 0 8px rgba(0, 0, 0, 0.05);
        }

        .sidebar.closed {
          width: 80px;
        }

        .sidebar.open {
          left: 0;
        }

        .main-content {
          transition: all 0.3s ease;
          width: 100%;
          overflow: hidden;
        }

        .hover-bg-light:hover {
          background-color: rgba(0, 0, 0, 0.05);
        }

        .hover-bg-light.active {
          background-color: #32803e;
          color: white;
        }

        .transition-all {
          transition: all 0.3s ease;
        }

        .transition-sidebar {
          transition:
            width 0.3s ease-in-out,
            left 0.3s ease-in-out;
        }

        /* Scrollbar styling - Light theme */
        ::-webkit-scrollbar {
          width: 5px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #32803e;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #32803e;
        }

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          border-color: #32803e;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .sidebar {
            position: fixed;
            height: 100vh;
            top: 0;
            left: -280px;
          }

          .sidebar.open {
            left: 0;
          }
        }
      `}</style>
    </>
  );
}
