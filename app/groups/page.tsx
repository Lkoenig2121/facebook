'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Image from 'next/image';

const mockGroups = [
  {
    id: '1',
    name: 'Bahamas Snorkeling Community',
    members: '12.5K',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    description: 'A community for snorkeling enthusiasts in the Bahamas',
    lastActive: '5 minutes ago',
  },
  {
    id: '2',
    name: 'Manchester Tech Meetup',
    members: '8.2K',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=300&fit=crop',
    description: 'Connect with tech professionals in Manchester',
    lastActive: '1 hour ago',
  },
  {
    id: '3',
    name: 'Ocean Conservation Alliance',
    members: '45.6K',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop',
    description: 'Protecting our oceans for future generations',
    lastActive: '30 minutes ago',
  },
  {
    id: '4',
    name: 'Beach Yoga & Wellness',
    members: '6.8K',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    description: 'Mindfulness and wellness by the ocean',
    lastActive: '2 hours ago',
  },
  {
    id: '5',
    name: 'Travel Photography Club',
    members: '23.4K',
    image: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop',
    description: 'Share your best travel photos and tips',
    lastActive: '15 minutes ago',
  },
];

const suggestedGroups = [
  {
    id: '6',
    name: 'Underwater Photography',
    members: '18.9K',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
  },
  {
    id: '7',
    name: 'Island Life & Culture',
    members: '9.3K',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
  },
];

export default function GroupsPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto pt-6 px-4 pb-12">
        <div className="flex gap-6">
          {/* Left Sidebar */}
          <aside className="w-80 flex-shrink-0 hidden lg:block">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-20">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Groups</h1>
              
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  <span className="font-semibold">Your Feed</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Discover</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                  </svg>
                  <span className="font-semibold">Your Groups</span>
                </button>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Groups You've Joined</h3>
                <div className="space-y-2">
                  {mockGroups.slice(0, 3).map(group => (
                    <div key={group.id} className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 cursor-pointer">
                      <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                        <Image
                          src={group.image}
                          alt={group.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{group.name}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Your Groups */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Your Groups</h2>
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                  + Create New Group
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockGroups.map(group => (
                  <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-40 bg-gray-200">
                      <Image
                        src={group.image}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-1">{group.name}</h3>
                      <p className="text-sm text-gray-600 mb-2">{group.description}</p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                          </svg>
                          {group.members} members
                        </span>
                        <span>Last active {group.lastActive}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Groups */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Suggested For You</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {suggestedGroups.map(group => (
                  <div key={group.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                    <div className="relative h-40 bg-gray-200">
                      <Image
                        src={group.image}
                        alt={group.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">{group.name}</h3>
                      <p className="text-sm text-gray-500 mb-3">{group.members} members</p>
                      <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                        Join Group
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

