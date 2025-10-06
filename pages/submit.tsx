import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react';
import { countries } from '../lib/mockData';
import { TrickShareAPI } from '../lib/api';
import AuthWrapper from '../components/AuthWrapper';

export default function Submit() {
  return (
    <Authenticator>
      <AuthWrapper>
        <SubmitContent />
      </AuthWrapper>
    </Authenticator>
  );
}

function SubmitContent() {
  const { user } = useAuthenticator((context) => [context.user]);
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    country: '',
    difficulty: 'easy',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.title || !formData.description || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    try {
      const trickData = {
        title: formData.title,
        description: formData.description,
        steps: formData.steps.filter(step => step.trim()),
        country: formData.country,
        countryCode: formData.country, // Add this line to fix the issue
        difficulty: formData.difficulty,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        authorName: user?.signInDetails?.loginId || 'Anonymous',
        authorEmail: user?.signInDetails?.loginId || 'anonymous'
      };
      
      await TrickShareAPI.createTrick(trickData);
      alert('Trick submitted successfully!');
      router.push('/');
    } catch (error) {
      console.error('Error submitting trick:', error);
      // Log more details for debugging
      if (error instanceof Error) {
        console.error('Error message:', error.message);
      }
      alert(`Failed to submit trick: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    }
  };

  const addStep = () => {
    if (formData.steps.length < 3) {
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, '']
      }));
    }
  };

  const updateStep = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  };

  return (
    <div className="container">
      <header className="page-header">
        <Link href="/" className="back-btn">← Back</Link>
        <h1>Share Your Trick</h1>
      </header>

      <form onSubmit={handleSubmit} className="submit-form">
        <div className="form-group">
          <label>Title *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
            placeholder="What's your trick?"
            required
          />
        </div>

        <div className="form-group">
          <label>Description *</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
            placeholder="Briefly describe your trick..."
            rows={3}
            required
          />
        </div>

        <div className="form-group">
          <label>Steps</label>
          {formData.steps.map((step, index) => (
            <textarea
              key={index}
              value={step}
              onChange={(e) => updateStep(index, e.target.value)}
              placeholder={`Step ${index + 1}...`}
              rows={2}
            />
          ))}
          {formData.steps.length < 3 && (
            <button type="button" onClick={addStep} className="add-step-btn">
              + Add Step
            </button>
          )}
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Country *</label>
            <select
              value={formData.country}
              onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
              required
            >
              <option value="">Select country</option>
              {countries.map(country => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Difficulty</label>
            <select
              value={formData.difficulty}
              onChange={(e) => setFormData(prev => ({...prev, difficulty: e.target.value}))}
            >
              <option value="easy">🟢 Easy</option>
              <option value="medium">🟡 Medium</option>
              <option value="hard">🔴 Hard</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
            placeholder="cooking, productivity, health (comma separated)"
          />
        </div>

        <button type="submit" className="submit-btn">
          Share Trick
        </button>
      </form>

      <style jsx>{`
        .page-header {
          display: flex;
          align-items: center;
          gap: var(--space-lg);
          margin-bottom: var(--space-xl);
          background: var(--glass-bg);
          padding: var(--space-lg);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
        }
        
        .back-btn {
          color: #667eea;
          text-decoration: none;
          font-size: var(--text-lg);
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          color: #764ba2;
          transform: translateX(-3px);
        }
        
        .submit-form {
          max-width: 600px;
          margin: 0 auto;
          background: var(--glass-bg);
          padding: var(--space-xl);
          border-radius: var(--radius-lg);
          backdrop-filter: blur(20px);
          box-shadow: var(--glass-shadow);
          border: 1px solid var(--glass-border);
        }
        
        .form-group {
          margin-bottom: var(--space-lg);
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-lg);
        }
        
        label {
          display: block;
          margin-bottom: var(--space-sm);
          font-weight: 700;
          color: var(--text-primary);
          font-size: var(--text-base);
        }
        
        input, textarea, select {
          width: 100%;
          padding: var(--space-md);
          border: 1px solid #e2e8f0;
          border-radius: var(--radius-md);
          font-size: var(--text-base);
          font-family: inherit;
          background: white;
          transition: all 0.3s ease;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
          transform: translateY(-1px);
        }
        
        .add-step-btn {
          background: var(--glass-bg);
          border: 1px solid var(--glass-border);
          padding: var(--space-sm) var(--space-lg);
          border-radius: var(--radius-lg);
          cursor: pointer;
          margin-top: var(--space-sm);
          font-weight: 600;
          transition: all 0.3s ease;
          backdrop-filter: blur(5px);
        }
        
        .add-step-btn:hover {
          background: #667eea;
          color: white;
          border-color: #667eea;
          transform: translateY(-2px);
        }
        
        .submit-btn {
          width: 100%;
          background: var(--primary-gradient);
          color: white;
          padding: var(--space-lg);
          border: none;
          border-radius: var(--radius-lg);
          font-size: var(--text-lg);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.3);
        }
        
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(102, 126, 234, 0.4);
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .submit-form {
            padding: var(--space-lg);
          }
        }
      `}</style>
    </div>
  );
}
