'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

const mockGames = [
  {
    id: '1',
    title: 'Ocean Quest',
    category: 'Adventure',
    players: '2.4M',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400&h=300&fit=crop',
    rating: 4.8,
  },
  {
    id: '2',
    title: 'Island Survival',
    category: 'Strategy',
    players: '1.8M',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    rating: 4.6,
  },
  {
    id: '3',
    title: 'Beach Volleyball Pro',
    category: 'Sports',
    players: '950K',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop',
    rating: 4.5,
  },
  {
    id: '4',
    title: 'Underwater Explorer',
    category: 'Simulation',
    players: '3.2M',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    rating: 4.9,
  },
  {
    id: '5',
    title: 'Tropical Paradise Builder',
    category: 'Casual',
    players: '5.1M',
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=300&fit=crop',
    rating: 4.7,
  },
  {
    id: '6',
    title: 'Sea Creature Rescue',
    category: 'Puzzle',
    players: '1.2M',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=300&fit=crop',
    rating: 4.4,
  },
];

const playingNow = [
  { name: 'Sarah Johnson', game: 'Ocean Quest', avatar: 'https://i.pravatar.cc/150?img=5' },
  { name: 'David Martinez', game: 'Underwater Explorer', avatar: 'https://i.pravatar.cc/150?img=13' },
  { name: 'Mike Wilson', game: 'Beach Volleyball Pro', avatar: 'https://i.pravatar.cc/150?img=33' },
];

export default function GamingPage() {
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
              <h1 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <svg className="w-8 h-8 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-2.22l.123.489.804.804A1 1 0 0113 18H7a1 1 0 01-.707-1.707l.804-.804L7.22 15H5a2 2 0 01-2-2V5zm5.771 7H5V5h10v7H8.771z" clipRule="evenodd" />
                </svg>
                Gaming
              </h1>
              
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg bg-purple-50 text-purple-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Play Games</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 6V5a3 3 0 013-3h2a3 3 0 013 3v1h2a2 2 0 012 2v3.57A22.952 22.952 0 0110 13a22.95 22.95 0 01-8-1.43V8a2 2 0 012-2h2zm2-1a1 1 0 011-1h2a1 1 0 011 1v1H8V5zm1 5a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clipRule="evenodd" />
                    <path d="M2 13.692V16a2 2 0 002 2h12a2 2 0 002-2v-2.308A24.974 24.974 0 0110 15c-2.796 0-5.487-.46-8-1.308z" />
                  </svg>
                  <span className="font-semibold">Gaming Feed</span>
                </button>

                <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-800">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="font-semibold">Tournaments</span>
                </button>
              </div>

              <hr className="my-4" />

              <div>
                <h3 className="font-semibold text-gray-800 mb-3">Friends Playing Now</h3>
                <div className="space-y-3">
                  {playingNow.map((player, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <div className="relative">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src={player.avatar}
                            alt={player.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">{player.name}</p>
                        <p className="text-xs text-gray-500 truncate">{player.game}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            {/* Featured Game */}
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="relative h-80 bg-gradient-to-br from-purple-600 to-blue-600">
                <img
                  src="https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=1200&h=400&fit=crop"
                  alt="Featured"
                  className="w-full h-full object-cover opacity-50"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-4xl font-bold mb-2">Ocean Quest</h2>
                    <p className="text-xl mb-4">Dive into an underwater adventure</p>
                    <button className="px-8 py-3 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-100 transition-colors">
                      Play Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Popular Games */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Popular Games</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockGames.map(game => (
                  <div key={game.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow cursor-pointer group">
                    <div className="relative h-48 bg-gray-200">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                      <div className="absolute top-2 right-2 bg-yellow-400 text-gray-800 px-2 py-1 rounded text-sm font-semibold flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {game.rating}
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{game.title}</h3>
                          <p className="text-sm text-gray-500">{game.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{game.players} players</span>
                        <button className="px-4 py-1.5 bg-purple-600 text-white rounded-lg text-sm font-semibold hover:bg-purple-700 transition-colors">
                          Play
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Browse by Category</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['Action', 'Adventure', 'Puzzle', 'Strategy', 'Sports', 'Casual', 'Simulation', 'Racing'].map(category => (
                  <button
                    key={category}
                    className="bg-white rounded-xl shadow-md p-6 hover:shadow-xl transition-shadow text-center group"
                  >
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                      <svg className="w-8 h-8 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h3 className="font-semibold text-gray-800">{category}</h3>
                  </button>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

