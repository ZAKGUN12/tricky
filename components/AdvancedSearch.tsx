import { useState, useEffect, useRef } from 'react';
import { TrickShareAPI } from '../lib/api';

interface SearchSuggestion {
  text: string;
  type: 'trick' | 'tag' | 'country' | 'smart';
  count?: number;
  relevance?: number;
}

export default function AdvancedSearch({ onSearch, onFilter }: {
  onSearch: (query: string) => void;
  onFilter: (filters: any) => void;
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [smartSuggestions, setSmartSuggestions] = useState<string[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enhanced auto-complete with AI suggestions
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.length > 1) {
        const [suggestions, smart] = await Promise.all([
          fetchSuggestions(query),
          fetchSmartSuggestions(query)
        ]);
        setSuggestions([...suggestions, ...smart]);
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

  const fetchSmartSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    try {
      const response = await fetch(`/api/search/smart?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      return data.map((suggestion: string) => ({
        text: suggestion,
        type: 'smart' as const,
        relevance: 0.9
      }));
    } catch (error) {
      return [];
    }
  };

  // Enhanced voice search with language detection
  const startVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice search not supported in this browser');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = navigator.language || 'en-US';

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onresult = async (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      
      // AI-enhanced voice query processing
      const enhancedQuery = await enhanceVoiceQuery(transcript);
      onSearch(enhancedQuery);
    };

    recognition.start();
  };

  const enhanceVoiceQuery = async (transcript: string): Promise<string> => {
    try {
      const response = await fetch('/api/search/enhance-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript })
      });
      const data = await response.json();
      return data.enhancedQuery || transcript;
    } catch (error) {
      return transcript;
    }
  };

  return (
    <div className="advanced-search" ref={searchRef}>
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              onSearch(query);
              setShowSuggestions(false);
            }
          }}
          onFocus={() => query.length > 1 && setShowSuggestions(true)}
          placeholder="Search tricks, ask questions, or describe what you need..."
          className="search-input"
        />
        
        <div className="search-actions">
          <button 
            onClick={startVoiceSearch}
            className={`voice-btn ${isListening ? 'listening' : ''}`}
            title="Voice search"
          >
            {isListening ? '🔴' : '🎤'}
          </button>
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
              <div className="suggestion-meta">
                <span className="suggestion-type">
                  {suggestion.type === 'smart' ? '🧠 AI' : suggestion.type}
                </span>
                {suggestion.count && <span className="suggestion-count">{suggestion.count}</span>}
              </div>
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
          background: #f8fafc;
          border: 2px solid #cbd5e1;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .search-container:focus-within {
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .search-input {
          flex: 1;
          padding: 16px 20px;
          border: none;
          outline: none;
          font-size: 16px;
          background: transparent;
          color: #1e293b;
        }
        
        .search-input::placeholder {
          color: #64748b;
        }
        
        .search-actions {
          padding: 8px 12px;
        }
        
        .voice-btn {
          padding: 12px;
          border: none;
          background: #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 18px;
          transition: all 0.2s;
          color: #475569;
        }
        
        .voice-btn:hover {
          background: #cbd5e1;
          transform: scale(1.05);
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
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
          z-index: 10;
          max-height: 400px;
          overflow-y: auto;
        }
        
        .suggestion-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 20px;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;
          transition: background 0.2s;
        }
        
        .suggestion-item:hover {
          background: #f8fafc;
        }
        
        .suggestion-item.smart {
          background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%);
        }
        
        .suggestion-meta {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .suggestion-type {
          font-size: 12px;
          color: #64748b;
          text-transform: uppercase;
          font-weight: 600;
        }
        
        .suggestion-count {
          font-size: 12px;
          color: #94a3b8;
          background: #f1f5f9;
          padding: 2px 6px;
          border-radius: 4px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
