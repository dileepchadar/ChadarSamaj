import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import CreateProfile from './pages/Profile/CreateProfile';
import EditProfile from './pages/Profile/EditProfile';
import SearchProfiles from './pages/Profile/SearchProfiles';
import ProfileDetails from './pages/Profile/ProfileDetails';
import MyProfile from './pages/Profile/MyProfile';
import AdminDashboard from './pages/Admin/AdminDashboard';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <LanguageProvider>
    <AuthProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create-profile" element={<CreateProfile />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/search" element={<SearchProfiles />} />
            <Route path="/profile" element={<MyProfile />} />
            <Route path="/profile/:id" element={<ProfileDetails />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-gray-800 text-white text-center p-6 mt-10">
          <p>&copy; 2026 Simple Matrimony. Built for Community.</p>
        </footer>
      </div>
    </AuthProvider>
    </LanguageProvider>
  );
}

export default App;
