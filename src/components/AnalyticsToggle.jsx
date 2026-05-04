import { useEffect, useState } from "react";
import api from "../api/Auth";
import {
  FaSchool,
  FaChartBar,
  FaSpinner,
  FaTrophy,
  FaUsers,
  FaGraduationCap,
  FaArrowUp,
  FaArrowDown,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp } from "react-icons/md";

const AnalyticsToggle = ({ selectedExam }) => {
  const [view, setView] = useState("schools");
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [programmes, setProgrammes] = useState(null);

  // ==============================
  // 📡 FETCH DATA BASED ON VIEW
  // ==============================
  useEffect(() => {
    if (!selectedExam?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        if (view === "schools") {
          const res = await api.get(
            `/analytics/top-10-schools?examId=${selectedExam._id}`,
          );
          setSchools(res.data.data || []);
        }

        if (view === "programmes") {
          const res = await api.get(
            `/analytics/programme-analytics?examId=${selectedExam._id}`,
          );
          setProgrammes(res.data);
        }
      } catch (err) {
        console.error("Analytics fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [view, selectedExam]);

  // ==============================
  // 🎯 BUTTON STYLE
  // ==============================
  const getBtnClass = (type) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
      view === type
        ? "text-success shadow-lg"
        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
    }`;

  // Format score display
  const formatScore = (score) => {
    const num = parseFloat(score);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  // Get performance color
  const getPerformanceColor = (score) => {
    const num = parseFloat(score);
    if (num >= 70) return "#78a372";
    if (num >= 50) return "#32803e";
    return "#dc3545";
  };

  return (
    <div
      className="container-fluid px-4 py-4"
      style={{ backgroundColor: "#f8f9fa", minHeight: "100vh" }}
    >
      {/* Header Section */}
      <div className="mb-4">
        <div className="d-flex align-items-center gap-3 mb-2">
          <div
            className="rounded-circle d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              background: "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
              boxShadow: "0 4px 12px rgba(50, 128, 62, 0.3)",
            }}
          >
            <MdAnalytics size={24} className="text-white" />
          </div>
          <div>
            <h4 className="fw-bold mb-0" style={{ color: "#2c3e2f" }}>
              Performance Analytics
            </h4>
           
          </div>
        </div>
      </div>

      {/* Right Column - Toggle Views */}
      <div className="col">
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          {/* Toggle Header */}
          <div
            className="card-header border-0 p-4"
            style={{
              background: "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
            }}
          >
            <div className="d-flex gap-3">
              <button
                className={`${getBtnClass("schools")} d-flex align-items-center gap-2`}
                onClick={() => setView("schools")}
                style={{
                  background:
                    view === "schools" ? "white" : "rgba(255, 255, 255, 0.2)",
                  color: view === "schools" ? "#32803e" : "white",
                  border: "none",
                }}
              >
                <FaSchool size={16} />
                Top Schools
              </button>

              <button
                className={`${getBtnClass("programmes")} d-flex align-items-center gap-2`}
                onClick={() => setView("programmes")}
                style={{
                  background:
                    view === "programmes"
                      ? "white"
                      : "rgba(255, 255, 255, 0.2)",
                  color: view === "programmes" ? "#32803e" : "white",
                  border: "none",
                }}
              >
                <FaGraduationCap size={16} />
                Programmes
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="card-body p-4">
            {loading && (
              <div className="text-center py-5">
                <FaSpinner
                  className="fa-spin mb-3"
                  size={40}
                  style={{ color: "#78a372" }}
                />
                <p className="text-muted">Loading analytics data...</p>
              </div>
            )}

            {/* ============================== */}
            {/* 🏫 TOP SCHOOLS */}
            {/* ============================== */}
            {!loading && view === "schools" && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="fw-bold mb-0" style={{ color: "#2c3e2f" }}>
                      Top Performing Schools
                    </h4>
                    <small className="text-muted">
                      Based on average scores and pass rates
                    </small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(120, 163, 114, 0.1)",
                    }}
                  >
                    <FaTrophy style={{ color: "#32803e" }} size={20} />
                  </div>
                </div>

                {schools.length === 0 ? (
                  <div className="text-center py-5">
                    <FaSchool
                      size={48}
                      className="text-muted opacity-25 mb-3"
                    />
                    <p className="text-muted mb-0">No school data available</p>
                  </div>
                ) : (
                  <div className="vstack gap-3">
                    {schools.map((s, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-3 border"
                        style={{
                          background: "white",
                          border: "1px solid #e9ecef",
                          transition: "all 0.3s ease",
                          cursor: "pointer",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(5px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(50, 128, 62, 0.1)";
                          e.currentTarget.style.borderColor = "#78a372";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "#e9ecef";
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div className="d-flex align-items-center gap-3">
                            <div
                              className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                width: "36px",
                                height: "36px",
                                background:
                                  i < 3
                                    ? "linear-gradient(135deg, #78a372 0%, #32803e 100%)"
                                    : "#f8f9fa",
                                color: i < 3 ? "white" : "#6c757d",
                              }}
                            >
                              {i + 1}
                            </div>
                            <div>
                              <h6 className="fw-semibold mb-1">{s.school}</h6>
                              <div className="d-flex align-items-center gap-3">
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <FaUsers size={12} />
                                  {s.totalStudents} students
                                </small>
                              </div>
                            </div>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold fs-5"
                              style={{
                                color: getPerformanceColor(s.avgScore),
                              }}
                            >
                              {formatScore(s.avgScore)}%
                            </div>
                            <small className="text-success d-flex align-items-center gap-1">
                              <MdTrendingUp size={12} />
                              {formatScore(s.passRate)}% pass
                            </small>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div
                            className="progress"
                            style={{
                              height: "6px",
                              borderRadius: "3px",
                              background: "#e9ecef",
                            }}
                          >
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${parseFloat(s.avgScore) || 0}%`,
                                background:
                                  "linear-gradient(90deg, #78a372 0%, #32803e 100%)",
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ============================== */}
            {/* 📘 PROGRAMMES */}
            {/* ============================== */}
            {!loading && view === "programmes" && programmes && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4">
                  <div>
                    <h4 className="fw-bold mb-0" style={{ color: "#2c3e2f" }}>
                      Programme Distribution
                    </h4>
                    <small className="text-muted">
                      Performance by programme
                    </small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: "40px",
                      height: "40px",
                      background: "rgba(120, 163, 114, 0.1)",
                    }}
                  >
                    <FaChartBar style={{ color: "#32803e" }} size={20} />
                  </div>
                </div>

                {/* Unknown Programme Alert */}
                {programmes.unknownPercentage > 0 && (
                  <div
                    className="alert mb-4 d-flex align-items-center justify-content-between"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(120, 163, 114, 0.1) 0%, rgba(50, 128, 62, 0.05) 100%)",
                      border: "1px solid rgba(120, 163, 114, 0.3)",
                      borderRadius: "0.75rem",
                    }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      <MdAnalytics style={{ color: "#32803e" }} size={18} />
                      <span className="small">Unknown Programme:</span>
                      <span
                        className="fw-semibold"
                        style={{ color: "#32803e" }}
                      >
                        {programmes.unknownPercentage}%
                      </span>
                    </div>
                  </div>
                )}

                {programmes.programmes.length === 0 ? (
                  <div className="text-center py-5">
                    <FaGraduationCap
                      size={48}
                      className="text-muted opacity-25 mb-3"
                    />
                    <p className="text-muted mb-0">
                      No programme data available
                    </p>
                  </div>
                ) : (
                  <div className="vstack gap-3">
                    {programmes.programmes.map((p, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-3 border"
                        style={{
                          background: "white",
                          border: "1px solid #e9ecef",
                          transition: "all 0.3s ease",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = "translateX(5px)";
                          e.currentTarget.style.boxShadow =
                            "0 4px 12px rgba(50, 128, 62, 0.1)";
                          e.currentTarget.style.borderColor = "#78a372";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = "translateX(0)";
                          e.currentTarget.style.boxShadow = "none";
                          e.currentTarget.style.borderColor = "#e9ecef";
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <div>
                            <h6 className="fw-semibold mb-1">{p.programme}</h6>
                            <small className="text-muted d-flex align-items-center gap-1">
                              <MdTrendingUp size={12} />
                              Avg Score: {formatScore(p.avgScore)}%
                            </small>
                          </div>
                          <div className="text-end">
                            <div
                              className="fw-bold fs-5"
                              style={{ color: "#32803e" }}
                            >
                              {p.count}
                            </div>
                            <small className="text-muted">
                              {p.percentage}% of total
                            </small>
                          </div>
                        </div>
                        <div className="mt-2">
                          <div
                            className="progress"
                            style={{
                              height: "6px",
                              borderRadius: "3px",
                              background: "#e9ecef",
                            }}
                          >
                            <div
                              className="progress-bar"
                              role="progressbar"
                              style={{
                                width: `${parseFloat(p.percentage) || 0}%`,
                                background:
                                  "linear-gradient(90deg, #78a372 0%, #32803e 100%)",
                                borderRadius: "3px",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .fa-spin {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .card {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        .progress-bar {
          transition: width 1s ease;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsToggle;
