import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { useToast } from '../../hooks/useToast';
import { employerService } from '../../services/api/employer';
import { 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ListChecks, 
  Building2, 
  Camera, 
  X, 
  ChevronRight, 
  Sparkles,
  Zap,
  ArrowLeft,
  ArrowRight,
  Globe,
  Clock,
  Layers
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Dropdown } from 'react-native-element-dropdown';
import { tw } from '../../lib/tailwind';
import { countries, getCities } from '../../lib/locations';
import { apiClient } from '../../services/api/client';

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  companyName: z.string().min(2, 'Company name is required'),
  companyLogoUrl: z.string().optional(),
  officeImageUrl: z.string().optional(),
  phoneNumber: z.string().optional(),
  location: z.string().min(2, 'Location is required'),
  workMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']).default('ONSITE'),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  contractDuration: z.string().optional(),
  category: z.string().min(2, 'Category is required'),
  salaryRange: z.string().optional(),
  salaryType: z.enum(['YEARLY', 'MONTHLY', 'WEEKLY', 'HOURLY']).default('YEARLY'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

type JobValues = z.infer<typeof jobSchema>;

export const PostJobWizard = () => {
  const [step, setStep] = useState(1);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingOffice, setUploadingOffice] = useState(false);
  const router = useRouter();

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobValues>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      workMode: 'ONSITE',
      type: 'FULL_TIME',
      salaryType: 'YEARLY',
      category: 'Engineering',
      description: '',
    }
  });

  const selectedType = watch('type');
  const selectedMode = watch('workMode');
  const companyLogoUrl = watch('companyLogoUrl');
  const officeImageUrl = watch('officeImageUrl');

  const onSubmit = async (data: JobValues) => {
    setLoading(true);
    try {
      await employerService.postJob(data);
      showSuccess('Success', 'Your job posting is now live!');
      router.replace('/(tabs)');
    } catch (error: any) {
      showError('Error', error?.response?.data?.message || 'Failed to post job.');
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async (field: 'companyLogoUrl' | 'officeImageUrl') => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: field === 'companyLogoUrl' ? [1, 1] : [16, 9],
      quality: 0.8,
    });

    if (!result.canceled) {
      const isLogo = field === 'companyLogoUrl';
      if (isLogo) setUploadingLogo(true);
      else setUploadingOffice(true);

      try {
        const uri = result.assets[0].uri;
        const filename = uri.split('/').pop() || 'image.jpg';
        const contentType = 'image/jpeg';

        // 1. Get presigned URL
        const presignResp = await apiClient.post('/upload/presign', {
          filename,
          contentType,
          folder: 'avatars' // Using avatars folder as a generic storage for now
        });
        
        const { url, publicUrl } = presignResp.data;

        // 2. Upload to S3
        // We need to fetch the local file as a blob
        const response = await fetch(uri);
        const blob = await response.blob();

        await fetch(url, {
          method: 'PUT',
          body: blob,
          headers: {
             'Content-Type': contentType
          }
        });

        setValue(field, publicUrl);
        showSuccess('Success', 'Image uploaded successfully');
      } catch (e) {
        showError('Error', 'Failed to upload image');
      } finally {
        if (isLogo) setUploadingLogo(false);
        else setUploadingOffice(false);
      }
    }
  };

  const nextStep = () => {
    // Basic validation per step can be added here
    if (step === 1) {
       const vals = watch();
       if (!vals.title || !vals.companyName) {
         showError('Required', 'Please fill basics');
         return;
       }
    }
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const renderHeader = () => (
    <View style={tw`mb-10 px-6 pt-16`}>
      <View style={tw`flex-row items-center gap-2 mb-4 px-3 py-1 bg-primary/10 rounded-full w-40`}>
        <Sparkles size={12} color="#014D9F" />
        <Text style={tw`text-[10px] font-black uppercase text-primary tracking-widest`}>Step {step} of 4</Text>
      </View>
      <Text style={tw`text-4xl font-black text-slate-900 tracking-tighter leading-tight`}>
        {step === 1 && "Post the"}
        {step === 2 && "Location &"}
        {step === 3 && "Details &"}
        {step === 4 && "Job"}
        {'\n'}
        <Text style={tw`text-primary italic`}>
          {step === 1 && "Basics"}
          {step === 2 && "Work Mode"}
          {step === 3 && "Benefits"}
          {step === 4 && "Description"}
        </Text>
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={tw`flex-1 bg-slate-50`}
    >
      <ScrollView 
        style={tw`flex-1`}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {renderHeader()}

        <View style={tw`px-6`}>
            {step === 1 && (
            <View style={tw`space-y-6`}>
                <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                    <Input
                    label="What is the role?"
                    placeholder="e.g. Senior Product Designer"
                    onChangeText={onChange}
                    value={value}
                    error={errors.title?.message}
                    icon={<Briefcase size={20} color="#94A3B8" />}
                    />
                )}
                />

                <Controller
                control={control}
                name="companyName"
                render={({ field: { onChange, value } }) => (
                    <Input
                    label="Company Name"
                    placeholder="e.g. Acme Studio"
                    onChangeText={onChange}
                    value={value}
                    error={errors.companyName?.message}
                    icon={<Building2 size={20} color="#94A3B8" />}
                    />
                )}
                />

                {/* Image Uploads */}
                <View style={tw`flex-row gap-4 mt-2`}>
                   <View style={tw`flex-1`}>
                      <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Company Logo</Text>
                      <TouchableOpacity 
                        onPress={() => pickImage('companyLogoUrl')}
                        style={tw`h-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden`}
                      >
                         {uploadingLogo ? (
                           <ActivityIndicator color="#014D9F" />
                         ) : companyLogoUrl ? (
                           <Image source={{ uri: companyLogoUrl }} style={tw`w-full h-full`} resizeMode="cover" />
                         ) : (
                           <Camera size={24} color="#CBD5E1" />
                         )}
                      </TouchableOpacity>
                   </View>
                   <View style={tw`flex-[1.5]`}>
                      <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Workspace Photo</Text>
                      <TouchableOpacity 
                        onPress={() => pickImage('officeImageUrl')}
                        style={tw`h-32 bg-white rounded-3xl border-2 border-dashed border-slate-200 items-center justify-center overflow-hidden`}
                      >
                         {uploadingOffice ? (
                           <ActivityIndicator color="#014D9F" />
                         ) : officeImageUrl ? (
                           <Image source={{ uri: officeImageUrl }} style={tw`w-full h-full`} resizeMode="cover" />
                         ) : (
                           <View style={tw`items-center`}>
                              <Camera size={24} color="#CBD5E1" />
                              <Text style={tw`text-[8px] font-black text-slate-300 uppercase mt-2`}>Optional</Text>
                           </View>
                         )}
                      </TouchableOpacity>
                   </View>
                </View>

                <Button 
                    title="Continue" 
                    onPress={nextStep} 
                    style={tw`mt-8 h-16 rounded-3xl shadow-xl shadow-primary/20`}
                    icon={<ChevronRight size={20} color="#FFF" />}
                />
            </View>
            )}

            {step === 2 && (
            <View style={tw`space-y-6`}>
                <View>
                    <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Work Mode</Text>
                    <View style={tw`flex-row gap-2`}>
                        {['ONSITE', 'HYBRID', 'REMOTE'].map((mode) => (
                            <TouchableOpacity 
                                key={mode}
                                onPress={() => setValue('workMode', mode as any)}
                                style={tw`flex-1 p-4 rounded-2xl border-2 ${selectedMode === mode ? 'bg-primary border-primary' : 'bg-white border-slate-100'}`}
                            >
                                <Text style={tw`text-[10px] font-black uppercase text-center ${selectedMode === mode ? 'text-white' : 'text-slate-400'}`}>{mode}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                <View>
                   <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Location</Text>
                   <Dropdown
                     style={tw`bg-white h-16 rounded-2xl px-5 border border-slate-100 mb-4`}
                     placeholderStyle={tw`text-slate-400 text-base font-medium`}
                     selectedTextStyle={tw`text-slate-900 text-base font-bold`}
                     data={countries.map(c => ({ label: c.name, value: c.name }))}
                     maxHeight={300}
                     labelField="label"
                     valueField="value"
                     placeholder="Select Country"
                     value={country}
                     onChange={item => {
                       setCountry(item.value);
                       setCity('');
                       setValue('location', item.value);
                     }}
                     renderLeftIcon={() => <Globe size={18} color="#94A3B8" style={tw`mr-3`} />}
                   />
                   
                   <Dropdown
                     style={tw`bg-white h-16 rounded-2xl px-5 border border-slate-100`}
                     placeholderStyle={tw`text-slate-400 text-base font-medium`}
                     selectedTextStyle={tw`text-slate-900 text-base font-bold`}
                     data={getCities(country).map(c => ({ label: c, value: c }))}
                     maxHeight={300}
                     labelField="label"
                     valueField="value"
                     placeholder="Select City"
                     value={city}
                     disabled={!country}
                     onChange={item => {
                       setCity(item.value);
                       setValue('location', `${item.value}, ${country}`);
                     }}
                     renderLeftIcon={() => <MapPin size={18} color="#94A3B8" style={tw`mr-3`} />}
                   />
                </View>

                <Controller
                  control={control}
                  name="phoneNumber"
                  render={({ field: { onChange, value } }) => (
                      <Input
                        label="Phone Number (Optional)"
                        placeholder="+1 (555) 000-0000"
                        onChangeText={onChange}
                        value={value}
                        icon={<Zap size={20} color="#94A3B8" />}
                      />
                  )}
                />

                <View style={tw`flex-row w-full gap-x-3 mt-4`}>
                    <Button title="Back" onPress={prevStep} variant="ghost" style={tw`flex-1 h-16 rounded-3xl`} />
                    <Button title="Next" onPress={nextStep} style={tw`flex-[1.5] h-16 rounded-3xl shadow-xl shadow-primary/20`} />
                </View>
            </View>
            )}

            {step === 3 && (
            <View style={tw`space-y-6`}>
                <View>
                    <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Job category</Text>
                    <Dropdown
                     style={tw`bg-white h-16 rounded-2xl px-5 border border-slate-100`}
                     placeholderStyle={tw`text-slate-400 text-base font-medium`}
                     selectedTextStyle={tw`text-slate-900 text-base font-bold`}
                     data={[
                        { label: 'Engineering', value: 'Engineering' },
                        { label: 'Design', value: 'Design' },
                        { label: 'Marketing', value: 'Marketing' },
                        { label: 'Management', value: 'Management' },
                        { label: 'Sales', value: 'Sales' },
                        { label: 'Operations', value: 'Operations' }
                     ]}
                     maxHeight={300}
                     labelField="label"
                     valueField="value"
                     placeholder="Select Category"
                     onChange={item => setValue('category', item.value)}
                     renderLeftIcon={() => <Layers size={18} color="#94A3B8" style={tw`mr-3`} />}
                   />
                </View>

                <View style={tw`flex-row gap-3`}>
                    <View style={tw`flex-1`}>
                        <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-2 ml-1`}>Salary Type</Text>
                        <Dropdown
                            style={tw`bg-white h-14 rounded-2xl px-4 border border-slate-100`}
                            data={[
                                { label: 'Yearly', value: 'YEARLY' },
                                { label: 'Monthly', value: 'MONTHLY' },
                                { label: 'Hourly', value: 'HOURLY' }
                            ]}
                            labelField="label"
                            valueField="value"
                            value={watch('salaryType')}
                            onChange={item => setValue('salaryType', item.value as any)}
                        />
                    </View>
                    <View style={tw`flex-[1.5]`}>
                       <Controller
                        control={control}
                        name="salaryRange"
                        render={({ field: { onChange, value } }) => (
                            <Input
                            label="Salary Amount"
                            placeholder="e.g. 120k - 150k"
                            onChangeText={onChange}
                            value={value}
                            icon={<DollarSign size={18} color="#94A3B8" />}
                            />
                        )}
                        />
                    </View>
                </View>

                <View>
                    <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Employment Type</Text>
                    <View style={tw`flex-row flex-wrap gap-2`}>
                        {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'].map((t) => (
                            <TouchableOpacity 
                                key={t}
                                onPress={() => setValue('type', t as any)}
                                style={tw`px-4 py-3 rounded-xl border ${selectedType === t ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100'}`}
                            >
                                <Text style={tw`text-[9px] font-black uppercase ${selectedType === t ? 'text-white' : 'text-slate-400'}`}>
                                   {t.replace('_', ' ')}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {selectedType === 'CONTRACT' && (
                    <Controller
                    control={control}
                    name="contractDuration"
                    render={({ field: { onChange, value } }) => (
                        <Input
                        label="Contract Duration"
                        placeholder="e.g. 6 Months"
                        onChangeText={onChange}
                        value={value}
                        icon={<Clock size={20} color="#94A3B8" />}
                        />
                    )}
                    />
                )}

                <View style={tw`flex-row w-full gap-x-3 mt-4`}>
                    <Button title="Back" onPress={prevStep} variant="ghost" style={tw`flex-1 h-16 rounded-3xl`} />
                    <Button title="Next" onPress={nextStep} style={tw`flex-[1.5] h-16 rounded-3xl shadow-xl shadow-primary/20`} />
                </View>
            </View>
            )}

            {step === 4 && (
            <View style={tw`space-y-6`}>
                <View>
                    <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Job Description</Text>
                    <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange, value } }) => (
                        <View style={tw`bg-white rounded-3xl border border-slate-100 p-6 min-h-[300px]`}>
                            <TextInput
                                placeholder="Describe the role, requirements, and culture..."
                                placeholderTextColor="#94A3B8"
                                multiline
                                onChangeText={onChange}
                                value={value}
                                textAlignVertical="top"
                                style={tw`flex-1 text-base text-slate-900 font-medium`}
                            />
                        </View>
                    )}
                    />
                    {errors.description && (
                        <Text style={tw`text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase`}>{errors.description.message}</Text>
                    )}
                </View>

                <View style={tw`bg-slate-900 p-6 rounded-3xl mb-4 overflow-hidden relative`}>
                    <View style={[tw`absolute top--10 right--10 w-40 h-40 bg-primary/20 rounded-full`, { filter: 'blur(40px)' } as any]} />
                    <View style={tw`flex-row items-center gap-3 mb-2`}>
                       <Zap size={18} color="#10B981" />
                       <Text style={tw`text-white font-black text-lg`}>Ready for Launch</Text>
                    </View>
                    <Text style={tw`text-slate-400 font-medium text-xs leading-relaxed`}>
                        By publishing, your job will be visible to thousands of potential candidates across our network.
                    </Text>
                </View>

                <View style={tw`flex-row w-full gap-x-3 mt-4`}>
                    <Button title="Back" onPress={prevStep} variant="ghost" style={tw`flex-1 h-16 rounded-3xl`} />
                    <Button 
                        title="Post Job Now" 
                        onPress={handleSubmit(onSubmit)} 
                        loading={loading} 
                        style={tw`flex-[2] h-16 rounded-3xl bg-primary shadow-2xl shadow-primary/40`} 
                        textStyle={tw`font-black`}
                        icon={<Sparkles size={18} color="#FFF" />}
                    />
                </View>
            </View>
            )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
