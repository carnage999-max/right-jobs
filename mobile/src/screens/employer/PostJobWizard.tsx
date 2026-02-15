import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { employerService } from '../../services/api/employer';
import { Briefcase, MapPin, DollarSign, ListChecks } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  company: z.string().min(2, 'Company name is required'),
  location: z.string().min(2, 'Location is required'),
  salary: z.string().optional(),
  type: z.string().min(2, 'Job type is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  requirements: z.string().min(10, 'Requirements are required'),
});

type JobValues = z.infer<typeof jobSchema>;

export const PostJobWizard = () => {
  const [step, setStep] = useState(1);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { control, handleSubmit, formState: { errors } } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      type: 'Full-time',
    }
  });

  const onSubmit = async (data: JobValues) => {
    setLoading(true);
    try {
      await employerService.postJob(data);
      showSuccess('Success', 'Your job posting is now live!');
      router.replace('/(tabs)');
    } catch (error: any) {
      showError('Error', 'Failed to post job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-light"
    >
      <ScrollView className="flex-1 px-6 pt-12">
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
            {step === 1 && "Basic Info"}
            {step === 2 && "Job Details"}
            {step === 3 && "Job Description"}
          </Text>
        </View>

        {step === 1 && (
          <View>
            <Controller
              control={control}
              name="title"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Job Title"
                  placeholder="Software Engineer"
                  onChangeText={onChange}
                  value={value}
                  error={errors.title?.message}
                  icon={<Briefcase size={20} color="#94A3B8" />}
                />
              )}
            />
            <Controller
              control={control}
              name="company"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Company Name"
                  placeholder="Acme Corp"
                  onChangeText={onChange}
                  value={value}
                  error={errors.company?.message}
                />
              )}
            />
            <Button title="Next" onPress={nextStep} className="mt-4" />
          </View>
        )}

        {step === 2 && (
          <View>
            <Controller
              control={control}
              name="location"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Location"
                  placeholder="Remote / New York, NY"
                  onChangeText={onChange}
                  value={value}
                  error={errors.location?.message}
                  icon={<MapPin size={20} color="#94A3B8" />}
                />
              )}
            />
            <Controller
              control={control}
              name="salary"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Salary (Optional)"
                  placeholder="$100k - $120k"
                  onChangeText={onChange}
                  value={value}
                  error={errors.salary?.message}
                  icon={<DollarSign size={20} color="#94A3B8" />}
                />
              )}
            />
             <Controller
              control={control}
              name="type"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Job Type"
                  placeholder="Full-time / Contract"
                  onChangeText={onChange}
                  value={value}
                  error={errors.type?.message}
                />
              )}
            />
            <View className="flex-row w-full gap-x-3 mt-4">
              <Button title="Back" onPress={prevStep} variant="outline" className="flex-1" />
              <Button title="Next" onPress={nextStep} className="flex-1" />
            </View>
          </View>
        )}

        {step === 3 && (
          <View>
            <Controller
              control={control}
              name="description"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Description"
                  placeholder="What will the person do?..."
                  onChangeText={onChange}
                  value={value}
                  error={errors.description?.message}
                  multiline
                  numberOfLines={6}
                  className="h-40 textAlignVertical-top"
                />
              )}
            />
            <Controller
              control={control}
              name="requirements"
              render={({ field: { onChange, value } }) => (
                <Input
                  label="Requirements"
                  placeholder="What skills are needed?..."
                  onChangeText={onChange}
                  value={value}
                  error={errors.requirements?.message}
                  multiline
                  numberOfLines={4}
                  className="h-32 textAlignVertical-top"
                  icon={<ListChecks size={20} color="#94A3B8" />}
                />
              )}
            />
            <View className="flex-row w-full gap-x-3 mt-4 mb-20">
              <Button title="Back" onPress={prevStep} variant="outline" className="flex-1" />
              <Button 
                title="Post Job" 
                onPress={handleSubmit(onSubmit)} 
                loading={loading} 
                className="flex-1" 
              />
            </View>
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
