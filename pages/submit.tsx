import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../components/AuthProvider';
import { countries } from '../lib/mockData';

export default function Submit() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    country: '',
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
      const selectedCountry = countries.find(c => c.name === formData.country);
      
      // Ensure all required fields are present
      const submitData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        steps: formData.steps.filter(step => step.trim()).map(step => step.trim()),
        country: formData.country,
        countryCode: selectedCountry?.code || 'US', // Default to US if no country selected
        difficulty: formData.difficulty as 'easy' | 'medium' | 'hard',
        category: formData.category,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        authorName: user.username || user.name || 'Anonymous',
        authorEmail: user.email || 'anonymous@example.com'
      };

      // Validate required fields before sending
      if (!submitData.title || submitData.title.length < 5) {
        alert('Title must be at least 5 characters long');
        return;
      }
      
      if (!submitData.description || submitData.description.length < 10) {
        alert('Description must be at least 10 characters long');
        return;
      }
      
      if (!submitData.steps.length || submitData.steps[0].length < 5) {
        alert('At least one step with 5+ characters is required');
        return;
      }

      console.log('Submitting data:', submitData);

      const response = await fetch('/api/tricks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      console.log('Response:', result);

      if (response.ok) {
        router.push('/');
      } else {
        console.error('Validation error:', result);
        alert(`Failed to submit trick: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting trick');
    } finally {
      setSubmitting(false);
    }
  };

  const addStep = () => {
    setFormData(prev => ({ ...prev, steps: [...prev.steps, ''] }));
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <style jsx>{`
          .loading-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          }
          .loading-spinner {
            width: 50px;
            height: 50px;
            border: 3px solid rgba(120, 119, 198, 0.3);
            border-top: 3px solid #7877c6;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="home">
        <div className="container">
          <div className="signin-prompt">
            <div className="prompt-card glass-elevated">
              <h1 className="prompt-title text-gradient-primary">🔐 Sign In Required</h1>
              <p className="prompt-subtitle text-secondary">
                Please sign in to share your amazing tricks with the global community!
              </p>
              <button
                onClick={() => router.push('/signin?returnUrl=/submit')}
                className="signin-button btn-primary"
              >
                🚀 Sign In to Continue
              </button>
            </div>
          </div>
        </div>
        
        <style jsx>{`
          .home {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: 9999;
            overflow: hidden;
          }

          .container {
            position: relative;
            z-index: 10000;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .signin-prompt {
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 2rem;
          }
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: 
              radial-gradient(2px 2px at 20px 30px, rgba(120, 219, 255, 0.8), transparent),
              radial-gradient(2px 2px at 40px 70px, rgba(255, 119, 198, 0.6), transparent),
              radial-gradient(1px 1px at 90px 40px, rgba(120, 119, 198, 0.9), transparent),
              radial-gradient(1px 1px at 130px 80px, rgba(120, 219, 255, 0.7), transparent),
              radial-gradient(2px 2px at 160px 30px, rgba(255, 119, 198, 0.5), transparent);
            background-repeat: repeat;
            background-size: 200px 100px;
            pointer-events: none;
            z-index: -1;
            animation: sparkle 15s linear infinite;
          }

          @keyframes sparkle {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.3; }
          }

          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            33% { transform: translateY(-20px) rotate(1deg); }
            66% { transform: translateY(10px) rotate(-1deg); }
          }

          .container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 1rem;
          }

          .signin-prompt {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .prompt-card {
            background: rgba(15, 15, 35, 0.85);
            backdrop-filter: blur(25px);
            border-radius: 20px;
            padding: 3rem;
            max-width: 400px;
            width: 100%;
            text-align: center;
            border: 1px solid rgba(120, 119, 198, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(120, 119, 198, 0.1);
          }

          .prompt-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: white;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .prompt-subtitle {
            color: rgba(120, 219, 255, 0.9);
            margin-bottom: 2rem;
            line-height: 1.5;
          }

          .signin-button {
            background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
            color: white;
            border: none;
            padding: 1rem 2rem;
            border-radius: 12px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
          }

          .signin-button:hover {
            transform: translateY(-2px) scale(1.05);
            box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="home">
      <div className="container">
        <div className="header">
          <div className="header-content">
            <div className="header-left">
              <button onClick={() => router.push('/')} className="back-btn">
                ← Back to Home
              </button>
            </div>
            <div className="header-center">
              <h1 className="page-title">🌟 Share Your Trick</h1>
            </div>
            <div className="header-right">
              <span className="welcome-text">
                Welcome, <span className="username-highlight">{user.profile?.displayName || user.name}</span>!
              </span>
            </div>
          </div>
        </div>
        
        <div className="submit-card">
          <form onSubmit={handleSubmit} className="submit-form">
            <div className="form-row">
              <div className="input-group">
                <label className="input-label">✨ Title</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="form-input"
                  placeholder="Enter your amazing trick title"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">📝 Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="form-textarea"
                  placeholder="Describe your trick in detail"
                  rows={3}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">🔢 Steps</label>
                <div className="steps-container">
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
                      className="form-input"
                      placeholder={`Step ${index + 1}`}
                    />
                  ))}
                  <button 
                    type="button" 
                    onClick={addStep} 
                    className="add-step-button"
                  >
                    ➕ Add Step
                  </button>
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">🌍 Country</label>
                <select
                  value={formData.country}
                  onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value }))}
                  className="form-select"
                >
                  <option value="">Select your country...</option>
                  {countries.map(country => (
                    <option key={country.code} value={country.name}>
                      {country.flag} {country.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-row-split">
              <div className="input-group">
                <label className="input-label">📂 Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="form-select"
                >
                  <option value="cooking">🍳 Cooking</option>
                  <option value="cleaning">🧹 Cleaning</option>
                  <option value="technology">📱 Technology</option>
                  <option value="health">🍎 Health</option>
                  <option value="travel">✈️ Travel</option>
                </select>
              </div>
              <div className="input-group">
                <label className="input-label">⚡ Difficulty</label>
                <select
                  value={formData.difficulty}
                  onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="form-select"
                >
                  <option value="easy">🟢 Easy</option>
                  <option value="medium">🟡 Medium</option>
                  <option value="hard">🔴 Hard</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label className="input-label">🏷️ Tags</label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  className="form-input"
                  placeholder="cooking, quick, easy (comma separated)"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="submit-button"
            >
              <span className="button-text">
                {submitting ? (
                  <>
                    <span className="spinner"></span>
                    Sharing...
                  </>
                ) : (
                  '🚀 Share Your Trick'
                )}
              </span>
            </button>
          </form>
        </div>
      </div>

      <style jsx>{`
        .home {
          min-height: 100vh;
          background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
          position: relative;
        }

        .home::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.4) 0%, transparent 50%),
                      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3) 0%, transparent 50%);
          pointer-events: none;
          z-index: -1;
          animation: float 20s ease-in-out infinite;
        }

        .home::after {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: 
            radial-gradient(2px 2px at 20px 30px, rgba(120, 219, 255, 0.8), transparent),
            radial-gradient(2px 2px at 40px 70px, rgba(255, 119, 198, 0.6), transparent),
            radial-gradient(1px 1px at 90px 40px, rgba(120, 119, 198, 0.9), transparent),
            radial-gradient(1px 1px at 130px 80px, rgba(120, 219, 255, 0.7), transparent),
            radial-gradient(2px 2px at 160px 30px, rgba(255, 119, 198, 0.5), transparent);
          background-repeat: repeat;
          background-size: 200px 100px;
          pointer-events: none;
          z-index: -1;
          animation: sparkle 15s linear infinite;
        }

        @keyframes sparkle {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          33% { transform: translateY(-20px) rotate(1deg); }
          66% { transform: translateY(10px) rotate(-1deg); }
        }

        .container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 0 1rem;
        }

        .header {
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          margin: 1rem 0;
          padding: 1rem 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          position: sticky;
          top: 1rem;
          z-index: 100;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(120, 119, 198, 0.1);
          animation: headerGlow 4s ease-in-out infinite;
        }

        @keyframes headerGlow {
          0%, 100% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 60px rgba(120, 119, 198, 0.1); }
          50% { box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 80px rgba(120, 119, 198, 0.2); }
        }

        .header-content {
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 2rem;
          height: 100%;
        }

        .header-left {
          justify-self: start;
          display: flex;
          align-items: center;
        }

        .header-center {
          justify-self: center;
          display: flex;
          align-items: center;
        }

        .header-right {
          justify-self: end;
          display: flex;
          align-items: center;
        }

        .back-btn {
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 4px 16px rgba(120, 119, 198, 0.3);
        }

        .back-btn:hover {
          transform: translateY(-2px) scale(1.05);
          box-shadow: 0 8px 24px rgba(120, 119, 198, 0.5);
        }

        .page-title {
          font-size: 2rem;
          font-weight: 700;
          color: white;
          background: linear-gradient(135deg, #7877c6, #ff77c6, #78dbff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          text-align: center;
        }

        .welcome-text {
          color: rgba(120, 219, 255, 0.9);
          font-size: 0.9rem;
        }

        .username-highlight {
          color: #78dbff;
          font-weight: 600;
        }

        .submit-card {
          background: rgba(15, 15, 35, 0.85);
          backdrop-filter: blur(25px);
          border-radius: 20px;
          padding: 2rem;
          border: 1px solid rgba(120, 119, 198, 0.3);
          position: relative;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(120, 119, 198, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          margin-bottom: 2rem;
        }

        .submit-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(120, 119, 198, 0.15), transparent);
          transition: left 0.6s;
        }

        .submit-card::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background: linear-gradient(90deg, #7877c6, #ff77c6, #78dbff);
          opacity: 0;
          transition: opacity 0.3s;
        }

        .submit-card:hover::before {
          left: 100%;
        }

        .submit-card:hover::after {
          opacity: 1;
        }

        .submit-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 20px 60px rgba(120, 119, 198, 0.4), 0 0 40px rgba(120, 119, 198, 0.2);
          border-color: rgba(120, 119, 198, 0.6);
        }

        .submit-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .form-row {
          display: flex;
          gap: 1.5rem;
        }

        .form-row-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
        }

        .input-group {
          position: relative;
          flex: 1;
        }

        .input-label {
          display: block;
          color: white;
          font-weight: 600;
          margin-bottom: 0.5rem;
          font-size: 0.9rem;
        }

        .form-input, .form-textarea, .form-select {
          width: 100%;
          padding: 1rem 1.25rem;
          background: rgba(15, 15, 35, 0.8);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(120, 119, 198, 0.3);
          border-radius: 12px;
          color: white;
          font-size: 1rem;
          transition: all 0.3s ease;
          outline: none;
        }

        .form-input::placeholder, .form-textarea::placeholder {
          color: rgba(255, 255, 255, 0.6);
        }

        .form-input:focus, .form-textarea:focus, .form-select:focus {
          border-color: rgba(120, 219, 255, 0.6);
          box-shadow: 0 0 20px rgba(120, 219, 255, 0.2);
        }

        .form-textarea {
          resize: vertical;
          min-height: 100px;
        }

        .form-select {
          cursor: pointer;
        }

        .form-select option {
          background: #1a1a2e;
          color: white;
        }

        .steps-container {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .add-step-button {
          background: none;
          border: 1px solid rgba(120, 219, 255, 0.3);
          color: #78dbff;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 0.9rem;
        }

        .add-step-button:hover {
          background: rgba(120, 219, 255, 0.1);
          border-color: rgba(120, 219, 255, 0.6);
          transform: translateY(-1px);
        }

        .submit-button {
          position: relative;
          background: linear-gradient(135deg, #7877c6 0%, #ff77c6 100%);
          color: white;
          border: none;
          padding: 1.25rem 2rem;
          border-radius: 12px;
          font-size: 1.2rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 0 8px 32px rgba(120, 119, 198, 0.3);
          margin-top: 1rem;
        }

        .submit-button:hover:not(:disabled) {
          transform: translateY(-2px) scale(1.02);
          box-shadow: 0 12px 40px rgba(120, 119, 198, 0.5);
        }

        .submit-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .button-text {
          position: relative;
          z-index: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
        }

        .spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .header-content {
            grid-template-columns: 1fr;
            text-align: center;
            gap: 1rem;
          }

          .header-left, .header-center, .header-right {
            justify-self: center;
          }

          .page-title {
            font-size: 1.5rem;
          }

          .form-row-split {
            grid-template-columns: 1fr;
          }

          .form-row {
            flex-direction: column;
            gap: 1rem;
          }

          .submit-card {
            padding: 1.5rem;
          }
        }
      `}</style>
    </div>
  );
}
