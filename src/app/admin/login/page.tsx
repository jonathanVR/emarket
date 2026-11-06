import { LoginForm } from '@/components/admin/LoginForm';
import { SetupBanner } from '@/components/SetupBanner';

export default function AdminLoginPage() {
  return (
    <div className="login-card">
      <div>
        <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>
          Entrar al admin
        </h1>
        <SetupBanner />
        <LoginForm />
      </div>
    </div>
  );
}
