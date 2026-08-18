import React, { useEffect, useState } from 'react';
import axiosClient from '../api/axiosClient';
import { User, Mail, MapPin, ShieldCheck } from 'lucide-react';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosClient
      .get('/users/profile')
      .then((res) => setProfile(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-20 text-slate-500">Loading profile...</div>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Profile</h1>
        <p className="text-sm text-slate-500">Your account information</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-6">
        <div className="flex items-center space-x-4 border-b border-slate-100 pb-6">
          <div className="w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-2xl">
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{profile?.name}</h2>
            <span className="inline-flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full mt-1">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" /> Active Account
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 text-sm">
          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <Mail className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Email Address</p>
              <p className="font-semibold text-slate-700">{profile?.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl">
            <MapPin className="w-5 h-5 text-slate-400" />
            <div>
              <p className="text-xs text-slate-400 font-medium">Address</p>
              <p className="font-semibold text-slate-700">{profile?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}