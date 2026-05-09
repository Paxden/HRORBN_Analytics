
import { useEffect, useState } from "react";
import api from "../api/Auth";
import {
  FaGraduationCap,
  FaUsers,
  FaSpinner,
  FaStar,
} from "react-icons/fa";
import { MdTrendingUp } from "react-icons/md";
// #7e796c #6c757d


const TopProgrammes = ({ selectedExam }) => {
  const [loading, setLoading] = useState(false);
  const [programmes, setProgrammes] = useState([]);

  useEffect(() => {
    if (!selectedExam?._id) return;

    const fetchProgrammes = async () => {
      try {
        setLoading(true);

        const res = await api.get(
          `/analytics/programme-analytics?examId=${selectedExam._id}`
        );

        console.log("PROGRAMME RESPONSE:", res.data);

        setProgrammes(res.data.programmes || []);
      } catch (err) {
        console.error("Programme fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgrammes();
  }, [selectedExam]);

  const formatScore = (score) => {
    const num = parseFloat(score);
    return isNaN(num) ? "0.0" : num.toFixed(1);
  };

  const getPerformanceColor = (score) => {
    const num = parseFloat(score);

    if (num >= 70) return "#28a745";
    if (num >= 50) return "#ffc107";

    return "#dc3545";
  };

  return (
    <div
      className="card border-0 shadow-sm"
      style={{
        borderRadius: "1rem",
      }}
    >
      {/* HEADER */}
      <div
        className="card-header border-0 text-white"
        style={{
          background:
            "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)",
        }}
      >
        <div className="d-flex align-items-center gap-2">
          <FaGraduationCap />
          <h5 className="mb-0 fw-bold">Top Programmes</h5>
        </div>
      </div>

      {/* BODY */}
      <div className="card-body p-4">
        {loading ? (
          <div className="text-center py-5">
            <FaSpinner
              className="fa-spin mb-3"
              size={35}
              style={{ color: "#6c757d" }}
            />

            <p className="text-muted mb-0">
              Loading programmes...
            </p>
          </div>
        ) : programmes.length === 0 ? (
          <div className="text-center py-5">
            <FaGraduationCap
              size={45}
              className="text-muted opacity-25 mb-3"
            />

            <p className="text-muted mb-0">
              No programme data available
            </p>
          </div>
        ) : (
          <div className="vstack gap-3">
            {programmes.slice(0, 10).map((p, i) => (
              <div
                key={i}
                className="p-3 rounded-3 border"
                style={{
                  background: "#fff",
                  transition: "0.3s ease",
                  cursor: "pointer",
                }}
              >
                <div className="d-flex justify-content-between align-items-start">
                  {/* LEFT */}
                  <div className="d-flex gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                      style={{
                        width: "42px",
                        height: "42px",
                        background:
                          i < 3
                            ? "linear-gradient(135deg, #7e796c 0%, #6c757d 100%)"
                            : "#f1f3f5",
                        color: i < 3 ? "white" : "#6c757d",
                      }}
                    >
                      {i < 3 ? <FaStar /> : i + 1}
                    </div>

                    <div>
                      <h5
                        className="fw-bold mb-1"
                        style={{ color: "#2c3e2f" }}
                      >
                        {p.programme}
                      </h5>

                      <div className="d-flex gap-3 flex-wrap">
                        <b className="text-muted d-flex align-items-center gap-1">
                          <FaUsers size={12} />
                          {p.count} candidates
                        </b>

                        <small className="text-muted d-flex align-items-center gap-1">
                          <MdTrendingUp size={12} />
                          Avg: {formatScore(p.avgScore)}%
                        </small>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="text-end">
                    <div
                      className="fw-bold fs-4"
                      style={{
                        color: getPerformanceColor(p.passRate),
                      }}
                    >
                      {formatScore(p.passRate)}%
                    </div>

                    <small className="text-muted">
                      Pass Rate
                    </small>
                  </div>
                </div>

               
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
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
      `}</style>
    </div>
  );
};

export default TopProgrammes;