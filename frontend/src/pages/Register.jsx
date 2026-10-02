import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthShell from '../components/layout/AuthShell';
import Alert from '../components/ui/Alert';
import Button from '../components/ui/Button';
import { Field, Input } from '../components/ui/Field';
import PasswordInput from '../components/ui/PasswordInput';
import { authService } from '../services/authService';
import { getErrorMessage, getFieldErrors } from '../utils/errors';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const setField = (name) => (event) => setForm((prev) => ({ ...prev, [name]: event.target.value }));

  async function handleSubmit(event) {
    event.preventDefault();
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Enter your name.';
    if (!form.email.trim()) nextErrors.email = 'Enter your email address.';
    if (!form.password) nextErrors.password = 'Choose a password.';
    if (form.password && form.confirm !== form.password) nextErrors.confirm = 'Passwords do not match.';
    setErrors(nextErrors);
    setFormError('');
    if (Object.keys(nextErrors).length) return;

    setSubmitting(true);
    try {
      // Registration does not sign the user in, so send them to the login page.
      await authService.register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      navigate('/login', { replace: true, state: { registered: true, email: form.email.trim() } });
    } catch (error) {
      setErrors(getFieldErrors(error));
      setFormError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Start tracking your applications in minutes."
      footer={<>Already have an account? <Link to="/login" className="font-medium text-brand-600 hover:text-brand-700">Sign in</Link></>}
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        {formError && <Alert>{formError}</Alert>}
        <Field label="Full name" error={errors.name}>
          {(props) => <Input {...props} autoComplete="name" maxLength={100} value={form.name} onChange={setField('name')} />}
        </Field>
        <Field label="Email" error={errors.email}>
          {(props) => <Input {...props} type="email" autoComplete="email" maxLength={255} value={form.email} onChange={setField('email')} placeholder="you@example.com" />}
        </Field>
        <Field label="Password" error={errors.password}>
          {(props) => <PasswordInput {...props} autoComplete="new-password" value={form.password} onChange={setField('password')} />}
        </Field>
        <Field label="Confirm password" error={errors.confirm}>
          {(props) => <PasswordInput {...props} autoComplete="new-password" value={form.confirm} onChange={setField('confirm')} />}
        </Field>
        <Button type="submit" loading={submitting} className="w-full">Create account</Button>
      </form>
    </AuthShell>
  );
}
