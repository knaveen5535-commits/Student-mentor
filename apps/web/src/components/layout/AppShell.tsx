'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUserStore } from '../../store/userStore';
import { useChatStore } from '../../store/chatStore';

/* ─────────────────── Nav items ────────────────── */
const NAV_ITEMS = [
  { href: '/chat',      label: 'Chat',       icon: '💬', desc: 'AI conversations' },
  { href: '/projects',  label: 'Projects',   icon: '📁', desc: 'Your projects'    },
  { href: '/tutorials', label: 'Tutorials',  icon: '🎓', desc: 'Learn & grow'     },
  { href: '/profile',   label: 'Profile',    icon: '👤', desc: 'Account settings' },
];

function SidebarNav({
  href,
  label,
  icon,
  desc,
  collapsed,
  onClick,
}: {
  href: string;
  label: string;
  icon: string;
  desc: string;
  collapsed: boolean;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  const [hovering, setHovering] = useState(false);

  return (
    <Link
      href={href}
      onClick={onClick}
      title={collapsed ? label : undefined}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: collapsed ? 0 : 12,
        padding: collapsed ? '13px' : '12px 14px',
        borderRadius: 12,
        transition: 'all 0.2s ease',
        textDecoration: 'none',
        position: 'relative',
        overflow: 'hidden',
        justifyContent: collapsed ? 'center' : 'flex-start',
        background: active
          ? 'linear-gradient(135deg, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.15) 100%)'
          : hovering
          ? 'rgba(255,255,255,0.05)'
          : 'transparent',
        border: active
          ? '1px solid rgba(99,102,241,0.3)'
          : '1px solid transparent',
        boxShadow: active ? '0 4px 16px rgba(99,102,241,0.12)' : 'none',
      }}
    >
      {/* Active indicator bar */}
      {active && (
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: '20%',
            bottom: '20%',
            width: 3,
            background: 'linear-gradient(180deg, #6366f1, #a78bfa)',
            borderRadius: '0 3px 3px 0',
          }}
        />
      )}

      {/* Icon */}
      <span
        style={{
          fontSize: 20,
          flexShrink: 0,
          filter: active ? 'drop-shadow(0 0 8px rgba(99,102,241,0.6))' : 'none',
          transition: 'filter 0.2s ease',
        }}
      >
        {icon}
      </span>

      {/* Label + desc */}
      {!collapsed && (
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 14,
              fontWeight: active ? 600 : 500,
              color: active ? '#c4b5fd' : 'rgba(240,242,255,0.75)',
              lineHeight: 1.2,
              whiteSpace: 'nowrap',
            }}
          >
            {label}
          </div>
          <div
            style={{
              fontSize: 11,
              color: 'rgba(240,242,255,0.3)',
              marginTop: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {desc}
          </div>
        </div>
      )}
    </Link>
  );
}

