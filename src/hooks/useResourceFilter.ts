import { useState, useMemo } from 'react';
import Fuse from 'fuse.js';

export interface Resource {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  isVerified: boolean;
}

const fuseOptions = {
  keys: [
    { name: 'name', weight: 0.4 },
    { name: 'category', weight: 0.3 },
    { name: 'description', weight: 0.2 },
    { name: 'location', weight: 0.1 }
  ],
  threshold: 0.3,
  includeScore: true,
  ignoreLocation: true
};

export function useResourceFilter(resources: Resource[]) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const fuse = useMemo(() => new Fuse(resources, fuseOptions), [resources]);

  const filteredResources = useMemo(() => {
    let results = resources;
    if (selectedCategory !== 'all') {
      results = results.filter(r => r.category === selectedCategory);
    }
    if (query.trim()) {
      const fuseResults = fuse.search(query);
      results = fuseResults.map(result => result.item);
      if (selectedCategory !== 'all') {
        results = results.filter(r => r.category === selectedCategory);
      }
    }
    return results;
  }, [query, selectedCategory, resources, fuse]);

  return { query, setQuery, selectedCategory, setSelectedCategory, filteredResources };
}
