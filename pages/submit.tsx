import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuthenticator } from '@aws-amplify/ui-react';
import AuthWrapper from '../components/AuthWrapper';

const countries = [
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'JP', name: '🇯🇵 Japan' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'FR', name: '🇫🇷 France' },
  { code: 'IT', name: '🇮🇹 Italy' },
  { code: 'GB', name: '🇬🇧 United Kingdom' },
  { code: 'ES', name: '🇪🇸 Spain' },
  { code: 'CA', name: '🇨🇦 Canada' }
];

const popularTags = [
  'cooking', 'cleaning', 'productivity', 'health', 'tech', 'travel', 
  'money', 'fitness', 'study', 'work', 'home'
];

function SubmitForm() {
  const router = useRouter();
  const { user } = useAuthenticator();
  const [form, setForm] = useState({
    title: '',
    description: '',
    steps: ['', '', ''],
    countryCode: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.steps[0] || !form.countryCode) {
      alert('Please fill in all required fields');
      return;
    }
    
    setSubmitting(true);
    
    const trick = {
      ...form,
      languageCode: 'en',
      authorId: user?.userId,
      authorName: user?.signInDetails?.loginId?.split('@')[0] || 'Anonymous',
      steps: form.steps.filter(step => step.trim()),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trick)
      });

      if (response.ok) {
        router.push('/');
      } else {
        throw new Error('Failed to submit');
      }
    } catch (error) {
      alert('Failed to submit trick. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const addTag = (tag: string) => {
    const currentTags = form.tags.split(',').map(t => t.trim()).filter(Boolean);
    if (!currentTags.includes(tag)) {
      setForm({...form, tags: [...currentTags, tag].join(', ')});
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Share Your Trick</h1>
        <p>Help others with your life hack</p>
        <div style={{ marginTop: '15px', fontSize: '14px', opacity: 0.9 }}>
          Signed in as: {user?.signInDetails?.loginId}
        </div>
      </header>
      
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Trick Title *</label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g., Perfect Coffee Brewing Technique"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            maxLength={100}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Description *</label>
          <textarea
            className="form-textarea"
            placeholder="Brief description of what this trick does and why it's useful..."
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            maxLength={200}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Steps (max 3) *</label>
          {form.steps.map((step, i) => (
            <input
              key={i}
              className="form-input"
              type="text"
              placeholder={`Step ${i + 1}${i === 0 ? ' (required)' : ' (optional)'}`}
              value={step}
              onChange={(e) => {
                const newSteps = [...form.steps];
                newSteps[i] = e.target.value;
                setForm({...form, steps: newSteps});
              }}
              maxLength={150}
              required={i === 0}
              style={{ marginBottom: '10px' }}
            />
          ))}
        </div>
        
        <div className="form-group">
          <label className="form-label">Country *</label>
          <select
            className="form-select"
            value={form.countryCode}
            onChange={(e) => setForm({...form, countryCode: e.target.value})}
            required
          >
            <option value="">Select your country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="form-group">
          <label className="form-label">Tags</label>
          <input
            className="form-input"
            type="text"
            placeholder="cooking, productivity, health..."
            value={form.tags}
            onChange={(e) => setForm({...form, tags: e.target.value})}
          />
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>Popular tags:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {popularTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  className="tag"
                  style={{ cursor: 'pointer' }}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          className="submit-btn"
          disabled={submitting}
        >
          {submitting ? 'Sharing...' : 'Share My Trick'}
        </button>
      </form>
    </div>
  );
}

export default function Submit() {
  return (
    <AuthWrapper>
      <SubmitForm />
    </AuthWrapper>
  );
}
