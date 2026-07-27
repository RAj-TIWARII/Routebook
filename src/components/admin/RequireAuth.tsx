import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (!isSupabaseConfigured) {
    // No backend connected yet — let people preview the admin UI, but every
    // mutating action inside it will surface a "connect Supabase" message.
    return <>{children}</>;
  }

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-secondary">Loading…</div>;
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return <>{children}</>;
}
