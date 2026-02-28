import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const CreateProfile = () => {
  const { user } = useContext(AuthContext);
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
  const [photos, setPhotos] = useState([]);
  const [previews, setPreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    // Create preview URLs
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    // Append fields
    Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
    });
    data.append('userId', user.userId);
    
    // Upload photos first or handle together? 
    // My API has separate upload endpoint or I can modify to accept files on Create. 
    // My API "POST /profiles" expects JSON. "POST /api/profiles/upload" handles files.
    // I should upload files first, get URLs, then create profile.
    
    try {
        let photoPaths = [];
        if(photos.length > 0) {
            const uploadData = new FormData();
            for(let i=0; i<photos.length; i++){
                uploadData.append('photos', photos[i]);
            }
            const res = await axios.post('http://localhost:5001/api/profiles/upload', uploadData);
            photoPaths = res.data.paths;
        }

        // Now create profile
        const profileData = { ...formData, userId: user.userId, photos: photoPaths };
        await axios.post('http://localhost:5001/api/profiles', profileData);
        navigate('/profile');
    } catch (err) {
        alert('Error creating profile: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl">
      <h2 className="text-3xl text-primary text-center mb-6">Create Your Profile</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Basic Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2">Basic Details</h3></div>
        
        <div><label>Full Name <span className="text-red-500">*</span></label><input name="name" onChange={handleChange} required /></div>
        <div>
            <label>Gender</label>
            <select name="gender" onChange={handleChange}>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
            </select>
        </div>
        <div><label>Age <span className="text-red-500">*</span></label><input name="age" type="number" onChange={handleChange} required /></div>
        <div><label>Height</label><input name="height" onChange={handleChange} placeholder="e.g. 5'9" /></div>
        <div>
            <label>Marital Status</label>
            <select name="maritalStatus" onChange={handleChange}>
                <option value="Single">Single</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
            </select>
        </div>
        
        {/* Family Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Family Information</h3></div>
        
        <div><label>Father's Name <span className="text-red-500">*</span></label><input name="fatherName" onChange={handleChange} required /></div>
        <div><label>Mother's Name <span className="text-red-500">*</span></label><input name="motherName" onChange={handleChange} required /></div>
        <div><label>Gotra <span className="text-red-500">*</span></label><input name="gotra" onChange={handleChange} required /></div>

        {/* Social Details */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Social & Education</h3></div>
        
        <div><label>Religion <span className="text-red-500">*</span></label><input name="religion" onChange={handleChange} required /></div>
        <div><label>Caste <span className="text-red-500">*</span></label><input name="caste" onChange={handleChange} required /></div>
        <div><label>Education</label><input name="education" onChange={handleChange} /></div>
        <div><label>Occupation</label><input name="occupation" onChange={handleChange} /></div>
        <div><label>Disability (if any)</label><input name="disability" placeholder="e.g. None, Speech, Walking" onChange={handleChange} /></div>

        {/* Location & Contact */}
        <div className="md:col-span-2"><h3 className="text-xl font-bold border-b pb-2 mt-4">Location & Contact</h3></div>

        <div><label>Village <span className="text-red-500">*</span></label><input name="village" onChange={handleChange} required /></div>
        <div><label>District <span className="text-red-500">*</span></label><input name="district" onChange={handleChange} required /></div>
        <div><label>State <span className="text-red-500">*</span></label><input name="state" onChange={handleChange} required /></div>
        <div><label>Mobile Number (For Contact) <span className="text-red-500">*</span></label><input name="mobile" onChange={handleChange} required /></div>

        {/* Extra */}
        <div className="md:col-span-2"><label>About Me</label><textarea name="description" onChange={handleChange} rows="3"></textarea></div>
        <div className="md:col-span-2"><label>Family Details</label><textarea name="familyDetails" onChange={handleChange} rows="3"></textarea></div>

        {/* Photos */}
        <div className="md:col-span-2">
            <label>Upload Photos (Max 4)</label>
            <input type="file" multiple onChange={handleFileChange} accept="image/*" className="p-2 border" />
            
            {/* Image Previews */}
            {previews.length > 0 && (
                <div className="mt-4 flex gap-4 overflow-x-auto">
                    {previews.map((src, index) => (
                        <div key={index} className="w-24 h-24 border rounded-lg overflow-hidden shadow-sm">
                            <img src={src} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>
            )}
        </div>

        <div className="md:col-span-2 text-center mt-6">
            <button type="submit" className="btn btn-primary w-full md:w-1/2 text-xl">Save Profile</button>
        </div>
      </form>
    </div>
  );
};

export default CreateProfile;
