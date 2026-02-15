import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, View } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  textClassName?: string;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  textClassName,
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
      className={cn(
        'flex-row items-center justify-center',
        variants[variant],
        sizes[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' || variant === 'ghost' ? '#000' : '#fff'} />
      ) : (
        <View className="flex-row items-center">
          {icon && <View className="mr-2">{icon}</View>}
          <Text className={cn(textColors[variant], textSizes[size], textClassName)}>
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
