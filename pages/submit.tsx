import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import { getCognitoAuthUrl } from '../lib/cognito-auth';

export default function Submit() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    country: '',
    countryCode: '',
    difficulty: 'easy',
    tags: '',
    category: 'cooking'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setSubmitting(true);

    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authorName: user.username,
          authorEmail: user.email,
          steps: formData.steps.filter(step => step.trim()),
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
        })
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Failed to submit trick');
      }
    } catch (error) {
      alert('Error submitting trick');
    } finally {
      setSubmitting(false);
    }
  };

  const addStep = () => setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }));

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #581c87 0%, #1e3a8a 50%, #312e81 100%)'
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '400px',
          width: '100%',
          margin: '0 1rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: 'bold',
            color: 'white',
            marginBottom: '1rem'
          }}>🌍 Share Your Trick</h1>
          <p style={{
            color: 'rgba(255, 255, 255, 0.8)',
            marginBottom: '2rem',
            lineHeight: '1.5'
          }}>Sign in to share your amazing life tricks with the global community!</p>
          <button
            onClick={() => window.location.href = getCognitoAuthUrl()}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)',
              color: 'white',
              fontWeight: 'bold',
              padding: '1rem 1.5rem',
              borderRadius: '12px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '1.1rem',
              transition: 'all 0.2s ease',
              transform: 'scale(1)'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #a855f7 0%, #f472b6 100%)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'linear-gradient(135deg, #9333ea 0%, #ec4899 100%)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            🔐 Sign In to Share
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">🌍 Share Your Trick</h1>
            <p className="text-white/80">Welcome back, <span className="text-cyan-300">{user.name}</span>!</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white font-medium mb-2">✨ Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                placeholder="Enter your amazing trick title"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">📝 Description</label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 h-24 focus:border-cyan-400 focus:outline-none"
                placeholder="Describe your trick in detail"
              />
            </div>

            <div>
              <label className="block text-white font-medium mb-2">🔢 Steps</label>
              {formData.steps.map((step, index) => (
                <input
                  key={index}
                  type="text"
                  value={step}
                  onChange={(e) => {
                    const newSteps = [...formData.steps];
                    newSteps[index] = e.target.value;
                    setFormData(prev => ({ ...prev, steps: newSteps }));
                  }}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 mb-2 focus:border-cyan-400 focus:outline-none"
                  placeholder={`Step ${index + 1}`}
                />
              ))}
              <button 
                type="button" 
                onClick={addStep} 
                className="text-cyan-300 hover:text-cyan-200 font-medium"
              >
                ➕ Add Step
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">🌍 Country</label>
                <input
                  type="text"
                  required
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                  placeholder="Country name"
                />
              </div>
              <div>
                <label className="block text-white font-medium mb-2">🏳️ Country Code</label>
                <input
                  type="text"
                  required
                  value={formData.countryCode}
                  onChange={(e) => setFormData(prev => ({ ...prev, countryCode: e.target.value.toUpperCase() }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                  placeholder="US, TR, JP..."
                  maxLength={2}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-white font-medium mb-2">📂 Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="cooking">🍳 Cooking</option>
                  <option value="cleaning">🧹 Cleaning</option>
                  <option value="technology">📱 Technology</option>
                  <option value="health">🍎 Health</option>
                  <option value="travel">✈️ Travel</option>
                </select>
              </div>
              <div>
                <label className="block text-white font-medium mb-2">⚡ Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-white font-medium mb-2">🏷️ Tags</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                className="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/60 focus:border-cyan-400 focus:outline-none"
                placeholder="cooking, quick, easy (comma separated)"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all duration-200 disabled:opacity-50 transform hover:scale-105"
            >
              {submitting ? '🚀 Sharing...' : '🌟 Share Your Trick'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
