/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
// pages/dashboard/Results.jsx
import { useEffect, useState } from "react";
import api from "../api/Auth";
import { useAuth } from "../context/AuthContext";
import {
  FaSpinner,
  FaSearch,
  FaFilter,
  FaPrint,
  FaChevronLeft,
  FaChevronRight,
  FaTrophy,
  FaUserGraduate,
  FaSchool,
  FaBuilding,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileExport,
  FaUsers,
  FaPercentage,
  FaRegFileAlt,
  FaBook,
  FaClipboardList,
  FaCalendar,
  FaChartLine,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import Loading from "../components/Loading";
// #7e796c #6c757d


export default function Results() {
  const { selectedExam } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedResult, setSelectedResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // filters - updated to match backend fields
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [programme, setProgramme] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("");
  const [resit, setResit] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [stats, setStats] = useState(null);

  const statuses = ["PASS", "FAIL"];
  const grades = ["A", "B", "C", "D", "F"];
  const resitOptions = ["true", "false"];
  const months = [
    "january",
    "february",
    "march",
    "april",
    "may",
    "june",
    "july",
    "august",
    "september",
    "october",
    "november",
    "december",
  ];
  const years = ["2024", "2025", "2026", "2027"];

  const fetchResults = async () => {
    try {
      if (!selectedExam?._id) return;

      setLoading(true);
      setError("");

      const res = await api.get("/results", {
        params: {
          examId: selectedExam._id,
          page,
          limit: 15,
          search,
          department,
          programme,
          minScore,
          maxScore,
          grade,
          status,
          resit,
          month,
          year,
        },
      });

      setResults(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalResults(res.data.pagination?.total || 0);
    } catch (err) {
      console.error("Results error:", err);
      setError(err.response?.data?.message || "Failed to load results");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedExam?._id) {
      fetchResults();
    }
  }, [selectedExam, page]);

  const handleFilter = () => {
    setPage(1);
    fetchResults();
  };

  const handleReset = () => {
    setSearch("");
    setDepartment("");
    setProgramme("");
    setMinScore("");
    setMaxScore("");
    setGrade("");
    setStatus("");
    setResit("");
    setMonth("");
    setYear("");
    setPage(1);
    setTimeout(() => fetchResults(), 100);
  };

  const getScoreColor = (score) => {
    if (!score && score !== 0) return "text-muted";
    if (score >= 70) return "text-success";
    if (score >= 50) return "text-warning";
    return "text-danger";
  };

  const getScoreBadgeClass = (score) => {
    if (score >= 70) return "bg-success bg-opacity-10 text-success";
    if (score >= 50) return "bg-warning bg-opacity-10 text-warning";
    return "bg-danger bg-opacity-10 text-danger";
  };

  const exportToCSV = () => {
    const headers = [
      "S/N",
      "Exam Number",
      "Department",
      "Department Code",
      "Programme",
      "Level Code",
      "Paper 1",
      "Paper 2",
      "Paper 3",
      "Paper 4",
      "Paper 5",
      "Paper 6",
      "Total Score",
      "Average",
      "Grade",
      "Status",
      "Resit",
      "Month",
      "Year",
    ];

    const csvData = results.map((r, i) => [
      i + 1,
      r.examNumber || "N/A",
      r.department || "N/A",
      r.departmentCode || "N/A",
      r.programmeLevel || "N/A",
      r.levelCode || "N/A",
      r.subjects?.[0]?.score?.toFixed(1) || "N/A",
      r.subjects?.[1]?.score?.toFixed(1) || "N/A",
      r.subjects?.[2]?.score?.toFixed(1) || "N/A",
      r.subjects?.[3]?.score?.toFixed(1) || "N/A",
      r.subjects?.[4]?.score?.toFixed(1) || "N/A",
      r.subjects?.[5]?.score?.toFixed(1) || "N/A",
      r.totalScore?.toFixed(1) || "N/A",
      r.average?.toFixed(1) || "N/A",
      r.grade || "N/A",
      r.status || "N/A",
      r.isResit ? "Yes" : "No",
      r.month || "N/A",
      r.year || "N/A",
    ]);

    const csvContent = [headers, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `results_${selectedExam.title}_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const fetchAnalytics = async () => {
    try {
      if (!selectedExam?._id) return;

      const res = await api.get("/analytics/stats", {
        params: {
          examId: selectedExam._id,
        },
      });

      const data = res.data;
      const totalCandidates = data.totalCandidates || 0;
      const passCount = data.passCount || 0;
      const passRate =
        totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;

      const analyticsData = {
        totalCandidates: totalCandidates,
        avgScore: data.avgScore || 0,
        maxScore: data.maxScore || 0,
        minScore: data.minScore || 0,
        passCount: passCount,
        failCount: data.failCount || 0,
        passRate: passRate,
        ...data,
      };

      setStats(analyticsData);
    } catch (err) {
      console.error("Analytics error:", err);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedExam]);

  const viewDetails = (result) => {
    setSelectedResult(result);
    setShowModal(true);
  };

  const totalCandidates = stats?.totalCandidates || 0;
  const avgScore = stats?.avgScore || 0;
  const maxScoreStat = stats?.maxScore || 0;
  const passRate = stats?.passRate || 0;

  const statCards = [
    {
      title: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      icon: <FaUsers />,
      gradient: "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
      bgLight: "rgba(50, 128, 62, 0.1)",
      textColor: "#6c757d",
    },
    {
      title: "Average Score",
      value: avgScore.toFixed(1),
      icon: <MdAnalytics />,
      suffix: "%",
      gradient: "linear-gradient(135deg, #0dcaf0 0%, #0d6efd 100%)",
      bgLight: "rgba(13, 202, 240, 0.1)",
      textColor: "#0dcaf0",
    },
    {
      title: "Highest Score",
      value: maxScoreStat.toFixed(1),
      icon: <FaTrophy />,
      suffix: "%",
      gradient: "linear-gradient(135deg, #ffc107 0%, #ff9800 100%)",
      bgLight: "rgba(255, 193, 7, 0.1)",
      textColor: "#ffc107",
    },
    {
      title: "Pass Rate",
      value: passRate.toFixed(1),
      icon: <FaPercentage />,
      suffix: "%",
      gradient: "linear-gradient(135deg, #78a372 0%, #32803e 100%)",
      bgLight: "rgba(108, 117, 125, 0.1)",
      textColor: "#6c757d",
    },
  ];


  if (!selectedExam?._id) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: "80px", height: "80px" }}
          >
            <FaUserGraduate size={40} className="text-muted" />
          </div>
          <h5 className="fw-bold mb-2">No Exam Selected</h5>
          <p className="text-muted mb-0">
            Please select an exam to view results.
          </p>
        </div>
      </div>
    );
  }

  if (loading && results.length === 0) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <Loading />
          <h5 className="text-muted mt-3">Loading results...</h5>
        </div>
      </div>
    );
  }

  return (
    <div
      className="animate-fade-in"
      style={{ backgroundColor: "#f8f9fc", minHeight: "100vh" }}
    >
      <div className="container-fluid px-4">
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
          <div>
            <div className="d-flex gap-3 mb-2">
              <div
                className="rounded-circle d-flex mt-1 align-items-center justify-content-center"
                style={{
                  width: "48px",
                  height: "48px",
                  background:
                    "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                  boxShadow: "0 4px 12px rgba(50, 128, 62, 0.3)",
                }}
              >
                <FaClipboardList size={24} className="text-white" />
              </div>
              <div>
                <h1
                  className="h2 fw-bold mb-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Exam Results
                </h1>
                <h5 className="m-0 p-0">
                  Health Records Organization Registration Board of Nigeria{" "}
                </h5>
                <p className="text-muted mb-0">{selectedExam.title}</p>
              </div>
            </div>
          </div>

          <div className="d-flex gap-2">
            <button
              className="btn btn-sm"
              onClick={exportToCSV}
              disabled={results.length === 0}
              style={{
                background: "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                color: "white",
                border: "none",
                borderRadius: "0.5rem",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.9")}
              onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
            >
              <FaFileExport className="me-1" size={14} /> Export CSV
            </button>
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={() => window.print()}
              style={{ borderRadius: "0.5rem" }}
            >
              <FaPrint className="me-1" size={14} /> Print
            </button>
            <button
              className="btn btn-outline-success btn-sm"
              onClick={() => setShowFilters(!showFilters)}
              style={{
                borderRadius: "0.5rem",
                borderColor: "#7e796c",
                color: "#6c757d",
              }}
            >
              <FaFilter className="me-1" size={14} />{" "}
              {showFilters ? "Hide" : "Show"} Filters
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="row g-3 mb-4">
          {statCards.map((stat, index) => (
            <div key={index} className="col-md-3 col-sm-6">
              <div
                className="card border-0 shadow-sm h-100 animate-slide-up"
                style={{
                  borderRadius: "1rem",
                  transition: "transform 0.3s ease",
                  cursor: "pointer",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "translateY(-5px)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "translateY(0)")
                }
              >
                <div className="card-body p-4">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <div
                      className="rounded-3 p-3 d-flex align-items-center justify-content-center"
                      style={{
                        background: stat.gradient,
                        width: "56px",
                        height: "56px",
                      }}
                    >
                      <div style={{ color: "white", fontSize: "1.5rem" }}>
                        {stat.icon}
                      </div>
                    </div>
                    <div className="text-end">
                      <h3 className="fw-bold mb-0" style={{ color: "#6c757d" }}>
                        {stat.value}
                        {stat.suffix && (
                          <small className="fs-6 text-muted">
                            {stat.suffix}
                          </small>
                        )}
                      </h3>
                    </div>
                  </div>
                  <h6 className="fw-semibold mb-0 text-muted">{stat.title}</h6>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters Card */}
        {showFilters && (
          <div
            className="card border-0 shadow-sm mb-4 animate-slide-up"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="row g-3">
                <div className="col-md-3">
                  <label className="form-label fw-semibold small">
                    <FaSearch
                      className="me-1"
                      size={12}
                      style={{ color: "#7e796c" }}
                    />{" "}
                    Search
                  </label>
                  <input
                    className="form-control"
                    placeholder="Exam Number / Department / Programme"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label fw-semibold small">
                    <FaBuilding
                      className="me-1"
                      size={12}
                      style={{ color: "#7e796c" }}
                    />{" "}
                    Department
                  </label>
                  <input
                    className="form-control"
                    placeholder="Department"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>

                <div className="col-md-2">
                  <label className="form-label fw-semibold small">
                    <FaBook
                      className="me-1"
                      size={12}
                      style={{ color: "#7e796c" }}
                    />{" "}
                    Programme
                  </label>
                  <input
                    className="form-control"
                    placeholder="Programme"
                    value={programme}
                    onChange={(e) => setProgramme(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                    style={{ borderRadius: "0.5rem" }}
                  />
                </div>

                <div className="col-md-1">
                  <label className="form-label fw-semibold small">Status</label>
                  <select
                    className="form-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <option value="">All</option>
                    {statuses.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-1">
                  <label className="form-label fw-semibold small">Resit</label>
                  <select
                    className="form-select"
                    value={resit}
                    onChange={(e) => setResit(e.target.value)}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <option value="">All</option>
                    <option value="false">Regular</option>
                    <option value="true">Resit</option>
                  </select>
                </div>

                <div className="col-md-3 d-flex  align-items-center justify-content-center gap-2">
                  <div>
                    {" "}
                    {/* <label className="form-label fw-semibold small">
                      &nbsp;
                    </label> */}
                    <div className="d-flex gap-2">
                      <button
                        className="btn flex-grow-1"
                        onClick={handleFilter}
                        style={{
                          background:
                            "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                          color: "white",
                          border: "none",
                          borderRadius: "0.5rem",
                        }}
                      >
                        <FaSearch className="me-1" size={12} /> 
                         Apply
                      </button>
                    </div>
                  </div>
                  <div className="">
                    <div className="">
                      <button
                        className="btn btn-outline-secondary btn-sm"
                        onClick={handleReset}
                        style={{ borderRadius: "0.5rem" }}
                      >
                        Reset All Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div
            className="alert alert-danger d-flex align-items-center mb-4"
            style={{ borderRadius: "0.75rem" }}
          >
            <FaTimesCircle className="me-2" size={18} />
            <div>{error}</div>
          </div>
        )}

        {/* Results Table */}
        <div
          className="card border-0 shadow-sm"
          style={{ borderRadius: "1rem", overflow: "hidden" }}
        >
          <div className="table-responsive">
            <table className="table table-hover mb-0">
              <thead
                style={{
                  backgroundColor: "#f8f9fa",
                  borderBottom: "2px solid #7e796c",
                }}
              >
                <tr>
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    #
                  </th>
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Exam Number
                  </th>
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Department
                  </th>
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Programme
                  </th>
                
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Avg score
                  </th>
                 
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Status
                  </th>
                
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Month/Year
                  </th>
                  <th className="py-3 px-4" style={{ color: "#6c757d" }}>
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <FaSpinner
                        className="fa-spin mb-2"
                        size={30}
                        style={{ color: "#7e796c" }}
                      />
                      <p className="text-muted mb-0">Loading results...</p>
                    </td>
                  </tr>
                ) : results.length === 0 ? (
                  <tr>
                    <td colSpan="11" className="text-center py-5">
                      <div className="text-muted">
                        <FaUserGraduate size={48} className="mb-3 opacity-25" />
                        <p className="mb-0">No results found for this exam</p>
                        <small>Try adjusting your filters</small>
                      </div>
                    </td>
                  </tr>
                ) : (
                  results.map((r, i) => (
                    <tr
                      key={r._id}
                      className="border-bottom"
                      style={{ transition: "background 0.3s ease" }}
                    >
                      <td className="py-3 px-4">{(page - 1) * 15 + i + 1}</td>

                      <td className="py-3 px-4">
                        <code
                          className="small"
                          style={{
                            backgroundColor: "#f8f9fa",
                            padding: "4px 8px",
                            borderRadius: "4px",
                          }}
                        >
                          {r.examNumber || "N/A"}
                        </code>
                      </td>

                      <td className="py-3 px-4">
                        <div className="d-flex flex-column">
                          <span className="fw-semibold small">
                            {r.department || "N/A"}
                          </span>
                          {r.departmentCode && (
                            <small
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              Code: {r.departmentCode}
                            </small>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="d-flex flex-column">
                          <span className="small">
                            {r.programmeLevel || "N/A"}
                          </span>
                          {r.levelCode && (
                            <small
                              className="text-muted"
                              style={{ fontSize: "10px" }}
                            >
                              Level: {r.levelCode}
                            </small>
                          )}
                        </div>
                      </td>

                     

                      <td className="py-3 px-4">
                        <div className="d-flex flex-column">
                          <span
                            className={`fw-bold ${getScoreColor(r.average)}`}
                          >
                            {r.average?.toFixed(1)}%
                          </span>
                        </div>
                      </td>

                  

                      <td className="py-3 px-4">
                        <span
                          className={`badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 ${
                            r.status === "PASS" ? "bg-success" : "bg-danger"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {r.status === "PASS" ? (
                            <FaCheckCircle size={12} />
                          ) : (
                            <FaTimesCircle size={12} />
                          )}
                          {r.status || "N/A"}
                        </span>
                      </td>


                      <td className="py-3 px-4">
                        <div className="d-flex flex-column">
                          <small className="fw-semibold">
                            {r.month
                              ? r.month.charAt(0).toUpperCase() +
                                r.month.slice(1)
                              : "N/A"}
                          </small>
                          <small
                            className="text-muted"
                            style={{ fontSize: "10px" }}
                          >
                            {r.year || "N/A"}
                          </small>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          className="btn btn-sm"
                          onClick={() => viewDetails(r)}
                          style={{
                            background:
                              "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                            color: "white",
                            borderRadius: "0.5rem",
                            border: "none",
                            padding: "6px 12px",
                          }}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.opacity = "0.9")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.opacity = "1")
                          }
                        >
                          <FaEye size={12} className="me-1" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white border-0 py-3 px-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="text-muted small">
                  Showing {(page - 1) * 15 + 1} to{" "}
                  {Math.min(page * 15, totalResults)} of {totalResults} results
                </div>
                <div className="d-flex gap-1">
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <FaChevronLeft size={12} /> Prev
                  </button>
                  <span
                    className="px-3 py-1"
                    style={{ color: "#6c757d", fontWeight: 500 }}
                  >
                    Page {page} of {totalPages}
                  </span>
                  <button
                    className="btn btn-outline-secondary btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    Next <FaChevronRight size={12} />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Result Details Modal */}
      {showModal && selectedResult && (
        <div
          className="modal show d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowModal(false)}
        >
          <div
            className="modal-dialog modal-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div
              className="modal-content"
              style={{ borderRadius: "1rem", overflow: "hidden" }}
            >
              <div
                className="modal-header"
                style={{
                  background:
                    "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                  color: "white",
                  border: "none",
                }}
              >
                <h5 className="modal-title fw-bold">
                  <FaUserGraduate className="me-2" /> Candidate Details
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="row g-4">
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-1">
                        Exam Number
                      </small>
                      <h6 className="fw-bold mb-0">
                        {selectedResult.examNumber}
                      </h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-1">
                        Department
                      </small>
                      <h6 className="fw-bold mb-0">
                        {selectedResult.department}
                        {selectedResult.departmentCode && (
                          <small className="text-muted">
                            {" "}
                            ({selectedResult.departmentCode})
                          </small>
                        )}
                      </h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-1">
                        Programme
                      </small>
                      <h6 className="fw-bold mb-0">
                        {selectedResult.programmeLevel}
                        {selectedResult.levelCode && (
                          <small className="text-muted">
                            {" "}
                            - {selectedResult.levelCode}
                          </small>
                        )}
                      </h6>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-1">Status</small>
                      <h6 className="fw-bold mb-0">
                        <span
                          className={`badge px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1 ${
                            selectedResult.status === "PASS"
                              ? "bg-success"
                              : "bg-danger"
                          }`}
                          style={{ fontWeight: 600 }}
                        >
                          {selectedResult.status === "PASS" ? (
                            <FaCheckCircle size={12} />
                          ) : (
                            <FaTimesCircle size={12} />
                          )}
                          {selectedResult.status}
                        </span>
                        {selectedResult.isResit && (
                          <span className="badge bg-warning text-dark ms-2">
                            Resit
                          </span>
                        )}
                      </h6>
                    </div>
                  </div>
                  <div className="col-12">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-2">
                        Subjects Breakdown
                      </small>
                      <div className="row g-3">
                        {selectedResult.subjects?.map((subject, idx) => (
                          <div key={idx} className="col-md-4">
                            <div className="text-center p-2 bg-white rounded">
                              <div
                                className="fw-bold fs-5"
                                style={{ color: "#6c757d" }}
                              >
                                {subject.score?.toFixed(1)}%
                              </div>
                              <small className="text-muted">
                                {subject.name || `Paper ${idx + 1}`}
                              </small>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="row justify-content-center mt-3 pt-2 border-top">
                       
                        <div className="col-4">
                          <div className="text-center">
                            <div
                              className="fw-bold fs-4"
                              style={{ color: "#6c757d" }}
                            >
                              {selectedResult.average?.toFixed(1)}%
                            </div>
                            <small className="text-muted">Average</small>
                          </div>
                        </div>
                       
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="bg-light rounded-3 p-3">
                      <small className="text-muted d-block mb-1">
                        <FaCalendar className="me-1" size={12} /> Exam Period
                      </small>
                      <h6 className="fw-bold mb-0">
                        {selectedResult.month?.charAt(0).toUpperCase() +
                          selectedResult.month?.slice(1)}{" "}
                        {selectedResult.year}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn"
                  onClick={() => setShowModal(false)}
                  style={{
                    background:
                      "linear-gradient(135deg, #6c757d 0%, #7e796c 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: "0.5rem",
                  }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Custom CSS */}
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

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
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

        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(120, 163, 114, 0.25);
          border-color: #7e796c;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(120, 163, 114, 0.05);
        }

        code {
          font-family: 'Courier New', monospace;
        }

        .modal.show {
          display: block;
          z-index: 1050;
        }
      `}</style>
    </div>
  );
}
