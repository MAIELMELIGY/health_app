import React, { useState } from 'react';
import { register } from '../../api/api';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await register({ name, email, password, userType: role });
      navigate('/login');
    } catch (error) {
      setError('Failed to register. Please try again.');
      console.error(error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Register</h2>
      {error && <p className="text-danger">{error}</p>}
      
      <input 
        type="text" 
        placeholder="Name" 
        value={name} 
        onChange={(e) => setName(e.target.value)} 
        className="form-control mb-2" 
      />
      
      <input 
        type="email" 
        placeholder="Email" 
        value={email} 
        onChange={(e) => setEmail(e.target.value)} 
        className="form-control mb-2" 
      />
      
      <input 
        type="password" 
        placeholder="Password" 
        value={password} 
        onChange={(e) => setPassword(e.target.value)} 
        className="form-control mb-2" 
      />
      
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)} 
        className="form-control mb-3"
      >
        <option value="">Select Role</option>
        <option value="Patient">Patient</option>
        <option value="Doctor">Doctor</option>
        <option value="Finance">Finance</option>
      </select>
      
      <button onClick={handleRegister} className="btn btn-primary">Register</button>
    </div>
  );
}

export default Register;
