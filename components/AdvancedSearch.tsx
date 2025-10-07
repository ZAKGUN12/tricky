import { useState, useEffect, useRef } from 'react';
import { TrickShareAPI } from '../lib/api';

interface SearchSuggestion {
  text: string;
  type: 'trick' | 'tag' | 'country';
  count?: number;
}

export default function AdvancedSearch({ onSearch, onFilter }: {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-complete with debouncing
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const suggestions = await fetchSuggestions(query);
        setSuggestions(suggestions);
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      return await response.json();
    } catch (error) {
      return [];
    }
  };

  // Voice Search
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      onSearch(transcript);
    };

    recognition.start();
  };

  // Visual Search
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch('/api/search/visual', {
        method: 'POST',
        body: formData,
      });
      const results = await response.json();
      onFilter({ visual: results });
    } catch (error) {
      console.error('Visual search failed:', error);
    }
  };

  return (
    <div className="advanced-search">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && onSearch(query)}
          placeholder="Search tricks, tags, or countries..."
          className="search-input"
        />
        
        <div className="search-actions">
          <button 
            onClick={startVoiceSearch}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title="Voice search"
          >
            🎤
          </button>
          
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="visual-btn"
            title="Visual search"
          >
            📷
          </button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ display: 'none' }}
          />
        </div>
      </div>

      {showSuggestions && (
        <div className="suggestions-dropdown">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`suggestion-item ${suggestion.type}`}
              onClick={() => {
                setQuery(suggestion.text);
                onSearch(suggestion.text);
                setShowSuggestions(false);
              }}
            >
              <span className="suggestion-text">{suggestion.text}</span>
              <span className="suggestion-type">{suggestion.type}</span>
              {suggestion.count && <span className="suggestion-count">{suggestion.count}</span>}
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        .advanced-search {
          position: relative;
          width: 100%;
        }
        
        .search-container {
          display: flex;
          align-items: center;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .search-input {
          flex: 1;
          padding: 12px 16px;
          border: none;
          outline: none;
          font-size: 16px;
        }
        
        .search-actions {
          display: flex;
          gap: 8px;
          padding: 8px;
        }
        
        .voice-btn, .visual-btn {
          padding: 8px;
          border: none;
          background: #f8fafc;
          border-radius: 8px;
          cursor: pointer;
          font-size: 16px;
        }
        
        .voice-btn.listening {
          background: #ef4444;
          animation: pulse 1s infinite;
        }
        
        .suggestions-dropdown {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
          z-index: 10;
          max-height: 300px;
          overflow-y: auto;
        }
        
        .suggestion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
        }
        
        .suggestion-item:hover {
          background: #f8fafc;
        }
        
        .suggestion-type {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
        }
        
        .suggestion-count {
          font-size: 12px;
          color: #94a3b8;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
