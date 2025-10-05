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
        }
        
        .back-btn {
          color: #666;
          text-decoration: none;
          font-size: 1.1rem;
        }
        
        .submit-form {
          max-width: 600px;
          margin: 0 auto;
        }
        
        .form-group {
          margin-bottom: 20px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        label {
          display: block;
          margin-bottom: 5px;
          font-weight: 600;
          color: #333;
        }
        
        input, textarea, select {
          width: 100%;
          padding: 12px;
          border: 2px solid #e1e8ed;
          border-radius: 8px;
          font-size: 16px;
          font-family: inherit;
        }
        
        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: #3498db;
        }
        
        .add-step-btn {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin-top: 10px;
        }
        
        .submit-btn {
          width: 100%;
          background: #27ae60;
          color: white;
          padding: 15px;
          border: none;
          border-radius: 8px;
          font-size: 1.1rem;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        
        .submit-btn:hover {
          background: #229954;
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
