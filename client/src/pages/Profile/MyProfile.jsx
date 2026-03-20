import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE } from '../../api';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        if(!user) return navigate('/login');
        const res = await axios.get(`${API_BASE}/api/profiles/user/${user.userId}`);
        if (res.data) {
          // If profile exists, go to detail view
          navigate(`/profile/${res.data._id}`);
        } else {
          // If not, go to create
          navigate('/create-profile');
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkProfile();
  }, [user, navigate]);

  return <div className="p-10 text-center">Loading Profile...</div>;
};

export default MyProfile;
