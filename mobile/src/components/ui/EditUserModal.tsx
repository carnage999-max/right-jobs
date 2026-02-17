import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import { tw } from '../../lib/tailwind';
import { Input } from './Input';
import { X, User, Shield, Info } from 'lucide-react-native';

interface EditUserModalProps {
  visible: boolean;
  onClose: () => void;
  user: any;
  onSave: (data: { name: string; role: string }) => Promise<void>;
  isLoading: boolean;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({ 
  visible, 
  onClose, 
  user, 
  onSave,
  isLoading 
}) => {
  const [name, setName] = useState(user?.name || '');
  const [role, setRole] = useState(user?.role || 'USER');

  const handleSave = async () => {
    await onSave({ name, role });
  };

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="fade"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={tw`flex-1 bg-black/50 justify-center p-6`}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          >
            <View style={tw`bg-white rounded-[40px] overflow-hidden shadow-2xl`}>
              <View style={tw`p-8`}>
                <View style={tw`flex-row justify-between items-center mb-8`}>
                  <Text style={tw`text-2xl font-black text-slate-900`}>Edit Profile</Text>
                  <TouchableOpacity onPress={onClose} style={tw`p-2 bg-slate-50 rounded-xl`}>
                    <X size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>

                <View style={tw`items-center mb-8`}>
                  <View style={tw`h-20 w-20 rounded-3xl bg-primary/10 items-center justify-center mb-3`}>
                    <User size={40} color="#014D9F" />
                  </View>
                  <Text style={tw`text-sm font-medium text-slate-400`}>{user?.email}</Text>
                </View>

                <View style={tw`gap-y-6`}>
                  <View>
                    <Text style={tw`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1`}>
                      Full Identity Name
                    </Text>
                    <Input
                      value={name}
                      onChangeText={setName}
                      placeholder="e.g. John Doe"
                    />
                  </View>

                  <View>
                    <Text style={tw`text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3 px-1`}>
                      System Access Role
                    </Text>
                    <View style={tw`flex-row gap-2`}>
                      {['USER', 'EMPLOYER', 'ADMIN'].map((r) => (
                        <TouchableOpacity
                          key={r}
                          onPress={() => setRole(r)}
                          style={tw`flex-1 py-3 rounded-xl border-2 items-center ${
                            role === r 
                              ? 'bg-primary/5 border-primary' 
                              : 'bg-slate-50 border-transparent'
                          }`}
                        >
                          <Text style={tw`text-[10px] font-black tracking-widest uppercase ${
                            role === r ? 'text-primary' : 'text-slate-400'
                          }`}>
                            {r}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </View>

                <View style={tw`mt-8 pt-6 border-t border-slate-50 flex-row items-start gap-3`}>
                  <Info size={14} color="#94A3B8" style={tw`mt-0.5`} />
                  <Text style={tw`text-[9px] font-bold text-slate-400 leading-4 flex-1`}>
                    Updating this profile will trigger a security notification email to the user regarding the administrative changes.
                  </Text>
                </View>

                <TouchableOpacity
                  disabled={isLoading}
                  onPress={handleSave}
                  style={tw`mt-8 bg-[#014D9F] h-14 rounded-2xl items-center justify-center shadow-lg shadow-primary/20`}
                >
                  {isLoading ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text style={tw`text-white font-black text-base`}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
