import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Submit() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    steps: ['', '', ''],
    countryCode: '',
    tags: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const trick = {
      ...form,
      languageCode: 'en',
      steps: form.steps.filter(step => step.trim()),
      tags: form.tags.split(',').map(tag => tag.trim()).filter(Boolean)
    };

    const response = await fetch('/api/tricks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(trick)
    });

    if (response.ok) {
      router.push('/');
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Share Your Trick</h1>
        <p>Help others with your life hack ✨</p>
      </header>
      
      <form className="form" onSubmit={handleSubmit}>
        <input
          className="form-input"
          type="text"
          placeholder="What's your trick? 🤔"
          value={form.title}
          onChange={(e) => setForm({...form, title: e.target.value})}
          required
        />
        
        <textarea
          className="form-textarea"
          placeholder="Tell us more about it..."
          value={form.description}
          onChange={(e) => setForm({...form, description: e.target.value})}
          required
        />
        
        {form.steps.map((step, i) => (
          <input
            key={i}
            className="form-input"
            type="text"
            placeholder={`Step ${i + 1} ${i === 0 ? '(required)' : '(optional)'}`}
            value={step}
            onChange={(e) => {
              const newSteps = [...form.steps];
              newSteps[i] = e.target.value;
              setForm({...form, steps: newSteps});
            }}
            required={i === 0}
          />
        ))}
        
        <select
          className="form-select"
          value={form.countryCode}
          onChange={(e) => setForm({...form, countryCode: e.target.value})}
          required
        >
          <option value="">🌍 Where are you from?</option>
          <option value="US">🇺🇸 United States</option>
          <option value="JP">🇯🇵 Japan</option>
          <option value="DE">🇩🇪 Germany</option>
        </select>
        
        <input
          className="form-input"
          type="text"
          placeholder="Tags: cooking, cleaning, life..."
          value={form.tags}
          onChange={(e) => setForm({...form, tags: e.target.value})}
        />
        
        <button type="submit" className="submit-btn">
          ✨ Share My Trick
        </button>
      </form>
    </div>
  );
}
