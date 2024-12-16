import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, Ship } from 'lucide-react';
import FormError from './FormError';
import { searchAddresses } from '../../services/addressService';

interface AddressInputProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
}

interface Suggestion {
  label: string;
  value: string;
  type: 'airport' | 'port' | 'city';
}

export default function AddressInput({
  label,
  name,
  value,
  onChange,
  required = false,
  error
}: AddressInputProps) {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    
    const results = searchAddresses(query);
    setSuggestions(results);
    setShowSuggestions(true);
    setFocusedIndex(-1);
  };

  const handleSuggestionClick = (suggestion: Suggestion) => {
    onChange(suggestion.value);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
          handleSuggestionClick(suggestions[focusedIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  };

  return (
    <div className="space-y-2" ref={wrapperRef}>
      <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <MapPin size={18} />
        {label}
      </label>
      <div className="relative">
        <MapPin 
          size={18} 
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          required={required}
          className={`
            w-full px-4 py-2 pl-10 border rounded-md 
            focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${error ? 'border-red-300' : 'border-gray-300'}
          `}
          placeholder="Enter airport, port, or city (e.g., FCO, Venice Port)"
          autoComplete="off"
        />
        
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200">
            <ul className="py-1">
              {suggestions.map((suggestion, index) => (
                <li
                  key={suggestion.value}
                  className={`px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                    index === focusedIndex ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  <div className="flex items-center gap-2">
                    {suggestion.type === 'airport' ? (
                      <Plane size={16} className="text-blue-600" />
                    ) : suggestion.type === 'port' ? (
                      <Ship size={16} className="text-blue-600" />
                    ) : (
                      <MapPin size={16} className="text-gray-600" />
                    )}
                    {suggestion.label}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {error && <FormError message={error} />}
      <p className="text-xs text-gray-500">
        Enter an airport code, port name, or city name
      </p>
    </div>
  );
}