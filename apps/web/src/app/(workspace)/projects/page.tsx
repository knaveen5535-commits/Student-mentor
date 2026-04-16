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
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28, maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 8 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 800,
            background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #c4b5fd 100%)',
            backgroundSize: '200%',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: 8,
          }}
        >
          📁 Projects
        </h1>
        <p style={{ color: 'rgba(240,242,255,0.5)' }}>
          Create and manage your AI projects
        </p>
      </div>

      {/* Create Project Card */}
      <div
        style={{
          background: 'rgba(15, 17, 24, 0.6)',
          backdropFilter: 'blur(40px) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 24,
          padding: '32px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#fff' }}>
          ✨ Create New Project
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <input
            placeholder="Project title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          />
          <textarea
            placeholder="Project description"
            rows={4}
            value={information}
            onChange={(e) => setInformation(e.target.value)}
            style={{
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontFamily: 'inherit',
              transition: 'all 0.3s ease',
              resize: 'vertical',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          />
          <button
            disabled={loading || !title.trim()}
            onClick={async () => {
              setError(null);
              try {
                await create(title, information);
                setTitle('');
                setInformation('');
              } catch (e: any) {
                setError(e?.message || 'Failed to create project');
              }
            }}
            style={{
              padding: '12px 24px',
              background: loading ? 'rgba(99,102,241,0.5)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)';
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)';
            }}
          >
            {loading ? 'Creating...' : '🚀 Create Project'}
          </button>
          {error && (
            <div
              style={{
                padding: '12px 16px',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: 12,
                color: '#fca5a5',
                fontSize: 14,
              }}
            >
              ⚠️ {error}
            </div>
          )}
        </div>
      </div>

      {/* Search Section */}
      <div
        style={{
          background: 'rgba(15, 17, 24, 0.6)',
          backdropFilter: 'blur(40px) brightness(1.05)',
          WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
          border: '1px solid rgba(255,255,255,0.15)',
          borderRadius: 24,
          padding: '32px',
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
        }}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#fff' }}>
          🔍 Search Projects
        </h2>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <input
            placeholder="Search by title"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              flex: 1,
              minWidth: 200,
              padding: '12px 16px',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              transition: 'all 0.3s ease',
              outline: 'none',
            }}
            onFocus={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
            }}
          />
          <button
            onClick={async () => {
              await refresh(q);
              const h = await history().catch(() => []);
              setHistoryItems(h as any);
            }}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 8px 24px rgba(99,102,241,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(99,102,241,0.3)';
            }}
          >
            Search
          </button>
          <button
            onClick={async () => {
              setQ('');
              await refresh('');
            }}
            style={{
              padding: '12px 24px',
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: 12,
              color: '#fff',
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
            }}
          >
            Clear
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: filtered.length === 0 ? '1fr' : 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
        }}
      >
        {loading && (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px' }}>
            <p style={{ fontSize: 16, color: 'rgba(240,242,255,0.6)' }}>⏳ Loading projects...</p>
          </div>
        )}
        {!loading && filtered.length === 0 && (
          <div
            style={{
              gridColumn: '1 / -1',
              textAlign: 'center',
              padding: '60px 40px',
              background: 'rgba(15, 17, 24, 0.4)',
              borderRadius: 24,
              border: '2px dashed rgba(255,255,255,0.1)',
            }}
          >
            <div style={{ fontSize: 48, marginBottom: 16 }}>📭</div>
            <p style={{ fontSize: 16, color: 'rgba(240,242,255,0.6)' }}>
              No projects yet. Create your first project above!
            </p>
          </div>
        )}
        {!loading && filtered.map((p) => (
          <div
            key={p.id}
            style={{
              background: 'rgba(15, 17, 24, 0.6)',
              backdropFilter: 'blur(40px) brightness(1.05)',
              WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: 20,
              padding: '24px',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              overflow: 'hidden',
              position: 'relative',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 16px 48px rgba(99,102,241,0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
              e.currentTarget.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, color: '#fff', flex: 1 }}>
                {p.title}
              </h3>
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'rgba(240,242,255,0.6)',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                maxHeight: '100px',
                overflow: 'hidden',
                marginBottom: 12,
              }}
            >
              {p.information}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span
                style={{
                  fontSize: 12,
                  color: 'rgba(240,242,255,0.4)',
                  background: 'rgba(99,102,241,0.1)',
                  padding: '4px 12px',
                  borderRadius: 8,
                }}
              >
                {new Date(p.created_at).toLocaleDateString()}
              </span>
              <span style={{ fontSize: 16 }}>→</span>
            </div>
          </div>
        ))}
      </div>

      {/* Search History Sidebar */}
      {historyItems.length > 0 && (
        <div
          style={{
            background: 'rgba(15, 17, 24, 0.6)',
            backdropFilter: 'blur(40px) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
            padding: '24px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <h3 style={{ fontSize: 14, fontWeight: 700, marginBottom: 16, color: '#fff' }}>
            ⏱️ Search History
          </h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {historyItems.map((h) => (
              <button
                key={h.id}
                onClick={async () => {
                  setQ(h.query);
                  await refresh(h.query);
                }}
                style={{
                  padding: '8px 16px',
                  background: 'rgba(99,102,241,0.15)',
                  border: '1px solid rgba(99,102,241,0.3)',
                  borderRadius: 8,
                  color: '#a5b4fc',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.25)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(99,102,241,0.15)';
                  e.currentTarget.style.borderColor = 'rgba(99,102,241,0.3)';
                }}
              >
                {h.query}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
