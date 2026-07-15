"use client";
import React, { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

import { API_BASE } from '@/api';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');
    
    try {
      const res = await axios.post(`${API_BASE}/api/auth/forgot-password`, { email });
      setMessage(res.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-md">
      <h2 className="text-center text-primary">Forgot Password</h2>
      <p className="text-center text-gray-600 mb-6 text-sm">
        Enter your registered email address and we'll send you a temporary password.
      </p>
      
      {error && <p className="text-red-500 text-center mb-4 bg-red-50 p-2 rounded">{error}</p>}
      {message && <p className="text-green-600 text-center mb-4 bg-green-50 p-2 rounded">{message}</p>}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Email Address</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            placeholder="Enter your email"
            required 
            disabled={loading}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary w-full"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send Temporary Password'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p>Remember your password? <Link href="/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
};

export default ForgotPassword;
