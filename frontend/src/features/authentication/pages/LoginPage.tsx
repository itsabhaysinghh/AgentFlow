import { Link } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return <AuthShell title="Sign in to AgentFlow" description="Access your workspace and automations." footer={<>Don&apos;t have an account? <Link to="/register" className="text-white underline-offset-4 hover:underline">Create account</Link></>}><LoginForm /></AuthShell>;
}
