'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import Navbar from '../../components/Navbar';
import Post from '../../components/Post';
import Image from 'next/image';
import Link from 'next/link';
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

interface Friend {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: 'online' | 'offline';
}

interface PostType {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  timestamp: string;
  likes: number;
  comments: any[];
}

export default function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState<Partial<User>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'about' | 'posts' | 'friends' | 'photos'>('about');
  const [userPosts, setUserPosts] = useState<PostType[]>([]);
  const [userFriends, setUserFriends] = useState<Friend[]>([]);
  const [showProfilePicture, setShowProfilePicture] = useState(false);
  const [highlightedPostId, setHighlightedPostId] = useState<string | null>(null);

  const isOwnProfile = currentUser?.id === resolvedParams.id;

  useEffect(() => {
    if (!currentUser) {
      router.push('/login');
      return;
    }
    fetchProfile();
    fetchUserPosts();
    fetchUserFriends();
  }, [currentUser, resolvedParams.id, router]);

  // Clear highlighted post after 3 seconds
  useEffect(() => {
    if (highlightedPostId) {
      const timer = setTimeout(() => {
        setHighlightedPostId(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [highlightedPostId]);

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

  const fetchUserPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/posts');
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const allPosts = await response.json();
      const filtered = allPosts.filter((post: PostType) => post.userId === resolvedParams.id);
      setUserPosts(filtered);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const fetchUserFriends = async () => {
    try {
      const response = await fetch(`http://localhost:3001/api/friends/${resolvedParams.id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUserFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
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

      {/* Profile Picture Modal */}
      {showProfilePicture && profileUser && (
        <div 
          className="fixed inset-0 bg-white z-50 flex items-center justify-center p-4"
          onClick={() => setShowProfilePicture(false)}
        >
          <button
            onClick={() => setShowProfilePicture(false)}
            className="absolute top-4 right-4 text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-full p-2 transition-colors z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-4xl max-h-[90vh] relative">
            <div className="bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-200">
              {/* Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {profileUser.avatar && (
                    <Image
                      src={profileUser.avatar}
                      alt={profileUser.name}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div>
                  <h3 className="text-gray-800 font-semibold">{profileUser.name}</h3>
                  <p className="text-gray-500 text-sm">Profile Picture</p>
                </div>
              </div>
              
              {/* Image */}
              <div className="relative bg-gray-50" onClick={(e) => e.stopPropagation()}>
                {profileUser.avatar ? (
                  <img
                    src={profileUser.avatar}
                    alt={profileUser.name}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                ) : (
                  <div className="w-full h-96 flex items-center justify-center text-gray-400 text-6xl font-semibold bg-gray-100">
                    {profileUser.name.charAt(0)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
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
                  <div 
                    onClick={() => !isEditing && setShowProfilePicture(true)}
                    className={`relative w-40 h-40 rounded-full border-4 border-white overflow-hidden bg-gray-200 shadow-lg ${!isEditing && 'cursor-pointer hover:opacity-90 transition-opacity'}`}
                  >
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
                <button
                  onClick={() => setActiveTab('about')}
                  className={`font-semibold py-3 transition-colors ${
                    activeTab === 'about'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 rounded-lg'
                  }`}
                >
                  About
                </button>
                <button
                  onClick={() => setActiveTab('posts')}
                  className={`font-semibold py-3 transition-colors ${
                    activeTab === 'posts'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 rounded-lg'
                  }`}
                >
                  Posts
                </button>
                <button
                  onClick={() => setActiveTab('friends')}
                  className={`font-semibold py-3 transition-colors ${
                    activeTab === 'friends'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 rounded-lg'
                  }`}
                >
                  Friends
                </button>
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`font-semibold py-3 transition-colors ${
                    activeTab === 'photos'
                      ? 'text-blue-600 border-b-4 border-blue-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-4 rounded-lg'
                  }`}
                >
                  Photos
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Profile Content */}
        <div className="mt-6 px-4">
          {/* About Tab */}
          {activeTab === 'about' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Posts</h2>
              {userPosts.length > 0 ? (
                <div className="space-y-4">
                  {userPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="border border-gray-200 rounded-lg p-4">
                      <p className="text-gray-800 mb-2">{post.content}</p>
                      {post.image && (
                        <div className="relative h-48 rounded-lg overflow-hidden bg-gray-200">
                          <img src={post.image} alt="Post" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                        <span>{post.likes} likes</span>
                        <span>{post.comments.length} comments</span>
                      </div>
                    </div>
                  ))}
                  <button
                    onClick={() => setActiveTab('posts')}
                    className="w-full py-2 text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    View All Posts
                  </button>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <p>No posts to show</p>
                </div>
              )}
            </div>
          </div>
        </div>
          )}

          {/* Posts Tab */}
          {activeTab === 'posts' && (
            <div className="max-w-2xl mx-auto space-y-6">
              {userPosts.length > 0 ? (
                userPosts.map(post => (
                  <div 
                    key={post.id} 
                    id={`post-${post.id}`}
                    className={`transition-all ${
                      highlightedPostId === post.id 
                        ? 'ring-4 ring-blue-400 ring-opacity-50 rounded-xl' 
                        : ''
                    }`}
                  >
                    <Post post={post} onUpdate={fetchUserPosts} />
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-xl shadow-md p-12 text-center">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">No posts yet</h3>
                  <p className="text-gray-600">
                    {isOwnProfile ? "You haven't posted anything yet" : `${profileUser?.name} hasn't posted anything yet`}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Friends Tab */}
          {activeTab === 'friends' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Friends ({userFriends.length})
              </h2>
              {userFriends.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {userFriends.map(friend => (
                    <Link
                      key={friend.id}
                      href={`/profile/${friend.friendId}`}
                      className="group"
                    >
                      <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-200 mb-2">
                        {friend.friendAvatar && (
                          <Image
                            src={friend.friendAvatar}
                            alt={friend.friendName}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform"
                          />
                        )}
                        {friend.status === 'online' && (
                          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <p className="font-semibold text-gray-800 text-sm truncate group-hover:text-blue-600">
                        {friend.friendName}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                  <p>No friends to show</p>
                </div>
              )}
            </div>
          )}

          {/* Photos Tab */}
          {activeTab === 'photos' && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Photos</h2>
              {userPosts.filter(p => p.image).length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {userPosts
                    .filter(post => post.image)
                    .map(post => (
                      <div 
                        key={post.id} 
                        onClick={() => {
                          setActiveTab('posts');
                          setHighlightedPostId(post.id);
                          // Scroll to post after a brief delay to let the tab switch
                          setTimeout(() => {
                            const element = document.getElementById(`post-${post.id}`);
                            if (element) {
                              element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }
                          }, 100);
                        }}
                        className="rounded-lg overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                      >
                        <img
                          src={post.image}
                          alt="Photo"
                          className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            console.error('Image failed to load:', post.image);
                            e.currentTarget.src = 'https://via.placeholder.com/400x400?text=Image+Not+Found';
                          }}
                        />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-600">
                  <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p>No photos to show</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

