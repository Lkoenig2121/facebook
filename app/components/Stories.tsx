'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Story {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  image: string;
  timestamp: string;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);

  useEffect(() => {
    fetch('http://localhost:3001/api/stories')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => setStories(data))
      .catch(err => {
        console.error('Error fetching stories:', err);
        setStories([]);
      });
  }, []);

  const openStory = (story: Story) => {
    setSelectedStory(story);
  };

  const closeStory = () => {
    setSelectedStory(null);
  };

  return (
    <>
      <div className="bg-white rounded-xl shadow-md p-4 mb-6">
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {/* Create Story Card */}
          <div className="flex-shrink-0 w-32">
            <div className="relative h-48 rounded-xl overflow-hidden bg-gradient-to-br from-purple-400 to-pink-500 cursor-pointer hover:scale-105 transition-transform">
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="text-sm font-semibold">Create Story</span>
              </div>
            </div>
          </div>

          {/* Story Cards */}
          {stories.map(story => (
            <div
              key={story.id}
              onClick={() => openStory(story)}
              className="flex-shrink-0 w-32 cursor-pointer group"
            >
              <div className="relative h-48 rounded-xl overflow-hidden bg-gray-200">
                {story.image ? (
                  <Image
                    src={story.image}
                    alt={story.userName}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60"></div>
                {/* User avatar */}
                <div className="absolute top-3 left-3 w-10 h-10 rounded-full border-4 border-blue-500 overflow-hidden bg-gray-200">
                  {story.userAvatar ? (
                    <Image
                      src={story.userAvatar}
                      alt={story.userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 text-xs font-semibold">
                      {story.userName.charAt(0)}
                    </div>
                  )}
                </div>
                {/* User name */}
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white text-sm font-semibold drop-shadow-lg line-clamp-2">
                    {story.userName}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {selectedStory && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4">
          <button
            onClick={closeStory}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div className="max-w-lg w-full max-h-[90vh] relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gray-600 z-10">
              <div className="h-full bg-white w-full animate-pulse"></div>
            </div>

            {/* Story content */}
            <div className="relative w-full h-[80vh] rounded-lg overflow-hidden bg-gray-900">
              {selectedStory.image ? (
                <Image
                  src={selectedStory.image}
                  alt={selectedStory.userName}
                  fill
                  className="object-contain"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white">
                  No Image Available
                </div>
              )}
              
              {/* User info overlay */}
              <div className="absolute top-4 left-4 flex items-center space-x-3 z-10">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white bg-gray-200">
                  {selectedStory.userAvatar ? (
                    <Image
                      src={selectedStory.userAvatar}
                      alt={selectedStory.userName}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                      {selectedStory.userName.charAt(0)}
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-white font-semibold drop-shadow-lg">{selectedStory.userName}</p>
                  <p className="text-white text-sm drop-shadow-lg">
                    {new Date(selectedStory.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

