import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const EditProfile = () => {
  const { user } = useContext(AuthContext);
  const { id } = useParams(); // Should pass ID or get from user? 
  // Actually usually /profile/edit/:id or just /profile/edit (implies my profile).
  // I'll assume /profile/edit route.
  
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    gender: 'Male',
    age: '',
    height: '',
    maritalStatus: 'Single',
    religion: 'Hindu',
    caste: '',
    education: '',
    occupation: '',
    village: '',
    district: '',
    state: '',
    mobile: '',
    description: '',
    fatherName: '',
    motherName: '',
    gotra: '',
    familyDetails: ''
  });
  const [loading, setLoading] = useState(true);
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
      const fetchData = async () => {
          try {
              // Fetch existing profile
              // We assume user can only edit their own, so we could fetch by user ID or assume the ID passed is valid and verified on backend.
              // For simplicity, let's look up by user ID.
              const res = await axios.get(`http://localhost:5001/api/profiles/user/${user.userId}`);
              if(res.data) {
                  setFormData(res.data);
                  setExistingPhotos(res.data.photos || []);
              }
              setLoading(false);
          } catch(err) {
              console.log(err);
              setLoading(false);
          }
      };
      if(user) fetchData();
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Create preview URLs for new files
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Update profile
        let photoPaths = [...existingPhotos];
        
        // If new photos are selected, upload and append them
        if(photos.length > 0) {
            const uploadData = new FormData();
            for(let i=0; i<photos.length; i++){
                uploadData.append('photos', photos[i]);
            }
            const res = await axios.post('http://localhost:5001/api/profiles/upload', uploadData);
            // Append new photos
            const newPaths = res.data.paths;
            photoPaths = [...photoPaths, ...newPaths];
        }

        const updatedData = { ...formData, photos: photoPaths };
        await axios.put(`http://localhost:5001/api/profiles/${formData._id}`, updatedData);
        navigate('/profile');
    } catch (err) {
        alert('Error updating profile: ' + (err.response?.data?.message || err.message));
    }
  };

  if(loading) return <div>Loading...</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl text-primary text-center mb-6">Edit Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2">Basic Details</h3></div>
        
        <div><label>Full Name <span className="text-red-500">*</span></label><input name="name" value={formData.name} onChange={handleChange} required /></div>
        <div>
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
        <div><label>Age <span className="text-red-500">*</span></label><input name="age" type="number" value={formData.age} onChange={handleChange} required /></div>
        <div><label>Height</label><input name="height" value={formData.height} onChange={handleChange} placeholder="e.g. 5'9" /></div>
        <div>
            <label>Marital Status</label>
            <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
            </select>
        </div>
        
        {/* Family Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Family Information</h3></div>
        
        <div><label>Father's Name <span className="text-red-500">*</span></label><input name="fatherName" value={formData.fatherName || ''} onChange={handleChange} required /></div>
        <div><label>Mother's Name <span className="text-red-500">*</span></label><input name="motherName" value={formData.motherName || ''} onChange={handleChange} required /></div>
        <div><label>Gotra <span className="text-red-500">*</span></label><input name="gotra" value={formData.gotra || ''} onChange={handleChange} required /></div>

        {/* Social Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Social & Education</h3></div>
        
        <div><label>Religion <span className="text-red-500">*</span></label><input name="religion" value={formData.religion} onChange={handleChange} required /></div>
        <div><label>Caste <span className="text-red-500">*</span></label><input name="caste" value={formData.caste} onChange={handleChange} required /></div>
        <div><label>Education</label><input name="education" value={formData.education} onChange={handleChange} /></div>
        <div><label>Occupation</label><input name="occupation" value={formData.occupation} onChange={handleChange} /></div>

        <div><label className="block text-gray-700 font-bold mb-1">Disability</label><input className="w-full border p-2 rounded" name="disability" value={formData.disability || ''} onChange={handleChange} placeholder="e.g. None" /></div>
        
        {/* Location & Contact */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Location & Contact</h3></div>

        <div><label>Village <span className="text-red-500">*</span></label><input name="village" value={formData.village} onChange={handleChange} required /></div>
        <div><label>District <span className="text-red-500">*</span></label><input name="district" value={formData.district} onChange={handleChange} required /></div>
        <div><label>State <span className="text-red-500">*</span></label><input name="state" value={formData.state} onChange={handleChange} required /></div>
        <div><label>Mobile Number (For Contact) <span className="text-red-500">*</span></label><input name="mobile" value={formData.mobile} onChange={handleChange} required /></div>

        {/* Extra */}
        <div className="md:col-span-2"><label>About Me</label><textarea name="description" value={formData.description} onChange={handleChange} rows="3"></textarea></div>
        <div className="md:col-span-2"><label>Family Details</label><textarea name="familyDetails" value={formData.familyDetails} onChange={handleChange} rows="3"></textarea></div>

        <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="btn btn-primary w-full md:w-1/2 text-xl">Update Profile</button>
        </div>
        <div className="md:col-span-2 mt-4">
            <h3 className="text-xl font-bold border-b pb-2">Photos</h3>
            
            {/* Existing Photos */}
            {existingPhotos.length > 0 && (
                <div className="mb-4">
                    <p className="mb-2 font-medium">Current Photos (Click X to remove):</p>
                    <div className="flex gap-4 overflow-x-auto">
                        {existingPhotos.map((src, index) => (
                            <div key={index} className="w-24 h-24 border rounded-lg overflow-hidden shadow-sm relative group">
                                <img src={src.startsWith('http') ? src : `http://localhost:5001${src}`} alt={`Current ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => {
                                        const newPhotos = existingPhotos.filter((_, i) => i !== index);
                                        setExistingPhotos(newPhotos);
                                    }}
                                    className="absolute top-0 right-0 bg-red-600 text-white rounded-bl-lg w-6 h-6 flex items-center justify-center opacity-75 hover:opacity-100 font-bold"
                                >
                                    &times;
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <label>Add More Photos (Max 4 Total)</label>
            <input type="file" multiple onChange={handleFileChange} accept="image/*" className="p-2 border block w-full" />
            
            {/* New Previews */}
            {previews.length > 0 && (
                <div className="mt-4">
                     <p className="mb-2 font-medium text-green-600">New Photos Preview:</p>
                     <div className="flex gap-4 overflow-x-auto">
                        {previews.map((src, index) => (
                            <div key={index} className="w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                                <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
