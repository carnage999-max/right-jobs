import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, Bell, CheckCircle2, AlertCircle, Info, Archive, Trash2 } from 'lucide-react-native';
import { tw } from '../src/lib/tailwind';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    route: string;
  };
}

export default function NotificationsScreen() {
  const router = useRouter();

  // Mock notifications - in production, fetch from API
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'success',
      title: 'Profile Updated',
      message: 'Your profile information has been successfully saved.',
      timestamp: '2 hours ago',
      read: false,
    },
    {
      id: '2',
      type: 'info',
      title: 'New Job Matching Your Skills',
      message: 'We found a Senior Developer role that matches your profile. Check it out!',
      timestamp: '5 hours ago',
      read: false,
      action: {
        label: 'View Job',
        route: '/(tabs)/jobs',
      },
    },
    {
      id: '3',
      type: 'warning',
      title: 'Verify Your Identity',
      message: 'Complete identity verification to unlock premium features and boost your visibility.',
      timestamp: '1 day ago',
      read: true,
      action: {
        label: 'Verify Now',
        route: '/profile/compliance',
      },
    },
    {
      id: '4',
      type: 'info',
      title: 'Welcome to Right Jobs!',
      message: 'Start building your profile and discover amazing opportunities.',
      timestamp: '3 days ago',
      read: true,
    },
  ];

  const getIconColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#10B981';
      case 'warning':
        return '#F59E0B';
      case 'info':
        return '#3B82F6';
      default:
        return '#64748B';
    }
  };

  const getIconBgColor = (type: string) => {
    switch (type) {
      case 'success':
        return '#ECFDF5';
      case 'warning':
        return '#FFFBEB';
      case 'info':
        return '#EFF6FF';
      default:
        return '#F1F5F9';
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return CheckCircle2;
      case 'warning':
        return AlertCircle;
      case 'info':
        return Info;
      default:
        return Bell;
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => {
    const IconComponent = getIcon(item.type);
    const iconColor = getIconColor(item.type);
    const bgColor = getIconBgColor(item.type);

    return (
      <TouchableOpacity
        onPress={() => {
          if (item.action) {
            router.push(item.action.route as any);
          }
        }}
        style={[
          tw`bg-white rounded-2xl p-4 mb-3 border`,
          { 
            borderColor: item.read ? '#E2E8F0' : '#CBD5E1',
            backgroundColor: item.read ? '#FFFFFF' : '#F8FAFC'
          }
        ]}
      >
        <View style={tw`flex-row gap-4`}>
          <View
            style={[
              tw`h-12 w-12 rounded-xl items-center justify-center shrink-0`,
              { backgroundColor: bgColor }
            ]}
          >
            <IconComponent size={24} color={iconColor} />
          </View>

          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-start justify-between mb-1`}>
              <Text style={tw`font-bold text-slate-900 text-base flex-1`}>
                {item.title}
              </Text>
              {!item.read && (
                <View style={tw`h-2 w-2 rounded-full bg-primary ml-2 mt-1.5`} />
              )}
            </View>

            <Text style={tw`text-slate-600 text-sm leading-relaxed mb-2`}>
              {item.message}
            </Text>

            <View style={tw`flex-row items-center justify-between`}>
              <Text style={tw`text-xs text-slate-400 font-medium uppercase tracking-wide`}>
                {item.timestamp}
              </Text>
              {item.action && (
                <TouchableOpacity
                  onPress={() => router.push(item.action!.route as any)}
                  style={tw`px-3 py-1.5 rounded-lg bg-primary/10`}
                >
                  <Text style={tw`text-primary font-bold text-xs uppercase tracking-wide`}>
                    {item.action.label}
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <View style={tw`flex-1 bg-slate-50`}>
      {/* Header */}
      <View style={tw`bg-white pt-12 pb-4 px-6 border-b border-slate-100 flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center flex-1`}>
          <TouchableOpacity 
            onPress={() => router.back()}
            style={tw`p-2 -ml-2 mr-4 rounded-full`}
          >
            <ChevronLeft size={24} color="#0F172A" />
          </TouchableOpacity>
          <View>
            <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Notifications</Text>
            <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest mt-1`}>{unreadCount} unread</Text>
          </View>
        </View>
        <View style={tw`flex-row gap-2`}>
          <TouchableOpacity style={tw`p-2 rounded-lg bg-slate-100 hover:bg-slate-200`}>
            <Archive size={18} color="#475569" />
          </TouchableOpacity>
        </View>
      </View>

      {notifications.length > 0 ? (
        <FlatList
          data={notifications}
          renderItem={renderNotification}
          keyExtractor={(item) => item.id}
          contentContainerStyle={tw`p-6 pb-20`}
          scrollEnabled={true}
        />
      ) : (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`bg-slate-100 p-4 rounded-full mb-4`}>
            <Bell size={40} color="#CBD5E1" />
          </View>
          <Text style={tw`text-lg font-bold text-slate-900 text-center mb-2`}>
            No Notifications
          </Text>
          <Text style={tw`text-slate-500 text-center text-sm leading-relaxed`}>
            You're all caught up! We'll notify you when something important happens.
          </Text>
        </View>
      )}
    </View>
  );
}
