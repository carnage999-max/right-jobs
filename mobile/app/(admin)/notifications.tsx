import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { useMutation } from '@tanstack/react-query';
import { Bell, Send, Target, Info } from 'lucide-react-native';
import { adminService } from '../../src/services/api/admin';
import { Input } from '../../src/components/ui/Input';
import { Button } from '../../src/components/ui/Button';
import { useToast } from '../../src/hooks/useToast';
import tw from 'twrnc';

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
      style={tw`flex-1 bg-gray-50`}
    >
      <ScrollView style={tw`flex-1 px-6 pt-16`}>
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`bg-[#014D9F10] p-3 rounded-2xl mr-4`}>
            <Bell size={28} color="#014D9F" />
          </View>
          <Text style={tw`text-2xl font-bold text-gray-900`}>Broadcast</Text>
        </View>

        <View style={tw`bg-[#014D9F05] p-4 rounded-3xl mb-8 flex-row items-start`}>
          <Info size={20} color="#014D9F" style={tw`mr-3 mt-0.5`} />
          <Text style={tw`flex-1 text-[#014D9F] text-sm font-medium`}>
            Broadcasting sends a system email to all selected users. Use this for important announcements only.
          </Text>
        </View>

        <Text style={tw`text-gray-700 font-bold mb-3 ml-1`}>Target Audience</Text>
        <View style={tw`flex-row gap-x-2 mb-8`}>
          {(['ALL', 'JOB_SEEKERS', 'ADMINS'] as const).map((t) => (
            <TouchableOpacity 
              key={t}
              onPress={() => setTarget(t)}
              style={tw`flex-1 py-3 rounded-2xl border-2 items-center ${target === t ? 'bg-[#014D9F10] border-[#014D9F]' : 'bg-white border-gray-100'}`}
            >
              <Text style={tw`font-bold text-xs ${target === t ? 'text-[#014D9F]' : 'text-gray-400'}`}>
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
          containerStyle={tw`mb-4`}
        />

        <Input
          label="Message Content"
          placeholder="Write your message here..."
          value={content}
          onChangeText={setContent}
          multiline
          numberOfLines={6}
          inputStyle={tw`h-40 textAlignVertical-top`}
          containerStyle={tw`mb-8`}
        />

        <Button
          title="Send Broadcast"
          onPress={() => broadcastMutation.mutate()}
          loading={broadcastMutation.isPending}
          disabled={!subject || !content}
          icon={<Send size={20} color="#FFF" />}
          style={tw`mb-20`}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
