'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Session, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

export interface UserProfile {
  id: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  provider: string;
  created_at?: string;
  last_login?: string;
}

export interface AuthState {
  user: UserProfile | null;
  session: Session | null;
  loading: boolean;
  error: AuthError | null;
}

const AUTH_STORAGE_KEY = 'ai_workspace_user_profile';
const SESSION_STORAGE_KEY = 'ai_workspace_session';

/**
 * useSupabaseAuth Hook
 * Manages all authentication logic including OAuth, session persistence, and user data
 */
export function useSupabaseAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  /**
   * Load user from localStorage
   */
  const loadStoredUser = useCallback(() => {
    try {
      if (typeof window === 'undefined') return null;
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (err) {
      console.error('Failed to load stored user:', err);
      return null;
    }
  }, []);

  /**
   * Save user to localStorage
   */
  const saveUserToStorage = useCallback((user: UserProfile | null) => {
    try {
      if (typeof window === 'undefined') return;
      if (user) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (err) {
      console.error('Failed to save user to storage:', err);
    }
  }, []);

  /**
   * Extract user profile from Supabase session
   */
  const extractUserProfile = useCallback((session: Session | null): UserProfile | null => {
    if (!session?.user) return null;

    return {
      id: session.user.id,
      email: session.user.email || null,
      name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || null,
      picture: session.user.user_metadata?.avatar_url || null,
      provider: session.user.app_metadata?.provider || 'unknown',
      created_at: session.user.created_at,
      last_login: session.user.last_sign_in_at
    };
  }, []);

  /**
   * Initialize auth state from Supabase session
   */
  const initializeAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        console.error('🔴 Error getting session:', error);
        setState(prev => ({ ...prev, loading: false, error }));
        return;
      }

      if (session) {
        // Session exists, extract user profile
        const userProfile = extractUserProfile(session);
        setState({
          user: userProfile,
          session: session,
          loading: false,
          error: null
        });
        if (userProfile) {
          saveUserToStorage(userProfile);
        }
      } else {
        // No session, try to load from storage
        const storedUser = loadStoredUser();
        setState({
          user: storedUser,
          session: null,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('❌ Auth initialization error:', err);
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [extractUserProfile, saveUserToStorage, loadStoredUser]);

  /**
   * Setup auth state change listener
   */
  useEffect(() => {
    // Initialize first
    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔔 Auth state changed:', event);

      if (event === 'SIGNED_IN' && session) {
        // User just signed in
        const userProfile = extractUserProfile(session);
        setState({
          user: userProfile,
          session: session,
          loading: false,
          error: null
        });
        if (userProfile) {
          saveUserToStorage(userProfile);
        }
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        setState({
          user: null,
          session: null,
          loading: false,
          error: null
        });
        saveUserToStorage(null);
      } else if (event === 'TOKEN_REFRESHED' && session) {
        // Token was refreshed
        const userProfile = extractUserProfile(session);
        setState(prev => ({
          ...prev,
          session: session,
          user: userProfile
        }));
      }
    });

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, [initializeAuth, extractUserProfile, saveUserToStorage]);

  /**
   * Login with Google using Supabase
   */
  const loginWithGoogle = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent'
          }
        }
      });

      if (error) {
        console.error('❌ Google login error:', error);
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      return true;
    } catch (err) {
      console.error('❌ Login error:', err);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, []);

  /**
   * Logout user
   */
  const logout = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true }));

      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('❌ Logout error:', error);
        setState(prev => ({ ...prev, loading: false, error }));
        return false;
      }

      setState({
        user: null,
        session: null,
        loading: false,
        error: null
      });
      saveUserToStorage(null);
      router.push('/login');
      return true;
    } catch (err) {
      console.error('❌ Logout error:', err);
      setState(prev => ({ ...prev, loading: false }));
      return false;
    }
  }, [router, saveUserToStorage]);

  /**
   * Check if user is authenticated
   */
  const isAuthenticated = useCallback(() => {
    return !!state.session || !!state.user;
  }, [state.session, state.user]);

  return {
    ...state,
    loginWithGoogle,
    logout,
    isAuthenticated,
    initializeAuth
  };
}
