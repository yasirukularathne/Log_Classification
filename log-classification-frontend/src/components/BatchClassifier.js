import React, { useState } from "react";
import "./BatchClassifier.css";
import {
  Card,
  Button,
  Alert,
  Form,
  Spinner,
  Table,
  Badge,
} from "react-bootstrap";
import { useDropzone } from "react-dropzone";
import axios from "axios";

const API_URL = "http://localhost:8000";

function BatchClassifier() {
  const [file, setFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [classifiedData, setClassifiedData] = useState(null);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "text/csv": [".csv"] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleFileSelect(acceptedFiles[0]);
      }
    },
  });

  const handleFileSelect = (file) => {
    setFile(file);
    setError(null);
    setResult(null);
    setClassifiedData(null);

    // Read file for preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      const lines = content.split("\n");
      const headers = lines[0].split(",").map((h) => h.trim());

      // Validate headers
      if (!headers.includes("source") || !headers.includes("log_message")) {
        setError('CSV file must contain "source" and "log_message" columns');
        setFile(null);
        setFilePreview(null);
        return;
      }

      // Parse preview data (up to 5 rows)
      const previewData = [];
      for (let i = 1; i < Math.min(lines.length, 6); i++) {
        if (lines[i].trim()) {
          const values = lines[i].split(",").map((v) => v.trim());
          const row = {};
          headers.forEach((header, idx) => {
            row[header] = values[idx] || "";
          });
          previewData.push(row);
        }
      }

      setFilePreview({ headers, data: previewData });
    };

    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!file) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post(`${API_URL}/classify/`, formData);
      setResult(response.data);

      // Fetch the classified file
      if (response.data.file_url) {
        const classifiedFileResponse = await axios.get(
          `${API_URL}${response.data.file_url}`,
          {
            responseType: "text",
          }
        );

        // Parse CSV data
        const lines = classifiedFileResponse.data.split("\n");
        const headers = lines[0].split(",").map((h) => h.trim());

        const data = [];
        for (let i = 1; i < lines.length; i++) {
          if (lines[i].trim()) {
            const values = lines[i].split(",").map((v) => v.trim());
            const row = {};
            headers.forEach((header, idx) => {
              row[header] = values[idx] || "";
            });
            data.push(row);
          }
        }

        setClassifiedData({ headers, data });
      }
    } catch (err) {
      console.error("Classification error:", err);
      setError(err.response?.data?.detail || "Error processing your request");
    } finally {
      setLoading(false);
    }
  };

  const downloadClassifiedFile = () => {
    if (result?.file_url) {
      window.open(`${API_URL}${result.file_url}`, "_blank");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Batch Log Classification</h2>
      <p className="lead">
        Upload a CSV file with log entries to classify them in batch.
      </p>

      <Card>
        <Card.Header as="h5">Upload CSV File</Card.Header>
        <Card.Body>
          <div
            {...getRootProps()}
            className={`dropzone mb-4 ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p>Drop the CSV file here...</p>
            ) : (
              <div>
                <p>Drag and drop a CSV file here, or click to select a file</p>
                <p className="text-muted">
                  File must contain 'source' and 'log_message' columns
                </p>
              </div>
            )}
          </div>

          {file && (
            <Alert variant="info">
              Selected file: <strong>{file.name}</strong> (
              {(file.size / 1024).toFixed(1)} KB)
            </Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}

          {filePreview && (
            <div className="mt-4">
              <h5>File Preview:</h5>
              <div className="table-container">
                <Table striped bordered hover responsive>
                  <thead>
                    <tr>
                      {filePreview.headers.map((header, idx) => (
                        <th key={idx}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filePreview.data.map((row, rowIdx) => (
                      <tr key={rowIdx}>
                        {filePreview.headers.map((header, colIdx) => (
                          <td key={colIdx}>{row[header]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
              <p className="text-muted">
                Showing {filePreview.data.length} rows from the file.
              </p>
            </div>
          )}

          <Button
            variant="primary"
            size="lg"
            className="mt-3"
            onClick={handleSubmit}
            disabled={!file || loading}
          >
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
                Processing...
              </>
            ) : (
              "Classify Logs"
            )}
          </Button>
        </Card.Body>
      </Card>

      {result && (
        <Card className="result-animation">
          <Card.Header as="h5" className="bg-success text-white">
            Classification Complete
          </Card.Header>
          <Card.Body>
            <Alert variant="success">
              <Alert.Heading>{result.message}</Alert.Heading>
              <p>Successfully classified {result.row_count} log entries.</p>
            </Alert>

            <Button
              variant="success"
              size="lg"
              className="mb-4"
              onClick={downloadClassifiedFile}
            >
              Download Classified CSV
            </Button>

            {classifiedData && (
              <>
                <h5>Classification Results:</h5>
                <div className="table-container">
                  <Table striped bordered hover responsive>
                    <thead>
                      <tr>
                        {classifiedData.headers.map((header, idx) => (
                          <th key={idx}>{header}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {classifiedData.data.map((row, rowIdx) => (
                        <tr key={rowIdx}>
                          {classifiedData.headers.map((header, colIdx) => (
                            <td key={colIdx}>
                              {header === "target_label" ? (
                                <Badge
                                  bg="primary"
                                  className="classification-badge"
                                >
                                  {row[header]}
                                </Badge>
                              ) : (
                                row[header]
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
}

export default BatchClassifier;
