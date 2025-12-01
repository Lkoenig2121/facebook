'use client';

import { useAuth } from '../context/AuthContext';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Left - Logo and Search */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-3xl font-bold text-blue-600">
              facebook
            </Link>
            <div className="hidden md:block">
              <input
                type="text"
                placeholder="Search Facebook"
                className="bg-gray-100 rounded-full px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Center - Navigation */}
          <div className="hidden md:flex space-x-2">
            <Link
              href="/"
              className={`px-8 py-2 rounded-lg transition-colors ${
                pathname === '/' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <svg className="w-7 h-7 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              </svg>
            </Link>
          </div>

          {/* Right - Profile Menu */}
          <div className="flex items-center space-x-3">
            <Link
              href={`/profile/${user.id}`}
              className={`flex items-center space-x-2 px-3 py-1.5 rounded-full transition-colors ${
                pathname?.startsWith('/profile') ? 'bg-blue-50' : 'hover:bg-gray-100'
              }`}
            >
              <div className="relative w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                {user.avatar ? (
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-500 font-semibold">
                    {user.name.charAt(0)}
                  </div>
                )}
              </div>
              <span className="hidden md:inline font-semibold text-gray-800">{user.name}</span>
            </Link>
            
            <button
              onClick={logout}
              className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
              title="Logout"
            >
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