/* ─────────────────── Sidebar ──────────────────── */
function Sidebar({
  collapsed,
  onToggle,
  user,
  logout,
}: {
  collapsed: boolean;
  onToggle: () => void;
  user: any;
  logout: () => void;
}) {
  const [time, setTime] = useState('');
  const [showChats, setShowChats] = useState(false);
  const threads = useChatStore((s) => s.threads);
  const pathname = usePathname();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const avatarLetter = (user?.name || user?.email || 'U')[0].toUpperCase();
  const hue = ((avatarLetter.charCodeAt(0) - 65) / 26) * 360;

  return (
    <div
      style={{
        width: collapsed ? 72 : 264,
        height: '100vh',
        flexShrink: 0,
        background: 'rgba(14, 15, 20, 0.98)',
        backdropFilter: 'blur(40px) brightness(1.05)',
        WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
        borderRight: '1px solid rgba(99, 102, 241, 0.2)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: 'inset -1px 0 0 rgba(255,255,255,0.08)',
      }}
    >
      {/* Top: Logo + toggle */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '20px 0' : '20px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
          flexShrink: 0,
          minHeight: 70,
        }}
      >
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 18,
                boxShadow: '0 4px 12px rgba(99,102,241,0.4)',
                flexShrink: 0,
              }}
            >
              🧠
            </div>
            <span
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontWeight: 700,
                fontSize: 16,
                background: 'linear-gradient(135deg, #e0e7ff, #a5b4fc)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                whiteSpace: 'nowrap',
              }}
            >
              AI Mentor
            </span>
          </div>
        )}

        {collapsed && (
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 18,
            }}
          >
            🧠
          </div>
        )}

        {!collapsed && (
          <button
            id="sidebar-collapse-toggle"
            onClick={onToggle}
            title="Collapse sidebar"
            style={{
              width: 30,
              height: 30,
              borderRadius: 8,
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(240,242,255,0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              fontSize: 14,
              transition: 'all 0.2s ease',
              flexShrink: 0,
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(99,102,241,0.15)';
              el.style.color = '#a5b4fc';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.background = 'rgba(255,255,255,0.05)';
              el.style.color = 'rgba(240,242,255,0.5)';
            }}
          >
            ◀
          </button>
        )}

        {collapsed && (
          <button
            style={{ display: 'none' }}
            onClick={onToggle}
          />
        )}
      </div>

      {/* Expand button when collapsed */}
      {collapsed && (
        <button
          id="sidebar-expand-toggle"
          onClick={onToggle}
          title="Expand sidebar"
          style={{
            margin: '8px auto',
            width: 40,
            height: 30,
            borderRadius: 8,
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.06)',
            color: 'rgba(240,242,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 12,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(99,102,241,0.15)';
            el.style.color = '#a5b4fc';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(255,255,255,0.04)';
            el.style.color = 'rgba(240,242,255,0.4)';
          }}
        >
          ▶
        </button>
      )}

      {/* Nav */}
      <nav
        style={{
          flex: 1,
          padding: collapsed ? '8px 8px' : '12px 10px',
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        {!collapsed && (
          <div
            style={{
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'rgba(240,242,255,0.25)',
              padding: '4px 14px 8px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Navigation</span>
            <button
              onClick={() => setShowChats(!showChats)}
              title="Toggle chats"
              style={{
                width: 24,
                height: 24,
                borderRadius: 6,
                background: showChats ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
                transition: 'all 0.2s ease',
                boxShadow: '0 2px 8px rgba(99,102,241,0.3)',
                border: 'none',
                cursor: 'pointer',
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1.1)';
                el.style.boxShadow = '0 4px 12px rgba(99,102,241,0.5)';
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'scale(1)';
                el.style.boxShadow = '0 2px 8px rgba(99,102,241,0.3)';
              }}
            >
              +
            </button>
          </div>
        )}

        {collapsed && (
          <button
            onClick={() => setShowChats(!showChats)}
            title="Toggle chats"
            style={{
              width: 36,
              height: 36,
              marginLeft: 'auto',
              marginRight: 'auto',
              marginTop: 4,
              marginBottom: 4,
              borderRadius: 8,
              background: showChats ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 16,
              fontWeight: 700,
              color: '#fff',
              transition: 'all 0.2s ease',
              boxShadow: '0 4px 12px rgba(99,102,241,0.3)',
              border: 'none',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1.1)';
              el.style.boxShadow = '0 6px 16px rgba(99,102,241,0.5)';
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLElement;
              el.style.transform = 'scale(1)';
              el.style.boxShadow = '0 4px 12px rgba(99,102,241,0.3)';
            }}
          >
            +
          </button>
        )}

        {showChats ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              maxHeight: 300,
              overflowY: 'auto',
              paddingRight: 4,
            }}
          >
            {threads.length === 0 ? (
              <div
                style={{
                  fontSize: 12,
                  color: 'rgba(240,242,255,0.3)',
                  padding: '12px',
                  textAlign: 'center',
                }}
              >
                No chats yet
              </div>
            ) : (
              threads.map((t) => {
                const active = pathname === `/chat/${t.id}`;
                return (
                  <Link
                    key={t.id}
                    href={`/chat/${t.id}`}
                    style={{
                      padding: collapsed ? '8px' : '10px 12px',
                      borderRadius: 8,
                      background: active
                        ? 'rgba(99,102,241,0.2)'
                        : 'transparent',
                      border: active
                        ? '1px solid rgba(99,102,241,0.3)'
                        : '1px solid transparent',
                      color: active ? '#a5b4fc' : 'rgba(240,242,255,0.6)',
                      fontSize: 12,
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      display: 'block',
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      if (!active) {
                        el.style.background = 'rgba(255,255,255,0.05)';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      if (!active) {
                        el.style.background = 'transparent';
                      }
                    }}
                  >
                    {collapsed ? '💬' : t.title || 'Chat'}
                  </Link>
                );
              })
            )}
          </div>
        ) : null}

        {!showChats && (
          <>
            {NAV_ITEMS.map((item) => (
              <SidebarNav key={item.href} {...item} collapsed={collapsed} />
            ))}
          </>
        )}
      </nav>

      {/* Bottom: User info + logout */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.05)',
          padding: collapsed ? '12px 8px' : '12px 10px',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 12,
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.05)',
              marginBottom: 8,
            }}
          >
            {/* Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                background: `linear-gradient(135deg, hsl(${hue},70%,55%), hsl(${(hue + 40) % 360},70%,45%))`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {avatarLetter}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: 'rgba(240,242,255,0.9)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.name || 'User'}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: 'rgba(240,242,255,0.35)',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {user?.email || ''}
              </div>
            </div>
            {/* live clock */}
            <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.3)', whiteSpace: 'nowrap' }}>
              {time}
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          id="sidebar-logout"
          onClick={logout}
          style={{
            width: '100%',
            padding: collapsed ? '11px' : '10px 12px',
            borderRadius: 10,
            background: 'rgba(239,68,68,0.08)',
            border: '1px solid rgba(239,68,68,0.15)',
            color: 'rgba(252,165,165,0.8)',
            fontSize: 13,
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(239,68,68,0.18)';
            el.style.borderColor = 'rgba(239,68,68,0.35)';
            el.style.color = '#fca5a5';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(239,68,68,0.08)';
            el.style.borderColor = 'rgba(239,68,68,0.15)';
            el.style.color = 'rgba(252,165,165,0.8)';
          }}
        >
          <span>🚪</span>
          {!collapsed && 'Sign Out'}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────── Header ──────────────────── */
