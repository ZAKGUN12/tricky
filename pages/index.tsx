import { useState, useEffect } from 'react';
import { Trick } from '../lib/types';

const countries = [
  { code: '', name: '🌍 All', flag: '🌍' },
  { code: 'US', name: 'USA', flag: '🇺🇸' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' }
];

export default function Home() {
  const [tricks, setTricks] = useState<Trick[]>([]);
  const [activeFilter, setActiveFilter] = useState('');

  useEffect(() => {
    fetchTricks();
  }, [activeFilter]);

  const fetchTricks = async () => {
    const params = activeFilter ? `?country=${activeFilter}` : '';
    const response = await fetch(`/api/tricks${params}`);
    const data = await response.json();
    setTricks(data.tricks || []);
  };

  const giveKudos = async (trickId: string) => {
    await fetch(`/api/tricks/${trickId}/kudos`, { method: 'POST' });
    fetchTricks();
  };

  return (
    <div className="container">
      <header className="header">
        <h1>TrickShare</h1>
        <p>Life tricks from around the world ✨</p>
      </header>

      <div className="filters">
        {countries.map(country => (
          <button
            key={country.code}
            className={`filter-btn ${activeFilter === country.code ? 'active' : ''}`}
            onClick={() => setActiveFilter(country.code)}
          >
            {country.flag} {country.name}
          </button>
        ))}
      </div>

      <main>
        {tricks.map(trick => (
          <div key={trick.id} className="trick-card">
            <h2 className="trick-title">{trick.title}</h2>
            <p style={{ color: '#666', marginBottom: '15px' }}>{trick.description}</p>
            
            <ol className="trick-steps">
              {trick.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            
            <div className="trick-meta">
              <span>{countries.find(c => c.code === trick.countryCode)?.flag} {trick.countryCode}</span>
              {trick.tags.map(tag => (
                <span key={tag} className="tag">#{tag}</span>
              ))}
              <button 
                className="kudos-btn"
                onClick={() => giveKudos(trick.id)}
              >
                👍 {trick.kudos}
              </button>
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
