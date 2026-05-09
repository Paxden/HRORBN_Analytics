/* eslint-disable no-unused-vars */
// pages/dashboard/CompareExams.jsx
import { useEffect, useState } from "react";
import api from "../api/Auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  CartesianGrid,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
import {
  FaChartLine,
  FaCheckCircle,
  FaTimesCircle,
  FaTrophy,
  FaMedal,
  FaUsers,
  FaSpinner,
  FaDownload,
  FaPrint,
  FaExchangeAlt,
  FaStar,
  FaChartBar,
  FaRegCaretSquareDown,
} from "react-icons/fa";
import {
  MdAnalytics,
  MdCompare,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import Loading from "../components/Loading";

// #7e796c #6c757d
// #7e796c #6c757d


export default function CompareExams() {
  const [exams, setExams] = useState([]);
  const [selected, setSelected] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await api.get("/exams");
      setExams(res.data.exams || res.data || []);
    } catch (err) {
      console.error("Failed to fetch exams:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const toggleExam = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const compare = async () => {
    if (selected.length < 2) {
      alert("Please select at least 2 exams to compare");
      return;
    }

    try {
      setComparing(true);
      const res = await api.post("/analytics/compare", {
        examIds: selected,
      });
      setData(res.data.comparison);
    } catch (err) {
      console.error("Comparison failed:", err);
      alert("Failed to compare exams. Please try again.");
    } finally {
      setComparing(false);
    }
  };

  const clearSelection = () => {
    setSelected([]);
    setData(null);
  };

  const getExamTitle = (examId) => {
    const exam = exams.find((e) => e._id === examId);
    return exam?.title || `Exam ${examId.slice(-4)}`;
  };

  const COLORS = [
    "#0d6efd",
    "#28a745",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#fd7e14",
  ];

  // Prepare radar chart data
  const getRadarData = () => {
    if (!data) return [];
    const metrics = ["avgScore", "passRate", "totalCandidates"];
    return metrics.map((metric) => ({
      metric:
        metric === "avgScore"
          ? "Avg Score"
          : metric === "passRate"
            ? "Pass Rate"
            : "Total Students",
      ...data.reduce((acc, item, idx) => {
        acc[`exam${idx + 1}`] =
          metric === "totalCandidates" ? item[metric] / 100 : item[metric];
        return acc;
      }, {}),
    }));
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <Loading />
          <h5 className="text-muted">Loading exams...</h5>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
        {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <div className="d-flex gap-3 mb-2">
                  <div
                    className="rounded-circle d-flex mt-1 align-items-center justify-content-center"
                    style={{
                      width: "48px",
                      height: "48px",
                      background: "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)",
                      boxShadow: "0 4px 12px rgba(50, 128, 62, 0.3)",
                    }}
                  >
                    <FaRegCaretSquareDown size={24} className="text-white" />
                  </div>
                  <div>
                    <h1
                      className="h2 fw-bold mb-0"
                      style={{
                        background:
                          "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}
                    >
                      Examination Comparision
                    </h1>
                    <h5 className="m-0p-0">Health Records Organization Registration Board of Nigeria </h5>
                    <p className="text-muted mb-0">Compare examination results across different sessions</p>
                  </div>
                </div>
              </div>
            </div>

      <div className="row g-4">
        {/* Left Panel - Exam Selection */}
        <div className="col-lg-4">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <div
                  className="bg-gradient-success rounded-3 p-2"
                  style={{
                    background:
                      "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)",
                  }}
                >
                  <MdCompare className="text-white" size={18} />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">Select Exams</h5>
                  <small className="text-muted">
                    Choose 2 or more exams to compare
                  </small>
                </div>
              </div>
            </div>

            <div className="card-body p-4">
              {exams.length === 0 ? (
                <div className="text-center py-4">
                  <FaSpinner className="fa-spin mb-2" size={24} />
                  <p className="text-muted small mb-0">Loading exams...</p>
                </div>
              ) : (
                <>
                  <div className="vstack gap-2 mb-4">
                    {exams.map((exam, idx) => (
                      <div
                        key={exam._id}
                        className={`form-check p-3 rounded-3 transition-all ${selected.includes(exam._id) ? "bg-success bg-opacity-10 border border-success" : "bg-light"}`}
                        style={{ cursor: "pointer" }}
                        onClick={() => toggleExam(exam._id)}
                      >
                        <input
                          type="checkbox"
                          className="form-check-input me-2"
                          id={`exam-${exam._id}`}
                          checked={selected.includes(exam._id)}
                          onChange={() => toggleExam(exam._id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <label
                          className="form-check-label fw-semibold"
                          htmlFor={`exam-${exam._id}`}
                        >
                          {exam.title}
                        </label>
                        {selected.includes(exam._id) && (
                          <span className="badge bg-success ms-2">
                            Selected
                          </span>
                        )}
                      </div>
                    ))}
                  </div>

                  <div className="d-flex gap-2">
                    <button
                      className="btn btn-success flex-grow-1"
                      onClick={compare}
                      disabled={comparing || selected.length < 2}
                      style={{ borderRadius: "0.75rem" }}
                    >
                      {comparing ? (
                        <>
                          <FaSpinner className="fa-spin me-2" /> Comparing...
                        </>
                      ) : (
                        <>
                          <MdCompare className="me-2" /> Compare Exams
                        </>
                      )}
                    </button>

                    {selected.length > 0 && (
                      <button
                        className="btn btn-outline-secondary"
                        onClick={clearSelection}
                        style={{ borderRadius: "0.75rem" }}
                      >
                        Clear
                      </button>
                    )}
                  </div>

                  {selected.length > 0 && selected.length < 2 && (
                    <small className="text-warning d-block mt-2">
                      Select at least 2 exams to compare
                    </small>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Selection Summary */}
          {selected.length > 0 && (
            <div
              className="card border-0 shadow-sm mt-4"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-4">
                <h6 className="fw-bold mb-3">
                  Selected Exams ({selected.length})
                </h6>
                <div className="d-flex flex-wrap gap-2">
                  {selected.map((id) => {
                    const exam = exams.find((e) => e._id === id);
                    return (
                      <span
                        key={id}
                        className="badge bg-success bg-opacity-10 text-success p-2 rounded-pill"
                      >
                        {exam?.title || id}
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Panel - Results */}
        <div className="col-lg-8">
          {!data ? (
            <div
              className="card border-0 shadow-sm"
              style={{ borderRadius: "1rem" }}
            >
              <div className="card-body p-5 text-center">
                <div
                  className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                  style={{ width: "100px", height: "100px" }}
                >
                  <MdCompare size={50} className="text-muted opacity-50" />
                </div>
                <h5 className="fw-bold mb-2">No Comparison Data</h5>
                <p className="text-muted mb-0">
                  Select at least 2 exams from the left panel and click "Compare
                  Exams" to see analytics
                </p>
              </div>
            </div>
          ) : (
            <div className="vstack gap-4">
              {/* Average Score Comparison */}
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "1rem", overflow: "hidden" }}
              >
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success bg-opacity-10 rounded-3 p-2">
                      <FaChartBar className="text-success" size={18} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Average Score Comparison</h5>
                      <small className="text-muted">
                        Average scores across selected exams
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="avgScoreGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#7e796c" />
                          <stop offset="100%" stopColor="#6c757d" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e9ecef"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="examId"
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        tickFormatter={(value) =>
                          getExamTitle(value).slice(0, 15)
                        }
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        label={{
                          value: "Score (%)",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "#6c757d", fontSize: 12 },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        formatter={(value) => [
                          `${value.toFixed(1)}%`,
                          "Average Score",
                        ]}
                        labelFormatter={(label) => getExamTitle(label)}
                      />
                      <Bar
                        dataKey="avgScore"
                        fill="url(#avgScoreGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={80}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Pass Rate Comparison */}
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "1rem", overflow: "hidden" }}
              >
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-success bg-opacity-10 rounded-3 p-2">
                      <FaTrophy className="text-success" size={18} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Pass Rate Comparison</h5>
                      <small className="text-muted">
                        Success rates across selected exams
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-4">
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={data}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <defs>
                        <linearGradient
                          id="passRateGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#28a745" />
                          <stop offset="100%" stopColor="#20c997" />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e9ecef"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="examId"
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        tickFormatter={(value) =>
                          getExamTitle(value).slice(0, 15)
                        }
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis
                        domain={[0, 100]}
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        axisLine={false}
                        tickLine={false}
                        label={{
                          value: "Pass Rate (%)",
                          angle: -90,
                          position: "insideLeft",
                          style: { fill: "#6c757d", fontSize: 12 },
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                        }}
                        formatter={(value) => [
                          `${value.toFixed(1)}%`,
                          "Pass Rate",
                        ]}
                        labelFormatter={(label) => getExamTitle(label)}
                      />
                      <Bar
                        dataKey="passRate"
                        fill="url(#passRateGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={80}
                        animationDuration={1500}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Summary Table */}
              <div
                className="card border-0 shadow-sm"
                style={{ borderRadius: "1rem", overflow: "hidden" }}
              >
                <div className="card-header bg-white border-0 pt-4 px-4">
                  <div className="d-flex align-items-center gap-2">
                    <div className="bg-info bg-opacity-10 rounded-3 p-2">
                      <MdAnalytics className="text-info" size={18} />
                    </div>
                    <div>
                      <h5 className="fw-bold mb-0">Detailed Comparison</h5>
                      <small className="text-muted">
                        Comprehensive metrics for each exam
                      </small>
                    </div>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead className="bg-light">
                        <tr>
                          <th className="py-3 px-4">Metric</th>
                          {data.map((d, idx) => (
                            <th
                              key={d.examId}
                              className="py-3 px-4 text-center"
                            >
                              <div className="d-flex flex-column align-items-center">
                                <span className="fw-bold">Exam {idx + 1}</span>
                                <small className="text-muted">
                                  {getExamTitle(d.examId).slice(0, 20)}
                                </small>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-3 px-4 fw-semibold">
                            <FaUsers className="me-2 text-success" size={14} />{" "}
                            Total Candidates
                          </td>
                          {data.map((d) => (
                            <td key={d.examId} className="text-center py-3">
                              {d.totalCandidates?.toLocaleString() || 0}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 fw-semibold">
                            <FaChartLine className="me-2 text-info" size={14} />{" "}
                            Average Score
                          </td>
                          {data.map((d) => (
                            <td key={d.examId} className="text-center py-3">
                              <span className="fw-bold text-success">
                                {d.avgScore?.toFixed(1) || 0}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 fw-semibold">
                            <FaTrophy className="me-2 text-warning" size={14} />{" "}
                            Pass Rate
                          </td>
                          {data.map((d) => (
                            <td key={d.examId} className="text-center py-3">
                              <span className="fw-bold text-success">
                                {d.passRate?.toFixed(1) || 0}%
                              </span>
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 fw-semibold">
                            <FaCheckCircle
                              className="me-2 text-success"
                              size={14}
                            />{" "}
                            Pass Count
                          </td>
                          {data.map((d) => (
                            <td key={d.examId} className="text-center py-3">
                              {d.passCount || 0}
                            </td>
                          ))}
                        </tr>
                        <tr>
                          <td className="py-3 px-4 fw-semibold">
                            <FaTimesCircle
                              className="me-2 text-danger"
                              size={14}
                            />{" "}
                            Fail Count
                          </td>
                          {data.map((d) => (
                            <td key={d.examId} className="text-center py-3">
                              {d.failCount || 0}
                            </td>
                          ))}
                        </tr>
                        <tr className="bg-light">
                          <td className="py-3 px-4 fw-semibold">
                            <FaStar className="me-2 text-warning" size={14} />{" "}
                            Performance Score
                          </td>
                          {data.map((d) => {
                            const perfScore =
                              ((d.avgScore || 0) + (d.passRate || 0)) / 2;
                            return (
                              <td key={d.examId} className="text-center py-3">
                                <div className="d-flex align-items-center justify-content-center gap-2">
                                  <div
                                    className="progress"
                                    style={{ width: "80px", height: "6px" }}
                                  >
                                    <div
                                      className="progress-bar bg-gradient"
                                      style={{ width: `${perfScore}%` }}
                                    />
                                  </div>
                                  <span className="fw-bold">
                                    {perfScore.toFixed(0)}%
                                  </span>
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
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

        .animate-fade-in {
          animation: fadeIn 0.5s ease-out;
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

        .transition-all {
          transition: all 0.3s ease;
        }

        .bg-gradient-success {
          background: linear-gradient(135deg, #7e796c 0%, #6c757d 100%);
        }

        .bg-gradient {
          background: linear-gradient(90deg, #7e796c 0%, #6c757d 100%);
        }

        .form-check {
          transition: all 0.3s ease;
        }

        .form-check:hover {
          transform: translateX(4px);
        }
      `}</style>
    </div>
  );
}
