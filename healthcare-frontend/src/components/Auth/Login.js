import React, { useState } from 'react';
import { login } from '../../api/api';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    setError(''); 

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      const response = await login({ email, password });

      if (response.data.message !== 'Login successful') {
        setError('Login failed. Please check your credentials.');
        return;
      }

      const { token, userType } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('userType', userType);

      if (userType === 'Patient') {
        navigate('/patient/visits');
      } else if (userType === 'Doctor') {
        navigate('/doctor/visits');
      } else if (userType === 'Finance') {
        navigate('/finance');
      } else {
        setError('Unrecognized user type.');
      }
    } catch (error) {
      // Catch block for any unexpected issues
      setError(error.response?.data?.message || 'Something went wrong.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>Login</h2>
      {error && <p className="text-danger">{error}</p>}
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
      <button onClick={handleLogin} className="btn btn-primary">Login</button>
      <p className="mt-3">
        Don’t have an account? <Link to="/register">Register here</Link>.
      </p>
    </div>
  );
}

export default Login;