function WorkspaceHeader({
  onMenuClick,
  user,
}: {
  onMenuClick: () => void;
  user: any;
}) {
  const pathname = usePathname();
  const currentPage = NAV_ITEMS.find(
    (n) => pathname === n.href || pathname.startsWith(n.href + '/')
  );

  return (
    <header
      style={{
        height: 60,
        background: 'rgba(10,11,15,0.85)',
        backdropFilter: 'blur(40px) brightness(1.08)',
        WebkitBackdropFilter: 'blur(40px) brightness(1.08)',
        borderBottom: '1px solid rgba(99, 102, 241, 0.15)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        gap: 14,
        position: 'sticky',
        top: 0,
        zIndex: 40,
        flexShrink: 0,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.08), 0 4px 16px rgba(0,0,0,0.2)',
      }}
    >
      {/* Mobile hamburger */}
      <button
        id="header-menu-btn"
        onClick={onMenuClick}
        style={{
          display: 'none',
          width: 36,
          height: 36,
          borderRadius: 8,
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.08)',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          fontSize: 16,
          color: 'rgba(240,242,255,0.7)',
          flexShrink: 0,
          transition: 'all 0.2s ease',
        }}
      >
        ☰
      </button>

      {/* Breadcrumb */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: 18 }}>{currentPage?.icon || '🏠'}</span>
        <div>
          <div
            style={{
              fontWeight: 700,
              fontSize: 15,
              color: 'rgba(240,242,255,0.95)',
              lineHeight: 1.2,
            }}
          >
            {currentPage?.label || 'Workspace'}
          </div>
          <div style={{ fontSize: 11, color: 'rgba(240,242,255,0.35)' }}>
            {currentPage?.desc || 'AI Mentor'}
          </div>
        </div>
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Status pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            padding: '5px 12px',
            borderRadius: 999,
            background: 'rgba(16,185,129,0.1)',
            border: '1px solid rgba(16,185,129,0.2)',
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(52,211,153,0.9)',
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: '50%',
              background: '#10b981',
              boxShadow: '0 0 6px #10b981',
              animation: 'pulse-glow 2s ease-in-out infinite',
              display: 'inline-block',
            }}
          />
          AI Online
        </div>

        {/* New Chat shortcut */}
        <Link
          href="/chat"
          id="header-new-chat"
          style={{
            padding: '7px 16px',
            borderRadius: 10,
            background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
            fontSize: 13,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            transition: 'all 0.2s ease',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25))';
            el.style.boxShadow = '0 4px 16px rgba(99,102,241,0.2)';
            el.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.15))';
            el.style.boxShadow = 'none';
            el.style.transform = 'translateY(0)';
          }}
        >
          ✨ New Chat
        </Link>
      </div>
    </header>
  );
}

/* ─────────────────── AppShell ─────────────────── */
export function AppShell({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const profile = useUserStore((s) => s.profile);
  const logoutStore = useUserStore((s) => s.logout);

  // Build a user object compatible with Sidebar's expectations
  const user = profile
    ? { name: profile.name, email: profile.email }
    : null;

  const logout = () => {
    logoutStore();
    router.push('/login');
  };

  return (
    <div
      style={{
        display: 'flex',
        height: '100vh',
        background: '#0a0b0f',
        overflow: 'hidden',
      }}
    >
      {/* Desktop permanent sidebar */}
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        user={user}
        logout={logout}
      />

      {/* Mobile overlay sidebar */}
      {mobileMenuOpen && (
        <>
          <div
            onClick={() => setMobileMenuOpen(false)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.6)',
              zIndex: 100,
              animation: 'fadeIn 0.2s ease-out',
            }}
          />
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              height: '100vh',
              zIndex: 110,
              animation: 'slideInLeft 0.25s ease-out',
            }}
          >
            <Sidebar
              collapsed={false}
              onToggle={() => setMobileMenuOpen(false)}
              user={user}
              logout={logout}
            />
          </div>
        </>
      )}

      {/* Main content */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          minWidth: 0,
        }}
      >
        <WorkspaceHeader
          onMenuClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          user={user}
        />

        {/* Page content */}
        <main
          style={{
            flex: 1,
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: '20px',
            background: 'linear-gradient(180deg, #0a0b0f 0%, #0d0e14 100%)',
            position: 'relative',
          }}
        >
          {/* Glassmorphism background effects */}
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: -1,
              backgroundImage: `
                radial-gradient(circle at 25% 25%, rgba(99,102,241,0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(139,92,246,0.08) 0%, transparent 50%),
                radial-gradient(circle at 50% 50%, rgba(165,180,252,0.05) 0%, transparent 60%)
              `,
              pointerEvents: 'none',
            }}
          />
          {children}
        </main>
      </div>
    </div>
  );
}
