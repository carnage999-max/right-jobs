import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Bell, Send, Target, Info } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useToast } from '../../src/hooks/useToast';

export default function AdminNotificationsScreen() {
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
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light"
    >
      <ScrollView className="flex-1 px-6 pt-16">
        <View className="flex-row items-center mb-6">
          <View className="bg-primary/10 p-3 rounded-2xl mr-4">
            <Bell size={28} color="#014D9F" />
          </View>
          <Text className="text-2xl font-bold text-gray-900">Broadcast</Text>
        </View>

        <View className="bg-primary/5 p-4 rounded-3xl mb-8 flex-row items-start">
          <Info size={20} color="#014D9F" className="mr-3 mt-0.5" />
          <Text className="flex-1 text-primary text-sm font-medium">
            Broadcasting sends a system email to all selected users. Use this for important announcements only.
          </Text>
        </View>

        <Text className="text-gray-700 font-bold mb-3 ml-1">Target Audience</Text>
        <View className="flex-row gap-x-2 mb-8">
          {(['ALL', 'JOB_SEEKERS', 'ADMINS'] as const).map((t) => (
            <TouchableOpacity 
              key={t}
              onPress={() => setTarget(t)}
              className={`flex-1 py-3 rounded-2xl border-2 items-center ${target === t ? 'bg-primary/10 border-primary' : 'bg-white border-gray-100'}`}
            >
              <Text className={`font-bold text-xs ${target === t ? 'text-primary' : 'text-gray-400'}`}>
                {t.replace('_', ' ')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Input
          label="Email Subject"
          placeholder="System Update: New Features"
          value={subject}
          onChangeText={setSubject}
        />

        <Input
          label="Message Content"
          placeholder="Write your message here..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          className="h-40 textAlignVertical-top"
        />

        <Button
          title="Send Broadcast"
          onPress={() => broadcastMutation.mutate()}
          loading={broadcastMutation.isPending}
          disabled={!subject || !content}
          icon={<Send size={20} color="#FFF" />}
          className="mb-20"
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

import { TouchableOpacity } from 'react-native';
