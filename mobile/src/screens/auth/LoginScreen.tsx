import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import { tw } from '../../lib/tailwind';
import { LogIn, UserPlus, ShieldCheck, Briefcase } from 'lucide-react-native';

const authSchema = z.object({
  name: z.string().optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['seeker', 'employer']).default('seeker'),
});

type AuthFormValues = z.infer<typeof authSchema>;

import { useRouter } from 'expo-router';

// @ts-ignore
export const LoginScreen = (): any => {
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
      role: 'seeker',
    },
  });

  const onSubmit = async (data: AuthFormValues) => {
    console.log('[Auth] Submitting form...', { mode, email: data.email });
    setLoading(true);
    try {
      if (mode === 'login') {
        console.log('[Auth] Attempting login...');
        const response = await apiClient.post('/auth/mobile-login', {
          email: data.email,
          password: data.password,
        });
        console.log('[Auth] Login response received:', response.status);
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
      console.error('[Auth] Submit Error:', error.message);
      if (error.response) {
        console.error('[Auth] Error Status:', error.response.status);
        console.error('[Auth] Error Data:', error.response.data);
        console.error('[Auth] Error Headers:', error.response.headers);
      } else if (error.request) {
        console.error('[Auth] No response received. Request details:', error.request);
      }
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
      style={tw`flex-1 bg-white`}
    >
      <ScrollView contentContainerStyle={tw`flex-grow px-6 py-10`}>
        {/* Header/Logo */}
        <View style={tw`items-center mb-8`}>
          <Image 
            source={require('../../../assets/images/logo-nobg.png')} 
            style={tw`w-48 h-24`} 
            resizeMode="contain"
          />
        </View>

        <View style={tw`mb-8`}>
          <Text style={tw`text-3xl font-black text-gray-900 mb-2`}>
            {mode === 'login' ? 'Welcome Back' : 'Join RightJobs'}
          </Text>
          <Text style={tw`text-gray-500 font-medium`}>
            {mode === 'login' ? 'Enter your credentials to access your dashboard.' : 'Fill in the details to start your journey.'}
          </Text>
        </View>

        {/* Mode Toggle */}
        <View style={tw`flex-row p-1 mb-8 bg-gray-100 rounded-2xl`}>
          <TouchableOpacity 
            onPress={() => setMode('login')}
            style={tw`flex-1 py-3 items-center rounded-xl ${mode === 'login' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text style={tw`font-bold ${mode === 'login' ? 'text-primary' : 'text-gray-500'}`}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setMode('signup')}
            style={tw`flex-1 py-3 items-center rounded-xl ${mode === 'signup' ? 'bg-white shadow-sm' : ''}`}
          >
            <Text style={tw`font-bold ${mode === 'signup' ? 'text-primary' : 'text-gray-500'}`}>Register</Text>
          </TouchableOpacity>
        </View>

        {/* Form Fields */}
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
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Password"
              placeholder="••••••••"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.password?.message}
              secureTextEntry
            />
          )}
        />

        {mode === 'login' ? (
          <TouchableOpacity 
            style={tw`self-end mb-6`}
            onPress={() => router.push('/(auth)/forgot-password' as any)}
          >
            <Text style={tw`text-primary font-bold text-xs`}>Forgot Password?</Text>
          </TouchableOpacity>
        ) : (
          <Controller
            control={control}
            name="role"
            render={({ field: { onChange, value } }) => (
              <View style={tw`mb-8 mt-2`}>
                <Text style={tw`text-sm font-bold text-gray-700 mb-3`}>Account Type</Text>
                <View style={tw`flex-row gap-x-3`}>
                  <TouchableOpacity 
                    onPress={() => onChange('seeker')}
                    style={tw`flex-1 py-4 rounded-2xl border-2 items-center ${value === 'seeker' ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-transparent'}`}
                  >
                    <Briefcase size={20} color={value === 'seeker' ? '#014D9F' : '#94A3B8'} style={tw`mb-1`} />
                    <Text style={tw`font-bold text-xs ${value === 'seeker' ? 'text-primary' : 'text-gray-400'}`}>Job Seeker</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => onChange('employer')}
                    style={tw`flex-1 py-4 rounded-2xl border-2 items-center ${value === 'employer' ? 'bg-primary/5 border-primary' : 'bg-gray-50 border-transparent'}`}
                  >
                    <ShieldCheck size={20} color={value === 'employer' ? '#014D9F' : '#94A3B8'} style={tw`mb-1`} />
                    <Text style={tw`font-bold text-xs ${value === 'employer' ? 'text-primary' : 'text-gray-400'}`}>Employer</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        )}

        <Button
          title={mode === 'login' ? 'Sign In Now' : 'Create My Account'}
          onPress={handleSubmit(onSubmit, (err) => console.log('[Auth] Validation Errors:', err))}
          loading={loading}
          style={tw`mb-8 shadow-lg shadow-primary/20 h-14`}
          icon={mode === 'login' ? <LogIn size={20} color="#FFF" /> : <UserPlus size={20} color="#FFF" />}
        />

        <View style={tw`flex-row justify-center items-center mb-10`}>
          <Text style={tw`text-gray-500 font-medium mr-2`}>
            {mode === 'login' ? "Don't have an account?" : "Already a member?"}
          </Text>
          <TouchableOpacity onPress={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            <Text style={tw`text-primary font-black`}>
              {mode === 'login' ? 'Create one' : 'Login here'}
            </Text>
          </TouchableOpacity>
        </View>

        {mode === 'signup' && (
          <Text style={tw`text-[10px] text-center text-gray-400 leading-4 px-4`}>
            By clicking "Create My Account", you agree to Right Jobs' 
            <Text style={tw`text-primary font-bold`}> Terms of Service </Text> 
            and 
            <Text style={tw`text-primary font-bold`}> Privacy Policy</Text>.
          </Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
