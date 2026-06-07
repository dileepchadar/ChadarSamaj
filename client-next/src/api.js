import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === 'production' ? 'https://chadar-samaj-backend.onrender.com' : 'http://localhost:5001');

export const API_BASE = API_URL;

// Create an Axios instance for Client-Side calls
export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Common fetch functions for Server-Side Rendering (SSR)
// These use native fetch() so Next.js can cache and optimize them
export const fetchServerAPI = {
  getProfileById: async (id) => {
    // Adding { cache: 'no-store' } ensures it fetches fresh data on every request (SSR)
    const res = await fetch(`${API_BASE}/api/profiles/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },
  
  getAllProfiles: async () => {
    const res = await fetch(`${API_BASE}/api/profiles`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch profiles');
    return res.json();
  }
};
