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

  const usernameValid = username.trim().length > 0;
  const emailValid = email.trim().length > 0;
  const passwordValid = password.length > 0;
  const canSubmit = usernameValid && emailValid && passwordValid && !loading;

  const shouldRedirect = !!session || !!user;

  // Check if already logged in with Supabase
  useEffect(() => {
    if (!authLoading && shouldRedirect && !redirectingRef.current) {
      redirectingRef.current = true;
      router.replace('/chat');
    }
  }, [authLoading, shouldRedirect, router]);

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

      if (signUpError) {
        throw signUpError;
      }

      if (data.user) {
        const { error: insertError } = await supabase
          .from('users')
          .insert({
            id: data.user.id,
            username: username.trim(),
            email: email.trim()
          });

        if (insertError) {
          throw insertError;
        }
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

      setSuccess('Account created. You can log in now.');
      setLoading(false);
    } catch (err) {
      const message = (err as Error).message || 'Signup failed. Please try again.';
      if (message.toLowerCase().includes('rate limit')) {
        setError('Too many signup attempts. Please wait a few minutes and try again.');
      } else {
        setError(message);
      }
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  };

  const inputStyle = (focused: boolean) => ({
    paddingLeft: 16,
    paddingRight: 16,
    height: 50,
    fontSize: 15,
    width: '100%',
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: focused ? '#3b82f6' : '#374151',
    borderRadius: 12,
    background: '#111827',
    color: '#f9fafb',
    transition: 'all 0.2s ease',
    boxShadow: focused ? '0 0 0 3px rgba(59,130,246,0.25)' : 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box'
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
        backgroundSize: '400% 400%',
        animation: 'gradientShift 15s ease infinite',
        padding: '20px',
        position: 'relative'
      }}
    >
      {/* Login Link - Top Right */}
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 8
        }}
      >
        <span style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: 14, fontWeight: 500 }}>
          Already have an account?
        </span>
        <Link
          href="/login"
          style={{
            padding: '10px 20px',
            background: 'rgba(255, 255, 255, 0.95)',
            color: '#667eea',
            fontSize: 14,
            fontWeight: 700,
            borderRadius: 10,
            textDecoration: 'none',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.15)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
          }}
        >
          Sign In
        </Link>
      </div>

      <div style={{ maxWidth: 520, width: '100%' }}>
        {/* Header Section */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div
            style={{
              fontSize: 60,
              marginBottom: 16,
              animation: 'bounce 2s ease-in-out infinite'
            }}
          >
            ✨
          </div>
          <h1 style={{ 
            fontSize: 42, 
            fontWeight: 800, 
            marginBottom: 8,
            color: '#fff',
            textShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}>
            Join AI Mentor
          </h1>
          <p style={{ 
            opacity: 0.95, 
            fontSize: 16,
            color: '#fff',
            fontWeight: 500
          }}>
            Create your account to start learning
          </p>
        </div>

        {/* Card Container */}
        <div
          style={{
            padding: 40,
            background: 'rgba(255, 255, 255, 0.95)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            borderRadius: 20,
            backdropFilter: 'blur(10px)'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Username Input */}
            <div>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#e5e7eb',
                display: 'block', 
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Username
              </label>
              <input
                type="text"
                placeholder="Your username"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                onFocus={() => setFocusedField('username')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className="auth-input"
                style={inputStyle(focusedField === 'username')}
              />
            </div>

            {/* Email Input */}
            <div>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#e5e7eb',
                display: 'block', 
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                onFocus={() => setFocusedField('email')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className="auth-input"
                style={inputStyle(focusedField === 'email')}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#e5e7eb',
                display: 'block', 
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                  setSuccess(null);
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                className="auth-input"
                style={inputStyle(focusedField === 'password')}
              />
            </div>

            {/* Error Message */}
            {error ? (
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(220, 38, 38, 0.1)',
                  color: '#dc2626',
                  fontSize: 14,
                  fontWeight: 600,
                  animation: 'slideIn 0.3s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                ⚠️ {error}
              </div>
            ) : null}

            {/* Success Message */}
            {success ? (
              <div
                style={{
                  padding: 14,
                  borderRadius: 12,
                  background: 'rgba(16, 185, 129, 0.12)',
                  color: '#10b981',
                  fontSize: 14,
                  fontWeight: 600,
                  animation: 'slideIn 0.3s ease-out',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8
                }}
              >
                ✅ {success}
              </div>
            ) : null}

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!canSubmit}
              style={{
                height: 50,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: 12,
                border: 'none',
                background: canSubmit && !loading 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)',
                color: '#fff',
                cursor: canSubmit && !loading ? 'pointer' : 'not-allowed',
                transition: 'all 0.3s ease',
                opacity: canSubmit && !loading ? 1 : 0.7,
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
                boxShadow: canSubmit && !loading 
                  ? '0 8px 20px rgba(102, 126, 234, 0.3)' 
                  : 'none'
              }}
              onMouseEnter={(e) => {
                if (canSubmit && !loading) {
                  (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 12px 30px rgba(102, 126, 234, 0.4)';
                }
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = 
                  canSubmit && !loading ? '0 8px 20px rgba(102, 126, 234, 0.3)' : 'none';
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      border: '3px solid rgba(255,255,255,0.3)',
                      borderTop: '3px solid #fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite'
                    }}
                  />
                  Creating account...
                </span>
              ) : (
                '🚀 Create Account'
              )}
            </button>

            {/* Footer Info */}
            <div
              style={{
                textAlign: 'center',
                fontSize: 11,
                opacity: 0.6,
                lineHeight: 1.6,
                color: '#6b7280',
                paddingTop: 12,
                borderTop: '1px solid rgba(0,0,0,0.05)'
              }}
            >
              <p style={{ margin: 0, marginBottom: 4 }}>By creating an account, you agree to our Terms</p>
              <p style={{ margin: 0 }}>🔐 Your data is encrypted and stays in your browser</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .auth-input::placeholder {
          color: rgba(148, 163, 184, 0.75);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </div>
  );
}
