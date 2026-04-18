'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useSupabaseAuth } from '../../../hooks/useSupabaseAuth';
import { supabase } from '../../../lib/supabase';

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
  const { user, session, loading: authLoading, loginWithGoogle } = useSupabaseAuth();
  const redirectingRef = useRef(false);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [particles] = useState(generateParticles(25));
  const [mounted, setMounted] = useState(false);
  const [brainRotation, setBrainRotation] = useState({ x: 0, y: 0 });

  useEffect(() => { setMounted(true); }, []);

  // Interactive brain logo rotation
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      const x = (clientX / innerWidth - 0.5) * 2; // -1 to 1
      const y = (clientY / innerHeight - 0.5) * 2; // -1 to 1
      setBrainRotation({ x: -y * 15, y: x * 15 }); // Tilt effect
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const emailValid = email.trim().length > 0;
  const passwordValid = password.length > 0;
  const canSubmit = emailValid && passwordValid && !loading;

  const shouldRedirect = !!session || !!user;

  useEffect(() => {
    if (!authLoading && shouldRedirect && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace('/chat');
    }
  }, [authLoading, shouldRedirect, router]);

  const handleSubmit = async () => {
    setError(null);
    if (!canSubmit) {
      if (!emailValid) setError('Please enter your email');
      else if (!passwordValid) setError('Please enter a password');
      return;
    }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password
      });

      if (signInError) {
        throw signInError;
      }

      redirectingRef.current = true;
      router.replace('/chat');
    } catch (err) {
      setError((err as Error).message || 'Login failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) handleSubmit();
  };

  const handleGoogleLogin = async () => {
    setError(null);
    const ok = await loginWithGoogle();
    if (!ok) {
      setError('Google login failed. Please try again.');
    }
  };

  if (authLoading || shouldRedirect) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a0b0f',
          color: 'rgba(240,242,255,0.6)',
          fontSize: 14,
          letterSpacing: '0.05em'
        }}
      >
        Loading...
      </div>
    );
  }

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
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 0,
          opacity: 0.3,
        }}
      >
        <source src="/assets/AI MENTOR.mp4" type="video/mp4" />
      </video>

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
            background: 'rgba(99,102,241,0.15)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(99,102,241,0.4)',
            color: '#a5b4fc',
            fontSize: 14,
            fontWeight: 600,
            borderRadius: 12,
            transition: 'all 0.25s ease',
            display: 'inline-block',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(99,102,241,0.1)',
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(99,102,241,0.25)';
            el.style.borderColor = 'rgba(99,102,241,0.6)';
            el.style.transform = 'translateY(-2px)';
            el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.15), 0 12px 24px rgba(99,102,241,0.25)';
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLElement;
            el.style.background = 'rgba(99,102,241,0.15)';
            el.style.borderColor = 'rgba(99,102,241,0.4)';
            el.style.transform = 'translateY(0)';
            el.style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.1), 0 4px 12px rgba(99,102,241,0.1)';
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
          {/* AI icon with glow ring - Interactive */}
          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 72,
              height: 72,
              marginBottom: 24,
            }}
          >
            {/* Outer rotating halo */}
            <div
              style={{
                position: 'absolute',
                inset: -8,
                borderRadius: '50%',
                background: 'conic-gradient(from 0deg, #6366f1, #8b5cf6, #ec4899, #6366f1)',
                opacity: 0.4,
                animation: 'spin 8s linear infinite',
              }}
            />

            {/* Inner pulsing glow */}
            <div
              style={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                boxShadow: '0 0 40px rgba(99,102,241,0.5), inset 0 0 40px rgba(99,102,241,0.2)',
                animation: 'pulse-glow 3s ease-in-out infinite',
              }}
            />

            {/* Interactive Brain Logo */}
            <div
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d',
                transition: 'transform 0.1s ease-out',
                transform: `rotateX(${brainRotation.x}deg) rotateY(${brainRotation.y}deg)`,
              }}
            >
              <div
                style={{
                  fontSize: 80,
                  lineHeight: 1,
                  textAlign: 'center',
                  position: 'relative',
                  animation: 'pulse 5s infinite ease-in-out',
                }}
              >
                🧠
                {/* Halo effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '150%',
                    height: '150%',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.3) 0%, transparent 60%)',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: -1,
                    animation: 'halo-rotate 20s infinite linear',
                  }}
                />
                {/* Glow effect */}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: '120%',
                    height: '120%',
                    background: 'rgba(139,92,246,0.2)',
                    filter: 'blur(20px)',
                    transform: 'translate(-50%, -50%)',
                    borderRadius: '50%',
                    zIndex: -2,
                  }}
                />
              </div>
            </div>
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
            background: 'rgba(15, 17, 24, 0.7)',
            backdropFilter: 'blur(40px) brightness(1.1)',
            WebkitBackdropFilter: 'blur(40px) brightness(1.1)',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: 24,
            padding: '36px 32px',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.1), 0 8px 32px rgba(0,0,0,0.3), 0 32px 64px rgba(99,102,241,0.1)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Glass morphism overlay */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: 'radial-gradient(circle at 0% 0%, rgba(99,102,241,0.08) 0%, transparent 50%)',
              pointerEvents: 'none',
              borderRadius: 24,
            }}
          />

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

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, position: 'relative', zIndex: 2 }}>
            {/* OR Separator */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                color: 'rgba(240,242,255,0.3)',
                fontSize: 12,
                margin: '8px 0',
              }}
            >
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
              OR
              <hr style={{ flex: 1, border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)' }} />
            </div>

            {/* Email */}
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
                Email
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
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError(null); }}
                  onFocus={() => setFocusedField('email')}
                  onBlur={() => setFocusedField(null)}
                  onKeyDown={handleKeyPress}
                  style={{
                    paddingLeft: 44,
                    paddingRight: 16,
                    height: 52,
                    fontSize: 15,
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1.5px solid ${focusedField === 'email' ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 12,
                    color: '#f0f2ff',
                    transition: 'all 0.25s ease',
                    boxShadow: focusedField === 'email' ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px rgba(99,102,241,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
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
                    background: 'rgba(255,255,255,0.06)',
                    backdropFilter: 'blur(10px)',
                    WebkitBackdropFilter: 'blur(10px)',
                    border: `1.5px solid ${focusedField === 'password' ? 'rgba(99,102,241,0.8)' : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: 12,
                    color: '#f0f2ff',
                    transition: 'all 0.25s ease',
                    boxShadow: focusedField === 'password' ? 'inset 0 1px 0 rgba(255,255,255,0.1), 0 0 0 4px rgba(99,102,241,0.15)' : 'inset 0 1px 0 rgba(255,255,255,0.05)',
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
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
              {[
                { label: 'Google', icon: '🔵', id: 'login-google' },
              ].map((s) => (
                <button
                  key={s.label}
                  id={s.id}
                  type="button"
                  onClick={handleGoogleLogin}
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

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(99, 102, 241, 0.3), inset 0 0 20px rgba(99, 102, 241, 0.1); }
          50%       { box-shadow: 0 0 60px rgba(99, 102, 241, 0.8), inset 0 0 40px rgba(99, 102, 241, 0.3); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes particle-move {
          0%   { transform: translateY(0) translateX(0) scale(1); opacity: 0.6; }
          50%  { transform: translateY(-60px) translateX(20px) scale(1.2); opacity: 1; }
          100% { transform: translateY(-120px) translateX(-10px) scale(0.8); opacity: 0; }
        }
      `}</style>
    </div>
  );
}
