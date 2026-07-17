'use client';

import { useState, useRef, useEffect } from 'react';

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  allowCustom?: boolean;
}

export default function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  className = '',
  allowCustom = true,
}: CustomSelectProps) {
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const isPredefined = options.some((o) => o.value === value);
  const displayValue = isPredefined
    ? options.find((o) => o.value === value)?.label || value
    : value;

  useEffect(() => {
    if (!isPredefined && value) {
      setIsCustom(true);
      setCustomValue(value);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (val: string) => {
    onChange(val);
    setIsCustom(false);
    setCustomValue('');
    setIsOpen(false);
    setSearch('');
  };

  const handleCustomSubmit = () => {
    if (customValue.trim()) {
      onChange(customValue.trim());
      setIsOpen(false);
      setSearch('');
    }
  };

  const handleClear = () => {
    onChange('');
    setIsCustom(false);
    setCustomValue('');
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 50);
          }
        }}
        className="w-full bg-input-bg border border-border rounded-lg px-4 py-3 text-sm text-foreground text-left focus:outline-none focus:border-primary flex items-center justify-between"
      >
        <span className={value ? 'text-foreground' : 'text-muted'}>
          {value ? displayValue : placeholder}
        </span>
        <svg className={`w-4 h-4 text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-auto">
          <div className="sticky top-0 bg-card border-b border-border p-2">
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className="w-full bg-input-bg border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
            />
          </div>

          {filtered.length > 0 ? (
            <div className="py-1">
              {filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => handleSelect(opt.value)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                    value === opt.value
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-foreground hover:bg-background/5'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="px-4 py-2 text-sm text-muted">No matches</div>
          )}

          {allowCustom && (
            <div className="border-t border-border p-2">
              <p className="text-[10px] text-muted mb-1.5 uppercase tracking-wider font-bold">Or type custom value</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customValue}
                  onChange={(e) => setCustomValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleCustomSubmit())}
                  placeholder="Custom value..."
                  className="flex-1 bg-input-bg border border-border rounded px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-primary"
                />
                <button
                  type="button"
                  onClick={handleCustomSubmit}
                  className="px-3 py-1.5 bg-primary text-foreground text-xs font-bold rounded hover:bg-primary/80 transition-colors"
                >
                  Set
                </button>
              </div>
            </div>
          )}

          {value && (
            <div className="border-t border-border p-2">
              <button
                type="button"
                onClick={handleClear}
                className="w-full text-center px-3 py-1.5 text-xs text-red-400 hover:bg-red-500/10 rounded transition-colors"
              >
                Clear selection
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
