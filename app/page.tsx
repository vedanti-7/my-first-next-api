'use client';

import { useState } from 'react';

export default function AuthPage() {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [message, setMessage] = useState<{ text: string; isError: boolean } | null>(null);
  const [userData, setUserData] = useState<any>(null);

  const showFeedback = (text: string, isError = false) => {
    setMessage({ text, isError });
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    const endpoint = isRegistering ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        showFeedback(data.error || 'Something went wrong', true);
      } else {
        showFeedback(data.message || 'Success!', false);
        if (!isRegistering) {
          fetchDashboardData();
        }
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      showFeedback('Network error occurred', true);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch('/api/protected/dashboard');
      const data = await response.json();

      if (!response.ok) {
        showFeedback(`Failed to fetch secure route details: (Status ${response.status}) ${data.error}`, true);
        setUserData(null);
      } else {
        setUserData(data);
        showFeedback('Successfully authenticated and fetched data!', false);
      }
    } catch (error) {
      showFeedback('Could not reach protected route', true);
    }
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 flex flex-col items-center justify-center p-6">
      <div className="max-w-md w-full space-y-8 bg-slate-800 p-8 rounded-2xl shadow-xl border border-slate-700">
        
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
            {isRegistering ? 'Create your Account' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            {isRegistering ? 'Register to access isolated resources' : 'Sign in to access your dashboard'}
          </p>
        </div>

        {message && (
          <div className={`p-4 rounded-lg text-sm border ${
            message.isError 
              ? 'bg-rose-900/30 border-rose-800 text-rose-300' 
              : 'bg-emerald-900/30 border-emerald-800 text-emerald-300'
          }`}>
            {message.text}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleAuthSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email-address" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="you@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none relative block w-full px-3 py-3 mt-1 border border-slate-600 bg-slate-700 placeholder-slate-400 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent sm:text-sm"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-lg text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-blue-500 transition-colors duration-200"
            >
              {isRegistering ? 'Sign Up' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <button
            onClick={() => {
              setIsRegistering(!isRegistering);
              setMessage(null);
            }}
            className="text-sm text-blue-400 hover:underline focus:outline-none"
          >
            {isRegistering ? 'Already have an account? Sign In' : "Don't have an account? Register"}
          </button>
        </div>

        <div className="border-t border-slate-700 my-6"></div>

        <div className="space-y-4">
          <h3 className="text-md font-bold text-slate-200">Test Server-Side Protection</h3>
          <p className="text-xs text-slate-400">
            Click below to fetch the protected route. If you are authenticated, your details will display dynamically.
          </p>
          <button
            onClick={fetchDashboardData}
            className="w-full py-2 px-4 border border-dashed border-slate-600 rounded-lg text-xs font-semibold hover:border-slate-400 text-slate-300 transition-colors duration-150"
          >
            Trigger Secure Route Request
          </button>

          {userData && (
            <div className="mt-4 p-4 bg-slate-900 rounded-lg border border-indigo-500/30 text-xs space-y-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                🔒 Secure Context Loaded
              </span>
              <p className="text-slate-200 font-bold mt-1">{userData.message}</p>
              <pre className="bg-black/50 p-3 rounded overflow-x-auto text-emerald-400 text-[10px]">
                {JSON.stringify(userData, null, 2)}
              </pre>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}