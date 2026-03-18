import React, { useState, useRef, useEffect } from 'react';
import indianLocations from '../data/indianLocation';

const LocationAutocomplete = ({ value, onChange, placeholder, label }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchLocations = (query) => {
    if (!query || query.length < 2) return [];
    const q = query.toLowerCase();
    const results = [];

    indianLocations.forEach(loc => {
      // Match state/UT name
      if (loc.state.toLowerCase().includes(q)) {
        results.push({ name: loc.state, category: loc.type, icon: 'fa-flag' });
      }
      // Match districts
      loc.districts.forEach(district => {
        if (district.toLowerCase().includes(q)) {
          results.push({ name: district, category: `${loc.state} · ${loc.type}`, icon: 'fa-map-marker-alt' });
        }
      });
    });

    return results.slice(0, 15);
  };

  const handleChange = (e) => {
    const val = e.target.value;
    onChange(val);
    const results = searchLocations(val);
    setSuggestions(results);
    setShowDropdown(results.length > 0);
  };

  const handleSelect = (item) => {
    onChange(item.name);
    setShowDropdown(false);
  };

  return (
    <div className="form-group" ref={wrapperRef} style={{ position: 'relative' }}>
      {label && <label>{label}</label>}
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        onFocus={() => suggestions.length > 0 && setShowDropdown(true)}
        className="form-control"
        autoComplete="off"
      />
      {showDropdown && suggestions.length > 0 && (
        <ul style={{
          position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 1000,
          background: '#fff', border: '1px solid #ddd', borderRadius: '4px',
          maxHeight: '220px', overflowY: 'auto', listStyle: 'none',
          margin: 0, padding: 0, boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
        }}>
          {suggestions.map((item, i) => (
            <li key={i} onClick={() => handleSelect(item)} style={{
              padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid #eee',
              fontSize: '0.9rem', color: '#000', display: 'flex', alignItems: 'center', gap: '10px'
            }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#f0f0f0'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#fff'}
            >
              <i className={`fas ${item.icon}`} style={{ color: '#e74c3c', fontSize: '1rem', flexShrink: 0 }}></i>
              <div>
                <strong style={{ color: '#000' }}>{item.name}</strong>
                <span style={{ color: '#666', marginLeft: '6px', fontSize: '0.8rem' }}>
                  {item.category}
                </span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default LocationAutocomplete;
