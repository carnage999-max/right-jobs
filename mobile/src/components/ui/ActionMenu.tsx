import React, { useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  Animated, 
  Dimensions, 
  StyleSheet, 
  TouchableWithoutFeedback 
} from 'react-native';
import { tw } from '../../lib/tailwind';
import { LucideIcon } from 'lucide-react-native';

interface ActionMenuItem {
  label: string;
  onPress: () => void;
  icon?: LucideIcon;
  variant?: 'default' | 'destructive' | 'warning';
}

interface ActionMenuProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  items: ActionMenuItem[];
}

export const ActionMenu: React.FC<ActionMenuProps> = ({ visible, onClose, title, items }) => {
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 350,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const translateY = slideAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  if (!visible && slideAnim._value === 0) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <Animated.View 
          style={[
            tw`flex-1 bg-black/40`,
            { opacity: fadeAnim }
          ]}
        >
          <View style={tw`flex-1 justify-end`}>
            <TouchableWithoutFeedback>
              <Animated.View 
                style={[
                  tw`bg-white rounded-t-[40px] px-8 pt-8 pb-12 shadow-2xl`,
                  { transform: [{ translateY }] }
                ]}
              >
                {/* Drag Indicator */}
                <View style={tw`w-12 h-1.5 bg-slate-200 rounded-full self-center mb-6`} />

                {title && (
                  <Text style={tw`text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 px-1`}>
                    {title}
                  </Text>
                )}

                <View style={tw`gap-y-2`}>
                  {items.map((item, index) => (
                    <TouchableOpacity
                      key={index}
                      onPress={() => {
                        onClose();
                        item.onPress();
                      }}
                      style={tw`flex-row items-center py-4 px-5 rounded-2xl ${
                        item.variant === 'destructive' ? 'bg-red-50' : 
                        item.variant === 'warning' ? 'bg-orange-50' : 'bg-slate-50'
                      }`}
                    >
                      {item.icon && (
                        <item.icon 
                          size={20} 
                          color={
                            item.variant === 'destructive' ? '#EF4444' : 
                            item.variant === 'warning' ? '#EA580C' : '#64748B'
                          } 
                          style={tw`mr-4`} 
                        />
                      )}
                      <Text style={tw`text-sm font-bold ${
                        item.variant === 'destructive' ? 'text-red-600' : 
                        item.variant === 'warning' ? 'text-orange-600' : 'text-slate-700'
                      }`}>
                        {item.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <TouchableOpacity 
                  onPress={onClose}
                  style={tw`mt-6 py-4 items-center`}
                >
                  <Text style={tw`text-slate-400 font-bold`}>Dismiss</Text>
                </TouchableOpacity>
              </Animated.View>
            </TouchableWithoutFeedback>
          </View>
        </Animated.View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};
