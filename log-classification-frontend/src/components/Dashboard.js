import React, { useState, useEffect } from "react";
import { Card, Row, Col, Button, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = "http://localhost:8000";

function Dashboard() {
  const [apiStatus, setApiStatus] = useState("checking");
  const navigate = useNavigate();

  useEffect(() => {
    // Check API health on component mount
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      await axios.get(`${API_URL}/health`);
      setApiStatus("online");
    } catch (err) {
      setApiStatus("offline");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Log Classification Dashboard</h2>

      {apiStatus === "checking" && (
        <Alert variant="info">Checking API connection...</Alert>
      )}

      {apiStatus === "offline" && (
        <Alert variant="danger">
          <Alert.Heading>API Connection Failed</Alert.Heading>
          <p>
            Unable to connect to the classification API. Please ensure the
            server is running at {API_URL}.
          </p>
          <hr />
          <div className="d-flex justify-content-end">
            <Button onClick={checkApiHealth} variant="outline-danger">
              Retry Connection
            </Button>
          </div>
        </Alert>
      )}

      {apiStatus === "online" && (
        <Alert variant="success">
          <Alert.Heading>API Connected</Alert.Heading>
          <p>
            Successfully connected to the Log Classification API at {API_URL}.
          </p>
        </Alert>
      )}

      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Batch Classification</Card.Header>
            <Card.Body>
              <Card.Title>Process Multiple Logs</Card.Title>
              <Card.Text>
                Upload a CSV file containing log entries to classify them in
                bulk. The CSV must have 'source' and 'log_message' columns.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/batch")}>
                Go to Batch Classification
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-4">
          <Card className="h-100">
            <Card.Header as="h5">Single Classification</Card.Header>
            <Card.Body>
              <Card.Title>Process Individual Log</Card.Title>
              <Card.Text>
                Enter a single log entry to get an immediate classification
                result. Useful for testing or one-off classifications.
              </Card.Text>
              <Button variant="primary" onClick={() => navigate("/single")}>
                Go to Single Classification
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="mt-2">
        <Card.Header as="h5">API Information</Card.Header>
        <Card.Body>
          <Card.Title>Log Classification API</Card.Title>
          <Card.Text>
            <p>
              This application connects to a FastAPI backend that provides log
              classification services.
            </p>
            <p>
              The API uses a combination of techniques including regex pattern
              matching, BERT embeddings, and other natural language processing
              methods to classify logs.
            </p>
          </Card.Text>
          <Button
            variant="outline-secondary"
            href={`${API_URL}/docs`}
            target="_blank"
          >
            View API Documentation
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}

export default Dashboard;
