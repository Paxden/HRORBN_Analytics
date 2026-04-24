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
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaEye,
  FaFileExport,
  FaUsers,
  FaPercentage,
  FaRegFileAlt,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp, MdTrendingDown } from "react-icons/md";

export default function Results() {
  const { selectedExam } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [showFilters, setShowFilters] = useState(true);

  // filters
  const [search, setSearch] = useState("");
  const [state, setState] = useState("");
  const [school, setSchool] = useState("");
  const [centre, setCentre] = useState("");
  const [minScore, setMinScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  const [grade, setGrade] = useState("");
  const [status, setStatus] = useState("");
  const [stats, setStats] = useState(null);

  const statuses = ["Pass", "Fail"];

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
          state,
          school,
          centre,
          minScore,
          maxScore,
          grade,
          status,
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
    setState("");
    setSchool("");
    setCentre("");
    setMinScore("");
    setMaxScore("");
    setGrade("");
    setStatus("");
    setPage(1);
    setTimeout(() => fetchResults(), 100);
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  const exportToCSV = () => {
    const headers = [
      "S/N",
      "Name",
      "Reg No",
      "School",
      "State",
      "Centre",
      "Score",
      "Grade",
      "Status",
    ];
    const csvData = results.map((r, i) => [
      i + 1,
      r.name,
      r.regNumber,
      r.school,
      r.state,
      r.centre,
      r.score,
      r.grade,
      r.status,
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

      setLoading(true);
      setError(null);

      const res = await api.get("/analytics/stats", {
        params: {
          examId: selectedExam._id,
        },
      });

      // Calculate additional metrics from response data
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
        scoreDistribution: data.scoreDistribution || [],
        topSchools: data.topSchools || [],
        topCandidates: data.topCandidates || [],
        ...data,
      };

      setStats(analyticsData);
    } catch (err) {
      console.error("Analytics error:", err);
      setError(err.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const getPassRateColor = (passCount, totalCandidates) => {
    const rate = totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;
    if (rate >= 70) return "success";
    if (rate >= 50) return "warning";
    return "danger";
  };

  useEffect(() => {
    fetchAnalytics();
  }, [selectedExam]);

  // Safely extract values from stats with defaults
  const totalCandidates = stats?.totalCandidates || 0;
  const avgScore = stats?.avgScore || 0;
  const maxScoreStat = stats?.maxScore || 0;
  const passCount = stats?.passCount || 0;
  const passRate = stats?.passRate || 0;

  const statCards = [
    {
      title: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      icon: <FaUsers />,
      color: "primary",
      bgColor: "bg-primary bg-opacity-10",
      textColor: "text-primary",
    },
    {
      title: "Average Score",
      value: avgScore.toFixed(2),
      icon: <MdAnalytics />,
      color: "info",
      bgColor: "bg-info bg-opacity-10",
      textColor: "text-info",
      suffix: "%",
    },
    {
      title: "Highest Score",
      value: maxScoreStat,
      icon: <FaTrophy />,
      color: "warning",
      bgColor: "bg-warning bg-opacity-10",
      textColor: "text-warning",
      suffix: "%",
    },
    {
      title: "Pass Rate",
      value: `${passRate.toFixed(1)}%`,
      icon: <FaPercentage />,
      color: getPassRateColor(passCount, totalCandidates),
      bgColor: `bg-${getPassRateColor(passCount, totalCandidates)} bg-opacity-10`,
      textColor: `text-${getPassRateColor(passCount, totalCandidates)}`,
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

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <div>
          <h1
            className="h2 fw-bold mb-0"
            style={{
              background: "linear-gradient(135deg, #0d6efd 0%, #0dcaf0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Exam Results
          </h1>
          <h4 className="mt-2 mb-1">
            Nursing and Midwifery Council of Nigeria
          </h4>
          <p className="text-muted">
            Viewing Results for:{" "}
            <strong className="text-primary">
              {selectedExam.title} CBT and CAOSCE Result Dashboard
            </strong>
          </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={exportToCSV}
            disabled={results.length === 0}
          >
            <FaFileExport className="me-1" size={14} /> Export CSV
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.print()}
          >
            <FaPrint className="me-1" size={14} /> Print
          </button>
          <button
            className="btn btn-outline-primary btn-sm"
            onClick={() => setShowFilters(!showFilters)}
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
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "translateY(-5px)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "translateY(0)")
              }
            >
              <div className="card-body p-3">
                <div className="d-flex align-items-center justify-content-between mb-3">
                  <div className={`${stat.bgColor} rounded-3 p-3`}>
                    <div
                      className={stat.textColor}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-end">
                    <h3 className="fw-bold mb-0">
                      {stat.value}
                      {stat.suffix && (
                        <small className="fs-6 text-muted">{stat.suffix}</small>
                      )}
                    </h3>
                  </div>
                </div>
                <h6 className="fw-semibold mb-0">{stat.title}</h6>
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
                  <FaSearch className="me-1" size={12} /> Search
                </label>
                <input
                  className="form-control"
                  placeholder="Name / Reg No"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">
                  <FaSchool className="me-1" size={12} /> School
                </label>
                <input
                  className="form-control"
                  placeholder="School"
                  value={school}
                  onChange={(e) => setSchool(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">
                  <FaBuilding className="me-1" size={12} /> Centre
                </label>
                <input
                  className="form-control"
                  placeholder="Centre"
                  value={centre}
                  onChange={(e) => setCentre(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleFilter()}
                />
              </div>

              <div className="col-md-1">
                <label className="form-label fw-semibold small">
                  Min Score
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Min"
                  value={minScore}
                  onChange={(e) => setMinScore(e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label className="form-label fw-semibold small">
                  Max Score
                </label>
                <input
                  type="number"
                  className="form-control"
                  placeholder="Max"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                />
              </div>

              <div className="col-md-1">
                <label className="form-label fw-semibold small">Status</label>
                <select
                  className="form-select"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="">All</option>
                  {statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-2">
                <label className="form-label fw-semibold small">&nbsp;</label>
                <div className="d-flex gap-2">
                  <button
                    className="btn btn-primary flex-grow-1"
                    onClick={handleFilter}
                  >
                    <FaSearch className="me-1" size={14} />  Filter
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={handleReset}
                  >
                    Reset
                  </button>
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
            <thead className="bg-light">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">Candidate Name</th>
                <th className="py-3 px-4">Exam Number</th>
                <th className="py-3 px-4">School</th>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Centre</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <FaSpinner
                      className="fa-spin mb-2"
                      size={30}
                      style={{ color: "#0d6efd" }}
                    />
                    <p className="text-muted mb-0">Loading results...</p>
                  </td>
                </tr>
              ) : results.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-5">
                    <div className="text-muted">
                      <FaUserGraduate size={48} className="mb-3 opacity-25" />
                      <p className="mb-0">No results found for this exam</p>
                      <small>Try adjusting your filters</small>
                    </div>
                  </td>
                </tr>
              ) : (
                results.map((r, i) => (
                  <tr key={r._id} className="border-bottom">
                    <td className="py-3 px-4">{(page - 1) * 15 + i + 1}</td>
                    <td className="py-3 px-4">
                      <div className="d-flex align-items-center gap-2">
                        <div
                          className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                          style={{ width: "32px", height: "32px" }}
                        >
                          <FaUserGraduate size={14} className="text-muted" />
                        </div>
                        <span className="fw-semibold">{r.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <code className="small">{r.regNumber}</code>
                    </td>
                    <td className="py-3 px-4">{r.school}</td>
                    <td className="py-3 px-4">{r.state}</td>
                    <td className="py-3 px-4">{r.centre}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`fw-bold text-${getScoreColor(r.score)}`}
                      >
                        {r.score}%
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span
                        className={`badge ${r.status === "Pass" ? "bg-success" : "bg-danger"} px-3 py-2 rounded-pill d-inline-flex align-items-center gap-1`}
                      >
                        {r.status === "Pass" ? (
                          <FaCheckCircle size={12} />
                        ) : (
                          <FaTimesCircle size={12} />
                        )}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        style={{ borderRadius: "0.5rem" }}
                      >
                        <FaEye size={12} /> View
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
                <span className="px-3 py-1">
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
          box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
          border-color: #0d6efd;
        }

        .table-hover tbody tr:hover {
          background-color: rgba(13, 110, 253, 0.05);
        }

        code {
          background: #f8f9fa;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}
