import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, User, Mail, MapPin, X, Plus, Loader2 } from 'lucide-react-native';
import { tw } from '../../src/lib/tailwind';
import { useAuth } from '../../src/context/AuthContext';
import { Button } from '../../src/components/ui/Button';
import { useQuery, useMutation } from '@tanstack/react-query';
import { profileService } from '../../src/services/api/profile';
import { QUERY_KEYS } from '../../src/constants/queryKeys';

export default function PersonalDossierScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');

  // Fetch profile data
  const { data: profileData, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.PROFILE],
    queryFn: () => profileService.getProfile(),
  });

  const profile = profileData?.data;

  // Initialize form with profile data
  useEffect(() => {
    if (profile) {
      setName(profile.user?.name || '');
      setBio(profile.bio || '');
      setLocation(profile.location || '');
      setSkills(profile.skills || []);
    }
  }, [profile]);

  // Update profile mutation
  const updateMutation = useMutation({
    mutationFn: (data: any) => profileService.updateProfile(data),
    onSuccess: () => {
      Alert.alert('Success', 'Profile updated successfully!');
      setIsEditing(false);
    },
    onError: () => {
      Alert.alert('Error', 'Failed to update profile');
    }
  });

  const handleSave = () => {
    updateMutation.mutate({
      name,
      bio,
      location,
      skills
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 bg-slate-50 items-center justify-center`}>
        <ActivityIndicator size="large" color="#014D9F" />
      </View>
    );
  }

  const isVerified = profile?.verificationStatus === 'VERIFIED';

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
          <Text style={tw`text-xl font-black text-slate-900 tracking-tight`}>Personal Dossier</Text>
        </View>
        <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
          <Text style={tw`text-sm font-bold text-primary`}>{isEditing ? 'Cancel' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 p-6`} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile Info Card */}
        <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm mb-6 border border-slate-100`}>
          <View style={tw`flex-row items-center mb-6`}>
            <View style={tw`h-16 w-16 bg-primary/10 rounded-2xl items-center justify-center mr-4`}>
              <User size={32} color="#014D9F" />
            </View>
            <View>
              <Text style={tw`text-lg font-black text-slate-900`}>Identity Profile</Text>
              <Text style={tw`text-slate-400 text-xs font-bold uppercase tracking-widest`}>Basic Information</Text>
            </View>
          </View>

          {isEditing ? (
            // Edit Mode
            <View style={tw`space-y-4`}>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Full Name</Text>
                <TextInput
                  style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 font-bold text-slate-900`}
                  value={name}
                  onChangeText={setName}
                  placeholder="Enter your name"
                  placeholderTextColor="#CBD5E1"
                />
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Location</Text>
                <View style={tw`flex-row items-center`}>
                  <MapPin size={16} color="#94A3B8" style={tw`absolute left-4 z-10`} />
                  <TextInput
                    style={tw`bg-slate-50 p-4 pl-10 rounded-xl border border-slate-200 font-bold text-slate-900 flex-1`}
                    value={location}
                    onChangeText={setLocation}
                    placeholder="City, Country"
                    placeholderTextColor="#CBD5E1"
                  />
                </View>
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>About Me</Text>
                <TextInput
                  style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 font-medium text-slate-900 h-24`}
                  value={bio}
                  onChangeText={setBio}
                  placeholder="Share your professional story..."
                  placeholderTextColor="#CBD5E1"
                  multiline
                  numberOfLines={4}
                />
              </View>
            </View>
          ) : (
            // View Mode
            <View style={tw`space-y-4`}>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Full Name</Text>
                <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200`}>
                  <Text style={tw`font-bold text-slate-900`}>{name || 'Not set'}</Text>
                </View>
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>Location</Text>
                <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 flex-row items-center`}>
                  <MapPin size={16} color="#94A3B8" style={tw`mr-2`} />
                  <Text style={tw`font-bold text-slate-900`}>{location || 'Not set'}</Text>
                </View>
              </View>
              <View>
                <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-2 ml-1`}>About Me</Text>
                <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200`}>
                  <Text style={tw`font-medium text-slate-900`}>{bio || 'Not set'}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={tw`border-t border-slate-100 mt-6 pt-6`}>
            <Text style={tw`text-xs font-bold text-slate-500 uppercase mb-3 ml-1`}>Email Address</Text>
            <View style={tw`bg-slate-50 p-4 rounded-xl border border-slate-200 flex-row items-center`}>
              <Mail size={16} color="#94A3B8" style={tw`mr-2`} />
              <Text style={tw`font-bold text-slate-900`}>{user?.email || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {/* Skills Card */}
        {isEditing && (
          <View style={tw`bg-white p-6 rounded-[2rem] shadow-sm mb-6 border border-slate-100`}>
            <Text style={tw`text-base font-black text-slate-900 mb-4`}>Skills</Text>
            <View style={tw`flex-wrap flex-row gap-2 mb-4`}>
              {skills.map((skill) => (
                <View key={skill} style={tw`bg-slate-100 px-3 py-2 rounded-lg flex-row items-center`}>
                  <Text style={tw`text-sm text-slate-700 font-medium`}>{skill}</Text>
                  <TouchableOpacity onPress={() => removeSkill(skill)} style={tw`ml-2`}>
                    <X size={14} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            <View style={tw`flex-row gap-2`}>
              <TextInput
                style={tw`flex-1 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium text-slate-900`}
                value={newSkill}
                onChangeText={setNewSkill}
                placeholder="Add a skill"
                placeholderTextColor="#CBD5E1"
              />
              <TouchableOpacity 
                onPress={addSkill}
                style={tw`bg-slate-100 p-3 rounded-lg items-center justify-center w-12 border border-dashed border-slate-300`}
              >
                <Plus size={18} color="#475569" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Verification Banner */}
        <View style={tw`${isVerified ? 'bg-green-50 border-green-100' : 'bg-blue-50 border-blue-100'} p-6 rounded-[2rem] border mb-6`}>
          <Text style={tw`${isVerified ? 'text-green-900' : 'text-blue-900'} font-black text-lg mb-2`}>
            {isVerified ? 'Identity Verified' : 'Verified Credentials'}
          </Text>
          <Text style={tw`${isVerified ? 'text-green-700/80' : 'text-blue-700/80'} font-medium text-sm leading-relaxed mb-4`}>
            {isVerified 
              ? 'Your identity has been verified. You have full access to all features.'
              : 'Your identity has been verified through our secure ID check system. Changing your personal dossier may require re-verification.'}
          </Text>
        </View>

        {/* Save Button */}
        {isEditing && (
          <Button
            title={updateMutation.isPending ? "Saving..." : "Save Changes"}
            style={tw`w-full bg-primary h-14 rounded-2xl shadow-lg`}
            textStyle={tw`font-black text-white text-lg`}
            onPress={handleSave}
            disabled={updateMutation.isPending}
          />
        )}
      </ScrollView>
    </View>
  );
}
