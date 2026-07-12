import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Eye, 
  EyeOff, 
  Mail, 
  Lock, 
  Shield, 
  Check, 
  Info, 
  ChevronDown,
  Sparkles,
  ArrowRight,
  Loader2
} from 'lucide-react';

// Zod validation schema definition
const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['Fleet Manager', 'Dispatcher', 'Safety Officer', 'Financial Analyst'], {
    required_error: 'Please select a role',
  }),
  rememberMe: z.boolean().default(true),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [submitData, setSubmitData] = useState<LoginFormValues | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'Ravenk@transitops.in',
      password: '',
      role: 'Dispatcher',
      rememberMe: true,
    },
  });

  const rememberMeValue = watch('rememberMe');

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    // Simulate authentication API request delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitData(data);
    console.log('Login successful:', data);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/20 to-emerald-50/10 p-4 relative overflow-hidden font-sans">
      {/* Decorative blurred background accent blobs matching requested color palette */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-100/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-emerald-50/50 rounded-full blur-3xl" />
      <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-amber-50/40 rounded-full blur-3xl" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 p-8 relative z-10 transition-all duration-300 hover:shadow-2xl hover:shadow-slate-300/40">
        
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-gradient-to-tr from-amber-400 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/20 mb-4 transform hover:rotate-12 transition-transform duration-300">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight text-center">
            Sign in to your account
          </h1>
          <p className="text-sm text-slate-500 mt-1.5 text-center">
            Enter your credentials to continue
          </p>
        </div>

        {/* Interactive Submit Feedback Container */}
        {submitData ? (
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5 text-center space-y-3 animate-fade-in">
            <div className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-md shadow-emerald-500/10">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="font-semibold text-emerald-800">Success!</h3>
            <p className="text-xs text-emerald-600 leading-relaxed">
              Logged in successfully as <strong className="font-semibold">{submitData.role}</strong>.
            </p>
            <button
              onClick={() => setSubmitData(null)}
              className="text-xs text-emerald-700 font-medium hover:underline focus:outline-none"
            >
              Sign out / Test again
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Address Input */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-5 h-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  {...register('email')}
                  className={`block w-full pl-10 pr-4 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 ${
                    errors.email ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="name@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="password" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  Password
                </label>
                <a 
                  href="#forgot" 
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Password reset link has been simulated.');
                  }}
                  className="text-xs font-medium text-amber-600 hover:text-amber-700 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-5 h-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  {...register('password')}
                  className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 ${
                    errors.password ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Role (RBAC) Dropdown */}
            <div>
              <label htmlFor="role" className="block text-xs font-semibold text-slate-600 uppercase tracking-wider mb-2">
                Your Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Shield className="w-5 h-5" />
                </div>
                <select
                  id="role"
                  {...register('role')}
                  className={`block w-full pl-10 pr-10 py-2.5 bg-white border rounded-xl text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 ${
                    errors.role ? 'border-red-300 focus:ring-red-500/20 focus:border-red-500' : 'border-slate-200'
                  }`}
                >
                  <option value="Dispatcher">Dispatcher</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
              {errors.role && (
                <p className="mt-1.5 text-xs text-red-500 font-medium">{errors.role.message}</p>
              )}
            </div>

            {/* Custom Remember Me Checkbox with Lucide Check Icon */}
            <div className="flex items-center">
              <label className="flex items-center space-x-2.5 cursor-pointer select-none group">
                <div className="relative">
                  <input
                    id="rememberMe"
                    type="checkbox"
                    {...register('rememberMe')}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 ${
                    rememberMeValue 
                      ? 'bg-amber-500 border-amber-500 text-white shadow-sm shadow-amber-500/20' 
                      : 'bg-white border-slate-200 group-hover:border-slate-300'
                  }`}>
                    {rememberMeValue && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                  </div>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-700 transition-colors">
                  Remember me
                </span>
              </label>
            </div>

            {/* Custom Yellow-Orange Sign In Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="bg-[#F59E0B] hover:bg-[#D97706] active:bg-[#B45309] disabled:bg-[#F59E0B]/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 px-4 rounded-xl shadow-lg shadow-amber-500/10 hover:shadow-amber-500/20 active:shadow-none transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 w-full mt-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        )}

        {/* Role-Based Access Mapping Section */}
        <div className="mt-8 border-t border-slate-100 pt-6">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
            <Info className="w-3.5 h-3.5 text-blue-500" />
            <span>Role-Based Access Control (RBAC) Mapping</span>
          </div>
          <div className="grid grid-cols-2 gap-2.5 text-[11px]">
            <div className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100/50 hover:bg-blue-50/80 transition-colors">
              <span className="font-bold text-blue-700 block mb-0.5">Fleet Manager</span>
              <span className="text-slate-500 leading-normal">Fleet, Maintenance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-emerald-50/50 border border-emerald-100/50 hover:bg-emerald-50/80 transition-colors">
              <span className="font-bold text-emerald-700 block mb-0.5">Dispatcher</span>
              <span className="text-slate-500 leading-normal">Dashboard, Trips</span>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-50/40 border border-amber-100/50 hover:bg-amber-50/60 transition-colors">
              <span className="font-bold text-amber-700 block mb-0.5">Safety Officer</span>
              <span className="text-slate-500 leading-normal">Drivers, Compliance</span>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-50/50 border border-purple-100/50 hover:bg-purple-50/80 transition-colors">
              <span className="font-bold text-purple-700 block mb-0.5">Financial Analyst</span>
              <span className="text-slate-500 leading-normal">Fuel & Expenses, Analytics</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}