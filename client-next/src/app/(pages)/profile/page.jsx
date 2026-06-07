"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';

const MyProfile = () => {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    const checkProfile = async () => {
      try {
        if(!user) return router.push('/login');
        const res = await axios.get(`${API_BASE}/api/profiles/user/${user.userId}`);
        if (res.data) {
          // If profile exists, go to detail view
          router.push(`/profile/${res.data._id}`);
        } else {
          // If not, go to create
          router.push('/create-profile');
        }
      } catch (err) {
        console.error(err);
      }
    };
    checkProfile();
  }, [user, router]);

  return <div className="p-10 text-center">Loading Profile...</div>;
};

export default MyProfile;
