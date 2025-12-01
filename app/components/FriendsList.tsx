'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
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

export default function FriendsList() {
  const { user } = useAuth();
  const [friends, setFriends] = useState<Friend[]>([]);

  useEffect(() => {
    if (user) {
      fetchFriends();
    }
  }, [user]);

  const fetchFriends = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`http://localhost:3001/api/friends/${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      const data = await response.json();
      setFriends(data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setFriends([]);
    }
  };

  if (!user) return null;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800">Friends</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-semibold">
          See All
        </button>
      </div>

      <div className="space-y-3">
        {friends.length === 0 ? (
          <p className="text-gray-500 text-sm text-center py-4">No friends yet</p>
        ) : (
          friends.map(friend => (
            <Link
              key={friend.id}
              href={`/profile/${friend.friendId}`}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="relative">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {friend.friendAvatar ? (
                    <Image
                      src={friend.friendAvatar}
                      alt={friend.friendName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                      {friend.friendName.charAt(0)}
                    </div>
                  )}
                </div>
                {/* Online status indicator */}
                {friend.status === 'online' && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">
                  {friend.friendName}
                </p>
                <p className="text-xs text-gray-500">
                  {friend.status === 'online' ? 'Active now' : 'Offline'}
                </p>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

