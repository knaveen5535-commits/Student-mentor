'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useChatStore } from '../../store/chatStore';
import { useSupabaseAuth } from '../../hooks/useSupabaseAuth';
import { apiFetch } from '../../lib/api';

const NAV_ITEMS = [
  { href: '/chat',      label: 'Chat',       icon: '💬', desc: 'AI conversations' },
  { href: '/projects',  label: 'Projects',   icon: '📁', desc: 'Your projects'    },
  { href: '/tutorials', label: 'Tutorials',  icon: '🎓', desc: 'Learn & grow'     },
  { href: '/profile',   label: 'Profile',    icon: '👤', desc: 'Account settings' },
];

function BottomDock() {
  const pathname = usePathname();
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 24,
        left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex',
        alignItems: 'flex-end',
        gap: 12,
        padding: '12px 24px',
        background: 'rgba(20, 20, 25, 0.6)',
        backdropFilter: 'blur(30px) saturate(1.5)',
        WebkitBackdropFilter: 'blur(30px) saturate(1.5)',
        borderRadius: 32,
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 20px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
        zIndex: 50,
      }}
    >
      {NAV_ITEMS.map((item, idx) => {
        const active = pathname === item.href || pathname.startsWith(item.href + '/');
        // Simple scale effect mimicking macOS dock
        const distance = hoveredIdx !== null ? Math.abs(hoveredIdx - idx) : 2;
        const scale = hoveredIdx === idx ? 1.4 : distance === 1 ? 1.15 : 1;
        const margin = hoveredIdx === idx ? '0 12px' : distance === 1 ? '0 6px' : '0 0';

        return (
          <Link
            key={item.href}
            href={item.href}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
            style={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textDecoration: 'none',
              transition: 'all 0.2s cubic-bezier(0.2, 0.8, 0.2, 1)',
              transform: `scale(${scale}) translateY(${hoveredIdx === idx ? -10 : 0}px)`,
              margin: margin,
              zIndex: hoveredIdx === idx ? 10 : 1,
            }}
          >
            {/* Tooltip */}
            {hoveredIdx === idx && (
              <div
                style={{
                  position: 'absolute',
                  top: -40,
                  background: 'rgba(0,0,0,0.8)',
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  padding: '4px 10px',
                  borderRadius: 8,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  animation: 'fadeIn 0.2s ease-out',
                }}
              >
                {item.label}
              </div>
            )}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 20,
                background: active
                  ? 'linear-gradient(135deg, rgba(99,102,241,0.5), rgba(139,92,246,0.3))'
                  : 'rgba(255,255,255,0.05)',
                border: active
                  ? '2px solid rgba(165,180,252,0.5)'
                  : '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 24,
                boxShadow: active ? '0 8px 24px rgba(99,102,241,0.4)' : 'none',
                backdropFilter: 'blur(10px)',
              }}
            >
              <span style={{ filter: active ? 'drop-shadow(0 0 8px rgba(255,255,255,0.8))' : 'none' }}>
                {item.icon}
              </span>
            </div>
            {/* Active dot */}
            {active && (
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: '50%',
                  background: '#a5b4fc',
                  marginTop: 6,
                  boxShadow: '0 0 8px #a5b4fc',
                }}
              />
            )}
          </Link>
        );
      })}
    </div>
  );
}

function TopHUD({
  user,
  onToggleDrawer,
  drawerOpen
}: {
  user: any;
  onToggleDrawer: () => void;
  drawerOpen: boolean;
}) {
  const [time, setTime] = useState('');
  useEffect(() => {
    const update = () => {
      setTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const avatarLetter = (user?.name || user?.email || 'U')[0].toUpperCase();

  return (
    <div
      style={{
        position: 'fixed',
        top: 24,
        left: 24,
        right: 24,
        height: 64,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        background: 'rgba(15, 15, 20, 0.4)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        borderRadius: 24,
        border: '1px solid rgba(255,255,255,0.08)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        zIndex: 50,
      }}
    >
      {/* Logo Area */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            boxShadow: '0 4px 16px rgba(99,102,241,0.5)',
            overflow: 'hidden'
          }}
        >
          <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#e0e7ff', letterSpacing: 0.5 }}>
            AI MENTOR
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.5)', fontWeight: 500, letterSpacing: 1 }}>
            WORKSPACE
          </div>
        </div>
      </div>

      {/* Clock & Status */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 16,
          background: 'rgba(0,0,0,0.2)',
          padding: '6px 16px',
          borderRadius: 999,
          border: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(240,242,255,0.9)' }}>
          {time}
        </span>
        <div style={{ width: 1, height: 12, background: 'rgba(255,255,255,0.2)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px #10b981', animation: 'pulse-glow 2s infinite' }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: '#34d399' }}>CORE ONLINE</span>
        </div>
      </div>

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <Link
          href="/chat"
          style={{
            padding: '8px 16px',
            borderRadius: 12,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
            border: '1px solid rgba(99,102,241,0.4)',
            color: '#a5b4fc',
            fontSize: 13,
            fontWeight: 700,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(99,102,241,0.4), rgba(139,92,246,0.4))';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <span style={{ fontSize: 16 }}>+</span> New Chat
        </Link>
        <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.1)' }} />
        
        <button
          onClick={onToggleDrawer}
          style={{
            background: drawerOpen ? 'rgba(99,102,241,0.3)' : 'transparent',
            border: 'none',
            color: drawerOpen ? '#a5b4fc' : 'rgba(240,242,255,0.7)',
            fontSize: 20,
            cursor: 'pointer',
            padding: 8,
            borderRadius: 8,
            transition: 'all 0.2s',
          }}
        >
          {drawerOpen ? '📖' : '📚'}
        </button>

        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #2dd4bf)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 14,
            fontWeight: 700,
            color: '#fff',
            border: '2px solid rgba(255,255,255,0.2)'
          }}
        >
          {avatarLetter}
        </div>
      </div>
    </div>
  );
}

