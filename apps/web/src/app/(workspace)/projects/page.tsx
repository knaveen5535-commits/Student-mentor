'use client';

import { useEffect, useMemo, useState } from 'react';
import { useProjects } from '../../../hooks/useProjects';

export default function ProjectsPage() {
  const { projects, loading, refresh, create, history } = useProjects();

  const [title, setTitle] = useState('');
  const [information, setInformation] = useState('');
  const [q, setQ] = useState('');
  const [historyItems, setHistoryItems] = useState<Array<{ id: string; query: string; created_at: string }>>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refresh('');
    history().then(setHistoryItems).catch(() => {});
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => projects, [projects]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <h1>Projects</h1>

      <div className="card">
        <strong>Create project</strong>
        <div style={{ height: 10 }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <input placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea
            placeholder="Information"
            rows={4}
            value={information}
            onChange={(e) => setInformation(e.target.value)}
          />
          <button
            className="primary"
            disabled={loading}
            onClick={async () => {
              setError(null);
              try {
                await create(title, information);
                setTitle('');
                setInformation('');
              } catch (e: any) {
                setError(e?.message || 'Failed');
              }
            }}
          >
            Create
          </button>
          {error ? <div style={{ color: 'crimson' }}>{error}</div> : null}
        </div>
      </div>

      <div className="card">
        <strong>Search</strong>
        <div style={{ height: 10 }} />
        <div className="row">
          <input placeholder="Search by title" value={q} onChange={(e) => setQ(e.target.value)} />
          <button
            className="primary"
            onClick={async () => {
              await refresh(q);
              const h = await history().catch(() => []);
              setHistoryItems(h as any);
            }}
          >
            Search
          </button>
          <button
            onClick={async () => {
              setQ('');
              await refresh('');
            }}
          >
            Clear
          </button>
        </div>
      </div>

      <div className="row" style={{ alignItems: 'flex-start' }}>
        <div className="card" style={{ flex: 2 }}>
          <strong>Projects</strong>
          <div style={{ height: 10 }} />
          {loading ? <div>Loading...</div> : null}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {filtered.length === 0 ? (
              <div style={{ opacity: 0.75 }}>No projects yet.</div>
            ) : (
              filtered.map((p) => (
                <div key={p.id} className="card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                    <strong>{p.title}</strong>
                    <span style={{ opacity: 0.7, fontSize: 12 }}>{new Date(p.created_at).toLocaleString()}</span>
                  </div>
                  <div style={{ whiteSpace: 'pre-wrap', marginTop: 6 }}>{p.information}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="card" style={{ flex: 1 }}>
          <strong>Search history</strong>
          <div style={{ height: 10 }} />
          {historyItems.length === 0 ? (
            <div style={{ opacity: 0.75 }}>No searches yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {historyItems.map((h) => (
                <button
                  key={h.id}
                  onClick={async () => {
                    setQ(h.query);
                    await refresh(h.query);
                  }}
                  style={{ textAlign: 'left' }}
                >
                  {h.query}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
