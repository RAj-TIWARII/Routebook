import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, LayoutDashboard, LogOut, ExternalLink } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';

export function AdminLayout({ children }: { children: ReactNode }) {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  async function handleSignOut() {
    await signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen">
      <header className="flex items-center justify-between border-b border-border px-6 py-4 sm:px-10">
        <div className="flex items-center gap-2 font-display text-[15px] font-semibold">
          <Compass size={18} className="text-accent" /> RouteBook
          <span className="ml-1 rounded-full border border-border px-2 py-0.5 text-[10px] font-normal tracking-wide text-secondary uppercase">
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary"
          >
            <ExternalLink size={14} /> View site
          </Link>
          {isSupabaseConfigured && user && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-1.5 text-[13px] text-secondary hover:text-primary"
            >
              <LogOut size={14} /> Sign out
            </button>
          )}
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl gap-10 px-6 py-10 sm:px-10">
        <aside className="hidden w-48 shrink-0 sm:block">
          <nav className="flex flex-col gap-1 text-[13px]">
            <Link
              to="/admin"
              className="flex items-center gap-2 rounded-[10px] px-3 py-2 text-secondary hover:bg-white/5 hover:text-primary"
            >
              <LayoutDashboard size={15} /> Journeys
            </Link>
          </nav>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
