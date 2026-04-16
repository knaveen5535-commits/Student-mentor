'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/api';
import { useUserStore } from '../../store/userStore';

export default function ProfilePage() {
  const hydrate = useUserStore((s) => s.hydrate);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const profile = useUserStore((s) => s.profile);
  const [count, setCount] = useState<number>(0);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    async function load() {
      if (!profile?.email) return;
      const data = await apiFetch<{ count: number }>(`/projects/count`, { userEmail: profile.email });
      setCount(data.count);
    }
    if (loggedIn) load();
  }, [loggedIn, profile?.email]);

  if (!loggedIn) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            background: 'rgba(15, 17, 24, 0.6)',
            backdropFilter: 'blur(40px) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
            padding: '40px',
            textAlign: 'center',
            maxWidth: 400,
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          <h2 style={{ color: '#fff', marginBottom: 16 }}>Access Denied</h2>
          <p style={{ color: 'rgba(240,242,255,0.6)', marginBottom: 24 }}>
            Please login first to view your profile
          </p>
        </div>
      </div>
    );
  }

  const avatarLetter = (profile?.name || profile?.email || 'U')[0].toUpperCase();
  const hue = ((avatarLetter.charCodeAt(0) - 65) / 26) * 360;

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 600,
          animation: 'fadeInScale 0.5s ease-out',
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: 32, textAlign: 'center' }}>
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
            Your Profile
          </h1>
          <p style={{ color: 'rgba(240,242,255,0.5)' }}>
            Manage your account and settings
          </p>
        </div>

        {/* Main Card */}
        <div
          style={{
            background: 'rgba(15, 17, 24, 0.6)',
            backdropFilter: 'blur(40px) brightness(1.05)',
            WebkitBackdropFilter: 'blur(40px) brightness(1.05)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
            overflow: 'hidden',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3)',
          }}
        >
          {/* Avatar Section */}
          <div
            style={{
              background: `linear-gradient(135deg, hsl(${hue}, 70%, 50%) 0%, hsl(${hue + 30}, 70%, 60%) 100%)`,
              padding: '40px 24px',
              textAlign: 'center',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div
              style={{
                width: 90,
                height: 90,
                borderRadius: '50%',
                background: `linear-gradient(135deg, hsl(${hue}, 80%, 60%) 0%, hsl(${hue + 40}, 80%, 70%) 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 40,
                fontWeight: 800,
                color: '#fff',
                margin: '0 auto 16px',
                boxShadow: `0 0 0 6px rgba(255,255,255,0.1), 0 12px 32px rgba(${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},${Math.round(Math.random() * 255)},0.3)`,
                border: '2px solid rgba(255,255,255,0.2)',
                animation: 'float 4s ease-in-out infinite',
              }}
            >
              {avatarLetter}
            </div>
            <h2 style={{ fontSize: 24, color: '#fff', marginTop: 8 }}>
              {profile?.name}
            </h2>
          </div>

          {/* Info Section */}
          <div style={{ padding: '32px 24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {/* Email */}
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#a5b4fc',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  📧 Email
                </p>
                <p
                  style={{
                    fontSize: 14,
                    color: 'rgba(240,242,255,0.8)',
                    wordBreak: 'break-all',
                    background: 'rgba(99,102,241,0.1)',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  {profile?.email}
                </p>
              </div>

              {/* Projects Count */}
              <div>
                <p
                  style={{
                    fontSize: 12,
                    fontWeight: 700,
                    color: '#a5b4fc',
                    marginBottom: 8,
                    textTransform: 'uppercase',
                    letterSpacing: 0.5,
                  }}
                >
                  📁 Projects Created
                </p>
                <div
                  style={{
                    fontSize: 32,
                    fontWeight: 800,
                    background: 'linear-gradient(135deg, #6366f1 0%, #a78bfa 100%)',
                    backgroundSize: '200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  {count}
                </div>
              </div>
            </div>

            {/* Account Status */}
            <div
              style={{
                marginTop: 24,
                padding: 16,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: 12,
              }}
            >
              <p style={{ fontSize: 13, color: 'rgba(240,242,255,0.7)' }}>
                ✅ Account Status: <strong>Active & Verified</strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
      `}</style>
    </div>
  );
}
