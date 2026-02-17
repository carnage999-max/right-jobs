import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../../src/context/AuthContext';
import { useRouter } from 'expo-router';
import { ShieldAlert, RefreshCw } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';

export default function AdminMFACheckScreen() {
  const { user, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Check removed noisy log

    
    if (user?.role?.toUpperCase() === 'ADMIN') {
      if (!user.mfaComplete) {
        Alert.alert(
          'MFA Required',
          'Your admin session requires multi-factor authentication. You will be redirected to complete MFA.',
          [
            {
              text: 'Complete MFA',
              onPress: () => router.replace('/(auth)/mfa')
            }
          ]
        );
      }
    }
  }, [user]);

  return (
    <View style={tw`flex-1 bg-slate-50 items-center justify-center px-6`}>
      <View style={tw`bg-white rounded-3xl p-8 shadow-xl border border-slate-200 w-full max-w-md`}>
        <View style={tw`items-center mb-6`}>
          <View style={tw`w-16 h-16 rounded-2xl bg-orange-100 items-center justify-center mb-4`}>
            <ShieldAlert size={32} color="#EA580C" />
          </View>
          <Text style={tw`text-2xl font-black text-slate-900 text-center`}>
            MFA Verification Required
          </Text>
        </View>

        <Text style={tw`text-slate-600 text-center mb-6 leading-relaxed`}>
          Your admin account requires multi-factor authentication to access administrative features.
        </Text>

        <View style={tw`bg-slate-50 p-4 rounded-xl mb-6`}>
          <Text style={tw`text-xs font-bold text-slate-500 mb-2`}>Current Status:</Text>
          <Text style={tw`text-sm font-mono text-slate-700`}>
            Email: {user?.email}
          </Text>
          <Text style={tw`text-sm font-mono text-slate-700`}>
            Role: {user?.role}
          </Text>
          <Text style={tw`text-sm font-mono text-slate-700`}>
            MFA Complete: {user?.mfaComplete ? 'Yes ✓' : 'No ✗'}
          </Text>
        </View>

        <TouchableOpacity
          style={tw`bg-primary py-4 rounded-xl mb-3`}
          onPress={() => router.replace('/(auth)/mfa')}
        >
          <Text style={tw`text-white font-bold text-center`}>
            Complete MFA Verification
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`bg-slate-100 py-4 rounded-xl flex-row items-center justify-center`}
          onPress={() => signOut()}
        >
          <RefreshCw size={16} color="#64748B" />
          <Text style={tw`text-slate-600 font-bold text-center ml-2`}>
            Sign Out & Try Again
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
