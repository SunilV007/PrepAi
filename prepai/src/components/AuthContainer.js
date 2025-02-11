import React from 'react';

const AuthContainer = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full flex flex-col md:flex-row gap-8 items-center">
        {/* Welcome Section */}
        <div className="w-full md:w-1/2 text-white space-y-6">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              PrepAI
            </h1>
            <h2 className="text-2xl font-semibold">Your Personal Interview Coach</h2>
            <p className="text-gray-300 leading-relaxed">
              Master your interview skills with PrepAI, an advanced AI-powered interview preparation platform. Practice with realistic scenarios, receive instant feedback, and track your progress.
            </p>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-gray-300">Personalized interview simulations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <span className="text-gray-300">Real-time feedback and analysis</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500/10 rounded-lg">
                <svg className="w-5 h-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <span className="text-gray-300">Industry-specific questions</span>
            </div>
          </div>
        </div>

        {/* Auth Form Section */}
        <div className="w-full md:w-1/2">
          <div className="bg-gray-800/50 backdrop-blur-lg p-8 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-2xl text-white font-bold mb-6 text-center">{title}</h2>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthContainer;