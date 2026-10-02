import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthShell from '../components/layout/AuthShell';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import PasswordInput from '../components/ui/PasswordInput';
import { useAuth } from '../hooks/useAuth';
import { getErrorMessage, getFieldErrors } from '../utils/errors';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: location.state?.email ?? '', password: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const registered = Boolean(location.state?.registered);
  const from = location.state?.from;
  const redirectTo = from ? `${from.pathname}${from.search}` : '/';

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.';
    if (!form.password) nextErrors.password = 'Enter your password.';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to continue to your dashboard."
      footer={<>New to JobTrack? <Link to="/register" className="font-medium text-brand-600 hover:text-brand-700">Create an account</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {registered && !formError && <Alert tone="success">Account created. Sign in to get started.</Alert>}
        {formError && <Alert>{formError}</Alert>}
        <Field label="Email" error={errors.email}>
          {(props) => <Input {...props} type="email" autoComplete="email" value={form.email} onChange={setField('email')} placeholder="you@example.com" />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(props) => <PasswordInput {...props} autoComplete="current-password" value={form.password} onChange={setField('password')} />}
        </Field>
        <Button type="submit" loading={submitting} className="w-full">Sign in</Button>
      </form>
    </AuthShell>
  );
}
