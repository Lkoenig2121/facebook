'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Image from 'next/image';
import Link from 'next/link';

interface Friend {
  id: string;
  userId: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  status: 'online' | 'offline';
}

interface FriendRequest {
  id: string;
  name: string;
  avatar: string;
  mutualFriends: number;
}

export default function FriendsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [friends, setFriends] = useState<Friend[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'requests' | 'suggestions'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    fetchFriends();
  }, [user, router]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/friends/${user.id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    }
  };

  const mockRequests: FriendRequest[] = [
    {
      id: '1',
      name: 'Jessica Williams',
      avatar: 'https://i.pravatar.cc/150?img=48',
      mutualFriends: 12,
    },
    {
      id: '2',
      name: 'Robert Davis',
      avatar: 'https://i.pravatar.cc/150?img=17',
      mutualFriends: 8,
    },
  ];

  const mockSuggestions: FriendRequest[] = [
    {
      id: '3',
      name: 'Amanda Taylor',
      avatar: 'https://i.pravatar.cc/150?img=31',
      mutualFriends: 15,
    },
    {
      id: '4',
      name: 'Chris Anderson',
      avatar: 'https://i.pravatar.cc/150?img=68',
      mutualFriends: 6,
    },
    {
      id: '5',
      name: 'Michelle Lee',
      avatar: 'https://i.pravatar.cc/150?img=25',
      mutualFriends: 20,
    },
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-6 px-4 pb-12">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Friends</h1>
              
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab('all')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">All Friends</p>
                    <p className="text-xs text-gray-500">{friends.length} friends</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('requests')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'requests' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Friend Requests</p>
                    <p className="text-xs text-gray-500">{mockRequests.length} requests</p>
                  </div>
                </button>

                <button
                  onClick={() => setActiveTab('suggestions')}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    activeTab === 'suggestions' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M11 6a3 3 0 11-6 0 3 3 0 016 0zM14 17a6 6 0 00-12 0h12zM13 8a1 1 0 100 2h4a1 1 0 100-2h-4z" />
                  </svg>
                  <div className="flex-1 text-left">
                    <p className="font-semibold">Suggestions</p>
                    <p className="text-xs text-gray-500">{mockSuggestions.length} suggestions</p>
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {activeTab === 'all' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-800">
                    All Friends ({friends.length})
                  </h2>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {friends.map(friend => (
                    <Link
                      key={friend.id}
                      href={`/profile/${friend.friendId}`}
                      className="border border-gray-200 rounded-xl p-4 hover:shadow-lg transition-shadow"
                    >
                      <div className="relative w-full aspect-square rounded-lg overflow-hidden mb-3 bg-gray-200">
                        {friend.friendAvatar && (
                          <Image
                            src={friend.friendAvatar}
                            alt={friend.friendName}
                            fill
                            className="object-cover"
                          />
                        )}
                        {friend.status === 'online' && (
                          <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-800 mb-1">{friend.friendName}</h3>
                      <p className="text-sm text-gray-500">{friend.status === 'online' ? 'Active now' : 'Offline'}</p>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'requests' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  Friend Requests ({mockRequests.length})
                </h2>

                <div className="space-y-4">
                  {mockRequests.map(request => (
                    <div key={request.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                          <Image
                            src={request.avatar}
                            alt={request.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{request.name}</h3>
                          <p className="text-sm text-gray-500">{request.mutualFriends} mutual friends</p>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          Confirm
                        </button>
                        <button className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg font-semibold hover:bg-gray-300 transition-colors">
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'suggestions' && (
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-6">
                  People You May Know
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border border-gray-200 rounded-xl overflow-hidden">
                      <div className="relative w-full aspect-square bg-gray-200">
                        <Image
                          src={suggestion.avatar}
                          alt={suggestion.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-800 mb-1">{suggestion.name}</h3>
                        <p className="text-sm text-gray-500 mb-3">{suggestion.mutualFriends} mutual friends</p>
                        <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                          Add Friend
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}

