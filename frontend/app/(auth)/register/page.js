'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../hooks/useAuth';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { Eye, EyeOff, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, loading: authLoading } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      router.push('/leads');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md rounded-[1.5rem] p-6 shadow-2xl md:p-8">
        <div className="brand-chip inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs uppercase tracking-[0.25em] text-[color:var(--muted)]">
          <Sparkles size={12} /> WorkDesk
        </div>
        <h1 className="mt-5 font-[var(--font-display)] text-3xl font-semibold text-[color:var(--foreground)]">Create account</h1>
        <p className="mt-2 text-sm text-[color:var(--muted)]">Start tracking leads in minutes.</p>
        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full name"
            value={form.name}
            onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
            required
          />
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            rightIcon={
              <button type="button" onClick={() => setShowPassword((prev) => !prev)} className="pointer-events-auto text-slate-400 transition hover:text-white">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            }
            value={form.password}
            onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
            required
          />
          {error ? <p className="text-sm text-[color:var(--danger)]">{error}</p> : null}
          <Button loading={loading} type="submit" className="w-full">
            Register
          </Button>
        </form>
        <p className="mt-5 text-sm text-[color:var(--muted)]">
          Already have an account?{' '}
          <Link className="font-medium text-[color:var(--foreground)] hover:text-[color:var(--brand)]" href="/login">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
