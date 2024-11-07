import React, { useState, useEffect } from 'react';
import { viewDoctorVisits, startVisit, addTreatment, completeVisit } from '../../api/api';
import { Spinner, Button, Modal, Form, ListGroup, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./DoctorVisits.css";

function DoctorVisitsAndActions() {
  const [visits, setVisits] = useState([]);
  const [filteredVisits, setFilteredVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [activeVisit, setActiveVisit] = useState(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [treatmentDesc, setTreatmentDesc] = useState('');
  const [treatmentValue, setTreatmentValue] = useState('');

  useEffect(() => {
    fetchVisits();
  }, []);

  // Fetch all visits
  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await viewDoctorVisits();
      const allVisits = response?.data?.visits || [];
      setVisits(allVisits);
      setFilteredVisits(allVisits);
    } catch (error) {
      console.error("Error fetching visits:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter visits based on selected filter
  useEffect(() => {
    if (filter === 'pending') {
      setFilteredVisits(visits.filter(visit => visit.status === 'Pending'));
    } else {
      setFilteredVisits(visits);
    }
  }, [filter, visits]);

  // Start a visit
  const handleStartVisit = async (visitId) => {
    try {
      const response = await startVisit(visitId);
      setActiveVisit(response.data.visit);
      setVisits(visits.filter(visit => visit.id !== visitId));
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to start visit');
    }
  };

  // Complete the visit
  const handleCompleteVisit = async () => {
    try {
      await completeVisit(activeVisit.id);
      alert('Visit completed successfully');
      setActiveVisit(null);
      fetchVisits(); // Refresh visits list after completing the visit
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to complete visit');
    }
  };

  // Add treatment to the active visit
  const handleAddTreatment = async () => {
    try {
      const response = await addTreatment(activeVisit.id, treatmentDesc, parseFloat(treatmentValue));
      setActiveVisit(prev => ({
        ...prev,
        totalAmount: response.data.totalAmount,
        Treatments: [...(prev.Treatments || []), response.data.treatment]
      }));
      setShowTreatmentModal(false);
      setTreatmentDesc('');
      setTreatmentValue('');
    } catch (error) {
      alert(error.response?.data?.error || 'Failed to add treatment');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Doctor Visits and Actions</h2>

      {loading ? (
        <div className="d-flex justify-content-center">
          <Spinner animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </div>
      ) : (
        <>
          {activeVisit ? (
            <div>
              <h4>Active Visit</h4>
              <p><strong>Doctor:</strong> {activeVisit.Doctor?.name}</p>
              <p><strong>Patient:</strong> {activeVisit.Patient?.name}</p>
              <p><strong>Total Amount:</strong> ${activeVisit.totalAmount}</p>

              <ListGroup className="mb-4">
                {activeVisit.Treatments?.map((treatment, idx) => (
                  <ListGroup.Item key={idx}>
                    <strong>Description:</strong> {treatment.description} <br />
                    <strong>Cost:</strong> ${treatment.value}
                  </ListGroup.Item>
                ))}
              </ListGroup>

              <Button variant="info" onClick={() => setShowTreatmentModal(true)}>Add Treatment</Button>{' '}
              <Button variant="success" onClick={handleCompleteVisit}>Complete Visit</Button>
            </div>
          ) : (
            <>
              <div className="d-flex justify-content-center mb-4">
                <ToggleButtonGroup
                  type="radio"
                  name="visitFilter"
                  value={filter}
                  onChange={(val) => setFilter(val)}
                >
                  <ToggleButton variant="outline-primary" value="all">
                    All Visits
                  </ToggleButton>
                  <ToggleButton variant="outline-warning" value="pending">
                    Pending Visits
                  </ToggleButton>
                </ToggleButtonGroup>
              </div>

              <h4>{filter === 'pending' ? 'Pending' : 'All'} Visits</h4>
              <ListGroup>
                {filteredVisits.map((visit) => (
                  <ListGroup.Item key={visit.id} className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Patient:</strong> {visit.Patient?.name || 'N/A'}
                      <br />
                      <strong>Preferred Time:</strong> {visit.preferredTime ? new Date(visit.preferredTime).toLocaleString() : 'N/A'}
                      <br />
                      <strong>Status:</strong> <span className={`badge ${visit.status === 'Completed' ? 'bg-success' : visit.status === 'Pending' ? 'bg-warning' : 'bg-secondary'}`}>
                        {visit.status}
                      </span>
                    </div>
                    {visit.status === 'Pending' && (
                      <Button variant="primary" onClick={() => handleStartVisit(visit.id)}>Start Visit</Button>
                    )}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </>
          )}
        </>
      )}

      {/* Treatment Modal */}
      <Modal show={showTreatmentModal} onHide={() => setShowTreatmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Treatment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="treatmentDesc">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter treatment description"
                value={treatmentDesc}
                onChange={(e) => setTreatmentDesc(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="treatmentValue" className="mt-3">
              <Form.Label>Value</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter treatment cost"
                value={treatmentValue}
                onChange={(e) => setTreatmentValue(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTreatmentModal(false)}>Close</Button>
          <Button variant="primary" onClick={handleAddTreatment}>Add Treatment</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default DoctorVisitsAndActions;
