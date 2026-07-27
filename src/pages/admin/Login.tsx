import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { isSupabaseConfigured } from '@/lib/supabase';
import { GlassCard } from '@/components/shared/GlassCard';

export function AdminLogin() {
  const { signInWithPassword } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const { error } = await signInWithPassword(email, password);
    setSubmitting(false);
    if (error) setError(error);
    else navigate('/admin');
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-6">
      <GlassCard strong className="w-full max-w-sm p-8">
        <div className="mb-6 flex items-center gap-2 font-display text-[16px] font-semibold">
          <Compass size={18} className="text-accent" /> RouteBook Admin
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-5 rounded-[12px] border border-accent/30 bg-accent/10 p-3 text-[12px] leading-relaxed text-secondary">
            Supabase isn't connected yet, so sign-in is disabled. Add your project
            credentials to <span className="font-mono-num">.env</span> — see
            <span className="font-mono-num"> .env.example</span>.
          </p>
        )}

        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <div>
            <label className="mb-1.5 block text-[12px] text-secondary">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[12px] border border-border bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-primary outline-none focus:border-accent"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[12px] text-secondary">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[12px] border border-border bg-white/[0.04] px-3.5 py-2.5 text-[14px] text-primary outline-none focus:border-accent"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="text-[12px] text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={submitting || !isSupabaseConfigured}
            className="mt-2 rounded-[12px] bg-accent px-4 py-2.5 text-[14px] font-medium text-black transition-opacity hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </GlassCard>
    </div>
  );
}
