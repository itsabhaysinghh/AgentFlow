import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';

interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
  error?: string;
}

export function PasswordField({ id, label, value, onChange, autoComplete, error }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const errorId = `${id}-error`;

  return <div>
    <label htmlFor={id} className="mb-2 block text-base font-medium text-zinc-200">{label}</label>
    <div className="relative">
      <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" aria-hidden="true" />
      <input id={id} type={visible ? 'text' : 'password'} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error ? errorId : undefined} className="h-11 w-full rounded-lg border border-zinc-700 bg-zinc-900 pl-10 pr-12 text-base text-white outline-none transition focus:border-zinc-400 focus:ring-2 focus:ring-zinc-600" />
      <button type="button" onClick={() => setVisible(!visible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-zinc-400 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-300" aria-label={visible ? 'Hide password' : 'Show password'}>
        {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </button>
    </div>
    {error && <p id={errorId} className="mt-1.5 text-sm text-red-400">{error}</p>}
  </div>;
}
