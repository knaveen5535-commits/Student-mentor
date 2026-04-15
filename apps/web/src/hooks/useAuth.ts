'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '../store/userStore';

export function useAuthGuard() {
  const router = useRouter();
  const hydrated = useUserStore((s) => s.hydrated);
  const loggedIn = useUserStore((s) => s.loggedIn);
  const hydrate = useUserStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  useEffect(() => {
    if (hydrated && !loggedIn) {
      router.replace('/login');
    }
  }, [hydrated, loggedIn, router]);
}

/**
 * Hook for Google OAuth authentication
 */
export function useGoogleAuth() {
  const router = useRouter();
  const login = useUserStore((s) => s.login);
  const logout = useUserStore((s) => s.logout);

  const handleGoogleLogin = () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
    window.location.href = `${apiUrl}/auth/google`;
  };

  const handleOAuthCallback = async (token: string, user: any) => {
    try {
      // Store token in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update user store
      login({
        name: user.name,
        email: user.email,
        picture: user.picture,
        provider: user.provider
      });

      // Redirect to dashboard
      router.push('/chat');
    } catch (error) {
      console.error('OAuth callback failed:', error);
      router.push('/login?error=authentication_failed');
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
        await fetch(`${apiUrl}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }

      // Clear local storage
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');

      // Update store
      logout();

      // Redirect to login
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return {
    handleGoogleLogin,
    handleOAuthCallback,
    handleLogout
  };
}
