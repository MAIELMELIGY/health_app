import React, { useState, useEffect } from 'react';
import { bookVisit, listDoctors, viewDoctorVisits } from '../../api/api';
import { Spinner, Button, Form, Table } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function PatientVisits() {
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctorName, setSelectedDoctorName] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoctors();
    fetchVisits();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await listDoctors();
      setDoctors(response.data);
    } catch (error) {
      console.error('Failed to load doctors:', error);
      setError('Failed to load doctors.');
    }
  };

  const fetchVisits = async () => {
    setLoading(true);
    try {
      const response = await viewDoctorVisits();
      setVisits(response.data.visits || []);
    } catch (error) {
      console.error("Error fetching visits:", error);
      setVisits([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookVisit = async () => {
    try {
      const selectedDoctor = doctors.find((doctor) => doctor.name === selectedDoctorName);
      if (!selectedDoctor) {
        setError('Please select a valid doctor.');
        return;
      }
      if (!preferredTime) {
        setError('Please select a preferred time.');
        return;
      }

      await bookVisit({ doctorId: selectedDoctor.id, preferredTime });
      setSuccess('Booking successful!');
      setError('');
      fetchVisits(); // Refresh visits list after booking
      setSelectedDoctorName('');
      setPreferredTime('');
    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to book visit. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Patient Visits</h2>

      {/* Booking Form */}
      <div className="mb-5">
        <h4>Book a Visit</h4>
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <Form.Group className="mb-3">
          <Form.Label>Select a Doctor</Form.Label>
          <Form.Select
            value={selectedDoctorName}
            onChange={(e) => setSelectedDoctorName(e.target.value)}
          >
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor.id} value={doctor.name}>
                {doctor.name}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Preferred Time</Form.Label>
          <Form.Control
            type="datetime-local"
            value={preferredTime}
            onChange={(e) => setPreferredTime(e.target.value)}
          />
        </Form.Group>

        <Button onClick={handleBookVisit} className="btn btn-primary">Book Visit</Button>
      </div>

      {/* Visits List */}
      <div>
        <h4 className="text-center mb-4">Your Scheduled Visits</h4>

        {loading ? (
          <div className="d-flex justify-content-center">
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        ) : visits.length > 0 ? (
          <Table bordered striped>
            <thead className="table-dark">
              <tr>
                <th>Doctor</th>
                <th>Status</th>
                <th>Preferred Time</th>
                <th>Total Amount</th>
                <th>Created At</th>
              </tr>
            </thead>
            <tbody>
              {visits.map((visit) => (
                <tr key={visit.id}>
                  <td>{visit.Doctor?.name || 'N/A'}</td>
                  <td>
                    <span className={`badge ${visit.status === 'Completed' ? 'bg-success' : 'bg-warning'}`}>
                      {visit.status}
                    </span>
                  </td>
                  <td>{visit.preferredTime ? new Date(visit.preferredTime).toLocaleString() : 'N/A'}</td>
                  <td>${visit.totalAmount}</td>
                  <td>{new Date(visit.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p className="text-center text-muted">No visits available.</p>
        )}
      </div>
    </div>
  );
}

export default PatientVisits;
