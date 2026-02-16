import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { tw } from '../../lib/tailwind';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: any;
  textStyle?: any;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  textStyle,
  icon,
}) => {
  const variants = {
    primary: 'bg-primary shadow-sm',
    secondary: 'bg-secondary shadow-sm',
    outline: 'border border-gray-300 bg-transparent',
    ghost: 'bg-transparent',
    danger: 'bg-error shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 rounded-lg',
    md: 'px-4 py-2.5 rounded-xl',
    lg: 'px-6 py-3.5 rounded-2xl',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-gray-700',
    ghost: 'text-gray-700',
    danger: 'text-white',
  };

  const textSizes = {
    sm: 'text-sm font-medium',
    md: 'text-base font-semibold',
    lg: 'text-lg font-bold',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
      style={[
        tw`flex-row items-center justify-center ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-50' : ''}`,
        style
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} />
      ) : (
        <View style={tw`flex-row items-center`}>
          {icon && <View style={tw`mr-2`}>{icon}</View>}
          <Text style={[
            tw`${textColors[variant]} ${textSizes[size]}`,
            textStyle
          ]}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
