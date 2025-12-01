'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuth } from '../context/AuthContext';

interface User {
  id: string;
  email: string;
  name: string;
  avatar: string;
}

export default function LoginPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { setUser: setAuthUser } = useAuth();

  useEffect(() => {
    // Fetch all users for the login screen
    fetch('http://localhost:3001/api/users')
      .then(res => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const contentType = res.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Response is not JSON');
        }
        return res.json();
      })
      .then(data => setUsers(data))
      .catch(err => {
        console.error('Error fetching users:', err);
        console.error('Make sure the backend server is running on http://localhost:3001');
      });
  }, []);

  const handleLogin = async () => {
    if (!selectedUser) return;

    setLoading(true);
    const user = users.find(u => u.id === selectedUser);
    
    if (user) {
      try {
        console.log('Attempting login for:', user.email);
        const response = await fetch('http://localhost:3001/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: user.email, password: 'password123' }),
        });
        
        console.log('Login response status:', response.status);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Login response data:', data);
        
        if (data.success && data.user) {
          // Store user in localStorage
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          console.log('User stored in localStorage');
          
          // Update auth context
          setAuthUser(data.user);
          console.log('Auth context updated, redirecting...');
          
          // Navigate to home
          setTimeout(() => {
            router.push('/');
          }, 100);
        } else {
          console.error('Login failed:', data.message || 'Unknown error');
          alert('Login failed. Please try again.');
        }
      } catch (error) {
        console.error('Login error:', error);
        alert(`Login error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-4">facebook</h1>
          <p className="text-xl text-gray-700">Connect with friends and the world around you</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Select a User to Login
          </h2>

          <div className="space-y-3 mb-6">
            {users.map(user => (
              <div
                key={user.id}
                onClick={() => setSelectedUser(user.id)}
                className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedUser === user.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4 flex-shrink-0 bg-gray-200">
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
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{user.name}</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
                {selectedUser === user.id && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            onClick={handleLogin}
            disabled={!selectedUser || loading}
            className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${
              !selectedUser || loading
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
            }`}
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl">
            <p className="text-sm text-gray-600 text-center">
              <span className="font-semibold">Demo Account:</span> Select any user above
              <br />
              <span className="text-xs">All accounts use password: password123</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>Manchester Facebook Clone © 2025</p>
        </div>
      </div>
    </div>
  );
}

