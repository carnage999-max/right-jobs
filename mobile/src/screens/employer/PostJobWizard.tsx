import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  TextInput,
  Modal,
  FlatList
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
  Building2, 
  Camera, 
  X, 
  ChevronRight, 
  Sparkles,
  Zap,
  Layers,
  Search,
  CheckCircle2
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { tw } from '../../lib/tailwind';
import { countries, getCities } from '../../lib/locations';
import { apiClient } from '../../services/api/client';

const CATEGORIES = [
  'Engineering', 'Design', 'Marketing', 'Sales', 'Operations', 'Finance & Accounting',
  'Human Resources', 'Legal & Compliance', 'Healthcare & Medical', 'Education & Training',
  'Hospitality & Tourism', 'Construction & Trades', 'Logistics & Transport', 'Arts & Entertainment',
  'Real Estate', 'Data & Life Science'
];

const JOB_TYPES = ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP'];
const WORK_MODES = ['ONSITE', 'HYBRID', 'REMOTE'];
const SALARY_TYPES = ['YEARLY', 'MONTHLY', 'HOURLY'];

const jobSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  companyName: z.string().min(2, 'Company name is required'),
  companyLogoUrl: z.string().optional().default(''),
  officeImageUrl: z.string().optional().default(''),
  phoneNumber: z.string().optional().default(''),
  location: z.string().min(2, 'Location is required'),
  workMode: z.enum(['ONSITE', 'HYBRID', 'REMOTE']),
  type: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERNSHIP']),
  contractDuration: z.string().optional().default(''),
  category: z.string().min(2, 'Category is required'),
  salaryRange: z.string().optional().default(''),
  salaryType: z.enum(['YEARLY', 'MONTHLY', 'HOURLY']),
  description: z.string().min(50, 'Description must be at least 50 characters'),
});

type JobValues = z.infer<typeof jobSchema>;

