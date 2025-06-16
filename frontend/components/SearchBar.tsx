// components/SearchBar.tsx
import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => (
  <div className="relative mb-4">
    <Search 
      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" 
      size={16} 
    />
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder="Buscar criptomoeda..."
      className="w-full pl-10 p-2 rounded-md border border-input bg-background text-foreground focus:ring focus:ring-primary outline-none transition-colors"
    />
  </div>
);
