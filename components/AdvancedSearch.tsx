import { useState, useEffect, useRef } from 'react';

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
        try {
          const [suggestions, smart] = await Promise.all([
            fetchSuggestions(query),
            fetchSmartSuggestions(query)
          ]);
          setSuggestions([...suggestions, ...smart]);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Error fetching search suggestions:', error);
          setShowSuggestions(false);
        }
      } else {
        setShowSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const fetchSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    try {
      const response = await fetch(`/api/search/suggestions?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) return [];
      return await response.json();
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  };

  const fetchSmartSuggestions = async (searchQuery: string): Promise<SearchSuggestion[]> => {
    try {
      const response = await fetch(`/api/search/smart?q=${encodeURIComponent(searchQuery)}`);
      if (!response.ok) return [];
      const data = await response.json();
      return Array.isArray(data) ? data.map((suggestion: string) => ({
        text: suggestion,
        type: 'smart' as const,
        relevance: 0.9
      })) : [];
    } catch (error) {
      console.error('Error fetching smart suggestions:', error);
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
          position: relative !important;
          width: 100% !important;
          margin: 0 !important;
        }
        
        .search-container {
          display: flex !important;
          align-items: center !important;
          background: #f8fafc !important;
          border: 2px solid #cbd5e1 !important;
          border-radius: 12px !important;
          overflow: hidden !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;
          margin: 0 !important;
        }
        
        .search-container:focus-within {
          border-color: #3b82f6 !important;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1) !important;
        }
        
        .search-input {
          flex: 1 !important;
          padding: 16px 20px !important;
          border: none !important;
          outline: none !important;
          font-size: 16px !important;
          background: transparent !important;
          color: #1e293b !important;
          margin: 0 !important;
        }
        
        .search-input::placeholder {
          color: #64748b !important;
        }
        
        .search-actions {
          padding: 8px 12px !important;
          margin: 0 !important;
        }
        
        .voice-btn {
          padding: 12px !important;
          border: none !important;
          background: #e2e8f0 !important;
          border-radius: 8px !important;
          cursor: pointer !important;
          font-size: 18px !important;
          transition: all 0.2s !important;
          color: #475569 !important;
          margin: 0 !important;
        }
        
        .voice-btn:hover {
          background: #cbd5e1 !important;
          transform: scale(1.05) !important;
        }
        
        .voice-btn.listening {
          background: #ef4444 !important;
          animation: pulse 1s infinite !important;
        }
        
        .suggestions-dropdown {
          position: absolute !important;
          top: 100% !important;
          left: 0 !important;
          right: 0 !important;
          background: white !important;
          border: 1px solid #e2e8f0 !important;
          border-radius: 8px !important;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
          z-index: 1000 !important;
          max-height: 400px !important;
          overflow-y: auto !important;
          margin: 0 !important;
        }
        
        .suggestion-item {
          display: flex !important;
          justify-content: space-between !important;
          align-items: center !important;
          padding: 16px 20px !important;
          cursor: pointer !important;
          border-bottom: 1px solid #f1f5f9 !important;
          transition: background 0.2s !important;
          margin: 0 !important;
        }
        
        .suggestion-item:hover {
          background: #f8fafc !important;
        }
        
        .suggestion-item.smart {
          background: linear-gradient(90deg, #f0f9ff 0%, #ffffff 100%) !important;
        }
        
        .suggestion-meta {
          display: flex !important;
          align-items: center !important;
          gap: 8px !important;
          margin: 0 !important;
        }
        
        .suggestion-type {
          font-size: 12px !important;
          color: #64748b !important;
          text-transform: uppercase !important;
          font-weight: 600 !important;
          margin: 0 !important;
        }
        
        .suggestion-count {
          font-size: 12px !important;
          color: #94a3b8 !important;
          background: #f1f5f9 !important;
          padding: 2px 6px !important;
          border-radius: 4px !important;
          margin: 0 !important;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
      `}</style>
    </div>
  );
}
