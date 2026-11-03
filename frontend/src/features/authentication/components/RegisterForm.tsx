import { ArrowRight, Mail, User } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { AuthServiceError } from '../types/auth.types';
import { PasswordField } from './PasswordField';

const passwordMessage = 'Use at least 12 characters, including uppercase, lowercase, and a number.';
const isStrongPassword = (value: string) => value.length >= 12 && /[a-z]/.test(value) && /[A-Z]/.test(value) && /\d/.test(value);

export function RegisterForm() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmation, setConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    if (!fullName.trim() || !email.trim() || !password || !confirmation) return setError('Complete every field to create an account.');
    if (!/^\S+@\S+\.\S+$/.test(email)) return setError('Enter a valid email address.');
    if (!isStrongPassword(password)) return setError(passwordMessage);
    if (password !== confirmation) return setError('Passwords do not match.');
    setIsSubmitting(true);
    try {
      await authService.register({ fullName: fullName.trim(), email: email.trim(), password });
      navigate('/login', { replace: true });
    } catch (cause) {
      setError(cause instanceof AuthServiceError ? cause.message : 'Unable to create your account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return <form noValidate onSubmit={submit} className="mt-7 space-y-5">
    <TextField id="full-name" label="Full name" value={fullName} onChange={setFullName} autoComplete="name" icon={<User className="h-4 w-4" />} />
    <TextField id="register-email" label="Email address" value={email} onChange={setEmail} autoComplete="email" type="email" icon={<Mail className="h-4 w-4" />} />
    <PasswordField id="register-password" label="Password" value={password} onChange={setPassword} autoComplete="new-password" />
    <p className="-mt-3 text-sm text-zinc-500">{passwordMessage}</p>
    <PasswordField id="confirm-password" label="Confirm password" value={confirmation} onChange={setConfirmation} autoComplete="new-password" />
    {error && <p role="alert" className="rounded-lg border border-red-900/70 bg-red-950/30 px-3 py-2 text-sm text-red-300">{error}</p>}
    <button type="submit" disabled={isSubmitting} className="glass-btn-primary flex h-[45px] w-full items-center justify-center gap-2 rounded-lg px-4 text-base font-medium disabled:cursor-not-allowed disabled:opacity-60">
      {isSubmitting ? 'Creating account…' : 'Create Account'} <ArrowRight className="h-4 w-4" aria-hidden="true" />
    </button>
  </form>;
}

interface TextFieldProps { id: string; label: string; value: string; onChange: (value: string) => void; autoComplete: string; type?: 'text' | 'email'; icon: React.ReactNode; }
function TextField({ id, label, value, onChange, autoComplete, type = 'text', icon }: TextFieldProps) {
  return <div><label htmlFor={id} className="mb-2 block text-base font-medium text-zinc-200">{label}</label><div className="relative"><span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" aria-hidden="true">{icon}</span><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} required className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-3 text-base text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600" /></div></div>;
}
