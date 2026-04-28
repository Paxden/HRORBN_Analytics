/* eslint-disable react-hooks/exhaustive-deps */
// pages/dashboard/DashboardHome.jsx
import { useEffect, useState } from "react";
import api from "../api/Auth";
import { useAuth } from "../context/AuthContext";
import {
  FaSpinner,
  FaUsers,
  FaChartLine,
  FaTrophy,
  FaMedal,
  FaCheckCircle,
  FaTimesCircle,
  FaPercentage,
  FaCalendarAlt,
  FaArrowUp,
  FaArrowDown,
  FaUserGraduate,
  FaFileAlt,
  FaChartBar,
} from "react-icons/fa";
import { MdAnalytics, MdTrendingUp, MdTrendingDown } from "react-icons/md";
import ScoreDistribution from "../components/ScoreDistribution";
// #78a372 #32803e


export default function DashboardHome() {
  const { selectedExam } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch stats when exam changes
  useEffect(() => {
    if (selectedExam?._id) {
      fetchStats();
    }
  }, [selectedExam]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await api.get("/analytics/stats", {
        params: { examId: selectedExam._id },
      });

      setStats(res.data);
    } catch (err) {
      console.error("Stats error:", err.response?.data || err.message);
      setError(err.response?.data?.message || "Failed to load dashboard stats");
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

  const getPassRateIcon = (passCount, totalCandidates) => {
    const rate = totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;
    if (rate >= 70) return <MdTrendingUp className="text-success" />;
    if (rate >= 50) return <FaChartLine className="text-warning" />;
    return <MdTrendingDown className="text-danger" />;
  };

  const scoreData = [
    { range: "0-20", count: 5 },
    { range: "21-40", count: 12 },
    { range: "41-60", count: 28 },
    { range: "61-80", count: 35 },
    { range: "81-100", count: 20 },
  ];

  // No exam selected
  if (!selectedExam) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
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
        </div>
      </div>
    );
  }

  // Loading state
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-50">
        <div className="text-center">
          <FaSpinner
            className="fa-spin mb-3"
            size={48}
            style={{ color: "#0d6efd" }}
          />
          <h5 className="text-muted">Loading dashboard statistics...</h5>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="animate-fade-in">
        <div
          className="alert alert-danger d-flex align-items-center"
          style={{ borderRadius: "0.75rem" }}
        >
          <FaTimesCircle className="me-2" size={20} />
          <div>{error}</div>
        </div>
      </div>
    );
  }

  const totalCandidates = stats?.totalCandidates || 0;
  const passCount = stats?.passCount || 0;
  const failCount = stats?.failCount || 0;
  const passRate =
    totalCandidates > 0 ? (passCount / totalCandidates) * 100 : 0;

  const statCards = [
    {
      title: "Total Candidates",
      value: totalCandidates.toLocaleString(),
      icon: <FaUsers />,
      color: "success",
      bgColor: "bg-success bg-opacity-10",
      textColor: "text-success",
    },
    {
      title: "Average Score",
      value: stats?.avgScore ? stats.avgScore.toFixed(2) : "-",
      icon: <MdAnalytics />,
      color: "info",
      bgColor: "bg-info bg-opacity-10",
      textColor: "text-info",
      suffix: "%",
    },
    {
      title: "Highest Score",
      value: stats?.maxScore || "-",
      icon: <FaTrophy />,
      color: "warning",
      bgColor: "bg-warning bg-opacity-10",
      textColor: "text-warning",
      suffix: "%",
    },
    {
      title: "Lowest Score",
      value: stats?.minScore || "-",
      icon: <FaMedal />,
      color: "secondary",
      bgColor: "bg-secondary bg-opacity-10",
      textColor: "text-secondary",
      suffix: "%",
    },
  ];

  const performanceCards = [
    {
      title: "Pass Count",
      value: passCount.toLocaleString(),
      icon: <FaCheckCircle />,
      color: "success",
      bgColor: "bg-success bg-opacity-10",
      textColor: "text-success",
    },
    {
      title: "Fail Count",
      value: failCount.toLocaleString(),
      icon: <FaTimesCircle />,
      color: "danger",
      bgColor: "bg-danger bg-opacity-10",
      textColor: "text-danger",
    },
    {
      title: "Pass Rate",
      value: `${passRate.toFixed(1)}%`,
      icon: <FaPercentage />,
      color: getPassRateColor(passCount, totalCandidates),
      bgColor: `bg-${getPassRateColor(passCount, totalCandidates)} bg-opacity-10`,
      textColor: `text-${getPassRateColor(passCount, totalCandidates)}`,
    },
    {
      title: "Performance",
      value:
        passRate >= 70
          ? "Excellent"
          : passRate >= 50
            ? "Average"
            : "Needs Improvement",
      icon: getPassRateIcon(passCount, totalCandidates),
      color: getPassRateColor(passCount, totalCandidates),
      bgColor: `bg-${getPassRateColor(passCount, totalCandidates)} bg-opacity-10`,
      textColor: `text-${getPassRateColor(passCount, totalCandidates)}`,
    },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
          <div>
            <h1
              className="h2 fw-bold mb-0"
              style={{
                color: "#32803e",
              }}
            >
              Dashboard Overview
            </h1>
            <h4>Nursing and Midwifery Council of Nigeria </h4>
            <p className="text-muted mt-2">
              Viewing statistics for:{" "}
              <strong className="text-success">{selectedExam.title} CBT and CAOSCE Result Dashboard</strong>
            </p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <FaCalendarAlt className="text-muted" />
            <small className="text-muted">
              Last updated: {new Date().toLocaleDateString()}
            </small>
          </div>
        </div>
      </div>

      {/* Main Stats Row */}
      <div className="row g-4 mb-4">
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
                  <div className={`${stat.bgColor} rounded-3 p-2`}>
                    <div
                      className={stat.textColor}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {stat.icon}
                    </div>
                  </div>
                  <div className="text-end">
                    <h4 className="fw-bold mb-0">
                      {stat.value}
                      {stat.suffix && (
                        <small className="fs-6 text-muted">{stat.suffix}</small>
                      )}
                    </h4>
                  </div>
                </div>
                <h6 className="fw-semibold mb-0">{stat.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Performance Row */}
      <div className="row g-4 mb-4">
        {performanceCards.map((card, index) => (
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
                  <div className={`${card.bgColor} rounded-3 p-2`}>
                    <div
                      className={card.textColor}
                      style={{ fontSize: "1.5rem" }}
                    >
                      {card.icon}
                    </div>
                  </div>
                  <div className="text-end">
                    <h4 className="fw-bold mb-0">{card.value}</h4>
                  </div>
                </div>
                <h6 className="fw-semibold mb-0">{card.title}</h6>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Score Distribution tivity */}
      <div className="row g-4">
        {/* Score Distribution Chart */}
        <div className="">
          <ScoreDistribution
            data={scoreData}
            title="Exam Score Distribution"
            showStats={true}
          />
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
      `}</style>
    </div>
  );
}
