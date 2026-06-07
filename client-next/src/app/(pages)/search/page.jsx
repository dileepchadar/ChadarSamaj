"use client";
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

import { LanguageContext } from '@/context/LanguageContext';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';

const SearchProfiles = () => {
  const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
  const [profiles, setProfiles] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [filters, setFilters] = useState({
    gender: '',
    minAge: '',
    maxAge: '',
    district: '',
    religion: '',
    name: '',
    disability: '' // Use string 'true' due to native select/check handling
  });

  const [showFilters, setShowFilters] = useState(false); // Filter toggle for all screens

  const fetchProfiles = async () => {
    try {
      const params = new URLSearchParams(filters);
      // Remove empty filters
      for (const [key, value] of params.entries()) {
          if (!value) params.delete(key);
      }
      const res = await axios.get(`${API_BASE}/api/profiles?${params.toString()}`);
      setProfiles(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? (e.target.checked ? 'true' : '') : e.target.value;
    setFilters({...filters, [e.target.name]: value});
  };

  const handleProfileClick = (profileId) => {
      if (!user) {
          setShowLoginModal(true);
      } else {
          router.push(`/profile/${profileId}`);
      }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-3xl text-center text-primary mb-6">{t('allRegisteredMembers')}</h2>
      
      {/* Toggle Filters Button */}
      <div className="mb-6">
          <button onClick={() => setShowFilters(!showFilters)} className="w-full bg-white text-gray-700 font-bold py-3 px-6 rounded-xl shadow-md border border-gray-100 flex justify-between items-center hover:bg-gray-50 transition-all">
              <span className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                  {t('filterBtn')} & Options
              </span>
              <span className="text-gray-400">{showFilters ? '▲' : '▼'}</span>
          </button>
      </div>

      {/* Collapsible Filter Panel */}
      {showFilters && (
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-10 border border-gray-100 animate-fade-in-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
                <div className="col-span-1">
                    <input name="name" placeholder={t('byName')} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                </div>
                <select name="gender" onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none">
                    <option value="">{t('allGenders')}</option>
                    <option value="Male">{t('male')}</option>
                    <option value="Female">{t('female')}</option>
                </select>
                <input name="minAge" type="number" placeholder={t('minAge')} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                <input name="maxAge" type="number" placeholder={t('maxAge')} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                <input name="district" placeholder={t('byDistrict')} onChange={handleChange} className="w-full border border-gray-300 bg-gray-50 p-2.5 rounded-lg focus:ring-2 focus:ring-primary outline-none" />
                <div className="flex items-center gap-2 border border-gray-300 bg-gray-50 p-2.5 rounded-lg cursor-pointer hover:bg-gray-100">
                    <input type="checkbox" name="disability" onChange={handleChange} id="disCheck" checked={filters.disability === 'true'} className="w-4 h-4 text-primary rounded" />
                    <label htmlFor="disCheck" className="text-sm text-gray-700 cursor-pointer select-none font-medium">Disabled Only</label>
                </div>
                <button onClick={fetchProfiles} className="sm:col-span-2 lg:col-span-6 bg-primary hover:bg-red-700 text-white font-bold py-3 rounded-xl shadow-lg transition transform active:scale-95">
                    {t('filterBtn')}
                </button>
            </div>
        </div>
      )}

      {/* Results */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {profiles.map(profile => (
          <div onClick={() => handleProfileClick(profile._id)} key={profile._id} className="block group cursor-pointer">
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 transition-transform transform group-hover:-translate-y-1 hover:shadow-xl flex flex-col h-full">
                {/* Image Container: Aspect Ratio based for consistent look */}
                <div className="w-full aspect-[4/5] bg-gray-200 flex items-center justify-center overflow-hidden relative">
                    {profile.photos && profile.photos.length > 0 ? (
                        <img src={profile.photos[0].startsWith('http') ? profile.photos[0] : `${API_BASE}${profile.photos[0]}`} alt={profile.name} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-gray-400 text-5xl">👤</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 bg-white text-primary font-bold py-2 px-6 rounded-full shadow-lg transform scale-50 group-hover:scale-100 transition-all">{t('viewDetails')}</span>
                    </div>
                </div>
                <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                         <h3 className="text-xl font-bold text-gray-800">{profile.name}</h3>
                         <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-xs font-medium">{profile.age} {t('years')}</span>
                    </div>
                    
                    <p className="text-gray-600 mb-1 flex items-center gap-1">
                        <span>📍</span> {profile.village}, {profile.district}
                    </p>
                    {profile.disability && profile.disability !== 'None' && (
                        <p className="text-red-500 font-bold text-xs bg-red-50 px-2 py-1 rounded inline-block mb-2">
                           ⚠️ {profile.disability}
                        </p>
                    )}
                    <p className="text-gray-500 text-sm mb-3">{profile.occupation || 'N/A'}</p>
                    
                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center text-sm">
                        <span className="text-primary font-semibold">{profile.caste}</span>
                        <span className="text-gray-400">{t('viewDetails')} &rarr;</span>
                    </div>
                </div>
            </div>
          </div>
        ))}
        {profiles.length === 0 && <p className="text-center col-span-full py-10">{t('noProfiles')}</p>}
      </div>

      {/* Login Modal */}
      {showLoginModal && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
              <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl transform scale-100" onClick={e => e.stopPropagation()}>
                  <div className="text-5xl mb-4">🔒</div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{t('pleaseLoginTitle')}</h3>
                  <p className="text-gray-600 mb-6">{t('pleaseLoginMsg')}</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={() => router.push('/login')} className="bg-primary text-white font-bold py-3 rounded-xl w-full shadow hover:bg-red-700 transition">
                          {t('loginNow')}
                      </button>
                      <button onClick={() => setShowLoginModal(false)} className="text-gray-500 font-medium py-2 hover:text-gray-800 transition">
                          Cancel
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default SearchProfiles;
