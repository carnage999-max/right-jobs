import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image, Dimensions } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { tw } from '../../lib/tailwind';
import { 
  LogIn, 
  UserPlus, 
  ShieldCheck, 
  Briefcase, 
  Mail, 
  Lock, 
  User as UserIcon,
  CheckCircle2,
  ArrowRight
} from 'lucide-react-native';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AuthFormValues = z.infer<typeof authSchema>;

export const LoginScreen = () => {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const { signIn } = useAuth();
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors }, reset } = useForm<AuthFormValues>({
    resolver: zodResolver(authSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    setLoading(true);
    try {
      if (mode === 'login') {
        const response = await apiClient.post('/auth/mobile-login', {
          email: data.email,
          password: data.password,
        });
        const { token, user } = response.data;
        await signIn(token, user);
        showSuccess('Welcome back!', 'Successfully logged in.');
      } else {
        await apiClient.post('/auth/signup', data);
        showSuccess('Account created!', 'Please verify your email to continue.');
        setMode('login');
        reset();
      }
    } catch (error: any) {
      const action = mode === 'login' ? 'Login' : 'Sign Up';
      const message = error.response?.data?.message || `Failed to ${mode}. Please try again.`;
      showError(`${action} Failed`, message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-slate-50`}
    >
      <ScrollView contentContainerStyle={tw`flex-grow justify-center px-4 py-10`}>
        {/* Decorative Blurs (Simulated) */}
        <View style={[tw`absolute top-20 left--20 w-80 h-80 rounded-full bg-primary`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />
        <View style={[tw`absolute bottom-20 right--20 w-80 h-80 rounded-full bg-orange-200`, { opacity: 0.1, filter: 'blur(80px)' } as any]} />

        <View style={tw`bg-white/95 rounded-[2.5rem] border border-slate-200 shadow-2xl p-8`}>
          {/* Logo Section */}
          <View style={tw`flex-row items-center gap-2 mb-10`}>
            <View style={tw`h-10 w-10 flex items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/20`}>
              <Briefcase size={20} color="#FFF" />
            </View>
            <Text style={tw`text-xl font-bold tracking-tighter text-slate-900`}>RIGHT JOBS</Text>
          </View>

          <View style={tw`mb-8`}>
            <Text style={tw`text-3xl font-black text-slate-900 tracking-tight`}>
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Text>
            <Text style={tw`text-slate-500 font-medium mt-1`}>
              {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Fill in the details to start your journey.'}
            </Text>
          </View>

          {/* Mode Toggle */}
          <View style={tw`flex-row p-1 mb-8 bg-slate-100 rounded-xl`}>
            <TouchableOpacity 
              onPress={() => setMode('login')}
              style={tw`flex-1 py-2 items-center rounded-lg ${mode === 'login' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text style={tw`text-sm font-bold ${mode === 'login' ? 'text-primary' : 'text-slate-500'}`}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              onPress={() => setMode('signup')}
              style={tw`flex-1 py-2 items-center rounded-lg ${mode === 'signup' ? 'bg-white shadow-sm' : ''}`}
            >
              <Text style={tw`text-sm font-bold ${mode === 'signup' ? 'text-primary' : 'text-slate-500'}`}>Register</Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {mode === 'signup' && (
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Full Name"
                  placeholder="John Doe"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.name?.message}
                  icon={<UserIcon size={18} color={errors.name ? '#EF4444' : '#94A3B8'} />}
                />
              )}
            />
          )}

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email Address"
                placeholder="name@example.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
                keyboardType="email-address"
                autoCapitalize="none"
                icon={<Mail size={18} color={errors.email ? '#EF4444' : '#94A3B8'} />}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <View>
                <Input
                  label="Password"
                  placeholder="••••••••"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  error={errors.password?.message}
                  secureTextEntry
                  icon={<Lock size={18} color={errors.password ? '#EF4444' : '#94A3B8'} />}
                />
                {mode === 'login' && (
                  <TouchableOpacity 
                    style={tw`absolute top-0 right-0`}
                    onPress={() => router.push('/(auth)/forgot-password' as any)}
                  >
                    <Text style={tw`text-xs text-primary font-bold`}>Forgot?</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />

          <Button
            title={mode === 'login' ? 'Sign In Now' : 'Create My Account'}
            onPress={handleSubmit(onSubmit)}
            loading={loading}
            style={tw`h-14 rounded-2xl bg-primary shadow-xl shadow-primary/20 mb-8`}
            textStyle={tw`text-lg font-bold text-white`}
            icon={mode === 'login' ? <LogIn size={20} color="#FFF" /> : <UserPlus size={20} color="#FFF" />}
          />

          <View style={tw`items-center`}>
            <Text style={tw`text-sm text-center text-slate-500 font-medium`}>
              {mode === 'login' ? "Don't have an account yet?" : "Already a member?"}
            </Text>
            <TouchableOpacity 
              onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}
              style={tw`mt-2`}
            >
              <Text style={tw`text-primary font-black`}>
                {mode === 'login' ? 'Create one here' : 'Sign in here'}
              </Text>
            </TouchableOpacity>
          </View>

          {mode === 'signup' && (
            <Text style={tw`text-[10px] text-center text-slate-400 leading-4 mt-8 px-4`}>
              By clicking "Create My Account", you agree to Right Jobs' 
              <Text style={tw`text-primary font-bold`}> Terms of Service </Text> 
              and 
              <Text style={tw`text-primary font-bold`}> Privacy Policy</Text>.
            </Text>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
