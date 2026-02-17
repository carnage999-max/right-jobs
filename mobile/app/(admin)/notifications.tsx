import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';
import { Bell, Send, Users, Briefcase, ShieldCheck, CheckCircle2 } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useToast } from '../../src/hooks/useToast';
import { tw } from '../../src/lib/tailwind';

import { AdminBottomNav } from '../../src/components/AdminBottomNav';

const targetOptions = [
  { id: 'ALL', label: 'All Users', icon: Users, color: 'bg-blue-100' },
  { id: 'JOB_SEEKERS', label: 'Job Seekers', icon: Briefcase, color: 'bg-orange-100' },
  { id: 'ADMINS', label: 'Administrators', icon: ShieldCheck, color: 'bg-purple-100' },
] as const;

export default function AdminNotificationsScreen() {
  const navigation = useNavigation();
  const [subject, setSubject] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState<'ALL' | 'JOB_SEEKERS' | 'ADMINS'>('ALL');
  const { showSuccess, showError } = useToast();

  const broadcastMutation = useMutation({
    mutationFn: () => adminService.sendBroadcast({ subject, content, target }),
    onSuccess: (data: any) => {
      showSuccess('Sent', data.message || 'Broadcast sent successfully');
      setSubject('');
      setContent('');
    },
    onError: () => showError('Error', 'Failed to send broadcast'),
  });

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
      style={tw`flex-1 bg-slate-50`}
    >
      <ScrollView 
        style={tw`flex-1 px-6 pt-16`} 
        contentContainerStyle={{ paddingBottom: 160 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={tw`flex-row items-center justify-between mb-8`}>
          <View style={tw`flex-row items-center flex-1`}>
            <TouchableOpacity 
              style={tw`p-3 rounded-2xl mr-4 bg-slate-100 border border-slate-200`}
              onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            >
              <Bell size={28} color="#014D9F" />
            </TouchableOpacity>
            <View style={tw`flex-1`}>
              <Text style={tw`text-2xl font-black text-slate-900 tracking-tight`}>System Broadcast</Text>
              <Text style={tw`text-slate-500 font-medium text-xs mt-1`}>Dispatch critical platform announcements</Text>
            </View>
          </View>
        </View>

        {/* Target Segment Section */}
        <View style={tw`mb-8`}>
          <Text style={tw`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 ml-1`}>Target Segment</Text>
          <View style={tw`gap-y-2`}>
            {targetOptions.map((opt) => (
              <TouchableOpacity 
                key={opt.id}
                onPress={() => setTarget(opt.id)}
                style={tw`flex-row items-center gap-3 p-4 rounded-2xl border-2 ${
                  target === opt.id 
                    ? 'bg-white border-[#014D9F] shadow-md' 
                    : 'bg-slate-50 border-transparent'
                }`}
              >
                <View style={tw`h-12 w-12 rounded-xl ${opt.color} items-center justify-center`}>
                  <opt.icon size={20} color={opt.id === 'ALL' ? '#2563EB' : opt.id === 'JOB_SEEKERS' ? '#EA580C' : '#9333EA'} />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`font-black text-slate-900 text-sm`}>{opt.label}</Text>
                </View>
                {target === opt.id && <CheckCircle2 size={20} color="#014D9F" />}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Message Composer Card */}
        <View style={tw`bg-white rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-100 overflow-hidden mb-8`}>
          <View style={tw`px-6 py-4 bg-slate-50/30 border-b border-slate-100`}>
            <Text style={tw`text-lg font-black text-slate-900`}>Message Composer</Text>
          </View>
          
          <View style={tw`px-6 py-6 gap-y-5`}>
            {/* Email Subject */}
            <View>
              <Text style={tw`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1`}>Email Subject</Text>
              <Input
                placeholder="Urgent Maintenance / Update..."
                value={subject}
                onChangeText={setSubject}
                inputStyle={tw`font-bold`}
              />
            </View>

            {/* Content */}
            <View>
              <Text style={tw`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 ml-1`}>Content (HTML Supported)</Text>
              <Input
                placeholder="Write your announcement here..."
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={6}
                inputStyle={tw`h-40 textAlignVertical-top font-medium leading-relaxed`}
              />
            </View>

            {/* Footer */}
            <View style={tw`pt-2 gap-y-4`}>
              <Text style={tw`text-[9px] font-bold text-slate-400 uppercase tracking-widest`}>
                Reaching <Text style={tw`text-[#014D9F] italic`}>Global Audience</Text>
              </Text>
              <Button
                title="Execute Broadcast"
                onPress={() => broadcastMutation.mutate()}
                loading={broadcastMutation.isPending}
                disabled={!subject || !content}
                icon={<Send size={20} color="#FFF" />}
                style={tw`shadow-lg shadow-primary/10`}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      <AdminBottomNav />
    </KeyboardAvoidingView>
  );
}
