"use client";
import React, { useState, useContext } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long');
    }
    try {
      const res = await axios.post(`${API_BASE}/api/auth/login`, { mobile, password });
      login(res.data.userId, res.data.role);
      router.push('/');
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
        <div>
          <label>Password</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            placeholder="Enter your password"
            required 
          />
        </div>
        <button type="submit" className="btn btn-primary w-full">Login</button>
      </form>
      <div className="mt-4 text-center">
        <p>Don't have an account? <Link href="/register" className="text-blue-600 font-bold">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
