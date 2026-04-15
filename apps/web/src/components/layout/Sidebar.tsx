'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

function SidebarLink({ 
  href, 
  label, 
  icon, 
  onClick 
}: { 
  href: string; 
  label: string;
  icon: string;
  onClick?: () => void;
}) {
  const pathname = usePathname();
  const active = pathname === href || pathname.startsWith(href + '/');
  
  return (
    <Link
      href={href}
      onClick={onClick}
      style={{
        padding: '14px 16px',
        borderRadius: 8,
        fontWeight: active ? 600 : 500,
        fontSize: 15,
        transition: 'all 0.2s ease-out',
        color: active ? '#fff' : 'rgba(255,255,255,0.8)',
        background: active ? 'rgba(59, 130, 246, 0.9)' : 'transparent',
        borderLeft: active ? '3px solid #3b82f6' : '3px solid transparent',
        paddingLeft: active ? '13px' : '16px',
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        textDecoration: 'none',
      }}
      onMouseEnter={(e) => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.1)';
        }
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.background = active ? 'rgba(59, 130, 246, 0.9)' : 'transparent';
      }}
    >
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 90,
            animation: 'fadeIn 0.2s ease-out'
          }}
        />
      )}

      {/* Sidebar */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: 280,
          height: '100vh',
          background: 'linear-gradient(180deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)',
          zIndex: 95,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-out',
          overflowY: 'auto',
          boxShadow: isOpen ? '2px 0 12px rgba(0,0,0,0.2)' : 'none',
          paddingTop: 60
        }}
      >
        <div style={{ padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SidebarLink href="/chat" label="Chat" icon="💬" onClick={onClose} />
          <SidebarLink href="/projects" label="Projects" icon="📁" onClick={onClose} />
          <SidebarLink href="/uploads" label="Uploads" icon="📤" onClick={onClose} />
          <SidebarLink href="/tutorials" label="Tutorials" icon="🎓" onClick={onClose} />
          <SidebarLink href="/profile" label="Profile" icon="👤" onClick={onClose} />
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
}
