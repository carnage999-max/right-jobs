import React, { useState } from 'react';
import { View, TextInput, Text, type TextInputProps, TouchableOpacity, StyleSheet } from 'react-native';
import { tw } from '../../lib/tailwind';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerStyle?: any;
  labelStyle?: any;
  inputStyle?: any;
  errorStyle?: any;
}

// @ts-ignore
export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = secureTextEntry;

  return (
    <View style={[tw`w-full mb-5`, containerStyle]}>
      {label && (
        <Text style={[tw`text-sm font-bold text-slate-700 mb-2 ml-1`, labelStyle]}>
          {label}
        </Text>
      )}
      
      <View style={tw`w-full h-14 justify-center relative`}>
        {icon && (
          <View style={tw`absolute left-4 z-20`}>
            {icon}
          </View>
        )}
        
        <TextInput
          style={[
            tw`w-full h-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 text-base text-slate-900 ${
              icon ? 'pl-12' : ''
            } ${isPassword ? 'pr-12' : ''} ${
              error ? 'border-red-400 bg-red-50/5' : ''
            }`,
            inputStyle
          ]}
          placeholderTextColor="#94A3B8"
          secureTextEntry={isPassword && !showPassword}
          autoCorrect={false}
          autoCapitalize="none"
          {...props}
        />

        {isPassword && (
          <TouchableOpacity 
            onPress={() => setShowPassword(!showPassword)}
            activeOpacity={0.7}
            style={tw`absolute right-0 w-14 h-full items-center justify-center z-20`}
          >
            {showPassword ? (
              <EyeOff size={20} color="#64748B" />
            ) : (
              <Eye size={20} color="#64748B" />
            )}
          </TouchableOpacity>
        )}
      </View>

      {error && (
        <Text style={[tw`text-xs font-semibold text-red-500 mt-2 ml-1`, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};
