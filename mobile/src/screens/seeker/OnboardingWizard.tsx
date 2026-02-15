import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { apiClient } from '../../services/api/client';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

const onboardingSchema = z.object({
  phone: z.string().min(10, 'Invalid phone number'),
  bio: z.string().min(20, 'Bio should be at least 20 characters'),
  skills: z.string().min(3, 'At least one skill is required'),
  location: z.string().min(2, 'Location is required'),
});

type OnboardingValues = z.infer<typeof onboardingSchema>;

export const OnboardingWizard = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors } } = useForm<OnboardingValues>({
    resolver: zodResolver(onboardingSchema),
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const onSubmit = async (data: OnboardingValues) => {
    setLoading(true);
    try {
      // Logic for uploading avatar to S3 would go here
      await apiClient.patch('/profile', data);
      showSuccess('Profile Updated', 'Your profile is now complete!');
      router.replace('/(tabs)');
    } catch (error: any) {
      showError('Error', 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <ScrollView className="flex-1 bg-background-light px-6 pt-12">
      <View className="mb-8">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-sm font-bold text-primary uppercase">Step {step} of 3</Text>
          <View className="flex-row">
            {[1, 2, 3].map((s) => (
              <View 
                key={s} 
                className={`w-8 h-1.5 rounded-full ml-1 ${s <= step ? 'bg-primary' : 'bg-gray-200'}`} 
              />
            ))}
          </View>
        </View>
        <Text className="text-2xl font-bold text-gray-900">
          {step === 1 && "Basic Information"}
          {step === 2 && "Profile Picture"}
          {step === 3 && "Professional Details"}
        </Text>
      </View>

      {step === 1 && (
        <View>
          <Controller
            control={control}
            name="phone"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Phone Number"
                placeholder="+1 234 567 8900"
                onChangeText={onChange}
                value={value}
                error={errors.phone?.message}
                keyboardType="phone-pad"
              />
            )}
          />
          <Controller
            control={control}
            name="location"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Location"
                placeholder="City, Country"
                onChangeText={onChange}
                value={value}
                error={errors.location?.message}
              />
            )}
          />
          <Button title="Next" onPress={nextStep} className="mt-4" />
        </View>
      )}

      {step === 2 && (
        <View className="items-center">
          <TouchableOpacity 
            onPress={pickImage}
            className="w-32 h-32 bg-gray-100 rounded-full items-center justify-center border-2 border-dashed border-gray-300 mb-6 overflow-hidden"
          >
            {avatar ? (
              <Image source={{ uri: avatar }} className="w-full h-full" />
            ) : (
              <Text className="text-gray-400 text-center px-4">Tap to upload photo</Text>
            )}
          </TouchableOpacity>
          <Text className="text-gray-500 text-center mb-8">
            A professional photo helps you build trust with employers.
          </Text>
          <View className="flex-row w-full gap-x-3">
            <Button title="Back" onPress={prevStep} variant="outline" className="flex-1" />
            <Button title="Next" onPress={nextStep} className="flex-1" />
          </View>
        </View>
      )}

      {step === 3 && (
        <View>
          <Controller
            control={control}
            name="skills"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Skills (comma separated)"
                placeholder="React, TypeScript, Node.js"
                onChangeText={onChange}
                value={value}
                error={errors.skills?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, value } }) => (
              <Input
                label="Professional Summary"
                placeholder="Tell us about yourself..."
                onChangeText={onChange}
                value={value}
                error={errors.bio?.message}
                multiline
                numberOfLines={4}
                className="h-32 textAlignVertical-top"
              />
            )}
          />
          <View className="flex-row w-full gap-x-3 mt-4 mb-20">
            <Button title="Back" onPress={prevStep} variant="outline" className="flex-1" />
            <Button 
              title="Finish Profile" 
              onPress={handleSubmit(onSubmit)} 
              loading={loading} 
              className="flex-1" 
            />
          </View>
        </View>
      )}
    </ScrollView>
  );
};
