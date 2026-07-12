import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { settingsApi } from '../../api/settings';
import { useQuery } from '@tanstack/react-query';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Button } from '../../components/ui/Button';
import { toast } from '../../components/ui/Toast';
import { Compass } from 'lucide-react';

const registerSchema = zod.object({
  firstName: zod.string().min(2, 'First name must be at least 2 characters'),
  lastName: zod.string().min(2, 'Last name must be at least 2 characters'),
  email: zod.string().email('Please enter a valid email address'),
  password: zod.string().min(6, 'Password must be at least 6 characters'),
  departmentId: zod.string().min(1, 'Please select your department'),
});

type RegisterFormValues = zod.infer<typeof registerSchema>;

export function Register() {
  const { register: registerUser, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();

  // Redirect once auth state is confirmed true after registration
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Fetch departments for selection
  const { data: deptsData } = useQuery({
    queryKey: ['register_departments'],
    queryFn: () => settingsApi.getDepartments(),
  });

  const deptOptions = (deptsData?.data || []).map((d) => ({
    label: `${d.name} (${d.code})`,
    value: d.id,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      departmentId: '',
    },
  });

  const onSubmit = async (values: RegisterFormValues) => {
    try {
      await registerUser({
        email: values.email,
        password: values.password,
        firstName: values.firstName,
        lastName: values.lastName,
        role: 'CONTRIBUTOR',
        departmentId: values.departmentId,
      });
      toast.success('Registration successful! Welcome to EcoSphere.');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 p-6">
      <div className="w-full max-w-md bg-card border border-border p-8 rounded-2xl shadow-xl flex flex-col items-center">
        {/* Logo */}
        <div className="flex items-center space-x-2.5 mb-6">
          <Compass className="h-8 w-8 text-emerald-500" />
          <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-emerald-500 to-emerald-700 bg-clip-text text-transparent">
            EcoSphere
          </span>
        </div>

        <div className="text-center mb-6">
          <h2 className="text-xl font-bold text-foreground">Create Account</h2>
          <p className="text-xs text-muted-foreground mt-1">Register for EcoSphere ESG management</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="First Name"
              placeholder="Jane"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>

          <Input
            label="Email Address"
            type="email"
            placeholder="jane.doe@company.com"
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

          <Select
            label="Department"
            options={[{ label: 'Select Department...', value: '' }, ...deptOptions]}
            error={errors.departmentId?.message}
            {...register('departmentId')}
          />

          <Button type="submit" className="w-full" isLoading={isSubmitting}>
            Register
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-6 text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
export default Register;