function RightDrawer({
  open,
  onClose,
  logout
}: {
  open: boolean;
  onClose: () => void;
  logout: () => void;
}) {
  const threads = useChatStore((s) => s.threads);
  const deleteThreadLocal = useChatStore((s) => s.deleteThread);
  const profile = useUserStore((s) => s.profile);
  const pathname = usePathname();
  const router = useRouter();

  const handleDelete = async (e: React.MouseEvent, threadId: string) => {
    e.preventDefault();
    e.stopPropagation();

    // Optimistically remove from UI
    deleteThreadLocal(threadId);

    // If we are currently on this chat, redirect away
    if (pathname === `/chat/${threadId}`) {
      router.push('/chat');
    }

    try {
      if (profile?.email) {
        await apiFetch(`/chat/threads/${threadId}`, {
          method: 'DELETE',
          userEmail: profile.email
        });
      }
    } catch (err) {
      console.error('Failed to delete thread:', err);
    }
  };

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)',
          zIndex: 80,
          opacity: open ? 1 : 0,
          pointerEvents: open ? 'auto' : 'none',
          transition: 'opacity 0.3s ease',
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 24,
          bottom: 120, // leave space for dock
          right: open ? 24 : -400,
          width: 340,
          background: 'rgba(15, 15, 20, 0.7)',
          backdropFilter: 'blur(40px)',
          WebkitBackdropFilter: 'blur(40px)',
          borderRadius: 32,
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.5), inset 1px 1px 0 rgba(255,255,255,0.1)',
          zIndex: 90,
          transition: 'right 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          padding: 24,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <h2 style={{ margin: 0, fontSize: 18, color: '#e0e7ff', fontWeight: 700 }}>Chat History</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#a5b4fc', cursor: 'pointer', fontSize: 24, lineHeight: 1 }}>×</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {threads.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, textAlign: 'center', padding: 20 }}>
              No history found. Initialize a new sequence.
            </div>
          ) : (
            threads.map((t) => {
              const active = pathname === `/chat/${t.id}`;
              return (
                <Link
                  key={t.id}
                  href={`/chat/${t.id}`}
                  onClick={onClose}
                  style={{
                    padding: 16,
                    borderRadius: 16,
                    background: active ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.03)',
                    border: active ? '1px solid rgba(99,102,241,0.4)' : '1px solid rgba(255,255,255,0.05)',
                    color: active ? '#c4b5fd' : 'rgba(255,255,255,0.7)',
                    textDecoration: 'none',
                    fontSize: 14,
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 8,
                  }}
                  onMouseEnter={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)';
                  }}
                  onMouseLeave={(e) => {
                    if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1, overflow: 'hidden' }}>
                    <span style={{ marginRight: 8, opacity: active ? 1 : 0.5 }}>💬</span>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {t.title || 'Untitled Thread'}
                    </span>
                  </div>
                  
                  <button
                    onClick={(e) => handleDelete(e, t.id)}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'rgba(239, 68, 68, 0.6)',
                      cursor: 'pointer',
                      padding: '4px',
                      borderRadius: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      (e.currentTarget as HTMLElement).style.color = '#ef4444';
                      (e.currentTarget as HTMLElement).style.background = 'rgba(239, 68, 68, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.color = 'rgba(239, 68, 68, 0.6)';
                      (e.currentTarget as HTMLElement).style.background = 'transparent';
                    }}
                    title="Delete Chat"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M3 6h18"></path>
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                    </svg>
                  </button>
                </Link>
              );
            })
          )}
        </div>

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button
            onClick={logout}
            style={{
              width: '100%',
              padding: 14,
              borderRadius: 16,
              background: 'rgba(239,68,68,0.1)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#fca5a5',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = 'rgba(239,68,68,0.1)';
            }}
          >
            DISCONNECT
          </button>
        </div>
      </div>
    </>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const hydrate = useUserStore((s) => s.hydrate);
  const { logout, loading: authLoading } = useSupabaseAuth();
  const didLogout = useRef(false);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const user = profile ? { name: profile.name, email: profile.email } : null;

  const handleLogout = async () => {
    if (authLoading || didLogout.current) return;
    didLogout.current = true;
    await logout();
    router.replace('/login');
  };

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        background: '#050508',
        overflow: 'hidden',
        position: 'relative',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Immersive Dark Mesh Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 15% 50%, rgba(99, 102, 241, 0.15), transparent 50%),
            radial-gradient(circle at 85% 30%, rgba(139, 92, 246, 0.15), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(45, 212, 191, 0.1), transparent 50%)
          `,
          filter: 'blur(60px)',
          zIndex: 0,
          animation: 'pulse-glow 10s alternate infinite ease-in-out',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.3,
          zIndex: 0,
        }}
      />

      <TopHUD user={user} onToggleDrawer={() => setDrawerOpen(!drawerOpen)} drawerOpen={drawerOpen} />
      
      <RightDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)} logout={handleLogout} />

      <BottomDock />

      {/* Main Stage */}
      <main
        style={{
          position: 'absolute',
          top: 112, // Below TopHUD
          bottom: 112, // Above Dock
          left: 24,
          right: 24,
          zIndex: 10,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 32,
          overflow: 'hidden',
        }}
      >
        {children}
      </main>

      <style>{`
        @keyframes pulse-glow {
          0% { opacity: 0.8; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.05); }
          100% { opacity: 0.8; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
