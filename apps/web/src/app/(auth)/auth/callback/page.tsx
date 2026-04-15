'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../../../lib/supabase';

export default function AuthCallbackPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleCallback = async () => {
      try {
        console.log('🔄 Processing OAuth callback...');

        // Get the current session from Supabase
        // This will also trigger the onAuthStateChange listener
        const { data, error: sessionError } = await supabase.auth.getSession();

        if (sessionError) {
          console.error('❌ Session error:', sessionError);
          setError('Failed to get session');
          setLoading(false);
          return;
        }

        if (data.session) {
          console.log('✅ Session established, redirecting to dashboard...');
          // Session is set, redirect to dashboard
          // The useSupabaseAuth hook will update the state
          router.push('/chat');
        } else {
          console.error('❌ No session found after callback');
          setError('No session found. Please try logging in again.');
          setLoading(false);
          // Redirect to login after a delay
          setTimeout(() => router.push('/login'), 2000);
        }
      } catch (err) {
        console.error('❌ Callback error:', err);
        setError(err instanceof Error ? err.message : 'Something went wrong');
        setLoading(false);
      }
    };

    handleCallback();
  }, [router]);

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
        flexDirection: 'column',
        gap: 20
      }}
    >
      {loading && !error ? (
        <>
          <div
            style={{
              width: 60,
              height: 60,
              border: '4px solid rgba(255,255,255,0.3)',
              borderTop: '4px solid #fff',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}
          />
          <p
            style={{
              color: '#fff',
              fontSize: 18,
              fontWeight: 600,
              textShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            Redirecting you...
          </p>
        </>
      ) : error ? (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            padding: 40,
            borderRadius: 20,
            maxWidth: 500,
            textAlign: 'center',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
          }}
        >
          <div style={{ fontSize: 60, marginBottom: 16 }}>❌</div>
          <h1 style={{ fontSize: 24, fontWeight: 700, marginBottom: 12, color: '#dc2626' }}>
            Authentication Failed
          </h1>
          <p style={{ fontSize: 14, color: '#6b7280', marginBottom: 20 }}>
            {error}
          </p>
          <a
            href="/login"
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: 10,
              textDecoration: 'none',
              fontWeight: 600,
              display: 'inline-block',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              (e.currentTarget as HTMLElement).style.boxShadow = 'none';
            }}
          >
            Return to Login
          </a>
        </div>
      ) : null}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}
