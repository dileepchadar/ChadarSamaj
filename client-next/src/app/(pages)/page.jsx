"use client";
import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { LanguageContext } from '@/context/LanguageContext';
import { AuthContext } from '@/context/AuthContext';
import { API_BASE } from '@/api';
import axios from 'axios';

const Home = () => {
    const { t } = useContext(LanguageContext);
  const { user } = useContext(AuthContext);
  const router = useRouter();
    const [latestMales, setLatestMales] = useState([]);
    const [latestFemales, setLatestFemales] = useState([]);
  const [showLoginModal, setShowLoginModal] = useState(false);
    
    useEffect(() => {
        const fetchLatest = async () => {
            try {
                // Fetch latest males (more for slider)
                const resM = await axios.get(`${API_BASE}/api/profiles?gender=Male`);
                setLatestMales(resM.data);
                
                // Fetch latest females
                const resF = await axios.get(`${API_BASE}/api/profiles?gender=Female`);
                setLatestFemales(resF.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLatest();
    }, []);

  const handleProfileClick = (profileId) => {
    if (!user) {
      setShowLoginModal(true);
    } else {
      router.push(`/profile/${profileId}`);
    }
  };

    const ProfileCard = ({ profile }) => (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-100 min-w-[280px] md:min-w-[320px] snap-start">
            <div className="h-64 bg-gray-200 flex items-center justify-center overflow-hidden">
                {profile.photos && profile.photos.length > 0 ? (
                    <img src={profile.photos[0].startsWith('http') ? profile.photos[0] : `${API_BASE}${profile.photos[0]}`} alt={profile.name} className="w-full h-full object-cover transition-transform hover:scale-105" />
                ) : (
                    <div className="flex flex-col items-center">
                        <span className="text-gray-400 text-4xl">👤</span>
                        <span className="text-gray-400 text-sm mt-2">No Photo</span>
                    </div>
                )}
            </div>
            <div className="p-4 text-left">
                <h3 className="text-xl font-bold text-gray-800">{profile.name}, {profile.age}</h3>
                <p className="text-gray-600">{profile.village}, {profile.district}</p>
                <button onClick={() => handleProfileClick(profile._id)} className="block mt-3 text-center bg-gray-50 hover:bg-gray-100 text-primary font-bold py-2 rounded-lg border border-gray-200 transition-colors">
                    {t('viewDetails')}
                </button>
            </div>
        </div>
    );

  return (
    <div className="flex flex-col items-center min-h-screen bg-white">
      
      {/* Hero Banner Section */}
      <div className="w-full bg-gradient-to-r from-red-600 to-rose-700 text-white py-20 px-4 mb-12 shadow-md">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10">
              <div className="text-center md:text-left md:w-1/2">
                <h1 className="text-4xl md:text-6xl font-bold mb-6 drop-shadow-md">{t('findMatch')}</h1>
                <p className="text-lg md:text-xl text-red-50 mb-8 max-w-lg mx-auto md:mx-0 font-medium">
                    {t('subtitle')}
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                    <Link href="/search" className="bg-white text-red-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-100 shadow-lg transition-transform hover:scale-105 transform">{t('searchBtn')}</Link>
                    <Link href="/register" className="bg-red-800 text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-red-900 border-2 border-red-700 shadow-lg transition-transform hover:scale-105 transform">{t('createBtn')}</Link>
                </div>
              </div>
              
              {/* Decorative Hero Image (Placeholder or CSS Art) */}
              <div className="hidden md:block md:w-1/2 relative">
                 <div className="relative w-80 h-80 mx-auto">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-xl"></div>
                     <div className="absolute bottom-10 left-10 w-48 h-48 bg-yellow-400/20 rounded-full blur-xl"></div>
                     <div className="relative z-10 bg-white/10 backdrop-blur-sm p-8 rounded-2xl border border-white/20 shadow-2xl text-center">
                         <span className="text-6xl mb-4 block">💑</span>
                         <h3 className="text-2xl font-bold mb-2 text-white">Chadar Samaj</h3>
                         <p className="text-red-100">Matrimonial Service</p>
                     </div>
                 </div>
              </div>
          </div>
      </div>

      {/* Stats / Steps Section */}
      <div className="w-full max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 -mt-24 relative z-20">
        <div className="bg-white p-8 rounded-xl shadow-xl text-center border-t-8 border-red-600 transform transition hover:translate-y-[-5px]">
          <div className="text-4xl mb-4">📝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('step1')}</h3>
          <p className="text-gray-600">{t('step1Desc')}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-xl text-center border-t-8 border-red-600 transform transition hover:translate-y-[-5px]">
          <div className="text-4xl mb-4">🖼️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('step2')}</h3>
          <p className="text-gray-600">{t('step2Desc')}</p>
        </div>
        <div className="bg-white p-8 rounded-xl shadow-xl text-center border-t-8 border-red-600 transform transition hover:translate-y-[-5px]">
          <div className="text-4xl mb-4">🤝</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('step3')}</h3>
          <p className="text-gray-600">{t('step3Desc')}</p>
        </div>
      </div>

      {/* Latest Profiles Slider Section */}
      <div className="w-full max-w-7xl px-4 flex flex-col gap-16 mb-20">
          
          {/* Grooms Slider */}
          {latestMales.length > 0 && (
              <div className="bg-blue-50/50 p-6 rounded-3xl">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left border-l-8 border-primary pl-4 flex items-center gap-3">
                      <span>🤵</span> {t('maleProfiles')}
                  </h2>
                  <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide p-2">
                      {latestMales.map(p => <ProfileCard key={p._id} profile={p} />)}
                  </div>
              </div>
          )}

          {/* Brides Slider */}
          {latestFemales.length > 0 && (
              <div className="bg-pink-50/50 p-6 rounded-3xl">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6 text-left border-l-8 border-pink-500 pl-4 flex items-center gap-3">
                      <span>👰</span> {t('femaleProfiles')}
                  </h2>
                  <div className="flex overflow-x-auto pb-8 gap-6 snap-x snap-mandatory scrollbar-hide p-2">
                      {latestFemales.map(p => <ProfileCard key={p._id} profile={p} />)}
                  </div>
              </div>
          )}

      </div>

      {/* Why Choose Us Section */}
      <div className="w-full bg-gray-900 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-12">{t('whyChooseUs')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition">
                      <div className="text-5xl mb-4">🏘️</div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('why1')}</h3>
                      <p className="text-gray-400">{t('why1Desc')}</p>
                  </div>
                   <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition">
                      <div className="text-5xl mb-4">💰</div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('why2')}</h3>
                      <p className="text-gray-400">{t('why2Desc')}</p>
                  </div>
                   <div className="p-6 border border-gray-700 rounded-xl hover:bg-gray-800 transition">
                      <div className="text-5xl mb-4">🔒</div>
                      <h3 className="text-xl font-bold text-white mb-2">{t('why3')}</h3>
                      <p className="text-gray-400">{t('why3Desc')}</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Success Stories (Static Mock) */}
      <div className="w-full py-20 px-4 max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-primary">{t('successStories')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-yellow-50 p-8 rounded-2xl border border-yellow-100 flex items-center gap-4 text-left shadow-sm">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-800">Ravi & Priya</h3>
                      <p className="text-gray-600 italic">" {t('story1')} "</p>
                  </div>
              </div>
               <div className="bg-green-50 p-8 rounded-2xl border border-green-100 flex items-center gap-4 text-left shadow-sm">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex-shrink-0"></div>
                  <div>
                      <h3 className="font-bold text-lg text-gray-800">Amit & Sunita</h3>
                      <p className="text-gray-600 italic">" {t('story2')} "</p>
                  </div>
              </div>
          </div>
      </div>

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center p-4" onClick={() => setShowLoginModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl" onClick={e => e.stopPropagation()}>
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
      </div>)
};

export default Home;
