import React from 'react';
import { View, TextInput, Text, type TextInputProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputClassName?: string;
  errorClassName?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  containerClassName,
  labelClassName,
  inputClassName,
  errorClassName,
  ...props
}) => {
  return (
    <View className={cn('w-full mb-4', containerClassName)}>
      {label && (
        <Text className={cn('text-sm font-medium text-gray-700 mb-1.5', labelClassName)}>
          {label}
        </Text>
      )}
      <View className="relative flex-row items-center">
        {icon && (
          <View className="absolute left-4 z-10">
            {icon}
          </View>
        )}
        <TextInput
          className={cn(
            'w-full bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-900',
            icon && 'pl-11',
            error ? 'border-error' : 'focus:border-primary',
            inputClassName
          )}
          placeholderTextColor="#94A3B8"
          {...props}
        />
      </View>
      {error && (
        <Text className={cn('text-xs text-error mt-1', errorClassName)}>
          {error}
        </Text>
      )}
    </View>
  );
};
