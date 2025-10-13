import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { countries } from '../lib/mockData';
import { useAuth } from '../components/AuthProvider';
import AuthGuard from '../components/AuthGuard';

function SubmitContent() {
  const router = useRouter();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    country: '',
    countryCode: '',
    difficulty: 'easy',
    tags: '',
    category: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          authorName: user?.name || 'Anonymous',
          authorEmail: user?.email || 'anonymous@example.com',
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
          steps: formData.steps.filter(step => step.trim())
        })
      });

      if (response.ok) {
        router.push('/');
      } else {
        alert('Error submitting trick');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error submitting trick');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCountry = countries.find(c => c.name === e.target.value);
    setFormData({
      ...formData,
      country: e.target.value,
      countryCode: selectedCountry?.code || ''
    });
  };

  const addStep = () => {
    setFormData({
      ...formData,
      steps: [...formData.steps, '']
    });
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData({
      ...formData,
      steps: newSteps
    });
  };

  const removeStep = (index: number) => {
    setFormData({
      ...formData,
      steps: formData.steps.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="submit-page">
      <div className="container">
        <div className="header">
          <Link href="/" className="back-btn">← Back to Home</Link>
          <h1>Share Your Life Trick</h1>
          <p>Help others with your amazing life hack!</p>
        </div>

        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-group">
            <label htmlFor="title">Trick Title *</label>
            <input
              type="text"
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
              placeholder="e.g., Perfect way to fold fitted sheets"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              required
              rows={3}
              placeholder="Brief description of your trick..."
            />
          </div>

          <div className="form-group">
            <label>Steps *</label>
            {formData.steps.map((step, index) => (
              <div key={index} className="step-input">
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}...`}
                  required
                />
                {formData.steps.length > 1 && (
                  <button type="button" onClick={() => removeStep(index)} className="remove-step">
                    ×
                  </button>
                )}
              </div>
            ))}
            <button type="button" onClick={addStep} className="add-step">
              + Add Step
            </button>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">Country *</label>
              <select
                id="country"
                value={formData.country}
                onChange={handleCountryChange}
                required
              >
                <option value="">Select your country</option>
                {countries.map(country => (
                  <option key={country.code} value={country.name}>
                    {country.flag} {country.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="difficulty">Difficulty *</label>
              <select
                id="difficulty"
                value={formData.difficulty}
                onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                required
              >
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="tags">Tags</label>
            <input
              type="text"
              id="tags"
              value={formData.tags}
              onChange={(e) => setFormData({...formData, tags: e.target.value})}
              placeholder="cooking, cleaning, organization (comma separated)"
            />
          </div>

          <button type="submit" disabled={submitting} className="submit-btn">
            {submitting ? 'Submitting...' : 'Share Trick'}
          </button>
        </form>
      </div>

      <style jsx>{`
        .submit-page {
          min-height: 100vh;
          background: var(--gradient-bg);
          padding: 2rem 0;
        }

        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .back-btn {
          display: inline-block;
          margin-bottom: 2rem;
          color: var(--primary-600);
          text-decoration: none;
          font-weight: 500;
        }

        .back-btn:hover {
          color: var(--primary-700);
        }

        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          color: var(--text-primary);
          margin-bottom: 0.5rem;
        }

        .header p {
          color: var(--text-secondary);
          font-size: 1.1rem;
        }

        .submit-form {
          background: var(--surface-glass);
          backdrop-filter: blur(20px);
          border-radius: var(--radius-lg);
          padding: 2rem;
          border: 1px solid var(--border-light);
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: var(--text-primary);
        }

        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          border: 1px solid var(--border-light);
          border-radius: var(--radius-md);
          background: var(--surface-elevated);
          color: var(--text-primary);
          font-size: 1rem;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--primary-500);
          box-shadow: 0 0 0 3px var(--primary-100);
        }

        .step-input {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .remove-step {
          background: var(--error-500);
          color: white;
          border: none;
          border-radius: var(--radius-md);
          width: 40px;
          cursor: pointer;
        }

        .add-step {
          background: var(--primary-100);
          color: var(--primary-700);
          border: none;
          padding: 0.5rem 1rem;
          border-radius: var(--radius-md);
          cursor: pointer;
          font-weight: 500;
        }

        .add-step:hover {
          background: var(--primary-200);
        }

        .submit-btn {
          width: 100%;
          background: var(--gradient-primary);
          color: white;
          border: none;
          padding: 1rem 2rem;
          border-radius: var(--radius-md);
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all var(--transition-smooth);
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: var(--shadow-lg);
        }

        .submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}

export default function Submit() {
  return (
    <AuthGuard>
      <SubmitContent />
    </AuthGuard>
  );
}
