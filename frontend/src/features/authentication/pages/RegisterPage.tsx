import { Link } from 'react-router-dom';
import { AuthShell } from '../components/AuthShell';
import { RegisterForm } from '../components/RegisterForm';

export function RegisterPage() {
  return <AuthShell title="Create your account" description="Start building secure, intelligent workflows." footer={<>Already have an account? <Link to="/login" className="text-white underline-offset-4 hover:underline">Sign in</Link></>}><RegisterForm /></AuthShell>;
}
