import { useEffect, useState } from "react";
import api from "../api/Auth";
import { Card, Spinner, Row, Col } from "react-bootstrap";

export default function ScoreBandChart({ examId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBands = async () => {
      try {
        const res = await api.get(
          `/analytics/score-bands?examId=${examId}`
        );
        setData(res.data);
      } catch (err) {
        console.error("Score band error:", err);
      } finally {
        setLoading(false);
      }
    };

    if (examId) fetchBands();
  }, [examId]);

  if (loading) {
    return <Spinner animation="border" />;
  }

  if (!data) return null;

  const { bands, total } = data;

  const items = [
    { label: "Fail (0-49)", value: bands.fail, color: "danger" },
    { label: "Pass (50-59)", value: bands.pass, color: "warning" },
    { label: "Credit (60-69)", value: bands.credit, color: "info" },
    { label: "Distinction (70+)", value: bands.distinction, color: "success" },
  ];

  return (
    <Card className="p-3 shadow-sm">
      <h5 className="mb-3">Score Band Analysis</h5>

      <Row>
        {items.map((item, idx) => (
          <Col key={idx} md={3} className="mb-3">
            <Card className={`text-center border-${item.color}`}>
              <Card.Body>
                <h6>{item.label}</h6>
                <h3>{item.value}</h3>
                <small>
                  {((item.value / total) * 100).toFixed(1)}%
                </small>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Card>
  );
}