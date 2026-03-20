import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { API_BASE } from '../../api';

const AdminDashboard = () => {
  const [profiles, setProfiles] = useState([]);
  const [reports, setReports] = useState([]);

  const fetchData = async () => {
      try {
          const pRes = await axios.get(`${API_BASE}/api/admin/profiles`);
          setProfiles(pRes.data);
          const rRes = await axios.get(`${API_BASE}/api/admin/reports`);
          setReports(rRes.data);
      } catch (err) {
          console.error(err);
      }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async (id) => {
      await axios.put(`${API_BASE}/api/admin/approve/${id}`);
      fetchData();
  };

  const handleUnapprove = async (id) => {
      await axios.put(`${API_BASE}/api/admin/unapprove/${id}`);
      fetchData();
  };

  const handleDelete = async (id) => {
      if(!window.confirm('Delete this profile permanently?')) return;
      await axios.delete(`${API_BASE}/api/admin/profile/${id}`);
      fetchData();
  };

  const handleDismissReport = async (id) => {
      await axios.delete(`${API_BASE}/api/admin/report/${id}`);
      fetchData();
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-primary">Admin Dashboard</h1>

      {/* Reports Section */}
      <div className="mb-10">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Reported Profiles ({reports.length})</h2>
          {reports.length === 0 ? <p>No reports.</p> : (
              <div className="bg-white shadow rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                          <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Profile ID</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                          {reports.map(report => (
                              <tr key={report._id}>
                                  <td className="px-6 py-4">{report.reason}</td>
                                  <td className="px-6 py-4">{report.profileId?.name || report.profileId}</td>
                                  <td className="px-6 py-4">{new Date(report.createdAt).toLocaleDateString()}</td>
                                  <td className="px-6 py-4 text-right space-x-2">
                                      <button onClick={() => handleDelete(report.profileId?._id)} className="text-red-600 hover:text-red-900">Delete Profile</button>
                                      <button onClick={() => handleDismissReport(report._id)} className="text-gray-600 hover:text-gray-900">Dismiss</button>
                                  </td>
                              </tr>
                          ))}
                      </tbody>
                  </table>
              </div>
          )}
      </div>

      {/* Profiles Section */}
      <div>
          <h2 className="text-2xl font-bold mb-4">All Profiles</h2>
          <div className="bg-white shadow rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                      <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mobile</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                      {profiles.map(profile => (
                          <tr key={profile._id}>
                              <td className="px-6 py-4">
                                  <div className="font-bold">{profile.name}</div>
                                  <div className="text-sm text-gray-500">{profile.village}, {profile.district}</div>
                              </td>
                              <td className="px-6 py-4">
                                  {profile.isApproved ? (
                                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">Approved</span>
                                  ) : (
                                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">Pending</span>
                                  )}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">{profile.mobile}</td>
                              <td className="px-6 py-4 text-right space-x-2">
                                  {!profile.isApproved && (
                                      <button onClick={() => handleApprove(profile._id)} className="text-green-600 hover:text-green-900 font-bold">Approve</button>
                                  )}
                                  {profile.isApproved && (
                                      <button onClick={() => handleUnapprove(profile._id)} className="text-yellow-600 hover:text-yellow-900 font-bold">Unapprove</button>
                                  )}
                                  <button onClick={() => handleDelete(profile._id)} className="text-red-600 hover:text-red-900">Delete</button>
                              </td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
