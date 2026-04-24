/* eslint-disable no-unused-vars */
// pages/dashboard/Analytics.jsx
import { useEffect, useState } from "react";
import api from "../api/Auth";
import { useAuth } from "../context/AuthContext";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import {
  FaSpinner,
  FaChartLine,
  FaUsers,
  FaTrophy,
  FaMedal,
  FaSchool,
  FaUserGraduate,
  FaChartBar,
  FaDownload,
  FaPrint,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp, MdTrendingDown } from "react-icons/md";

export default function Analytics() {
  const { selectedExam } = useAuth();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      const passRate = totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;

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

  useEffect(() => {
    fetchAnalytics();
  }, [selectedExam]);

  const getPassRateColor = (passCount, totalCandidates) => {
    const rate = totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;
    if (rate >= 70) return "success";
    if (rate >= 50) return "warning";
    return "danger";
  };

  const getPassRateIcon = (passCount, totalCandidates) => {
    const rate = totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;
    if (rate >= 70) return <MdTrendingUp className="text-success" />;
    if (rate >= 50) return <FaChartLine className="text-warning" />;
    return <MdTrendingDown className="text-danger" />;
  };

  const getScoreColor = (score) => {
    if (score >= 70) return "success";
    if (score >= 50) return "warning";
    return "danger";
  };

  const formatValue = (value) => {
    if (value === undefined || value === null) return 0;
    return typeof value === "number" ? value : parseFloat(value) || 0;
  };

  const exportReport = () => {
    console.log("Exporting report...");
  };

  if (!selectedExam?._id) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <div
            className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
            style={{ width: "80px", height: "80px" }}
          >
            <MdAnalytics size={40} className="text-muted" />
          </div>
          <h5 className="fw-bold mb-2">No Exam Selected</h5>
          <p className="text-muted mb-0">
            Please select an exam to view analytics
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <FaSpinner
            className="fa-spin mb-3"
            size={48}
            style={{ color: "#0d6efd" }}
          />
          <h5 className="text-muted">Loading analytics data...</h5>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="animate-fade-in">
        <div
          className="alert alert-danger d-flex align-items-center justify-content-between"
          style={{ borderRadius: "0.75rem" }}
        >
          <div className="d-flex align-items-center gap-2">
            <FaChartLine size={20} />
            <div>
              <strong>Error Loading Analytics</strong>
              <p className="mb-0 small">{error}</p>
            </div>
          </div>
          <button
            className="btn btn-outline-danger btn-sm"
            onClick={fetchAnalytics}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Safely get numeric values
  const totalCandidates = formatValue(stats.totalCandidates);
  const avgScore = formatValue(stats.avgScore);
  const maxScore = formatValue(stats.maxScore);
  const passRate = formatValue(stats.passRate);
  const passCount = formatValue(stats.passCount);
  const failCount = formatValue(stats.failCount);

  const passFailData = [
    { name: "Pass", value: passCount },
    { name: "Fail", value: failCount },
  ];

  const COLORS = ["#28a745", "#dc3545"];

  const scoreDistribution = Array.isArray(stats.scoreDistribution)
    ? stats.scoreDistribution
    : [];

  const topSchools = Array.isArray(stats.topSchools) ? stats.topSchools : [];
  const topCandidates = Array.isArray(stats.topCandidates)
    ? stats.topCandidates
    : [];

  // Stat Cards Configuration
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
      value: maxScore,
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
            Analytics Dashboard
          </h1>
         <h4>Nursing and Midwifery Council of Nigeria </h4>
            <p className="text-muted mt-2">
              Performance Analytics for:{" "}
              <strong className="text-primary">{selectedExam.title} CBT and CAOSCE Result Dashboard</strong>
            </p>
        </div>

        <div className="d-flex gap-2">
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={exportReport}
          >
            <FaDownload className="me-1" size={14} /> Export Report
          </button>
          <button
            className="btn btn-outline-secondary btn-sm"
            onClick={() => window.print()}
          >
            <FaPrint className="me-1" size={14} /> Print
          </button>
        </div>
      </div>

      {/* Main Stats Row */}
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


      {/* Charts Row */}
      <div className="row g-4 mb-4">
        {/* Pass/Fail Pie Chart */}
        <div className="col-md-5">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="bg-gradient-primary rounded-3 p-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <FaChartLine className="text-white" size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Pass vs Fail Distribution</h5>
                    <small className="text-muted">
                      Overall performance overview
                    </small>
                  </div>
                </div>

                {/* Pass Rate Badge */}
                {passFailData[0].value + passFailData[1].value > 0 && (
                  <div className="text-end">
                    <div className="bg-success bg-opacity-10 rounded-3 px-3 py-1">
                      <small className="text-success fw-semibold">
                        Pass Rate: {passRate.toFixed(1)}%
                      </small>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-body p-4">
              {passFailData[0].value === 0 && passFailData[1].value === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaUsers size={40} className="text-muted opacity-50" />
                  </div>
                  <h6 className="fw-semibold mb-1">No Data Available</h6>
                  <p className="text-muted small mb-0">
                    Pass/Fail data will appear here once available
                  </p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={320}>
                    <PieChart>
                      <defs>
                        <linearGradient
                          id="passGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#28a745" />
                          <stop offset="100%" stopColor="#20c997" />
                        </linearGradient>
                        <linearGradient
                          id="failGradient"
                          x1="0"
                          y1="0"
                          x2="1"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#dc3545" />
                          <stop offset="100%" stopColor="#fd7e14" />
                        </linearGradient>
                        <filter
                          id="pieShadow"
                          x="-20%"
                          y="-20%"
                          width="140%"
                          height="140%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="4"
                            stdDeviation="6"
                            floodOpacity="0.15"
                          />
                        </filter>
                      </defs>
                      <Pie
                        data={passFailData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={60}
                        label={({ name, percent }) =>
                          `${name}: ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={{ stroke: "#6c757d", strokeWidth: 1 }}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                        filter="url(#pieShadow)"
                      >
                        {passFailData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={
                              index === 0
                                ? "url(#passGradient)"
                                : "url(#failGradient)"
                            }
                            stroke="white"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          padding: "12px 16px",
                          fontSize: "13px",
                          backgroundColor: "white",
                        }}
                        formatter={(value, name) => [`${value} students`, name]}
                      />
                      <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        iconSize={10}
                        formatter={(value, entry) => (
                          <span
                            style={{
                              color: "#6c757d",
                              fontSize: "13px",
                              fontWeight: 500,
                            }}
                          >
                            {value}: {entry.payload.value}
                          </span>
                        )}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  {/* Donut Center Content */}
                  <div className="text-center mt-3">
                    <div className="bg-light rounded-3 p-3">
                      <div className="row g-3">
                        <div className="col-6">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div
                              className="bg-success rounded-circle"
                              style={{ width: "10px", height: "10px" }}
                            />
                            <div>
                              <small className="text-muted d-block">Pass</small>
                              <span className="fw-bold text-success fs-5">
                                {passCount}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="col-6">
                          <div className="d-flex align-items-center justify-content-center gap-2">
                            <div
                              className="bg-danger rounded-circle"
                              style={{ width: "10px", height: "10px" }}
                            />
                            <div>
                              <small className="text-muted d-block">Fail</small>
                              <span className="fw-bold text-danger fs-5">
                                {failCount}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Score Distribution Chart */}
        <div className="col-md-7">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem", overflow: "hidden" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                <div className="d-flex align-items-center gap-2">
                  <div
                    className="bg-gradient-primary rounded-3 p-2"
                    style={{
                      background:
                        "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    }}
                  >
                    <FaChartBar className="text-white" size={18} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Score Distribution</h5>
                    <small className="text-muted">
                      Score range frequency analysis
                    </small>
                  </div>
                </div>

                {/* Stats Summary */}
                {scoreDistribution.length > 0 && (
                  <div className="d-flex gap-3">
                    <div className="text-end">
                      <small className="text-muted d-block">
                        Total Students
                      </small>
                      <span className="fw-bold text-primary">
                        {scoreDistribution.reduce(
                          (sum, item) => sum + (item.count || 0),
                          0
                        )}
                      </span>
                    </div>
                    <div className="text-end">
                      <small className="text-muted d-block">Score Range</small>
                      <span className="fw-bold text-info">
                        {scoreDistribution[0]?.range?.split("-")[0]} -{" "}
                        {scoreDistribution[scoreDistribution.length - 1]?.range?.split("-")[1]}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="card-body p-4">
              {scoreDistribution.length === 0 ? (
                <div className="text-center py-5">
                  <div
                    className="bg-light rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: "80px", height: "80px" }}
                  >
                    <FaChartBar size={40} className="text-muted opacity-50" />
                  </div>
                  <h6 className="fw-semibold mb-1">No Data Available</h6>
                  <p className="text-muted small mb-0">
                    Score distribution data will appear here once available
                  </p>
                </div>
              ) : (
                <>
                  <ResponsiveContainer width="100%" height={320}>
                    <BarChart
                      data={scoreDistribution}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                      barCategoryGap="15%"
                      barGap={2}
                    >
                      <defs>
                        <linearGradient
                          id="barGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop offset="0%" stopColor="#667eea" />
                          <stop offset="100%" stopColor="#764ba2" />
                        </linearGradient>
                        <filter
                          id="shadow"
                          x="-5%"
                          y="-5%"
                          width="110%"
                          height="110%"
                        >
                          <feDropShadow
                            dx="0"
                            dy="2"
                            stdDeviation="3"
                            floodOpacity="0.1"
                          />
                        </filter>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#e9ecef"
                        vertical={false}
                      />
                      <XAxis
                        dataKey="range"
                        axisLine={false}
                        tickLine={false}
                        tick={{
                          fill: "#6c757d",
                          fontSize: 12,
                          fontWeight: 500,
                        }}
                        dy={10}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6c757d", fontSize: 12 }}
                        label={{
                          value: "Number of Students",
                          angle: -90,
                          position: "insideLeft",
                          style: {
                            fill: "#6c757d",
                            fontSize: 12,
                            fontWeight: 500,
                          },
                          dx: -20,
                        }}
                      />
                      <Tooltip
                        contentStyle={{
                          borderRadius: "0.75rem",
                          border: "none",
                          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                          padding: "12px 16px",
                          fontSize: "13px",
                        }}
                        cursor={{ fill: "rgba(102, 126, 234, 0.05)" }}
                        formatter={(value, name) => [value, "Students"]}
                        labelFormatter={(label) => `Score Range: ${label}`}
                      />
                      <Bar
                        dataKey="count"
                        fill="url(#barGradient)"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={60}
                        animationDuration={1500}
                        animationEasing="ease-in-out"
                      />
                    </BarChart>
                  </ResponsiveContainer>

                  {/* Additional Stats Insights */}
                  <div className="row g-3 mt-3 pt-2 border-top">
                    <div className="col-4">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                          <FaTrophy size={14} className="text-warning" />
                          <small className="text-muted">Highest Range</small>
                        </div>
                        <p className="fw-bold mb-0 text-primary">
                          {scoreDistribution.reduce(
                            (max, item) =>
                              (item.count || 0) > (max.count || 0) ? item : max,
                            scoreDistribution[0]
                          )?.range || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                          <FaChartLine size={14} className="text-info" />
                          <small className="text-muted">Peak Performance</small>
                        </div>
                        <p className="fw-bold mb-0 text-info">
                          {Math.max(
                            ...scoreDistribution.map((item) => item.count || 0)
                          )}{" "}
                          students
                        </p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="text-center">
                        <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                          <MdAnalytics size={14} className="text-success" />
                          <small className="text-muted">Distribution</small>
                        </div>
                        <p className="fw-bold mb-0 text-success">
                          {scoreDistribution.length} ranges
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Tables - Top Schools and Top Candidates only */}
      <div className="row g-4">
        {/* Top Schools */}
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <FaSchool className="text-primary" size={18} />
                <h5 className="fw-bold mb-0">Top Performing Schools</h5>
              </div>
            </div>
            <div className="card-body p-4">
              {topSchools.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaSchool size={32} className="mb-2 opacity-25" />
                  <p className="mb-0 small">No data available</p>
                </div>
              ) : (
                <div className="vstack gap-2">
                  {topSchools.map((s, i) => {
                    const scoreValue = formatValue(s.avgScore || s.score || 0);
                    return (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3"
                      >
                        <div>
                          <span className="fw-bold me-2">{i + 1}.</span>
                          <span>{s.school || s.name || "Unknown"}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="progress"
                            style={{ width: "100px", height: "6px" }}
                          >
                            <div
                              className="progress-bar bg-info"
                              style={{ width: `${scoreValue}%` }}
                            />
                          </div>
                          <span className="fw-semibold text-info">
                            {scoreValue.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Top Candidates */}
        <div className="col-md-6">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-header bg-white border-0 pt-4 px-4">
              <div className="d-flex align-items-center gap-2">
                <FaUserGraduate className="text-warning" size={18} />
                <h5 className="fw-bold mb-0">Top Performing Candidates</h5>
              </div>
            </div>
            <div className="card-body p-4">
              {topCandidates.length === 0 ? (
                <div className="text-center py-4 text-muted">
                  <FaUserGraduate size={32} className="mb-2 opacity-25" />
                  <p className="mb-0 small">No data available</p>
                </div>
              ) : (
                <div className="vstack gap-2">
                  {topCandidates.map((c, i) => {
                    const scoreValue = formatValue(c.score);
                    return (
                      <div
                        key={i}
                        className="d-flex justify-content-between align-items-center p-2 bg-light rounded-3"
                      >
                        <div>
                          <span className="fw-bold me-2">{i + 1}.</span>
                          <span>{c.name || c.candidateName || "Unknown"}</span>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <span
                            className={`fw-bold text-${getScoreColor(scoreValue)}`}
                          >
                            {scoreValue.toFixed(1)}%
                          </span>
                          {scoreValue >= 70 ? (
                            <FaArrowUp className="text-success" size={12} />
                          ) : scoreValue >= 50 ? (
                            <FaChartLine className="text-warning" size={12} />
                          ) : (
                            <FaArrowDown className="text-danger" size={12} />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Overall Pass Rate Progress Bar */}
      <div className="row mt-4">
        <div className="col-12">
          <div
            className="card border-0 shadow-sm"
            style={{ borderRadius: "1rem" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6 className="fw-bold mb-0">Overall Pass Rate</h6>
                <div className="d-flex align-items-center gap-2">
                  <FaCalendarAlt className="text-muted" size={14} />
                  <small className="text-muted">
                    Last updated: {new Date().toLocaleDateString()}
                  </small>
                </div>
              </div>
              <div
                className="progress"
                style={{ height: "30px", borderRadius: "0.75rem" }}
              >
                <div
                  className="progress-bar bg-gradient"
                  role="progressbar"
                  style={{ width: `${passRate}%` }}
                  aria-valuenow={passRate}
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  {passRate.toFixed(1)}% Pass Rate
                </div>
              </div>
            </div>
          </div>
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

        .bg-gradient {
          background: linear-gradient(90deg, #0d6efd 0%, #0dcaf0 100%);
        }

        .progress-bar {
          transition: width 1s ease;
        }

        .card {
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
        }

        .bg-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }

        .recharts-bar-rectangle:hover {
          filter: brightness(0.95);
          transition: filter 0.2s ease;
        }

        .recharts-pie-sector:hover {
          filter: brightness(0.95);
          transition: filter 0.2s ease;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}