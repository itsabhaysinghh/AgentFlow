import { ArrowRight, Mail } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { authService } from '../services/authService';
import { AuthServiceError } from '../types/auth.types';
import { PasswordField } from './PasswordField';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!email.trim() || !password) {
      setError('Enter your email address and password.');
      return;
    }
    setIsSubmitting(true);
    try {
      await authService.login({ email: email.trim(), password });
      setError('The backend response does not yet support the required secure session flow.');
    } catch (cause) {
      setError(cause instanceof AuthServiceError ? cause.message : 'Unable to sign in. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form noValidate onSubmit={submit} className="mt-7 space-y-5">
    <div>
      <label htmlFor="login-email" className="mb-2 block text-base font-medium text-zinc-200">Email address</label>
      <div className="relative">
        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
        <input id="login-email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" required className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 text-base text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600" />
      </div>
    </div>
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <label className="text-base font-medium text-zinc-200" htmlFor="login-password">Password</label>
        <button type="button" onClick={() => setError('Password recovery is not available yet.')} className="text-sm text-zinc-400 underline-offset-4 hover:text-white hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300">Forgot password?</button>
      </div>
      <PasswordField id="login-password" label="" value={password} onChange={setPassword} autoComplete="current-password" />
    </div>
    {error && <p role="alert" className="rounded-lg border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}
    <button type="submit" disabled={isSubmitting} className="glass-btn-primary flex h-[45px] w-full items-center justify-center gap-2 rounded-lg px-4 text-base font-medium disabled:cursor-not-allowed disabled:opacity-60">
      {isSubmitting ? 'Signing in…' : 'Sign In'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  </form>;
}
