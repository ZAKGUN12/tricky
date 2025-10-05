import { useState } from 'react';
import { useRouter } from 'next/router';

const countries = [
  { code: 'US', name: '🇺🇸 United States' },
  { code: 'JP', name: '🇯🇵 Japan' },
  { code: 'DE', name: '🇩🇪 Germany' },
  { code: 'FR', name: '🇫🇷 France' },
  { code: 'IT', name: '🇮🇹 Italy' },
  { code: 'SE', name: '🇸🇪 Sweden' },
  { code: 'GB', name: '🇬🇧 United Kingdom' },
  { code: 'ES', name: '🇪🇸 Spain' },
  { code: 'NL', name: '🇳🇱 Netherlands' },
  { code: 'CA', name: '🇨🇦 Canada' }
];

const popularTags = [
  'cooking', 'cleaning', 'productivity', 'health', 'tech', 'travel', 
  'money', 'fitness', 'study', 'work', 'home', 'garden'
];

export default function Submit() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    steps: ['', '', ''],
    countryCode: '',
    tags: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!form.title.trim()) newErrors.title = 'Title is required';
    if (form.title.length > 100) newErrors.title = 'Title must be under 100 characters';
    
    if (!form.description.trim()) newErrors.description = 'Description is required';
    if (form.description.length > 200) newErrors.description = 'Description must be under 200 characters';
    
    if (!form.steps[0].trim()) newErrors.steps = 'At least one step is required';
    
    if (!form.countryCode) newErrors.countryCode = 'Please select a country';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    const trick = {
      ...form,
      languageCode: 'en',
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
        router.push('/?success=true');
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

  const getCharacterCount = (text: string, max: number) => {
    const remaining = max - text.length;
    const color = remaining < 20 ? '#e74c3c' : remaining < 50 ? '#f39c12' : '#27ae60';
    return <span style={{ color, fontSize: '12px' }}>{remaining} characters left</span>;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Share Your Trick</h1>
        <p>Help others with your life hack ✨</p>
      </header>
      
      <form className="form" onSubmit={handleSubmit}>
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Trick Title *
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="e.g., Perfect Coffee Brewing Technique"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            maxLength={100}
            style={{ borderColor: errors.title ? '#e74c3c' : undefined }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {errors.title && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.title}</span>}
            {getCharacterCount(form.title, 100)}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Description *
          </label>
          <textarea
            className="form-textarea"
            placeholder="Brief description of what this trick does and why it's useful..."
            value={form.description}
            onChange={(e) => setForm({...form, description: e.target.value})}
            maxLength={200}
            style={{ borderColor: errors.description ? '#e74c3c' : undefined }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {errors.description && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.description}</span>}
            {getCharacterCount(form.description, 200)}
          </div>
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '10px', fontWeight: '600' }}>
            Steps (max 3) *
          </label>
          {form.steps.map((step, i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <input
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
                style={{ 
                  borderColor: errors.steps && i === 0 ? '#e74c3c' : undefined,
                  marginBottom: '5px'
                }}
              />
              {step && (
                <div style={{ textAlign: 'right' }}>
                  {getCharacterCount(step, 150)}
                </div>
              )}
            </div>
          ))}
          {errors.steps && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.steps}</span>}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Country *
          </label>
          <select
            className="form-select"
            value={form.countryCode}
            onChange={(e) => setForm({...form, countryCode: e.target.value})}
            style={{ borderColor: errors.countryCode ? '#e74c3c' : undefined }}
          >
            <option value="">🌍 Select your country</option>
            {countries.map(country => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
          {errors.countryCode && <span style={{ color: '#e74c3c', fontSize: '12px' }}>{errors.countryCode}</span>}
        </div>
        
        <div style={{ marginBottom: '20px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: '600' }}>
            Tags
          </label>
          <input
            className="form-input"
            type="text"
            placeholder="cooking, productivity, health..."
            value={form.tags}
            onChange={(e) => setForm({...form, tags: e.target.value})}
          />
          <div style={{ marginTop: '10px' }}>
            <p style={{ fontSize: '12px', color: '#666', marginBottom: '8px' }}>Popular tags:</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {popularTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => addTag(tag)}
                  style={{
                    background: 'rgba(102, 126, 234, 0.1)',
                    border: '1px solid rgba(102, 126, 234, 0.3)',
                    color: '#667eea',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '11px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.2)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.background = 'rgba(102, 126, 234, 0.1)';
                  }}
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
          style={{ 
            opacity: submitting ? 0.7 : 1,
            cursor: submitting ? 'not-allowed' : 'pointer'
          }}
        >
          {submitting ? '✨ Sharing...' : '✨ Share My Trick'}
        </button>
        
        <p style={{ 
          textAlign: 'center', 
          marginTop: '15px', 
          fontSize: '12px', 
          color: '#666' 
        }}>
          Your trick will be reviewed and published shortly
        </p>
      </form>
    </div>
  );
}
