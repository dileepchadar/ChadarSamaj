"use client";
import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';

const Login = () => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

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
      
      <button 
        onClick={() => signIn('google')} 
        className="w-full flex items-center justify-center gap-2 border py-2 px-4 rounded-lg hover:bg-gray-50 mb-6 bg-white shadow-sm font-medium"
        type="button"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
          <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
          <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
          <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
          <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
        </svg>
        Sign in with Google
      </button>

      <div className="relative flex py-2 items-center mb-6">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink-0 mx-4 text-gray-400">Or login with mobile</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label>Mobile Number</label>
          <input 
            type="text" 
            value={mobile} 
            onChange={(e) => setMobile(e.target.value)} 
            placeholder="Enter 10 digit mobile number or email"
            required 
          />
        </div>
        <div>
          <div className="flex justify-between items-center">
            <label>Password</label>
            <Link href="/forgot-password" className="text-sm text-blue-600 hover:underline">Forgot Password?</Link>
          </div>
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
      <div className="mt-6 text-center">
        <p>Don't have an account? <Link href="/register" className="text-blue-600 font-bold">Register</Link></p>
      </div>
    </div>
  );
};

export default Login;
