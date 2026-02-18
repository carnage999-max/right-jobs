import 'react-native-gesture-handler';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { AuthProvider } from '../src/context/AuthContext';
import { useColorScheme } from '@/components/useColorScheme';
import { queryClient } from '../src/lib/queryClient';
import 'react-native-reanimated';

import { AnimatedSplashScreen } from '../src/components/AnimatedSplashScreen';
import { useState } from 'react';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [appReady, setAppReady] = useState(false);
  const [animationFinished, setAnimationFinished] = useState(false);

  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      // Hide native splash, custom one will be visible
      SplashScreen.hideAsync();
      setAppReady(true);
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <RootLayoutNav />
      {!animationFinished && (
        <AnimatedSplashScreen onAnimationFinish={() => setAnimationFinished(true)} />
      )}
    </>
  );
}

import { useAuth } from '../src/context/AuthContext';
import { useRouter, useSegments } from 'expo-router';

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <AuthGate />
          <Toast />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AuthGate() {
  const { user, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inAdminGroup = segments[0] === '(admin)';
    const inTabsGroup = segments[0] === '(tabs)';
    
    const isAdmin = user?.role?.toUpperCase() === 'ADMIN';

    if (!user && !inAuthGroup) {
      // Redirect to welcome if not logged in and not already in auth group
      router.replace('/(auth)/welcome');
    } else if (user) {
      if (isAdmin) {
        if (!user.mfaComplete) {
          if (segments[1] !== 'mfa') router.replace('/(auth)/mfa');
        } else if (!inAdminGroup) {
          // If admin, MFA complete, but not in admin group, redirect to dashboard
          router.replace('/(admin)/dashboard');
        }
      } else if (inAuthGroup || inAdminGroup) {
        // Regular user in auth or admin group, redirect to user tabs
        router.replace('/(tabs)');
      }
    }
  }, [user, isLoading, segments]);

  return (
    <Stack>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(admin)" options={{ headerShown: false }} />
      <Stack.Screen name="profile/personal" options={{ headerShown: false }} />
      <Stack.Screen name="profile/documents" options={{ headerShown: false }} />
      <Stack.Screen name="profile/compliance" options={{ headerShown: false }} />
      <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
