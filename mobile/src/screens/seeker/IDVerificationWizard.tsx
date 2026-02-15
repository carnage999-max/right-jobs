import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Camera, Shield, CheckCircle } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';

export const IDVerificationWizard = ({ navigation }: any) => {
  const [step, setStep] = useState(1);
  const [frontImage, setFrontImage] = useState<string | null>(null);
  const [backImage, setBackImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const takePhoto = async (type: 'front' | 'back') => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      return showError('Permission required', 'We need camera access to take ID photos.');
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      if (type === 'front') setFrontImage(result.assets[0].uri);
      else setBackImage(result.assets[0].uri);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      // Logic for uploading to S3...
      await apiClient.post('/verify-id', {
        frontImageKey: '...', 
        backImageKey: '...'
      });
      showSuccess('Submitted', 'Your ID verification is under review.');
      navigation.goBack();
    } catch (error) {
      showError('Error', 'Failed to submit verification.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-12">
      <View className="items-center mb-8">
        <View className="bg-primary/10 p-4 rounded-full mb-4">
          <Shield size={40} color="#0EA5E9" />
        </View>
        <Text className="text-2xl font-bold text-gray-900">ID Verification</Text>
        <Text className="text-gray-500 text-center">We need to verify your identity to protect the community.</Text>
      </View>

      <View className="bg-white p-6 rounded-3xl shadow-sm mb-6 border border-gray-100">
        <Text className="font-bold text-gray-800 mb-4">Front of ID Document</Text>
        <TouchableOpacity 
          onPress={() => takePhoto('front')}
          className="aspect-[1.6] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden"
        >
          {frontImage ? (
            <Image source={{ uri: frontImage }} className="w-full h-full" />
          ) : (
            <>
              <Camera size={32} color="#94A3B8" className="mb-2" />
              <Text className="text-gray-400">Take Front Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <View className="bg-white p-6 rounded-3xl shadow-sm mb-8 border border-gray-100">
        <Text className="font-bold text-gray-800 mb-4">Back of ID Document</Text>
        <TouchableOpacity 
          onPress={() => takePhoto('back')}
          className="aspect-[1.6] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 items-center justify-center overflow-hidden"
        >
          {backImage ? (
            <Image source={{ uri: backImage }} className="w-full h-full" />
          ) : (
            <>
              <Camera size={32} color="#94A3B8" className="mb-2" />
              <Text className="text-gray-400">Take Back Photo</Text>
            </>
          )}
        </TouchableOpacity>
      </View>

      <Button
        title="Submit Verification"
        onPress={onSubmit}
        disabled={!frontImage || !backImage}
        loading={loading}
        className="mb-20"
      />
    </ScrollView>
  );
};
