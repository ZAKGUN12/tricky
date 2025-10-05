import { useState } from 'react';
import { countries } from '../lib/mockData';

interface CountryChainProps {
  selectedCountry: string;
  onCountrySelect: (countryCode: string) => void;
}

export default function CountryChain({ selectedCountry, onCountrySelect }: CountryChainProps) {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-4xl mx-auto my-8">
      <div className="flex flex-wrap justify-center items-center gap-2 p-4">
        {countries.map((country, index) => {
          const isSelected = selectedCountry === country.code;
          const isHovered = hoveredCountry === country.code;
          const hasContent = country.tricks > 0;
          
          return (
            <div
              key={country.code}
              className={`
                relative group cursor-pointer transition-all duration-300 ease-in-out
                ${isSelected ? 'scale-125 z-10' : 'scale-100'}
                ${isHovered ? 'scale-110' : ''}
                ${hasContent ? 'animate-pulse-slow' : ''}
              `}
              style={{
                animationDelay: `${index * 0.1}s`
              }}
              onClick={() => onCountrySelect(country.code)}
              onMouseEnter={() => setHoveredCountry(country.code)}
              onMouseLeave={() => setHoveredCountry(null)}
            >
              {/* Connection line to next country */}
              {index < countries.length - 1 && (
                <div className={`
                  absolute top-1/2 -right-1 w-2 h-0.5 bg-gradient-to-r from-blue-300 to-transparent
                  transition-all duration-300
                  ${isSelected || isHovered ? 'from-blue-500' : ''}
                `} />
              )}
              
              {/* Country flag circle */}
              <div className={`
                w-12 h-12 rounded-full flex items-center justify-center text-2xl
                border-2 transition-all duration-300 shadow-lg
                ${isSelected 
                  ? 'border-blue-500 bg-blue-50 shadow-blue-200' 
                  : hasContent 
                    ? 'border-green-400 bg-green-50 shadow-green-200' 
                    : 'border-gray-300 bg-gray-50 shadow-gray-200'
                }
                ${isHovered ? 'shadow-xl transform rotate-12' : ''}
                hover:shadow-xl
              `}>
                {country.flag}
              </div>

              {/* Trick count badge */}
              {hasContent && (
                <div className={`
                  absolute -top-1 -right-1 w-5 h-5 rounded-full 
                  bg-red-500 text-white text-xs flex items-center justify-center
                  font-bold animate-bounce
                  ${isSelected ? 'bg-red-600' : ''}
                `}>
                  {country.tricks}
                </div>
              )}

              {/* Tooltip */}
              <div className={`
                absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2
                px-2 py-1 bg-black text-white text-xs rounded whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                pointer-events-none z-20
              `}>
                {country.name}
                {hasContent && (
                  <span className="text-green-300"> • {country.tricks} tricks</span>
                )}
              </div>
            </div>
          );
        })}
        
        {/* Closing the chain - connect last to first */}
        <div className="w-2 h-0.5 bg-gradient-to-r from-blue-300 to-blue-500 animate-pulse" />
      </div>

      {/* Selected country info */}
      {selectedCountry && (
        <div className="text-center mt-4 animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full">
            <span className="text-2xl">
              {countries.find(c => c.code === selectedCountry)?.flag}
            </span>
            <span className="font-medium text-blue-800">
              {countries.find(c => c.code === selectedCountry)?.name}
            </span>
            <span className="text-blue-600 text-sm">
              ({countries.find(c => c.code === selectedCountry)?.tricks || 0} tricks)
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
