'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '../../../hooks/useSupabaseAuth';
import { useUserStore } from '../../../store/userStore';

/* ── tiny particle helper ────────────────────── */
type Particle = {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  hue: number;
};

function generateParticles(n = 30): Particle[] {
  return Array.from({ length: n }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: 2 + Math.random() * 4,
    duration: 4 + Math.random() * 8,
    delay: Math.random() * 6,
    hue: 220 + Math.random() * 60, // blue-violet range
  }));
}

/* ─── Animated grid-dot background ──────────── */
function GridBackground() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: `
          radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(139,92,246,0.12) 0%, transparent 50%),
          radial-gradient(circle at 50% 50%, rgba(99,102,241,0.05) 0%, transparent 70%)
        `,
        zIndex: 0,
      }}
    >
      {/* Dot grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(rgba(99,102,241,0.2) 1px, transparent 1px)',
          backgroundSize: '32px 32px',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const login = useUserStore((s) => s.login);

  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particles] = useState(generateParticles(25));
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  const userInputValid = userInput.trim().length > 0;
  const passwordValid = password.length > 0;
  const canSubmit = userInputValid && passwordValid && !loading;

  useEffect(() => {
    if (user) {
      router.replace('/chat');
    }
  }, [user, router]);

  const handleSubmit = async () => {
    setError(null);
    if (!canSubmit) {
      if (!userInputValid) setError('Please enter your username or email');
      else if (!passwordValid) setError('Please enter a password');
      return;
    }
    setLoading(true);
    try {
      const userProfile = {
        id: `user_${Date.now()}`,
        email: userInput.trim(),
        name: userInput.trim().split('@')[0],
        provider: 'demo',
      };
      localStorage.setItem('ai_workspace_user_profile', JSON.stringify(userProfile));
      login(userProfile);
      await new Promise((r) => setTimeout(r, 600));
      router.push('/chat');
    } catch {
      setError('Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) handleSubmit();
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0a0b0f',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <GridBackground />

      {/* Floating particles */}
      {mounted && particles.map((p) => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            borderRadius: '50%',
            background: `hsl(${p.hue}, 80%, 70%)`,
            boxShadow: `0 0 ${p.size * 3}px hsl(${p.hue}, 80%, 60%)`,
            animation: `particle-move ${p.duration}s ${p.delay}s ease-in-out infinite`,
            zIndex: 1,
            pointerEvents: 'none',
          }}
        />
      ))}

      {/* Top-right signup link */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 28,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          zIndex: 10,
        }}
      >
        <span style={{ color: 'rgba(240,242,255,0.5)', fontSize: 14 }}>
          New here?
        </span>
        <Link
          href="/signup"
          style={{
            padding: '9px 20px',
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.35)',
            color: '#a5b4fc',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 10,
            transition: 'all 0.25s ease',
            display: 'inline-block',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(99,102,241,0.25)';
            el.style.borderColor = 'rgba(99,102,241,0.6)';
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = '0 8px 24px rgba(99,102,241,0.2)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(99,102,241,0.12)';
            el.style.borderColor = 'rgba(99,102,241,0.35)';
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'none';
          }}
        >
          Create Account →
        </Link>
      </div>

      {/* Main card */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          maxWidth: 460,
          animation: mounted ? 'fadeInScale 0.5s ease-out forwards' : 'none',
        }}
      >
        {/* Logo / Brand */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          {/* AI icon with glow ring */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 0 12px rgba(99,102,241,0.12), 0 0 40px rgba(99,102,241,0.35)',
              marginBottom: 24,
              fontSize: 32,
              animation: 'float 4s ease-in-out infinite',
            }}
          >
            🧠
          </div>

          <h1
            style={{
              fontSize: 32,
              fontWeight: 800,
              letterSpacing: '-0.5px',
              marginBottom: 8,
              background: 'linear-gradient(135deg, #e0e7ff 0%, #a5b4fc 40%, #c4b5fd 100%)',
              backgroundSize: '200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: 'rgba(240,242,255,0.5)', fontSize: 15, fontWeight: 400 }}>
            Sign in to your AI Mentor workspace
          </p>
        </div>

        {/* Card */}
        <div
          style={{
            background: 'rgba(22, 24, 31, 0.85)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20,
            padding: '36px 32px',
            boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(99,102,241,0.08)',
          }}
        >
          {/* Card inner gradient top line */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: '10%',
              right: '10%',
              height: 1,
              background: 'linear-gradient(90deg, transparent, rgba(99,102,241,0.6), transparent)',
              borderRadius: '50%',
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Email / Username */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 12,
                  fontWeight: 600,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'rgba(240,242,255,0.45)',
                  marginBottom: 8,
                }}
              >
                Email or Username
              </label>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 16,
                    opacity: 0.5,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  ✉️
                </span>
                <input
                  id="login-email"
                  type="text"
                  placeholder="Enter your email or username"
                  value={userInput}
                  onChange={(e) => { setUserInput(e.target.value); setError(null); }}
                  onFocus={() => setFocusedField('username')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={handleKeyPress}
                  style={{
                    paddingLeft: 44,
                    paddingRight: 16,
                    height: 52,
                    fontSize: 15,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${focusedField === 'username' ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    color: '#f0f2ff',
                    transition: 'all 0.25s ease',
                    boxShadow: focusedField === 'username' ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <label
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    color: 'rgba(240,242,255,0.45)',
                  }}
                >
                  Password
                </label>
                <button
                  type="button"
                  style={{
                    fontSize: 12,
                    color: '#818cf8',
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'pointer',
                    fontWeight: 500,
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <span
                  style={{
                    position: 'absolute',
                    left: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: 16,
                    opacity: 0.5,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                >
                  🔐
                </span>
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  onFocus={() => setFocusedField('password')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={handleKeyPress}
                  style={{
                    paddingLeft: 44,
                    paddingRight: 48,
                    height: 52,
                    fontSize: 15,
                    background: 'rgba(255,255,255,0.04)',
                    border: `1.5px solid ${focusedField === 'password' ? 'rgba(99,102,241,0.7)' : 'rgba(255,255,255,0.08)'}`,
                    borderRadius: 12,
                    color: '#f0f2ff',
                    transition: 'all 0.25s ease',
                    boxShadow: focusedField === 'password' ? '0 0 0 4px rgba(99,102,241,0.12)' : 'none',
                    outline: 'none',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: 14,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 16,
                    opacity: 0.5,
                    padding: 4,
                    zIndex: 1,
                    transition: 'opacity 0.2s ease',
                  }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.5'; }}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.25)',
                  color: '#fca5a5',
                  fontSize: 14,
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  animation: 'fadeIn 0.3s ease-out',
                }}
              >
                <span>⚠️</span>
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              id="login-submit"
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                height: 52,
                fontSize: 15,
                fontWeight: 700,
                letterSpacing: '0.03em',
                borderRadius: 12,
                border: 'none',
                background: canSubmit
                  ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                  : 'rgba(99,102,241,0.2)',
                color: canSubmit ? '#fff' : 'rgba(255,255,255,0.4)',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                transition: 'all 0.25s ease',
                boxShadow: canSubmit ? '0 8px 24px rgba(99,102,241,0.35)' : 'none',
                position: 'relative',
                overflow: 'hidden',
              }}
              onMouseEnter={(e) => {
                if (canSubmit) {
                  const el = e.currentTarget as HTMLButtonElement;
                  el.style.transform = 'translateY(-2px)';
                  el.style.boxShadow = '0 12px 32px rgba(99,102,241,0.5)';
                }
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.transform = 'translateY(0)';
                el.style.boxShadow = canSubmit ? '0 8px 24px rgba(99,102,241,0.35)' : 'none';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: '2.5px solid rgba(255,255,255,0.3)',
                      borderTop: '2.5px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.7s linear infinite',
                      display: 'inline-block',
                    }}
                  />
                  Signing in...
                </span>
              ) : (
                '✨ Sign in to Workspace'
              )}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
              <span style={{ fontSize: 12, color: 'rgba(240,242,255,0.3)', whiteSpace: 'nowrap' }}>
                or continue with
              </span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.07)' }} />
            </div>

            {/* Social Buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[
                { label: 'Google', icon: '🔵', id: 'login-google' },
                { label: 'GitHub', icon: '⚫', id: 'login-github' },
              ].map((s) => (
                <button
                  key={s.label}
                  id={s.id}
                  type="button"
                  style={{
                    padding: '12px',
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 10,
                    color: 'rgba(240,242,255,0.75)',
                    fontSize: 14,
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.08)';
                    el.style.borderColor = 'rgba(255,255,255,0.15)';
                    el.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.background = 'rgba(255,255,255,0.04)';
                    el.style.borderColor = 'rgba(255,255,255,0.08)';
                    el.style.transform = 'translateY(0)';
                  }}
                >
                  {s.icon} {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom register link */}
        <p style={{ textAlign: 'center', marginTop: 24, fontSize: 14, color: 'rgba(240,242,255,0.4)' }}>
          Don't have an account?{' '}
          <Link
            href="/signup"
            style={{
              color: '#818cf8',
              fontWeight: 600,
              transition: 'color 0.2s ease',
            }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#a5b4fc'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#818cf8'; }}
          >
            Sign up free
          </Link>
        </p>
      </div>
    </div>
  );
}
