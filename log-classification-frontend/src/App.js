import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Container, Nav, Navbar } from "react-bootstrap";
import BatchClassifier from "./components/BatchClassifier";
import SingleClassifier from "./components/SingleClassifier";
import Dashboard from "./components/Dashboard";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand href="/">Log Classification System</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/">Dashboard</Nav.Link>
                <Nav.Link href="/batch">Batch Classification</Nav.Link>
                <Nav.Link href="/single">Single Log Classification</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>

        <Container className="mt-4 mb-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/batch" element={<BatchClassifier />} />
            <Route path="/single" element={<SingleClassifier />} />
          </Routes>
        </Container>

        <footer className="bg-dark text-light py-3">
          <Container className="text-center">
            <p className="mb-0">Log Classification System &copy; 2025</p>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

export default App;
