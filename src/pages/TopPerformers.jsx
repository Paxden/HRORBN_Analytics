// pages/TopPerformers.jsx
import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Card, Row, Col, Badge } from "react-bootstrap";
import api from "../api/Auth";

export default function TopPerformers() {
  const { selectedExam } = useOutletContext();
  const [performers, setPerformers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (selectedExam?._id) {
      fetchTopPerformers();
    }
  }, [selectedExam]);

  const fetchTopPerformers = async () => {
    try {
      const res = await api.get(
        `/analytics/top-performers?examId=${selectedExam._id}`,
      );
      setPerformers(res.data);
    } catch (error) {
      console.error("Error fetching top performers:", error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (position) => {
    switch (position) {
      case 0:
        return "🥇";
      case 1:
        return "🥈";
      case 2:
        return "🥉";
      default:
        return `${position + 1}th`;
    }
  };

  return (
    <div>
      <h4 className="mb-4">Top Performers</h4>

      <Row>
        {loading ? (
          <Col>
            <p className="text-center">Loading top performers...</p>
          </Col>
        ) : performers.length === 0 ? (
          <Col>
            <p className="text-center">No results available yet</p>
          </Col>
        ) : (
          performers.map((performer, idx) => (
            <Col md={4} key={performer._id} className="mb-4">
              <Card
                className={`shadow-sm border-0 h-100 text-center ${idx === 0 ? "bg-warning bg-opacity-10" : ""}`}
              >
                <Card.Body>
                  <div style={{ fontSize: "3rem" }}>{getMedalIcon(idx)}</div>
                  <h5 className="mt-2">{performer.studentName}</h5>
                  <p className="text-muted small">{performer.studentEmail}</p>
                  <hr />
                  <div className="d-flex justify-content-between">
                    <span>Score:</span>
                    <strong className="text-success">{performer.score}%</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Time Taken:</span>
                    <strong>{performer.timeTaken} min</strong>
                  </div>
                  <div className="d-flex justify-content-between mt-2">
                    <span>Correct Answers:</span>
                    <strong>
                      {performer.correctAnswers}/{performer.totalQuestions}
                    </strong>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </div>
  );
}
