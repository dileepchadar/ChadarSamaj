import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE } from '../../api';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (newPassword.length < 6) {
      return setError('New password must be at least 6 characters long');
    }

    try {
      const res = await axios.post(`${API_BASE}/api/auth/change-password`, { 
        userId: user.userId, 
        oldPassword, 
        newPassword 
      });
      setMessage(res.data.message);
      // Optional: Clear form
      setOldPassword('');
      setNewPassword('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
    }
  };

  if (!user) {
    return <div className="text-center mt-10">Please login to view this page.</div>;
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-primary">Change Password</h2>
      {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4 bg-green-50 p-2 rounded">{message}</p>}
      
      <form onSubmit={handleChangePassword} className="space-y-4" autoComplete="off">
        <div>
          <label>Current or Temporary Password</label>
          <input 
            type="password" 
            value={oldPassword} 
            onChange={(e) => setOldPassword(e.target.value)} 
            placeholder="Enter current password"
            autoComplete="new-password"
            required 
          />
        </div>
        <div>
          <label>New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            placeholder="Minimum 6 characters"
            autoComplete="new-password"
            required 
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
