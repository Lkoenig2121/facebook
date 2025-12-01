'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Image from 'next/image';
import { use } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
  coverPhoto: string;
  bio: string;
  location: string;
  work: string;
  education: string;
  relationship: string;
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);

  const isOwnProfile = currentUser?.id === resolvedParams.id;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    fetchProfile();
  }, [currentUser, resolvedParams.id, router]);

  const fetchProfile = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${resolvedParams.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await response.json();
      setProfileUser(data);
      setEditForm(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setProfileUser(null);
    }
    setLoading(false);
  };

  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${resolvedParams.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm),
      });
      
      if (response.ok) {
        const updatedUser = await response.json();
        setProfileUser(updatedUser);
        
        // Update localStorage if editing own profile
        if (isOwnProfile) {
          localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        }
        
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!currentUser || loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-5xl mx-auto pt-6 px-4">
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <p className="text-gray-600">User not found</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-5xl mx-auto pb-12">
        {/* Cover Photo and Profile Picture */}
        <div className="bg-white rounded-b-xl shadow-md overflow-hidden">
          {/* Cover Photo */}
          <div className="relative h-96 bg-gradient-to-br from-blue-400 to-purple-500">
            {(isEditing ? (editForm.coverPhoto || profileUser.coverPhoto) : profileUser.coverPhoto) ? (
              <Image
                src={isEditing ? (editForm.coverPhoto || profileUser.coverPhoto) : profileUser.coverPhoto}
                alt="Cover photo"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white text-2xl">
                Cover Photo
              </div>
            )}
            {isEditing && (
              <div className="absolute bottom-4 right-4">
                <button className="bg-white px-4 py-2 rounded-lg font-semibold shadow-lg hover:bg-gray-100 transition-colors">
                  Edit Cover Photo
                </button>
              </div>
            )}
          </div>

          {/* Profile Info */}
          <div className="px-6 pb-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between">
              {/* Profile Picture */}
              <div className="flex flex-col md:flex-row md:items-end -mt-20 mb-4 md:mb-0">
                <div className="relative">
                  <div className="relative w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg">
                    {(isEditing ? (editForm.avatar || profileUser.avatar) : profileUser.avatar) ? (
                      <Image
                        src={isEditing ? (editForm.avatar || profileUser.avatar) : profileUser.avatar}
                        alt={profileUser.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-500 text-4xl font-semibold">
                        {profileUser.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <button className="absolute bottom-2 right-2 bg-gray-200 p-2 rounded-full hover:bg-gray-300 transition-colors">
                      <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                  )}
                </div>
                <div className="md:ml-6 mt-4 md:mt-0">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editForm.name || ''}
                      onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                      className="text-3xl font-bold text-gray-800 border-2 border-blue-500 rounded-lg px-3 py-1 mb-1"
                    />
                  ) : (
                    <h1 className="text-3xl font-bold text-gray-800">{profileUser.name}</h1>
                  )}
                  {isEditing ? (
                    <textarea
                      value={editForm.bio || ''}
                      onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                      className="text-gray-600 border-2 border-blue-500 rounded-lg px-3 py-2 w-full mt-2"
                      rows={2}
                    />
                  ) : (
                    <p className="text-gray-600">{profileUser.bio}</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              {isOwnProfile && (
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSave}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                      >
                        Save Changes
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm(profileUser);
                        }}
                        className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-gray-200 text-gray-800 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                      <span>Edit Profile</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Navigation Tabs */}
            <div className="border-t border-gray-200 mt-4 pt-2">
              <div className="flex space-x-6">
                <button className="text-blue-600 font-semibold py-3 border-b-4 border-blue-600">
                  About
                </button>
                <button className="text-gray-600 hover:text-gray-800 font-semibold py-3 hover:bg-gray-100 px-4 rounded-lg transition-colors">
                  Posts
                </button>
                <button className="text-gray-600 hover:text-gray-800 font-semibold py-3 hover:bg-gray-100 px-4 rounded-lg transition-colors">
                  Friends
                </button>
                <button className="text-gray-600 hover:text-gray-800 font-semibold py-3 hover:bg-gray-100 px-4 rounded-lg transition-colors">
                  Photos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-4">
          {/* Left Column - About */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">About</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Lives in</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.location || ''}
                        onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                        className="font-semibold text-gray-800 border-2 border-blue-500 rounded px-2 py-1 w-full mt-1"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{profileUser.location}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Works at</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.work || ''}
                        onChange={(e) => setEditForm({ ...editForm, work: e.target.value })}
                        className="font-semibold text-gray-800 border-2 border-blue-500 rounded px-2 py-1 w-full mt-1"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{profileUser.work}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Studied at</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editForm.education || ''}
                        onChange={(e) => setEditForm({ ...editForm, education: e.target.value })}
                        className="font-semibold text-gray-800 border-2 border-blue-500 rounded px-2 py-1 w-full mt-1"
                      />
                    ) : (
                      <p className="font-semibold text-gray-800">{profileUser.education}</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <svg className="w-6 h-6 text-gray-600 mt-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                  </svg>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Relationship</p>
                    {isEditing ? (
                      <select
                        value={editForm.relationship || ''}
                        onChange={(e) => setEditForm({ ...editForm, relationship: e.target.value })}
                        className="font-semibold text-gray-800 border-2 border-blue-500 rounded px-2 py-1 w-full mt-1"
                      >
                        <option value="Single">Single</option>
                        <option value="In a relationship">In a relationship</option>
                        <option value="Married">Married</option>
                        <option value="It's complicated">It's complicated</option>
                      </select>
                    ) : (
                      <p className="font-semibold text-gray-800">{profileUser.relationship}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Posts */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Posts</h2>
              <div className="text-center py-12 text-gray-600">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                <p>No posts to show</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

