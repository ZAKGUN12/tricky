import { useState } from 'react';
import ActivityFeed from '../components/ActivityFeed';
import TrendingTricks from '../components/TrendingTricks';
import NotificationBell from '../components/NotificationBell';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold text-gray-900">TrickShare</h1>
            <NotificationBell />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
          <div>
            <TrendingTricks />
          </div>
        </div>
      </main>
    </div>
  );
}
