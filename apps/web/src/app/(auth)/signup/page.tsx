'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../../hooks/useSupabaseAuth';
import { useUserStore } from '../../../store/userStore';
import { supabase } from '../../../lib/supabase';

export default function SignupPage() {
  const router = useRouter();
  const { user, session, loading: authLoading } = useSupabaseAuth();
  const login = useUserStore((s) => s.login);
  const redirectingRef = useRef(false);
  const lastSubmitRef = useRef(0);

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  // 3D Tilt state
  const cardRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');

  const usernameValid = username.trim().length > 0;
  const emailValid = email.trim().length > 0;
  const passwordValid = password.length > 0;
  const canSubmit = usernameValid && emailValid && passwordValid && !loading;

  const shouldRedirect = !!session || !!user;

  useEffect(() => {
    if (!authLoading && shouldRedirect && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace('/chat');
    }
  }, [authLoading, shouldRedirect, router]);

  // Handle 3D Tilt effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element.
    const y = e.clientY - rect.top;  // y position within the element.
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Calculate rotation (-10 to 10 degrees max)
    const rotateX = ((y - centerY) / centerY) * -10;
    const rotateY = ((x - centerX) / centerX) * 10;
    
    setTransform(`perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`);
  };

  const handleMouseLeave = () => {
    setTransform('perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)');
  };

  if (authLoading || shouldRedirect) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#050508', color: '#a5b4fc' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid rgba(165,180,252,0.3)', borderTopColor: '#a5b4fc', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  const handleSubmit = async () => {
    if (loading) return;
    const now = Date.now();
    if (now - lastSubmitRef.current < 1500) {
      setError('Please wait a moment before trying again.');
      return;
    }
    lastSubmitRef.current = now;
    setError(null);
    setSuccess(null);
    if (!canSubmit) {
      if (!usernameValid) setError('Please enter a username');
      else if (!emailValid) setError('Please enter your email');
      else if (!passwordValid) setError('Please enter a password');
      return;
    }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password
      });

      if (signUpError) throw signUpError;

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username: username.trim(),
            email: email.trim()
          });

        if (insertError) throw insertError;
      }

      if (data.session) {
        login({
          name: username.trim(),
          email: email.trim(),
          provider: 'supabase'
        });
        redirectingRef.current = true;
        router.replace('/chat');
        return;
      }

      setSuccess('Identity registered in the Neural Net. Proceed to authentication.');
      setLoading(false);
    } catch (err) {
      const message = (err as Error).message || 'Registration anomaly detected. Retry.';
      setError(message.toLowerCase().includes('rate limit') ? 'Too many queries. Cooldown required.' : message);
      setLoading(false);
    }
  };

  const inputStyle = (focused: boolean) => ({
    width: '100%',
    padding: '16px 20px',
    background: focused ? 'rgba(20, 20, 25, 0.9)' : 'rgba(15, 15, 20, 0.6)',
    border: '1px solid',
    borderColor: focused ? 'rgba(99, 102, 241, 0.8)' : 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    color: '#e0e7ff',
    fontSize: 15,
    outline: 'none',
    transition: 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)',
    boxShadow: focused ? '0 0 0 4px rgba(99, 102, 241, 0.15), inset 0 2px 4px rgba(0,0,0,0.4)' : 'inset 0 2px 4px rgba(0,0,0,0.2)',
    boxSizing: 'border-box' as const
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#050508',
        position: 'relative',
        overflow: 'hidden',
        fontFamily: "'Inter', sans-serif"
      }}
    >
      {/* Immersive Dark Mesh Background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: `
            radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.15), transparent 50%),
            radial-gradient(circle at 20% 80%, rgba(139, 92, 246, 0.15), transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(45, 212, 191, 0.08), transparent 60%)
          `,
          filter: 'blur(60px)',
          animation: 'pulse-bg 15s alternate infinite ease-in-out',
        }}
      />
      
      {/* Grid Pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          transform: 'perspective(1000px) rotateX(60deg) translateY(-100px) translateZ(-200px)',
          transformOrigin: 'top center',
          opacity: 0.6,
        }}
      />

      <div style={{ position: 'absolute', top: 32, right: 32, zIndex: 10 }}>
        <Link
          href="/login"
          style={{
            padding: '12px 24px',
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            color: '#a5b4fc',
            fontWeight: 600,
            fontSize: 14,
            borderRadius: 999,
            textDecoration: 'none',
            border: '1px solid rgba(255,255,255,0.1)',
            transition: 'all 0.3s ease',
            display: 'block'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.1)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(165, 180, 252, 0.5)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = 'rgba(255, 255, 255, 0.05)';
            (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Access Terminal (Login) →
        </Link>
      </div>

      <div 
        style={{ perspective: 1200, zIndex: 10, padding: 20, width: '100%', maxWidth: 480 }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        <div
          ref={cardRef}
          style={{
            background: 'rgba(12, 13, 18, 0.7)',
            backdropFilter: 'blur(40px)',
            WebkitBackdropFilter: 'blur(40px)',
            borderRadius: 32,
            padding: 48,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)',
            transformStyle: 'preserve-3d',
            transition: 'transform 0.1s ease-out',
            transform: transform,
          }}
        >
          {/* Holographic Header */}
          <div style={{ textAlign: 'center', marginBottom: 40, transform: 'translateZ(40px)' }}>
            <div style={{
              width: 64, height: 64, borderRadius: 20,
              background: 'linear-gradient(135deg, rgba(99,102,241,0.2), rgba(139,92,246,0.2))',
              border: '1px solid rgba(165,180,252,0.4)',
              margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 32, boxShadow: '0 0 30px rgba(99,102,241,0.3)',
              position: 'relative'
            }}>
              <img src="/assets/ai_logo.png" alt="AI Logo" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'relative', zIndex: 2, borderRadius: 20 }} />
              {/* Glow ring */}
              <div style={{
                position: 'absolute', inset: -4, borderRadius: 24, border: '1px solid rgba(99,102,241,0.5)',
                animation: 'spin 4s linear infinite', opacity: 0.5
              }}/>
            </div>
            <h1 style={{ fontSize: 32, fontWeight: 800, color: '#e0e7ff', marginBottom: 8, letterSpacing: -0.5 }}>
              Initialize Identity
            </h1>
            <p style={{ color: 'rgba(165, 180, 252, 0.6)', fontSize: 15, fontWeight: 500 }}>
              Connect your neural pathways into the AI Mentor network.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24, transform: 'translateZ(30px)' }}>
            {/* Input Groups */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Callsign (Username)"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError(null); }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === 'username')}
              />
            </div>
            
            <div style={{ position: 'relative' }}>
              <input
                type="email"
                placeholder="Neural Link (Email)"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(null); }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === 'email')}
              />
            </div>

            <div style={{ position: 'relative' }}>
              <input
                type="password"
                placeholder="Access Code (Password)"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(null); }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                style={inputStyle(focusedField === 'password')}
              />
            </div>

            {/* Response Messages */}
            {error && (
              <div style={{ padding: 16, borderRadius: 16, background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#fca5a5', fontSize: 14, fontWeight: 600, animation: 'fadeInDown 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>⚠️</span> {error}
              </div>
            )}
            {success && (
              <div style={{ padding: 16, borderRadius: 16, background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', color: '#6ee7b7', fontSize: 14, fontWeight: 600, animation: 'fadeInDown 0.3s', display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 18 }}>✅</span> {success}
              </div>
            )}

            {/* Glowing Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                marginTop: 8,
                width: '100%',
                padding: '18px',
                borderRadius: 16,
                background: canSubmit && !loading
                  ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
                  : 'rgba(255,255,255,0.05)',
                color: canSubmit && !loading ? '#fff' : 'rgba(255,255,255,0.3)',
                border: canSubmit && !loading ? 'none' : '1px solid rgba(255,255,255,0.1)',
                fontSize: 16,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: 'uppercase',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                position: 'relative',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                boxShadow: canSubmit && !loading ? '0 10px 30px rgba(99,102,241,0.5)' : 'none',
              }}
              onMouseEnter={(e) => {
                if (canSubmit && !loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 15px 40px rgba(99,102,241,0.6)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit && !loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 10px 30px rgba(99,102,241,0.5)';
                }
              }}
            >
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ width: 20, height: 20, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                  Processing...
                </div>
              ) : (
                'Establish Connection'
              )}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        input::placeholder { color: rgba(165, 180, 252, 0.4); }
        @keyframes spin { 100% { transform: rotate(360deg); } }
        @keyframes pulse-bg {
          0% { opacity: 0.8; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes fadeInDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
