import React, { useState } from "react";
import { Card, Form, Button, Alert, Spinner, Badge } from "react-bootstrap";
import axios from "axios";

const API_URL = "http://localhost:8000";

function SingleClassifier() {
  const [source, setSource] = useState("");
  const [logMessage, setLogMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!source.trim() || !logMessage.trim()) {
      setError("Both source and log message are required");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post(`${API_URL}/classify/single`, {
        source: source.trim(),
        log_message: logMessage.trim(),
      });

      const classification = response.data.classification;
      setResult(classification);

      // Add to history
      setHistory(
        [
          {
            id: Date.now(),
            timestamp: new Date().toLocaleTimeString(),
            source,
            logMessage,
            classification,
          },
          ...history,
        ].slice(0, 10)
      ); // Keep only 10 most recent entries
    } catch (err) {
      console.error("Classification error:", err);
      setError(err.response?.data?.detail || "Error classifying log message");
    } finally {
      setLoading(false);
    }
  };

  const clearForm = () => {
    setSource("");
    setLogMessage("");
    setError(null);
    setResult(null);
  };

  return (
    <div>
      <h2 className="mb-4">Single Log Classification</h2>
      <p className="lead">
        Enter a single log entry to get an immediate classification.
      </p>

      <Card>
        <Card.Header as="h5">Log Entry Details</Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Source System</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter source system (e.g., LegacyCRM, WebApp)"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={loading}
              />
              <Form.Text className="text-muted">
                The system that generated this log message
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Log Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={5}
                placeholder="Enter the log message to classify"
                value={logMessage}
                onChange={(e) => setLogMessage(e.target.value)}
                disabled={loading}
              />
            </Form.Group>

            {error && <Alert variant="danger">{error}</Alert>}

            <div className="d-flex gap-2">
              <Button variant="primary" type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Classifying...
                  </>
                ) : (
                  "Classify Log"
                )}
              </Button>

              <Button
                variant="secondary"
                onClick={clearForm}
                disabled={loading}
              >
                Clear Form
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {result && (
        <Card className="mt-4 result-animation">
          <Card.Header as="h5" className="bg-success text-white">
            Classification Result
          </Card.Header>
          <Card.Body className="text-center py-4">
            <h4>The log has been classified as:</h4>
            <Badge
              bg="primary"
              className="mt-3 mb-3 classification-badge"
              style={{ fontSize: "1.2rem", padding: "10px 20px" }}
            >
              {result}
            </Badge>
          </Card.Body>
        </Card>
      )}

      {history.length > 0 && (
        <Card className="mt-4">
          <Card.Header as="h5">Recent Classifications</Card.Header>
          <Card.Body>
            <div className="table-container">
              <table className="table table-striped table-hover">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Source</th>
                    <th>Log Message</th>
                    <th>Classification</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id}>
                      <td>{item.timestamp}</td>
                      <td>{item.source}</td>
                      <td
                        className="text-truncate"
                        style={{ maxWidth: "300px" }}
                      >
                        {item.logMessage}
                      </td>
                      <td>
                        <Badge bg="primary">{item.classification}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default SingleClassifier;
