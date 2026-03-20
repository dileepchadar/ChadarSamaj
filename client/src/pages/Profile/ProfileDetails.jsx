import React, { useState, useEffect, useContext, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { LanguageContext } from '../../context/LanguageContext';

const ProfileDetails = () => {
  const { id } = useParams();
  const { user, logout } = useContext(AuthContext);
  const { t } = useContext(LanguageContext);
  const [profile, setProfile] = useState(null);
  const [showContact, setShowContact] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); // For modal
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`http://localhost:5001/api/profiles/${id}`);
        setProfile(res.data);
        if(res.data.photos && res.data.photos.length > 0) {
            setMainImage(res.data.photos[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, [id]);

  const handleReport = async () => {
    if (!user) return alert('Please login to report.');
    const reason = window.prompt("Why are you reporting this profile?");
    if (reason) {
        try {
            await axios.post(`http://localhost:5001/api/profiles/${id}/report`, { reason, reportedBy: user.userId });
            alert('Profile reported successfully.');
        } catch (err) {
            alert('Error reporting profile.');
        }
    }
  };

  const handlePhotoSelect = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (profile.photos.length + files.length > 4) {
        return alert('You can only have a maximum of 4 photos.');
    }

    setUploading(true);
    try {
        const uploadData = new FormData();
        for (let i = 0; i < files.length; i++) {
            uploadData.append('photos', files[i]);
        }

        // 1. Upload new photos
        const res = await axios.post('http://localhost:5001/api/profiles/upload', uploadData);
        const newPaths = res.data.paths;

        // 2. Update profile with combined list
        const updatedPhotos = [...(profile.photos || []), ...newPaths];
        await axios.put(`http://localhost:5001/api/profiles/${profile._id}`, { ...profile, photos: updatedPhotos });

        // 3. Update local state
        setProfile({ ...profile, photos: updatedPhotos });
        alert('Photos uploaded successfully!');
    } catch (err) {
        console.error(err);
        alert('Error uploading photos.');
    } finally {
        setUploading(false);
        if(fileInputRef.current) fileInputRef.current.value = ''; // Reset input
    }
  };

  const handlePhotoDelete = async (photoToDelete, e) => {
    e.stopPropagation(); // Prevent opening the modal
    if(!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
        const updatedPhotos = profile.photos.filter(p => p !== photoToDelete);
        
        // Update on server
        await axios.put(`http://localhost:5001/api/profiles/${profile._id}`, { ...profile, photos: updatedPhotos });
        
        // Update local state
        setProfile({ ...profile, photos: updatedPhotos });
        
        if(selectedImage === photoToDelete) setSelectedImage(null);
    } catch (err) {
        console.error(err);
        alert('Error deleting photo.');
    }
  };

  const handleDelete = async () => {
      if(!window.confirm('Are you sure you want to delete this profile?')) return;
      try {
          await axios.delete(`http://localhost:5001/api/admin/profile/${id}`);
          alert('Profile deleted.');
          navigate('/search');
      } catch (err) {
          alert('Error deleting profile.');
      }
  };

  const handleAccountDelete = async () => {
      const confirmStr = t('deleteAccountConfirm') || 'Are you sure you want to permanently delete your account and profile? This action cannot be undone.';
      if(!window.confirm(confirmStr)) return;
      try {
          await axios.delete(`http://localhost:5001/api/auth/${user.userId}`);
          logout();
          alert(t('accountDeleted') || 'Account deleted successfully.');
          navigate('/');
      } catch (err) {
          console.error(err);
          alert(t('errorDeletingAccount') || 'Error deleting account.');
      }
  };

  if (!profile) return <div className="p-10 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-xl rounded-xl my-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Photos */}
        {/* Main Photo (Avatar) */}
        <div className="w-full md:w-1/3 flex justify-center md:block">
            {profile.photos && profile.photos.length > 0 ? (
                 <div className="w-64 h-64 md:w-full md:h-80 rounded-xl overflow-hidden shadow-lg border border-gray-100 bg-gray-100 relative group cursor-pointer" onClick={() => setSelectedImage(profile.photos[0])}>
                     <img src={profile.photos[0].startsWith('http') ? profile.photos[0] : `http://localhost:5001${profile.photos[0]}`} className="w-full h-full object-cover transition-transform hover:scale-105" alt="Profile Main" />
                     <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 flex items-center justify-center transition-all">
                         <span className="opacity-0 group-hover:opacity-100 text-white font-bold bg-black bg-opacity-50 px-3 py-1 rounded">View Photo</span>
                     </div>
                 </div>
            ) : (
                <div className="w-64 h-64 md:w-full md:h-80 bg-gray-200 flex items-center justify-center rounded-xl text-gray-500 text-6xl">👤</div>
            )}
        </div>

        {/* Details */}
        <div className="w-full md:w-2/3 space-y-4">
            <div className="flex justify-between items-start">
                <div>
                   <h1 className="text-3xl font-bold text-primary">{profile.name}</h1>
                   <p className="text-xl text-gray-600">{profile.age} {t('years')}</p>
                   <p className="text-xl text-gray-600">Height, {profile.height}</p>
                   <p className="text-lg text-gray-500">{profile.occupation} in {profile.village}, {profile.district}</p>
                </div>
                {user?.role === 'admin' && (
                    <button onClick={handleDelete} className="bg-red-600 text-white px-3 py-1 rounded text-sm">Delete (Admin)</button>
                )}
                {user && user.userId === profile.userId && (
                    <div className="flex flex-col sm:flex-row gap-2 ml-2">
                        <button onClick={() => navigate('/edit-profile')} className="bg-primary text-white px-3 py-1 rounded text-sm whitespace-nowrap">{t('editProfile')}</button>
                        <button onClick={handleAccountDelete} className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded text-sm whitespace-nowrap">Delete Account</button>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div><strong>{t('maritalStatus')}:</strong> {profile.maritalStatus}</div>
                <div><strong>{t('religion')}/{t('caste')}:</strong> {profile.religion} - {profile.caste}</div>
                {profile.disability && <div><strong>{t('disability')}:</strong> <span className="text-red-600 font-bold">{profile.disability}</span></div>}
                <div><strong>{t('education')}:</strong> {profile.education}</div>
                <div><strong>{t('state')}:</strong> {profile.state}</div>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-bold mb-2">{t('aboutMe')}</h3>
                <p className="text-gray-700">{profile.description || 'No description provided.'}</p>
            </div>

            <div className="my-4">
                <h3 className="text-xl font-bold mb-2">{t('myFamily')}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-gray-700 bg-yellow-50 p-4 rounded-lg">
                    <div><strong>{t('fatherName')}:</strong> {profile.fatherName || 'N/A'}</div>
                    <div><strong>{t('motherName')}:</strong> {profile.motherName || 'N/A'}</div>
                    <div><strong>{t('gotra')}:</strong> {profile.gotra || 'N/A'}</div>
                </div>
                <p className="text-gray-700 mt-2">{profile.familyDetails || 'No other details provided.'}</p>
            </div>

            <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100 text-center">
                {user ? (
                    showContact ? (
                        <div className="text-2xl font-bold text-green-700">{profile.mobile}</div>
                    ) : (
                        <button onClick={() => setShowContact(true)} className="btn btn-primary text-xl w-full">{t('viewContact')}</button>
                    )
                ) : (
                    <div>
                        <p className="mb-2 text-gray-600">{t('loginToView')}</p>
                        <button onClick={() => navigate('/login')} className="btn btn-secondary">{t('loginNow')}</button>
                    </div>
                )}
            </div>

            <div className="text-right mt-4">
                <button onClick={handleReport} className="text-gray-400 hover:text-red-500 text-sm">{t('reportFake')}</button>
            </div>
        </div>
      </div>
      
      
      {/* Separate Gallery Section */}
      <div className="mt-12 border-t pt-8">
          <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">{t('photoGallery')}</h2>
              {user && user.userId === profile.userId && (
                  <div>
                      <input 
                          type="file" 
                          ref={fileInputRef} 
                          onChange={handlePhotoSelect} 
                          multiple 
                          accept="image/*" 
                          className="hidden" 
                      />
                      <button 
                          onClick={() => fileInputRef.current.click()} 
                          disabled={uploading}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded shadow flex items-center gap-2"
                      >
                          {uploading ? t('uploading') : `📷 ${t('addPhotos')}`}
                      </button>
                  </div>
              )}
          </div>

          {profile.photos && profile.photos.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {profile.photos.map((p, idx) => (
                      <div key={idx} className="h-64 rounded-lg overflow-hidden shadow-md cursor-pointer relative group" onClick={() => setSelectedImage(p)}>
                          <img src={p.startsWith('http') ? p : `http://localhost:5001${p}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" alt={`Gallery ${idx}`} />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all"></div>
                          {user && user.userId === profile.userId && (
                              <button 
                                  onClick={(e) => handlePhotoDelete(p, e)}
                                  className="absolute top-2 right-2 bg-red-600 hover:bg-red-700 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-transform hover:scale-110 z-10"
                                  title="Delete Photo"
                              >
                                  &times;
                              </button>
                          )}
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all pointer-events-none"></div>
                      </div>
                  ))}
              </div>
          ) : (
              <p className="text-gray-500 italic">{t('noPhotos')}</p>
          )}
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
              <div className="relative max-w-4xl max-h-screen">
                  <img src={selectedImage.startsWith('http') ? selectedImage : `http://localhost:5001${selectedImage}`} className="max-w-full max-h-[85vh] rounded-lg shadow-2xl" alt="Full View" />
                  <button className="absolute -top-10 right-0 text-white text-4xl hover:text-gray-300">&times;</button>
              </div>
          </div>
      )}

    </div>
  );
};

export default ProfileDetails;
