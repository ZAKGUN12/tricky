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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const trickData = {
        title: formData.title,
        description: formData.description,
        steps: formData.steps.filter(step => step.trim()),
        country: formData.country,
        countryCode: formData.country,
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
      alert(`Failed to submit trick: ${error instanceof Error ? error.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addStep = () => {
    if (formData.steps.length < 5) {
      setFormData(prev => ({
        ...prev,
        steps: [...prev.steps, '']
      }));
    }
  };

  const removeStep = (index: number) => {
    if (formData.steps.length > 1) {
      setFormData(prev => ({
        ...prev,
        steps: prev.steps.filter((_, i) => i !== index)
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
        <Link href="/" className="back-btn">
          ← Back to Tricks
        </Link>
        <div className="header-content">
          <h1>✨ Share Your Trick</h1>
          <p>Help others with your amazing life hack!</p>
        </div>
      </header>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="submit-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label>Trick Title *</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({...prev, title: e.target.value}))}
                placeholder="e.g., Quick way to organize your closet"
                required
                maxLength={100}
              />
              <span className="char-count">{formData.title.length}/100</span>
            </div>

            <div className="form-group">
              <label>Description *</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({...prev, description: e.target.value}))}
                placeholder="Briefly describe what your trick does and why it's useful..."
                rows={4}
                required
                maxLength={300}
              />
              <span className="char-count">{formData.description.length}/300</span>
            </div>
          </div>

          <div className="form-section">
            <h3>Step-by-Step Instructions</h3>
            
            <div className="steps-container">
              {formData.steps.map((step, index) => (
                <div key={index} className="step-group">
                  <div className="step-header">
                    <span className="step-number">{index + 1}</span>
                    <label>Step {index + 1}</label>
                    {formData.steps.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => removeStep(index)}
                        className="remove-step-btn"
                      >
                        ×
                      </button>
                    )}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={`Describe step ${index + 1} in detail...`}
                    rows={3}
                    maxLength={200}
                  />
                  <span className="char-count">{step.length}/200</span>
                </div>
              ))}
              
              {formData.steps.length < 5 && (
                <button type="button" onClick={addStep} className="add-step-btn">
                  + Add Another Step
                </button>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Details & Tags</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label>Country *</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({...prev, country: e.target.value}))}
                  required
                >
                  <option value="">Select your country</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.code}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({...prev, difficulty: e.target.value}))}
                >
                  <option value="easy">🟢 Easy - Anyone can do it</option>
                  <option value="medium">🟡 Medium - Some skill needed</option>
                  <option value="hard">🔴 Hard - Advanced technique</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Tags (Optional)</label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({...prev, tags: e.target.value}))}
                placeholder="cooking, productivity, health, cleaning (comma separated)"
                maxLength={100}
              />
              <span className="char-count">{formData.tags.length}/100</span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner"></span>
                Sharing Your Trick...
              </>
            ) : (
              '🚀 Share My Trick'
            )}
          </button>
        </form>
      </div>

      <style jsx>{`
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
          background: #000;
          color: #fff;
          min-height: 100vh;
        }

        .page-header {
          margin-bottom: 40px;
        }

        .back-btn {
          color: #00d4aa;
          text-decoration: none;
          font-weight: 600;
          font-size: 16px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 0;
          transition: color 0.2s;
          margin-bottom: 20px;
        }

        .back-btn:hover {
          color: #00b894;
        }

        .header-content h1 {
          font-size: 32px;
          font-weight: 800;
          margin-bottom: 8px;
          background: linear-gradient(135deg, #00d4aa, #00b894);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .header-content p {
          font-size: 18px;
          color: #888;
          margin: 0;
        }

        .form-container {
          background: #111;
          border: 1px solid #333;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
        }

        .form-section {
          margin-bottom: 40px;
          padding-bottom: 30px;
          border-bottom: 1px solid #222;
        }

        .form-section:last-of-type {
          border-bottom: none;
          margin-bottom: 30px;
        }

        .form-section h3 {
          font-size: 20px;
          font-weight: 700;
          margin-bottom: 24px;
          color: #fff;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .form-group {
          margin-bottom: 24px;
          position: relative;
        }

        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 600;
          color: #fff;
          font-size: 14px;
        }

        input, textarea, select {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #333;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
          background: #0a0a0a;
          color: #fff;
          transition: all 0.2s ease;
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #00d4aa;
          box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
        }

        .char-count {
          position: absolute;
          bottom: -20px;
          right: 0;
          font-size: 12px;
          color: #666;
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-group {
          position: relative;
          padding: 20px;
          background: #0a0a0a;
          border: 1px solid #222;
          border-radius: 12px;
        }

        .step-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
        }

        .step-number {
          background: #00d4aa;
          color: #000;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
          flex-shrink: 0;
        }

        .remove-step-btn {
          background: #333;
          color: #fff;
          border: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          cursor: pointer;
          font-size: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-left: auto;
          transition: all 0.2s;
        }

        .remove-step-btn:hover {
          background: #e74c3c;
        }

        .add-step-btn {
          background: #333;
          color: #fff;
          border: 2px dashed #555;
          padding: 16px 24px;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.2s ease;
          width: 100%;
        }

        .add-step-btn:hover {
          background: #00d4aa;
          color: #000;
          border-color: #00d4aa;
        }

        .submit-btn {
          width: 100%;
          background: linear-gradient(135deg, #00d4aa, #00b894);
          color: #000;
          padding: 18px 32px;
          border: none;
          border-radius: 12px;
          font-size: 18px;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 6px 20px rgba(0, 212, 170, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .submit-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(0, 212, 170, 0.4);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid #333;
          border-top: 2px solid #000;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .container {
            padding: 16px;
          }

          .form-container {
            padding: 24px;
          }

          .form-row {
            grid-template-columns: 1fr;
          }

          .header-content h1 {
            font-size: 28px;
          }

          .header-content p {
            font-size: 16px;
          }
        }
      `}</style>
    </div>
  );
}
