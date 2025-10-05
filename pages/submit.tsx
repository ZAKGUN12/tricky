import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { countries } from '../lib/mockData';

export default function Submit() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    steps: [''],
    country: '',
    difficulty: 'easy',
    tags: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple validation
    if (!formData.title || !formData.description || !formData.country) {
      alert('Please fill in all required fields');
      return;
    }
    
    // Simulate submission
    alert('Trick submitted successfully!');
    router.push('/');
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
          gap: 20px;
          margin-bottom: 30px;
          background: rgba(255, 255, 255, 0.9);
          padding: 20px;
          border-radius: 15px;
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
        }
        
        .back-btn {
          color: #667eea;
          text-decoration: none;
          font-size: 1.1rem;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .back-btn:hover {
          transform: translateX(-3px);
        }
        
        .submit-form {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(255, 255, 255, 0.95);
          padding: 30px;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px rgba(0,0,0,0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .form-group {
          margin-bottom: 25px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 8px;
          font-weight: 700;
          color: #2c3e50;
          font-size: 1rem;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 15px;
          border: 2px solid transparent;
          border-radius: 12px;
          font-size: 16px;
          font-family: inherit;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(5px);
          transition: all 0.3s ease;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.2);
        }
        
        .add-step-btn {
          background: rgba(255, 255, 255, 0.8);
          border: 2px solid #e1e8ed;
          padding: 10px 20px;
          border-radius: 20px;
          cursor: pointer;
          margin-top: 10px;
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
          background: linear-gradient(135deg, #27ae60, #2ecc71);
          color: white;
          padding: 18px;
          border: none;
          border-radius: 25px;
          font-size: 1.2rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 6px 20px rgba(39, 174, 96, 0.3);
        }
        
        .submit-btn:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 30px rgba(39, 174, 96, 0.4);
        }
        
        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .submit-form {
            padding: 20px;
          }
        }
      `}</style>
    </div>
  );
}
