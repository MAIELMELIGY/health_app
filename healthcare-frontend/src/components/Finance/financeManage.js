import React, { useState, useEffect } from 'react';
import { Spinner, Button, Form, Row, Col, Card, ListGroup } from 'react-bootstrap';
import { viewDoctorVisits } from '../../api/api';
import 'bootstrap/dist/css/bootstrap.min.css';


function FinanceVisitManagement() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [doctorName, setDoctorName] = useState('');
  const [patientName, setPatientName] = useState('');
  const [visitId, setVisitId] = useState('');

  // Fetch visits based on search parameters
  const fetchVisits = async (filters = {}) => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters);
      const response = await viewDoctorVisits(params.toString());
      setVisits(response.data.visits || []);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVisits(); 
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchVisits({ doctorName, patientName, visitId });
  };

  const handleReview = (visit) => {
    setSelectedVisit(visit);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Finance Visit Management</h2>

      {/* Search Form */}
      <Form onSubmit={handleSearch} className="mb-4">
        <Row>
          <Col md={4}>
            <Form.Group controlId="doctorName">
              <Form.Label>Doctor Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter doctor's name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="patientName">
              <Form.Label>Patient Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter patient's name"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col md={4}>
            <Form.Group controlId="visitId">
              <Form.Label>Visit ID</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter visit ID"
                value={visitId}
                onChange={(e) => setVisitId(e.target.value)}
              />
            </Form.Group>
          </Col>
        </Row>
        <div className="text-center mt-3">
          <Button type="submit" variant="primary">Search</Button>
        </div>
      </Form>

      {/* Display Visits */}
      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {visits.length > 0 ? (
            <table className="table table-bordered table-striped">
              <thead className="table-dark">
                <tr>
                  <th>Doctor</th>
                  <th>Patient</th>
                  <th>Status</th>
                  <th>Preferred Time</th>
                  <th>Total Amount</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {visits.map((visit) => (
                  <tr key={visit.id}>
                    <td>{visit.Doctor?.name || 'N/A'}</td>
                    <td>{visit.Patient?.name || 'N/A'}</td>
                    <td>
                      <span className={`badge ${visit.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                        {visit.status}
                      </span>
                    </td>
                    <td>{visit.preferredTime ? new Date(visit.preferredTime).toLocaleString() : 'N/A'}</td>
                    <td>${visit.totalAmount}</td>
                    <td>
                      <Button variant="info" onClick={() => handleReview(visit)}>
                        Review
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-center text-muted">No visits available.</p>
          )}
        </>
      )}

      {/* Selected Visit Details */}
      {selectedVisit && (
        <div className="mt-5">
          <h3 className="text-center">Visit Details</h3>
          <Card className="mb-4">
            <Card.Header className="bg-dark text-white">General Information</Card.Header>
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item><strong>Doctor:</strong> {selectedVisit.Doctor?.name || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Patient:</strong> {selectedVisit.Patient?.name || 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Status:</strong> {selectedVisit.status}</ListGroup.Item>
                <ListGroup.Item><strong>Total Amount:</strong> ${selectedVisit.totalAmount}</ListGroup.Item>
                <ListGroup.Item><strong>Preferred Time:</strong> {selectedVisit.preferredTime ? new Date(selectedVisit.preferredTime).toLocaleString() : 'N/A'}</ListGroup.Item>
                <ListGroup.Item><strong>Created At:</strong> {new Date(selectedVisit.createdAt).toLocaleDateString()}</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>

          <Card className="mb-4">
            <Card.Header className="bg-dark text-white">Treatments</Card.Header>
            <Card.Body>
              {selectedVisit.Treatments && selectedVisit.Treatments.length > 0 ? (
                <ListGroup variant="flush">
                  {selectedVisit.Treatments.map((treatment, index) => (
                    <ListGroup.Item key={index}>
                      <strong>Description:</strong> {treatment.description} <br />
                      <strong>Cost:</strong> ${treatment.value}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p className="text-muted">No treatments recorded for this visit.</p>
              )}
            </Card.Body>
          </Card>
        </div>
      )}
    </div>
  );
}

export default FinanceVisitManagement;
