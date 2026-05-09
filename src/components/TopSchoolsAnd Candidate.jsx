import { useEffect, useState } from "react";
import api from "../api/Auth";
import {
  FaSpinner,
  FaSchool,
  FaTrophy,
  FaUserGraduate,
  FaMedal,
  FaChartLine,
  FaUsers,
  FaArrowUp,
  FaStar,
  FaRegStar,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp } from "react-icons/md";
import TopProgrammes from "./TopProgrames";
// #7e796c #6c757d

const TopSchoolsAndCandidates = ({ selectedExam }) => {
  const [loading, setLoading] = useState(false);
  const [candidates, setCandidates] = useState([]);

  // ==============================
  // 📡 FETCH DATA
  // ==============================
  useEffect(() => {
    if (!selectedExam?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [candidatesRes] = await Promise.all([
          api.get(
            `/analytics/top-candidates?examId=${selectedExam._id}&limit=10`,
          ),
        ]);

        setCandidates(candidatesRes.data || []);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedExam]);

  const formatScore = (score) => {
    const num = parseFloat(score);
    return isNaN(num) ? "N/A" : num.toFixed(1);
  };

  const getScoreColor = (score) => {
    const num = parseFloat(score);
    if (num >= 70) return "#6c757d";
    if (num >= 50) return "#7e796c";
    return "#dc3545";
  };

  if (!selectedExam?._id) {
    return (
      <div className="text-center py-5">
        <div
          className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
          style={{ width: "60px", height: "60px" }}
        >
          <FaSchool size={30} className="text-muted opacity-50" />
        </div>
        <p className="text-muted mb-0">Select an exam rankings</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* 🏫 TOP DEPARTMENTS - SIMPLE LIST */}
      {/* ============================== */}

      <TopProgrammes selectedExam={selectedExam} />

      {/* ============================== */}
      {/* 🏆 TOP CANDIDATES SECTION */}
      {/* ============================== */}
      <div className="">
        <div
          className="card border-0 shadow-sm h-100"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          <div
            className="card-header border-0 p-4"
            style={{
              background: "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg- bg-opacity-20 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px" }}
                >
                  <FaTrophy size={24} style={{ color: "white" }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-white">
                    Top Performing Candidates
                  </h5>
                  <small className="text-white text-opacity-75">
                    Highest scoring students
                  </small>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-3 px-3 py-1">
                <small className="text-success fw-semibold">
                  <FaUserGraduate className="me-1" size={12} />
                  Top {candidates.length}
                </small>
              </div>
            </div>
          </div>

          <div className="card-body p-4">
            {loading ? (
              <div className="text-center py-5">
                <FaSpinner
                  className="fa-spin mb-3"
                  size={32}
                  style={{ color: "#7e796c" }}
                />
                <p className="text-muted small mb-0">
                  Loading candidate rankings...
                </p>
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-5">
                <FaUserGraduate
                  size={48}
                  className="text-muted opacity-25 mb-3"
                />
                <p className="text-muted mb-0">No candidate data available</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                {candidates.map((candidate, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-3 border"
                    style={{
                      background:
                        index < 3
                          ? "linear-gradient(135deg, rgba(50, 128, 62, 0.05) 0%, rgba(120, 163, 114, 0.02) 100%)"
                          : "white",
                      border:
                        index < 3
                          ? `1px solid ${index === 0 ? "#FFD700" : index === 1 ? "#C0C0C0" : "#CD7F32"}`
                          : "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateX(5px)";
                      e.currentTarget.style.boxShadow =
                        "0 4px 12px rgba(50, 128, 62, 0.1)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateX(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div className="d-flex justify-content-between align-items-start">
                      <div className="d-flex align-items-center gap-3">
                        <div
                          className="rounded-circle d-flex align-items-center justify-content-center position-relative"
                          style={{
                            width: "45px",
                            height: "45px",
                            background:
                              index < 3
                                ? "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)"
                                : "#f8f9fa",
                            color: index < 3 ? "white" : "#6c757d",
                          }}
                        >
                          {index === 0 ? (
                            <FaStar size={20} style={{ color: "#FFD700" }} />
                          ) : index === 1 ? (
                            <FaStar size={18} style={{ color: "#C0C0C0" }} />
                          ) : index === 2 ? (
                            <FaStar size={16} style={{ color: "#CD7F32" }} />
                          ) : (
                            <span className="fw-bold">{index + 1}</span>
                          )}
                        </div>
                        <div>
                          <h6
                            className="fw-semibold mb-1"
                            style={{ color: "#2c3e2f" }}
                          >
                            {candidate.examNumber}
                          </h6>
                          <div className="d-flex align-items-center gap-3"></div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className="fw-bold fs-4"
                          style={{ color: getScoreColor(candidate.average) }}
                        >
                          {formatScore(candidate.average)}%
                        </div>
                        {candidate.position === 1 && (
                          <small
                            className="d-flex align-items-center gap-1"
                            style={{ color: "#7e796c" }}
                          >
                            <FaArrowUp size={10} />
                            Top Performer
                          </small>
                        )}
                      </div>
                    </div>
                    
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
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

        code {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }
      `}</style>
    </div>
  );
};

export default TopSchoolsAndCandidates;
