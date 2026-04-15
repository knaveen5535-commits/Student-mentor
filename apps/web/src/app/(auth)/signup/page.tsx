'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '../../../hooks/useSupabaseAuth';
import { useUserStore } from '../../../store/userStore';

export default function SignupPage() {
  const router = useRouter();
  const { user } = useSupabaseAuth();
  const login = useUserStore((s) => s.login);

  const [userInput, setUserInput] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const userInputValid = userInput.trim().length > 0;
  const passwordValid = password.length > 0;
  const canSubmit = userInputValid && passwordValid && !loading;

  // Check if already logged in with Supabase
  useEffect(() => {
    if (user) {
      console.log('✅ User already logged in via Supabase, redirecting to /chat');
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
      // Simulate successful signup - save user to localStorage
      const userProfile = {
        id: `user_${Date.now()}`,
        email: userInput.trim(),
        name: userInput.trim().split('@')[0], // Use email prefix as name
        provider: 'demo'
      };
      
      localStorage.setItem('ai_workspace_user_profile', JSON.stringify(userProfile));
      login(userProfile);
      
      await new Promise((r) => setTimeout(r, 400));
      router.push('/chat');
    } catch (err) {
      setError('Signup failed. Please try again.');
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && canSubmit) {
      handleSubmit();
    }
  };

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
            {/* Username or Email Input */}
            <div>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#1f2937',
                display: 'block', 
                marginBottom: 8,
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Username or Email
              </label>
              <input
                type="text"
                placeholder="Enter username or email"
                value={userInput}
                onChange={(e) => {
                  setUserInput(e.target.value);
                  setError(null);
                }}
                onFocus={() => setFocusedField('userInput')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                style={{
                  paddingLeft: 16,
                  paddingRight: 16,
                  height: 50,
                  fontSize: 15,
                  width: '100%',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: focusedField === 'userInput' 
                    ? '#667eea' 
                    : '#e5e7eb',
                  borderRadius: 12,
                  background: focusedField === 'userInput' 
                    ? 'rgba(102, 126, 234, 0.05)' 
                    : '#f9fafb',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'userInput' 
                    ? '0 0 0 4px rgba(102, 126, 234, 0.1)' 
                    : 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {/* Password Input */}
            <div>
              <label style={{ 
                fontSize: 13, 
                fontWeight: 600, 
                color: '#1f2937',
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
                }}
                onFocus={() => setFocusedField('password')}
                onBlur={() => setFocusedField(null)}
                onKeyPress={handleKeyPress}
                style={{
                  paddingLeft: 16,
                  paddingRight: 16,
                  height: 50,
                  fontSize: 15,
                  width: '100%',
                  borderWidth: 2,
                  borderStyle: 'solid',
                  borderColor: focusedField === 'password' 
                    ? '#f093fb' 
                    : '#e5e7eb',
                  borderRadius: 12,
                  background: focusedField === 'password' 
                    ? 'rgba(240, 147, 251, 0.05)' 
                    : '#f9fafb',
                  transition: 'all 0.3s ease',
                  boxShadow: focusedField === 'password' 
                    ? '0 0 0 4px rgba(240, 147, 251, 0.1)' 
                    : 'none',
                  fontFamily: 'inherit',
                  boxSizing: 'border-box'
                }}
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
