'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeOff, Sparkles, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ email: '', password: '', rememberMe: true });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.replace('/leads');
    }
  }, [authLoading, isAuthenticated, router]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const query = new URLSearchParams(window.location.search);
      const nextPath = query.get('next') || '/leads';
      await login(form);
      router.push(nextPath);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="grid min-h-[calc(100vh-3rem)] overflow-hidden rounded-[2rem] border border-[color:var(--surface-border)] bg-[linear-gradient(145deg,rgba(8,22,36,0.86),rgba(8,22,36,0.62))] shadow-[0_30px_90px_-44px_rgba(0,0,0,0.9)] md:grid-cols-[1.05fr_0.95fr]">
        <div className="relative hidden overflow-hidden p-10 md:flex md:flex-col md:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,122,26,0.26),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(36,200,219,0.22),transparent_34%)]" />
          <div className="relative z-10">
            <div className="brand-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
              <Sparkles size={12} /> Secure CRM
            </div>
            <h1 className="mt-8 max-w-xl font-[var(--font-display)] text-5xl font-semibold tracking-tight text-[color:var(--foreground)]">
              Move faster through every deal with a calmer workspace.
            </h1>
            <p className="mt-5 max-w-lg text-lg text-[color:var(--muted)]">
              Secure sessions, fast re-authentication, and a focused command center for teams that ship revenue daily.
            </p>
          </div>
          <div className="relative z-10 grid gap-3 text-sm text-[color:var(--muted)]">
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-4 py-3"><ShieldCheck size={16} /> HttpOnly cookies</div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-4 py-3"><ShieldCheck size={16} /> Auto refresh sessions</div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-[color:var(--surface-border)] bg-[color:var(--surface)] px-4 py-3"><ShieldCheck size={16} /> Cmd+K navigation</div>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 md:p-10">
          <div className="glass w-full max-w-md rounded-[1.5rem] p-6 md:p-8">
            <h1 className="font-[var(--font-display)] text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">Sign in</h1>
            <p className="mt-2 text-sm text-[color:var(--muted)]">Access your leads and tasks.</p>
            <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
              <Input
                label="Email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                required
                helperText="Use the email tied to your WorkDesk workspace."
              />
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={form.password}
                rightIcon={
                  <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="pointer-events-auto text-slate-400 transition hover:text-white">
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                }
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                required
              />
              <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300">
                <input
                  type="checkbox"
                  checked={form.rememberMe}
                  onChange={(event) => setForm((prev) => ({ ...prev, rememberMe: event.target.checked }))}
                  className="h-4 w-4 rounded border-[color:var(--surface-border)] bg-[color:var(--surface)]"
                />
                Remember me for 30 days
              </label>
              {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
              <Button loading={loading} type="submit" className="w-full">
                Login
              </Button>
            </form>
            <p className="mt-5 text-sm text-[color:var(--muted)]">
              New here?{' '}
              <Link className="font-medium text-[color:var(--foreground)] hover:text-[color:var(--brand)]" href="/register">
                Create an account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