// Custom Searchable Dropdown
const SearchableDropdown = ({ 
  data, 
  value, 
  onChange, 
  placeholder, 
  label,
  icon: Icon
}: { 
  data: string[]; 
  value: string; 
  onChange: (val: string) => void;
  placeholder: string;
  label?: string;
  icon?: any;
}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [search, setSearch] = useState('');
  
  const filtered = useMemo(() => 
    data.filter(item => item.toLowerCase().includes(search.toLowerCase())),
    [search, data]
  );

  return (
    <View>
      {label && <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>{label}</Text>}
      <TouchableOpacity 
        onPress={() => setModalVisible(true)}
        style={tw`bg-white h-16 rounded-2xl px-5 border border-slate-100 flex-row items-center`}
      >
        {Icon && <Icon size={18} color="#94A3B8" style={tw`mr-3`} />}
        <Text style={tw`flex-1 text-base font-medium ${value ? 'text-slate-900' : 'text-slate-400'}`}>
          {value || placeholder}
        </Text>
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={tw`flex-1 bg-black/50`}>
          <View style={tw`flex-1 bg-white rounded-t-[40px] mt-auto`}>
            <View style={tw`px-6 py-6 flex-row justify-between items-center border-b border-slate-100`}>
              <Text style={tw`text-xl font-black text-slate-900`}>{label || placeholder}</Text>
              <TouchableOpacity onPress={() => { setModalVisible(false); setSearch(''); }}>
                <X size={24} color="#64748B" />
              </TouchableOpacity>
            </View>

            <View style={tw`px-6 py-4 flex-row items-center bg-slate-50 mx-6 rounded-2xl border border-slate-100`}>
              <Search size={18} color="#94A3B8" />
              <TextInput 
                placeholder="Search..."
                placeholderTextColor="#94A3B8"
                value={search}
                onChangeText={setSearch}
                style={tw`flex-1 ml-3 text-base text-slate-900 font-medium`}
              />
            </View>

            <FlatList
              data={filtered}
              keyExtractor={item => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    onChange(item);
                    setSearch('');
                    setModalVisible(false);
                  }}
                  style={tw`px-6 py-4 border-b border-slate-50 flex-row justify-between items-center ${value === item ? 'bg-primary/5' : ''}`}
                >
                  <Text style={tw`text-base font-medium ${value === item ? 'text-primary font-black' : 'text-slate-900'}`}>
                    {item}
                  </Text>
                  {value === item && <CheckCircle2 size={18} color="#014D9F" />}
                </TouchableOpacity>
              )}
              contentContainerStyle={tw`pb-32`}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export const PostJobWizard = () => {
  const [step, setStep] = useState(1);
  const { showSuccess, showError } = useToast();
  const [loading, setLoading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingOffice, setUploadingOffice] = useState(false);
  const router = useRouter();

  const [country, setCountry] = useState('');
  const [cities, setCities] = useState<string[]>([]);

  const { control, handleSubmit, setValue, watch, formState: { errors } } = useForm<JobValues>({
    resolver: zodResolver(jobSchema) as any,
    defaultValues: {
      workMode: 'ONSITE',
      type: 'FULL_TIME',
      salaryType: 'YEARLY',
      category: 'Engineering',
      description: '',
      companyLogoUrl: '',
      officeImageUrl: '',
      phoneNumber: '',
      contractDuration: '',
      salaryRange: '',
      location: '',
      title: '',
      companyName: '',
    }
  });

  const selectedType = watch('type');
  const selectedMode = watch('workMode');
  const selectedCategory = watch('category');
  const selectedSalaryType = watch('salaryType');
  const location = watch('location');
  const companyLogoUrl = watch('companyLogoUrl');
  const officeImageUrl = watch('officeImageUrl');
  const description = watch('description');

  const onSubmit = async (data: JobValues) => {
    setLoading(true);
    try {
      const response = await apiClient.post('/jobs', data);
      showSuccess('Success', 'Your job posting is now live!');
      router.replace('/(tabs)/jobs');
    } catch (error: any) {
      showError('Error', error?.response?.data?.message || 'Failed to post job');
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

        const presignResp = await apiClient.post('/upload/presign', {
          filename,
          contentType,
          folder: 'job-images'
        });
        
        const { url, publicUrl } = presignResp.data;

        const response = await fetch(uri);
        const blob = await response.blob();

        await fetch(url, {
          method: 'PUT',
          body: blob,
          headers: { 'Content-Type': contentType }
        });

        setValue(field, publicUrl);
        showSuccess('Success', 'Image uploaded');
      } catch (e) {
        showError('Error', 'Failed to upload image');
      } finally {
        if (isLogo) setUploadingLogo(false);
        else setUploadingOffice(false);
      }
    }
  };

  const handleCountryChange = (countryName: string) => {
    setCountry(countryName);
    setValue('location', countryName);
    setCities(getCities(countryName));
  };

  const handleCityChange = (cityName: string) => {
    setValue('location', `${cityName}, ${country}`);
  };

  const nextStep = () => {
    if (step === 1) {
      if (!watch('title') || !watch('companyName')) {
        showError('Required', 'Please fill job title and company name');
        return;
      }
    } else if (step === 2) {
      if (!location) {
        showError('Required', 'Please select location');
        return;
      }
    } else if (step === 3) {
      if (!selectedCategory) {
        showError('Required', 'Please select category');
        return;
      }
    }
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const renderHeader = () => (
    <View style={tw`mb-10 px-6 pt-16`}>
      <View style={tw`flex-row items-center gap-2 mb-4 px-3 py-1 bg-primary/10 rounded-full w-fit`}>
        <Sparkles size={12} color="#014D9F" />
        <Text style={tw`text-[10px] font-black uppercase text-primary tracking-widest`}>Step {step} of 4</Text>
      </View>
      <Text style={tw`text-3xl font-black text-slate-900 tracking-tighter leading-tight`}>
        {step === 1 && "Post the\nBasics"}
        {step === 2 && "Location &\nWork Mode"}
        {step === 3 && "Details &\nBenefits"}
        {step === 4 && "Job\nDescription"}
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
          {/* STEP 1: Basics */}
          {step === 1 && (
            <View style={tw`space-y-6`}>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Job Title"
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

              <View style={tw`flex-row gap-4`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Logo</Text>
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
                  <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Office Photo</Text>
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

          {/* STEP 2: Location & Work Mode */}
          {step === 2 && (
            <View style={tw`space-y-6`}>
              <View>
                <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Work Mode</Text>
                <View style={tw`flex-row gap-2`}>
                  {WORK_MODES.map((mode) => (
                    <TouchableOpacity 
                      key={mode}
                      onPress={() => setValue('workMode', mode as any)}
                      style={tw`flex-1 p-4 rounded-2xl border-2 ${selectedMode === mode ? 'bg-primary border-primary' : 'bg-white border-slate-100'}`}
                    >
                      <Text style={tw`text-[10px] font-black uppercase text-center ${selectedMode === mode ? 'text-white' : 'text-slate-400'}`}>
                        {mode}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <SearchableDropdown
                data={countries.map(c => c.name)}
                value={country}
                onChange={handleCountryChange}
                placeholder="Select Country"
                label="Country"
                icon={Sparkles}
              />

              {country && (
                <SearchableDropdown
                  data={cities}
                  value={watch('location').split(', ')[0] || ''}
                  onChange={handleCityChange}
                  placeholder="Select City"
                  label="City"
                  icon={MapPin}
                />
              )}

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

              <View style={tw`flex-row gap-3 mt-4`}>
                <Button title="Back" onPress={prevStep} variant="outline" style={tw`flex-1 h-16 rounded-3xl`} />
                <Button title="Next" onPress={nextStep} style={tw`flex-[1.5] h-16 rounded-3xl shadow-xl shadow-primary/20`} />
              </View>
            </View>
          )}

          {/* STEP 3: Details & Benefits */}
          {step === 3 && (
            <View style={tw`space-y-6`}>
              <SearchableDropdown
                data={CATEGORIES}
                value={selectedCategory}
                onChange={(cat) => setValue('category', cat)}
                placeholder="Select Category"
                label="Job Category"
                icon={Layers}
              />

              <View style={tw`flex-row gap-3`}>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Salary Type</Text>
                  <View style={tw`flex-row gap-2`}>
                    {SALARY_TYPES.map((type) => (
                      <TouchableOpacity 
                        key={type}
                        onPress={() => setValue('salaryType', type as any)}
                        style={tw`flex-1 p-3 rounded-xl border ${selectedSalaryType === type ? 'bg-slate-900 border-slate-900' : 'bg-white border-slate-100'}`}
                      >
                        <Text style={tw`text-[9px] font-black uppercase text-center ${selectedSalaryType === type ? 'text-white' : 'text-slate-400'}`}>
                          {type}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <Controller
                control={control}
                name="salaryRange"
                render={({ field: { onChange, value } }) => (
                  <Input
                    label="Salary Range (Optional)"
                    placeholder="e.g. 120k - 150k"
                    onChangeText={onChange}
                    value={value}
                    icon={<DollarSign size={18} color="#94A3B8" />}
                  />
                )}
              />

              <View>
                <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Employment Type</Text>
                <View style={tw`flex-row flex-wrap gap-2`}>
                  {JOB_TYPES.map((t) => (
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
                    />
                  )}
                />
              )}

              <View style={tw`flex-row gap-3 mt-4`}>
                <Button title="Back" onPress={prevStep} variant="outline" style={tw`flex-1 h-16 rounded-3xl`} />
                <Button title="Next" onPress={nextStep} style={tw`flex-[1.5] h-16 rounded-3xl shadow-xl shadow-primary/20`} />
              </View>
            </View>
          )}

          {/* STEP 4: Description */}
          {step === 4 && (
            <View style={tw`space-y-6`}>
              <View>
                <Text style={tw`text-xs font-black text-slate-400 uppercase tracking-widest mb-3 ml-1`}>Job Description</Text>
                <Controller
                  control={control}
                  name="description"
                  render={({ field: { onChange, value } }) => (
                    <View style={tw`bg-white rounded-3xl border border-slate-100 p-6 min-h-[320px]`}>
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
                  <Text style={tw`text-red-500 text-[10px] font-bold mt-2 ml-4 uppercase`}>
                    {errors.description.message}
                  </Text>
                )}
                <Text style={tw`text-slate-400 text-[10px] font-medium mt-2 ml-1`}>
                  {description.length}/50 characters minimum
                </Text>
              </View>

              <View style={tw`bg-slate-900 p-6 rounded-3xl overflow-hidden`}>
                <View style={tw`flex-row items-center gap-3 mb-2`}>
                  <Zap size={18} color="#10B981" />
                  <Text style={tw`text-white font-black text-lg`}>Ready to Launch</Text>
                </View>
                <Text style={tw`text-slate-400 font-medium text-xs leading-relaxed`}>
                  Your job will be visible to thousands of potential candidates.
                </Text>
              </View>

              <View style={tw`flex-row gap-3 mt-4`}>
                <Button title="Back" onPress={prevStep} variant="outline" style={tw`flex-1 h-16 rounded-3xl`} />
                <Button 
                  title="Post Job" 
                  onPress={handleSubmit(onSubmit as any)} 
                  loading={loading} 
                  style={tw`flex-[1.5] h-16 rounded-3xl shadow-2xl shadow-primary/40`}
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
