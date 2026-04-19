'use client';

import { useState } from 'react';

const TOPICS = [
  { title: 'Machine Learning Basics', query: 'machine learning basics full course', color: '#6366f1' },
  { title: 'Next.js 14 App Router', query: 'next js 14 app router tutorial', color: '#8b5cf6' },
  { title: 'Supabase Authentication', query: 'supabase authentication crash course', color: '#10b981' },
  { title: 'Python Neural Networks', query: 'python neural networks from scratch', color: '#f59e0b' },
  { title: 'Advanced React Patterns', query: 'advanced react patterns and best practices', color: '#ec4899' },
  { title: 'System Design Interview', query: 'system design interview crash course', color: '#3b82f6' },
];

export default function TutorialsPage() {
  const [q, setQ] = useState('');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`, '_blank');
    }
  };

  const handleTopicClick = (query: string) => {
    window.open(`https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`, '_blank');
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        padding: '24px 32px',
        animation: 'fadeIn 0.4s ease-out',
        color: '#f0f2ff',
        position: 'relative'
      }}
    >
      {/* Header */}
      <div style={{ marginBottom: 40, textAlign: 'center', marginTop: 24 }}>
        <h1 style={{ fontSize: 40, fontWeight: 800, marginBottom: 12, background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: -1 }}>
          Neural Knowledge Base
        </h1>
        <p style={{ color: 'rgba(240,242,255,0.5)', fontSize: 16 }}>
          Access terabytes of visual training data directly from the YouTube databanks.
        </p>
      </div>

      {/* Interactive Global Search */}
      <div style={{ position: 'relative', width: '100%', maxWidth: 640, margin: '0 auto 48px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%' }}>
          <div style={{ position: 'absolute', left: 24, top: '50%', transform: 'translateY(-50%)', fontSize: 20, pointerEvents: 'none' }}>
            🔍
          </div>
          <input
            type="text"
            placeholder="Query global databanks (Search YouTube)..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{
              width: '100%',
              padding: '20px 24px 20px 60px',
              borderRadius: 24,
              border: '2px solid rgba(255,255,255,0.1)',
              background: 'rgba(15, 17, 24, 0.6)',
              backdropFilter: 'blur(20px)',
              color: '#fff',
              fontSize: 16,
              outline: 'none',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)'
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = 'rgba(99,102,241,0.6)';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(99,102,241,0.2), inset 0 1px 0 rgba(255,255,255,0.1)';
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05)';
            }}
          />
          <button
            type="submit"
            disabled={!q.trim()}
            style={{
              position: 'absolute',
              right: 8,
              top: 8,
              bottom: 8,
              padding: '0 24px',
              borderRadius: 16,
              border: 'none',
              background: q.trim() ? 'linear-gradient(135deg, #ef4444, #dc2626)' : 'rgba(255,255,255,0.05)',
              color: q.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
              fontWeight: 700,
              cursor: q.trim() ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              gap: 8
            }}
          >
            <span style={{ fontSize: 18 }}>▶</span> YouTube
          </button>
        </form>
      </div>

      {/* Suggested Topics Grid */}
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20, color: '#a5b4fc', letterSpacing: 1, textTransform: 'uppercase' }}>
        Curated Neural Pathways
      </h3>
      
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: 20,
          paddingBottom: 40,
        }}
      >
        {TOPICS.map((topic, idx) => (
          <div
            key={idx}
            onClick={() => handleTopicClick(topic.query)}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              background: 'rgba(20, 22, 30, 0.4)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
              padding: '32px 24px',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              transition: 'all 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transform: hoveredIdx === idx ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
              boxShadow: hoveredIdx === idx 
                ? `0 20px 40px rgba(0,0,0,0.4), inset 0 0 0 1px ${topic.color}80, 0 0 30px ${topic.color}20` 
                : '0 4px 12px rgba(0,0,0,0.2)',
            }}
          >
            {/* Hover Glow Background */}
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '100%',
                background: `radial-gradient(circle at top right, ${topic.color}25, transparent 70%)`,
                opacity: hoveredIdx === idx ? 1 : 0,
                transition: 'opacity 0.4s ease',
              }}
            />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div 
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 16,
                  background: `linear-gradient(135deg, ${topic.color}50, transparent)`,
                  border: `1px solid ${topic.color}80`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 24,
                  marginBottom: 20,
                  boxShadow: `0 8px 24px ${topic.color}30`
                }}
              >
                ▶
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px', color: '#e0e7ff', lineHeight: 1.3 }}>
                {topic.title}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 16 }}>
                <span style={{ fontSize: 13, color: topic.color, fontWeight: 600 }}>Access Feed</span>
                <span style={{ transition: 'transform 0.2s', transform: hoveredIdx === idx ? 'translateX(4px)' : 'none', color: topic.color }}>→</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
