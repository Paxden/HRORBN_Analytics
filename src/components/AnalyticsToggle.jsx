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
  FaCheckCircle,
  FaTimesCircle,
  FaUserGraduate,
  FaMapMarkerAlt,
  FaPercentage,
  FaStar,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp, MdClose } from "react-icons/md";

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

  // Get performance badge
  const getPerformanceBadge = (rate) => {
    const num = parseFloat(rate);
    if (num >= 70)
      return {
        text: "Excellent",
        color: "#28a745",
        bg: "rgba(40, 167, 69, 0.1)",
      };
    if (num >= 50)
      return { text: "Good", color: "#ffc107", bg: "rgba(255, 193, 7, 0.1)" };
    return {
      text: "Needs Improvement",
      color: "#dc3545",
      bg: "rgba(220, 53, 69, 0.1)",
    };
  };

  // Modal states
  const [selectedSchool, setSelectedSchool] = useState(null);
  const [schoolDetails, setSchoolDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [programmeDetails, setProgrammeDetails] = useState(null);
  const [loadingProgramme, setLoadingProgramme] = useState(false);

  const handleOpenSchool = async (schoolName) => {
    try {
      setSelectedSchool(schoolName);
      setLoadingDetails(true);

      const res = await api.get(
        `/analytics/school-details?examId=${selectedExam._id}&school=${encodeURIComponent(
          schoolName,
        )}`,
      );

      setSchoolDetails(res.data);
    } catch (err) {
      console.error("School details error:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleOpenProgramme = async (programme) => {
    try {
      setSelectedProgramme(programme);
      setLoadingProgramme(true);

      const res = await api.get(
        `/analytics/programme-details?examId=${selectedExam._id}&programme=${encodeURIComponent(programme)}`,
      );

      setProgrammeDetails(res.data);
    } catch (err) {
      console.error("Programme details error:", err);
    } finally {
      setLoadingProgramme(false);
    }
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
              width: "48px",
              height: "48px",
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
            <p className="text-muted small mb-0">
              {selectedExam?.title || "Exam Analytics Dashboard"}
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Toggle Views */}
      <div className="col-12">
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
                  borderRadius: "0.5rem",
                  padding: "8px 20px",
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
                  borderRadius: "0.5rem",
                  padding: "8px 20px",
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
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
                  <div>
                    <h4 className="fw-bold mb-0" style={{ color: "#2c3e2f" }}>
                      Top Performing Schools
                    </h4>
                    <small className="text-muted">Based on pass rates</small>
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
                    {schools.map((s, i) => {
                      const performance = getPerformanceBadge(s.passRate);
                      return (
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
                          onClick={() => handleOpenSchool(s.school)}
                        >
                          <div className="d-flex justify-content-between align-items-start mb-2">
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                                style={{
                                  width: "40px",
                                  height: "40px",
                                  background:
                                    i < 3
                                      ? "linear-gradient(135deg, #78a372 0%, #32803e 100%)"
                                      : "#f8f9fa",
                                  color: i < 3 ? "white" : "#6c757d",
                                  fontSize: i < 3 ? "14px" : "16px",
                                }}
                              >
                                {i < 3 ? <FaStar size={16} /> : i + 1}
                              </div>
                              <div>
                                <h6
                                  className="fw-semibold mb-1"
                                  style={{ color: "#2c3e2f" }}
                                >
                                  {s.school.length > 50
                                    ? s.school.substring(0, 50) + "..."
                                    : s.school}
                                </h6>
                                <div className="d-flex align-items-center gap-3">
                                  <small className="text-muted d-flex align-items-center gap-1">
                                    <FaUsers size={12} />
                                    {s.totalStudents} students
                                  </small>
                                  <small
                                    className="px-2 py-1 rounded"
                                    style={{
                                      background: performance.bg,
                                      color: performance.color,
                                      fontSize: "11px",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {performance.text}
                                  </small>
                                </div>
                              </div>
                            </div>
                            <div className="text-end">
                              <div
                                className="fw-bold fs-4"
                                style={{
                                  color: getPerformanceColor(s.passRate),
                                }}
                              >
                                {formatScore(s.passRate)}%
                              </div>
                              <small className="text-muted">Pass Rate</small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ============================== */}
            {/* 📘 PROGRAMMES */}
            {/* ============================== */}
            {!loading && view === "programmes" && programmes && (
              <div>
                <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-3">
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
                    className="alert mb-4 d-flex align-items-center justify-content-between flex-wrap gap-2"
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
                    {programmes.programmes.map((p, i) => {
                      const performance = getPerformanceBadge(p.passRate);
                      return (
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
                          onClick={() => handleOpenProgramme(p.programme)}
                        >
                          <div className="d-flex justify-content-between align-items-start">
                            <div className="flex-grow-1">
                              <div className="d-flex align-items-center gap-2 mb-2">
                                <h6
                                  className="fw-semibold mb-0"
                                  style={{ color: "#2c3e2f" }}
                                >
                                  {p.programme}
                                </h6>
                                <small
                                  className="px-2 py-1 rounded"
                                  style={{
                                    background: performance.bg,
                                    color: performance.color,
                                    fontSize: "10px",
                                    fontWeight: 600,
                                  }}
                                >
                                  {performance.text}
                                </small>
                              </div>
                              <div className="d-flex align-items-center gap-3">
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <MdTrendingUp size={12} />
                                  Pass Rate: {formatScore(p.passRate)}%
                                </small>
                                <small className="text-muted d-flex align-items-center gap-1">
                                  <FaUsers size={12} />
                                  {p.count} students
                                </small>
                              </div>
                            </div>
                            <div className="text-end ms-3">
                              <div
                                className="fw-bold fs-4"
                                style={{ color: "#32803e" }}
                              >
                                {p.count}
                              </div>
                              <small className="text-muted">
                                {p.percentage}% of total
                              </small>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================== */}
      {/* SCHOOL DETAILS MODAL */}
      {/* ============================== */}
      {selectedSchool && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setSelectedSchool(null)}
          />
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div
                className="modal-content"
                style={{ borderRadius: "1rem", overflow: "hidden" }}
              >
                <div
                  className="modal-header"
                  style={{
                    background:
                      "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FaSchool size={20} />
                    <h5 className="modal-title fw-bold">School Details</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedSchool(null)}
                  />
                </div>

                <div className="modal-body p-4">
                  {loadingDetails ? (
                    <div className="text-center py-4">
                      <FaSpinner
                        className="fa-spin mb-3"
                        size={30}
                        style={{ color: "#78a372" }}
                      />
                      <p className="text-muted mb-0">
                        Loading school details...
                      </p>
                    </div>
                  ) : schoolDetails ? (
                    <div>
                      <div className="mb-4 pb-3 border-bottom">
                        <h6
                          className="fw-bold mb-2"
                          style={{ color: "#2c3e2f" }}
                        >
                          {selectedSchool}
                        </h6>
                        <div className="d-flex align-items-center gap-2">
                          <FaMapMarkerAlt
                            size={14}
                            style={{ color: "#78a372" }}
                          />
                          <span className="text-muted h6">
                            {schoolDetails.state || "N/A"} State
                          </span>
                        </div>
                      </div>

                      <div className="row g-3">
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(120, 163, 114, 0.1)",
                            }}
                          >
                            <FaUsers size={20} style={{ color: "#78a372" }} />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#32803e" }}
                            >
                              {schoolDetails.totalCandidates || 0}
                            </div>
                            <small className="text-muted">
                              Total Candidates
                            </small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(120, 163, 114, 0.1)",
                            }}
                          >
                            <FaPercentage
                              size={20}
                              style={{ color: "#78a372" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#32803e" }}
                            >
                              {formatScore(schoolDetails.passRate)}%
                            </div>
                            <small className="text-muted">Pass Rate</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(40, 167, 69, 0.1)",
                            }}
                          >
                            <FaCheckCircle
                              size={20}
                              style={{ color: "#28a745" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#28a745" }}
                            >
                              {schoolDetails.passCount || 0}
                            </div>
                            <small className="text-muted">Passed</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(220, 53, 69, 0.1)",
                            }}
                          >
                            <FaTimesCircle
                              size={20}
                              style={{ color: "#dc3545" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#dc3545" }}
                            >
                              {schoolDetails.failCount || 0}
                            </div>
                            <small className="text-muted">Failed</small>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">
                            Performance Overview
                          </small>
                          <small
                            className="fw-semibold"
                            style={{ color: "#32803e" }}
                          >
                            {formatScore(schoolDetails.passRate)}% Pass Rate
                          </small>
                        </div>
                        <div
                          className="progress"
                          style={{ height: "8px", borderRadius: "4px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${schoolDetails.passRate || 0}%`,
                              background:
                                "linear-gradient(90deg, #78a372 0%, #32803e 100%)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">
                        No data available for this school
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0">
                  <button
                    className="btn px-4"
                    onClick={() => setSelectedSchool(null)}
                    style={{
                      background:
                        "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* ============================== */}
      {/* PROGRAMME DETAILS MODAL */}
      {/* ============================== */}
      {selectedProgramme && (
        <>
          <div
            className="modal-backdrop fade show"
            style={{
              zIndex: 1040,
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
            onClick={() => setSelectedProgramme(null)}
          />
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ zIndex: 1050 }}
          >
            <div className="modal-dialog modal-dialog-centered modal-md">
              <div
                className="modal-content"
                style={{ borderRadius: "1rem", overflow: "hidden" }}
              >
                <div
                  className="modal-header"
                  style={{
                    background:
                      "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
                    color: "white",
                    border: "none",
                  }}
                >
                  <div className="d-flex align-items-center gap-2">
                    <FaGraduationCap size={20} />
                    <h5 className="modal-title fw-bold">Programme Details</h5>
                  </div>
                  <button
                    type="button"
                    className="btn-close btn-close-white"
                    onClick={() => setSelectedProgramme(null)}
                  />
                </div>

                <div className="modal-body p-4">
                  {loadingProgramme ? (
                    <div className="text-center py-4">
                      <FaSpinner
                        className="fa-spin mb-3"
                        size={30}
                        style={{ color: "#78a372" }}
                      />
                      <p className="text-muted mb-0">
                        Loading programme details...
                      </p>
                    </div>
                  ) : programmeDetails ? (
                    <div>
                      <div className="mb-4 pb-3 border-bottom">
                        <h6
                          className="fw-bold mb-2"
                          style={{ color: "#2c3e2f" }}
                        >
                          {selectedProgramme}
                        </h6>
                      </div>

                      <div className="row g-3">
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(120, 163, 114, 0.1)",
                            }}
                          >
                            <FaUsers size={20} style={{ color: "#78a372" }} />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#32803e" }}
                            >
                              {programmeDetails.totalCandidates || 0}
                            </div>
                            <small className="text-muted">
                              Total Candidates
                            </small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(120, 163, 114, 0.1)",
                            }}
                          >
                            <MdTrendingUp
                              size={20}
                              style={{ color: "#78a372" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#32803e" }}
                            >
                              {formatScore(programmeDetails.avgScore)}%
                            </div>
                            <small className="text-muted">Average Score</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(40, 167, 69, 0.1)",
                            }}
                          >
                            <FaCheckCircle
                              size={20}
                              style={{ color: "#28a745" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#28a745" }}
                            >
                              {programmeDetails.passCount || 0}
                            </div>
                            <small className="text-muted">Passed</small>
                          </div>
                        </div>
                        <div className="col-6">
                          <div
                            className="rounded-3 p-3 text-center"
                            style={{
                              backgroundColor: "rgba(220, 53, 69, 0.1)",
                            }}
                          >
                            <FaTimesCircle
                              size={20}
                              style={{ color: "#dc3545" }}
                            />
                            <div
                              className="fw-bold fs-3 mt-2"
                              style={{ color: "#dc3545" }}
                            >
                              {programmeDetails.failCount || 0}
                            </div>
                            <small className="text-muted">Failed</small>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <small className="text-muted">Pass Rate</small>
                          <small
                            className="fw-semibold"
                            style={{ color: "#32803e" }}
                          >
                            {formatScore(programmeDetails.passRate)}%
                          </small>
                        </div>
                        <div
                          className="progress"
                          style={{ height: "8px", borderRadius: "4px" }}
                        >
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${programmeDetails.passRate || 0}%`,
                              background:
                                "linear-gradient(90deg, #32803e 0%, #78a372 100%)",
                              borderRadius: "4px",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <p className="text-muted mb-0">
                        No data available for this programme
                      </p>
                    </div>
                  )}
                </div>

                <div className="modal-footer border-0">
                  <button
                    className="btn px-4"
                    onClick={() => setSelectedProgramme(null)}
                    style={{
                      background:
                        "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
                      color: "white",
                      border: "none",
                      borderRadius: "0.5rem",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.opacity = "0.9")
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

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

        .modal.show {
          display: block;
        }

        .modal-backdrop {
          z-index: 1040;
        }
      `}</style>
    </div>
  );
};

export default AnalyticsToggle;
