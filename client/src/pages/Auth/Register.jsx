import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5001/api/auth/register', { mobile });
      login(res.data.userId, 'user');
      navigate('/create-profile'); // Redirect to profile creation after register
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-primary">Register</h2>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleRegister} className="space-y-4">
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
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
      <div className="mt-4 text-center">
        <p>Already have an account? <Link to="/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
