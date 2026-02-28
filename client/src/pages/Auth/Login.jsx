import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/login', { mobile });
      login(res.data.userId, res.data.role);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-primary">Login</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Mobile Number</label>
          <input 
            type="text" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            placeholder="Enter 10 digit mobile number"
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
      <div className="mt-4 text-center">
        <p>Don't have an account? <Link to="/register" className="text-blue-600 font-bold">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
