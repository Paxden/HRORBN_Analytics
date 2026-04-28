/* eslint-disable no-unused-vars */
// components/ScoreDistribution.jsx
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { FaChartBar, FaTrophy, FaChartLine } from "react-icons/fa";
import { MdAnalytics } from "react-icons/md";
// #32803e #78a372


export default function ScoreDistribution({
  data,
  title = "Score Distribution",
  showStats = true,
}) {
  const scoreDistribution = Array.isArray(data) ? data : [];

  const formatValue = (value) => {
    if (value === undefined || value === null) return 0;
    return typeof value === "number" ? value : parseFloat(value) || 0;
  };

  const getTotalStudents = () => {
    return scoreDistribution.reduce(
      (sum, item) => sum + formatValue(item.count),
      0,
    );
  };

  const getHighestRange = () => {
    if (scoreDistribution.length === 0) return "N/A";
    const maxItem = scoreDistribution.reduce(
      (max, item) =>
        formatValue(item.count) > formatValue(max.count) ? item : max,
      scoreDistribution[0],
    );
    return maxItem?.range || "N/A";
  };

  const getPeakPerformance = () => {
    if (scoreDistribution.length === 0) return 0;
    return Math.max(
      ...scoreDistribution.map((item) => formatValue(item.count)),
    );
  };

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

          {showStats && scoreDistribution.length > 0 && (
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
                  {scoreDistribution[0]?.range?.split("-")[0]} -{" "}
                  {
                    scoreDistribution[
                      scoreDistribution.length - 1
                    ]?.range?.split("-")[1]
                  }
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
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#32803e" />
                    <stop offset="100%" stopColor="#78a372" />
                  </linearGradient>
                  <linearGradient
                    id="barHoverGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#32803e" />
                    <stop offset="100%" stopColor="#78a372" />
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
                      <small className="text-muted">Distribution</small>
                    </div>
                    <p className="fw-bold mb-0 text-success">
                      {scoreDistribution.length} ranges
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
      `}</style>
    </div>
  );
}
