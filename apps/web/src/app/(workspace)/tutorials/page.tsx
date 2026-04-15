'use client';

import { useMemo, useState } from 'react';

export default function TutorialsPage() {
  const [q, setQ] = useState('');
  const url = useMemo(() => {
    const query = q.trim();
    if (!query) return null;
    return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
  }, [q]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>Tutorials</h1>
      <div className="card">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Search YouTube" value={q} onChange={(e) => setQ(e.target.value)} />
          <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
            <a href={url || '#'} target="_blank" rel="noreferrer">
              <button className="primary" disabled={!url}>Open YouTube search</button>
            </a>
            <button onClick={() => setQ('')}>Clear</button>
          </div>
          <div style={{ opacity: 0.75, fontSize: 13 }}>
            This uses the public YouTube search page (no API key required).
          </div>
        </div>
      </div>
    </div>
  );
}
