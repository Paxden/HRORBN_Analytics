/* eslint-disable no-unused-vars */
// components/ScoreDistribution.jsx
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaChartBar, FaTrophy, FaChartLine, FaSpinner } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
import api from "../api/Auth";

export default function ScoreDistribution({
  examId,
  title = "Score Distribution",
  showStats = true,
  data: propData, // Allow passing data as prop
}) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // If data is passed as prop, use it; otherwise fetch from API
  useEffect(() => {
    if (propData && Array.isArray(propData)) {
      setData(propData);
    } else if (examId) {
      fetchScoreDistribution();
    }
  }, [examId, propData]);

  const fetchScoreDistribution = async () => {
    try {
      setLoading(true);
      setError("");
      
      // First get stats to understand the distribution
      const statsRes = await api.get("/analytics/stats", {
        params: { examId },
      });
      
      const stats = statsRes.data;
      
      // Generate realistic distribution based on stats
      const distribution = generateDistributionFromStats(stats);
      setData(distribution);
      
    } catch (err) {
      console.error("Error fetching score distribution:", err);
      setError("Failed to load distribution data");
      
      // Fallback: Generate mock distribution
      setData(generateMockDistribution());
    } finally {
      setLoading(false);
    }
  };

  // Generate realistic distribution based on actual stats
  const generateDistributionFromStats = (stats) => {
    const { totalCandidates, avgScore, minScore, maxScore, passCount, failCount } = stats;
    
    // Calculate approximate distribution that matches the stats
    const passRate = (passCount / totalCandidates) * 100;
    
    // Define ranges
    const ranges = [
      { range: "0-25", min: 0, max: 25, count: 0 },
      { range: "26-50", min: 26, max: 50, count: 0 },
      { range: "51-75", min: 51, max: 75, count: 0 },
      { range: "76-100", min: 76, max: 100, count: 0 },
    ];
    
    // Distribute based on normal distribution around the average
    const stdDev = (maxScore - minScore) / 4; // Estimate standard deviation
    
    ranges.forEach(range => {
      // Calculate probability of score falling in this range using normal distribution
      const z1 = (range.min - avgScore) / stdDev;
      const z2 = (range.max - avgScore) / stdDev;
      const probability = normalCDF(z2) - normalCDF(z1);
      range.count = Math.round(probability * totalCandidates);
    });
    
    // Adjust to match exact total
    const total = ranges.reduce((sum, r) => sum + r.count, 0);
    const diff = totalCandidates - total;
    
    // Add remaining to the highest probability range
    if (diff !== 0) {
      const maxProbRange = ranges.reduce((max, r) => 
        r.count > max.count ? r : max, ranges[0]
      );
      maxProbRange.count += diff;
    }
    
    // Ensure no negative counts
    ranges.forEach(range => {
      if (range.count < 0) range.count = 0;
    });
    
    return ranges;
  };
  
  // Helper function for normal CDF (cumulative distribution)
  const normalCDF = (z) => {
    const t = 1 / (1 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2);
    const p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return z > 0 ? 1 - p : p;
  };
  
  // Generate mock distribution for fallback
  const generateMockDistribution = () => {
    return [
      { range: "0-20", count: 5 },
      { range: "21-40", count: 12 },
      { range: "41-60", count: 28 },
      { range: "61-80", count: 35 },
      { range: "81-100", count: 20 },
    ];
  };

  const formatValue = (value) => {
    if (value === undefined || value === null) return 0;
    return typeof value === "number" ? value : parseFloat(value) || 0;
  };

  const getTotalStudents = () => {
    return data.reduce((sum, item) => sum + formatValue(item.count), 0);
  };

  const getHighestRange = () => {
    if (data.length === 0) return "N/A";
    const maxItem = data.reduce((max, item) =>
      formatValue(item.count) > formatValue(max.count) ? item : max, data[0]
    );
    return maxItem?.range || "N/A";
  };

  const getPeakPerformance = () => {
    if (data.length === 0) return 0;
    return Math.max(...data.map((item) => formatValue(item.count)));
  };

  const getAverageStudentCount = () => {
    if (data.length === 0) return 0;
    const total = getTotalStudents();
    return (total / data.length).toFixed(1);
  };

  if (loading) {
    return (
      <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem", height: "100%" }}>
        <div className="card-body p-5 text-center">
          <FaSpinner className="fa-spin text-success mb-3" size={30} />
          <p className="text-muted mb-0">Loading score distribution...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card border-0 shadow-sm" style={{ borderRadius: "1rem", height: "100%" }}>
        <div className="card-body p-5 text-center">
          <div className="text-danger mb-2">⚠️</div>
          <p className="text-muted mb-0">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="card border-0 shadow-sm"
      style={{ borderRadius: "1rem", overflow: "hidden", height: "100%" }}
    >
      <div className="card-header bg-white border-0 pt-4 px-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-gradient-success rounded-3 p-2"
              style={{
                background: "linear-gradient(135deg, #32803e 0%, #78a372 100%)",
              }}
            >
              <FaChartBar className="text-white" size={18} />
            </div>
            <div>
              <h5 className="fw-bold mb-0">{title}</h5>
              <small className="text-muted">
                Score range frequency analysis
              </small>
            </div>
          </div>

          {showStats && data.length > 0 && (
            <div className="d-flex gap-3">
              <div className="text-end">
                <small className="text-muted d-block">Total Students</small>
                <span className="fw-bold text-success">
                  {getTotalStudents()}
                </span>
              </div>
              <div className="text-end">
                <small className="text-muted d-block">Score Range</small>
                <span className="fw-bold text-info">
                  {data[0]?.range?.split("-")[0]} -{" "}
                  {data[data.length - 1]?.range?.split("-")[1]}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-body p-4">
        {data.length === 0 ? (
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
                data={data}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                barCategoryGap="15%"
                barGap={2}
              >
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#32803e" />
                    <stop offset="100%" stopColor="#78a372" />
                  </linearGradient>
                  <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                    <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.1" />
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
                  cursor={{ fill: "rgba(50, 128, 62, 0.05)" }}
                  formatter={(value, name) => [`${value} students`, "Count"]}
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

            {showStats && (
              <div className="row g-3 mt-3 pt-2 border-top">
                <div className="col-4">
                  <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                      <FaTrophy size={14} className="text-warning" />
                      <small className="text-muted">Highest Range</small>
                    </div>
                    <p className="fw-bold mb-0 text-primary">
                      {getHighestRange()}
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
                      {getPeakPerformance()} students
                    </p>
                  </div>
                </div>
                <div className="col-4">
                  <div className="text-center">
                    <div className="d-flex align-items-center justify-content-center gap-1 mb-1">
                      <MdAnalytics size={14} className="text-success" />
                      <small className="text-muted">Avg per Range</small>
                    </div>
                    <p className="fw-bold mb-0 text-success">
                      {getAverageStudentCount()} students
                    </p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        .bg-gradient-primary {
          background: linear-gradient(135deg, #32803e 0%, #78a372 100%);
        }
        
        .recharts-bar-rectangle:hover {
          filter: brightness(0.95);
          transition: filter 0.2s ease;
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