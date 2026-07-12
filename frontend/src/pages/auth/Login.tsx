import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { Compass, Shield, Leaf, Users, Lock } from 'lucide-react';

const loginSchema = zod.object({
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormValues = zod.infer<typeof loginSchema>;

const demoAccounts = [
  { label: 'Admin', email: 'admin@ecosphere.com', password: 'admin123', icon: Shield, color: 'text-emerald-500' },
  { label: 'Manager', email: 'manager@ecosphere.com', password: 'manager123', icon: Users, color: 'text-blue-500' },
  { label: 'Employee', email: 'employee@ecosphere.com', password: 'employee123', icon: Leaf, color: 'text-purple-500' },
];

export function Login() {
  const { login, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (values: LoginFormValues) => {
    try {
      await login({
        email: values.email,
        password: values.password,
      });
      toast.success('Welcome back to EcoSphere!');
    } catch (err: any) {
      toast.error(err.message || 'Login failed. Please check your credentials.');
    }
  };

  const fillDemo = (email: string, password: string) => {
    setValue('email', email, { shouldValidate: true });
    setValue('password', password, { shouldValidate: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 p-6 relative overflow-hidden">
      {/* Decorative background blobs */}
      <div className="absolute top-[-120px] right-[-80px] w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-60px] w-72 h-72 bg-blue-500/10 rounded-full blur-3xl" />

      <div className="w-full max-w-md bg-card/80 backdrop-blur-md border border-border p-8 rounded-2xl shadow-2xl flex flex-col items-center relative z-10">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 mb-6">
          <Compass className="h-9 w-9 text-emerald-500 animate-pulse" />
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Welcome Back</h2>
          <p className="text-xs text-muted-foreground mt-1">Sign in to your ESG Management Platform</p>
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

        {/* Demo Accounts */}
        <div className="w-full mt-6 pt-5 border-t border-border/50">
          <div className="flex items-center justify-center space-x-1.5 mb-3">
            <Lock className="h-3 w-3 text-muted-foreground" />
            <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Quick Demo Access</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((acc) => (
              <button
                key={acc.label}
                type="button"
                onClick={() => fillDemo(acc.email, acc.password)}
                className="flex flex-col items-center p-2.5 rounded-xl border border-border/60 hover:border-emerald-500/30 hover:bg-emerald-500/5 transition-all duration-200 group cursor-pointer"
              >
                <acc.icon className={`h-4 w-4 mb-1 ${acc.color} group-hover:scale-110 transition-transform`} />
                <span className="text-[11px] font-semibold text-foreground">{acc.label}</span>
                <span className="text-[9px] text-muted-foreground mt-0.5">{acc.email.split('@')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-5 text-center">
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
