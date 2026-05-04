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

const TopSchoolsAndCandidates = ({ selectedExam }) => {
  const [loading, setLoading] = useState(false);
  const [schools, setSchools] = useState([]);
  const [candidates, setCandidates] = useState([]);

  // ==============================
  // 📡 FETCH DATA
  // ==============================
  useEffect(() => {
    if (!selectedExam?._id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [schoolsRes, candidatesRes] = await Promise.all([
          api.get(`/analytics/top-10-schools?examId=${selectedExam._id}`),
          api.get(
            `/analytics/top-candidates?examId=${selectedExam._id}&limit=10`,
          ),
        ]);

        setSchools(schoolsRes.data.data || []);
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
    if (num >= 70) return "#32803e";
    if (num >= 50) return "#78a372";
    return "#dc3545";
  };

  const getRankIcon = (index) => {
    if (index === 0) return <FaTrophy style={{ color: "#FFD700" }} size={14} />;
    if (index === 1) return <FaMedal style={{ color: "#C0C0C0" }} size={14} />;
    if (index === 2) return <FaMedal style={{ color: "#CD7F32" }} size={14} />;
    return (
      <span style={{ color: "#6c757d", fontSize: "12px" }}>{index + 1}</span>
    );
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
        <p className="text-muted mb-0">Select an exam to view rankings</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      {/* ============================== */}
      {/* 🏫 TOP SCHOOLS SECTION */}
      {/* ============================== */}
      <div className="">
        <div
          className="card border-0 shadow-sm h-100"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          <div
            className="card-header border-0 p-4"
            style={{
              background: "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
            }}
          >
            <div className="d-flex align-items-center justify-content-between">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="rounded-circle bg- bg-opacity-20 d-flex align-items-center justify-content-center"
                  style={{ width: "48px", height: "48px" }}
                >
                  <FaSchool size={24} style={{ color: "white" }} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0 text-white">
                    Top Performing Schools
                  </h5>
                  <small className="text-white text-opacity-75">
                    Based on average scores
                  </small>
                </div>
              </div>
              <div className="bg-white bg-opacity-20 rounded-3 px-3 py-1">
                <small className="text-success fw-semibold">
                  {schools.length} Schools
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
                  style={{ color: "#78a372" }}
                />
                <p className="text-muted small mb-0">
                  Loading school rankings...
                </p>
              </div>
            ) : schools.length === 0 ? (
              <div className="text-center py-5">
                <FaSchool size={48} className="text-muted opacity-25 mb-3" />
                <p className="text-muted mb-0">No school data available</p>
              </div>
            ) : (
              <div className="vstack gap-3">
                {schools.map((school, index) => (
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
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: "40px",
                            height: "40px",
                            background:
                              index < 3
                                ? "linear-gradient(135deg, #32803e 0%, #78a372 100%)"
                                : "#f8f9fa",
                            color: index < 3 ? "white" : "#6c757d",
                          }}
                        >
                          {getRankIcon(index)}
                        </div>
                        <div>
                          <h6
                            className="fw-semibold mb-1"
                            style={{ color: "#2c3e2f" }}
                          >
                            {school.school}
                          </h6>
                          <div className="d-flex align-items-center gap-3">
                            <small className="text-muted d-flex align-items-center gap-1">
                              <FaUsers size={12} />
                              {school.totalStudents} students
                            </small>
                          </div>
                        </div>
                      </div>
                      <div className="text-end">
                        <div
                          className="fw-bold fs-5"
                          style={{ color: getScoreColor(school.avgScore) }}
                        >
                          {formatScore(school.avgScore)}%
                        </div>
                        <small
                          className="d-flex align-items-center gap-1"
                          style={{ color: "#78a372" }}
                        >
                          <MdTrendingUp size={12} />
                          {formatScore(school.passRate)}% pass
                        </small>
                      </div>
                    </div>
                    <div className="mt-2">
                      <div
                        className="progress"
                        style={{
                          height: "4px",
                          borderRadius: "2px",
                          background: "#e9ecef",
                        }}
                      >
                        <div
                          className="progress-bar"
                          role="progressbar"
                          style={{
                            width: `${parseFloat(school.avgScore) || 0}%`,
                            background:
                              "linear-gradient(90deg, #32803e 0%, #78a372 100%)",
                            borderRadius: "2px",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

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
              background: "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
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
                  style={{ color: "#78a372" }}
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
                                ? "linear-gradient(135deg, #32803e 0%, #78a372 100%)"
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
                            {candidate.name}
                          </h6>
                          <div className="d-flex align-items-center gap-3">
                            <small className="text-muted d-flex align-items-center gap-1">
                              <code style={{ fontSize: "11px" }}>
                                {candidate.regNumber}
                              </code>
                            </small>
                            {candidate.grade && (
                              <small
                                className="px-2 py-0 rounded"
                                style={{
                                  background: "rgba(120, 163, 114, 0.15)",
                                  color: "#32803e",
                                  fontSize: "10px",
                                  fontWeight: 600,
                                }}
                              >
                                {candidate.grade}
                              </small>
                            )}
                          </div>
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
                            style={{ color: "#78a372" }}
                          >
                            <FaArrowUp size={10} />
                            Top Performer
                          </small>
                        )}
                      </div>
                    </div>
                    {index < 3 && (
                      <div className="mt-2">
                        <div
                          className="progress"
                          style={{
                            height: "3px",
                            borderRadius: "2px",
                            background: "#e9ecef",
                          }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${100 - index * 15}%`,
                              background:
                                index === 0
                                  ? "#FFD700"
                                  : index === 1
                                    ? "#C0C0C0"
                                    : "#CD7F32",
                              borderRadius: "2px",
                            }}
                          />
                        </div>
                      </div>
                    )}
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
