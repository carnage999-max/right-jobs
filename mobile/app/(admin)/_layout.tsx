import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { AdminSidebar } from '../../src/components/AdminSidebar';
import { useColorScheme } from '@/components/useColorScheme';

export default function AdminLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => <AdminSidebar {...props} />}
        screenOptions={{
          headerShown: true,
          headerStyle: { 
            backgroundColor: '#ffffff', 
            shadowOpacity: 0, 
            elevation: 0, 
            borderBottomWidth: 1, 
            borderBottomColor: '#f1f5f9' 
          },
          headerTintColor: '#0F172A',
          headerTitleStyle: { 
            fontWeight: 'bold',
            fontSize: 16,
            color: '#0F172A',
          },
          drawerStyle: { 
            width: '80%',
            backgroundColor: '#ffffff',
          },
          drawerType: 'front',
        }}
      >
        <Drawer.Screen 
            name="dashboard" 
            options={{ 
                drawerLabel: 'Overview',
                title: 'Overview',
            }} 
        />
        <Drawer.Screen 
            name="users" 
            options={{ 
                drawerLabel: 'Users',
                title: 'User Management',
            }} 
        />
        <Drawer.Screen 
            name="jobs" 
            options={{ 
                drawerLabel: 'Jobs',
                title: 'Job Listings',
            }} 
        />
        <Drawer.Screen 
            name="verifications" 
            options={{ 
                drawerLabel: 'Verifications',
                title: 'ID Verification Requests',
            }} 
        />
        <Drawer.Screen 
            name="reviews" 
            options={{ 
                drawerLabel: 'Reviews',
                title: 'Content Moderation',
            }} 
        />
        <Drawer.Screen 
            name="payments" 
            options={{ 
                drawerLabel: 'Payments',
                title: 'Transaction History',
            }} 
        />
        <Drawer.Screen 
            name="notifications" 
            options={{ 
                drawerLabel: 'Notifications',
                title: 'System Alerts',
            }} 
        />
        <Drawer.Screen 
            name="audit" 
            options={{ 
                drawerLabel: 'Audit',
                title: 'Activity Audit Log',
            }} 
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
