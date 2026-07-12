import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { Compass } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

export function Login() {
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email,
        passwordHash: values.password,
      });
      toast.success('Welcome back to EcoSphere!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 mb-6">
          <Compass className="h-8 w-8 text-emerald-500 animate-pulse" />
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Sign In</h2>
          <p className="text-xs text-muted-foreground mt-1">Access your ESG Management dashboard</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Sign In
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          New to the platform?{' '}
          <Link to="/register" className="text-primary font-semibold hover:underline">
            Request Access
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Login;
