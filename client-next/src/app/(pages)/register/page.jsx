"use client";
import React, { useState, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';

const Register = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    try {
      const res = await axios.post(`${API_BASE}/api/auth/register`, { mobile, password });
      login(res.data.userId, 'user');
      router.push('/create-profile'); // Redirect to profile creation after register
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
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Minimum 6 characters"
            required 
            minLength={6}
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Register</button>
      </form>
      <div className="mt-4 text-center">
        <p>Already have an account? <Link href="/login" className="text-blue-600 font-bold">Login</Link></p>
      </div>
    </div>
  );
};

export default Register;
