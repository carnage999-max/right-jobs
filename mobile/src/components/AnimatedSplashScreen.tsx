import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming, 
  withSequence, 
  withDelay,
  Easing,
  runOnJS
} from 'react-native-reanimated';
import { tw } from '../lib/tailwind';

const { width, height } = Dimensions.get('window');

interface AnimatedSplashScreenProps {
  onAnimationFinish: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({ onAnimationFinish }): any => {
  const splashScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const containerOpacity = useSharedValue(1);
  const [typedText, setTypedText] = useState('');
  const fullText = 'RightJobs';

  useEffect(() => {
    // 1. Splash circle expands
    splashScale.value = withTiming(2.5, {
      duration: 1000,
      easing: Easing.bezier(0.25, 0.1, 0.25, 1),
    });

    // 2. Logo fades in
    logoOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));

    // 3. Text typing animation
    const typeText = async () => {
      await new Promise(resolve => setTimeout(resolve, 1500));
      for (let i = 0; i <= fullText.length; i++) {
        setTypedText(fullText.slice(0, i));
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      // 4. Stay for a bit then fade out everything
      await new Promise(resolve => setTimeout(resolve, 800));
      containerOpacity.value = withTiming(0, { duration: 500 }, (finished) => {
        if (finished) {
          runOnJS(onAnimationFinish)();
        }
      });
    };

    typeText();
  }, []);

  const splashStyle = useAnimatedStyle(() => ({
    transform: [{ scale: splashScale.value }],
  }));

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ translateY: withTiming(logoOpacity.value === 1 ? 0 : 20, { duration: 800 }) }],
  }));

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      {/* Background Splash Circle */}
      <Animated.View style={[styles.splashCircle, splashStyle]} />
      
      <View style={tw`items-center justify-center`}>
        <Animated.View style={[tw`items-center`, logoStyle]}>
          <Image 
            source={require('../../assets/images/logo-nobg.png')} 
            style={tw`w-48 h-32 mb-4`} 
            resizeMode="contain"
          />
          <View style={tw`h-10`}>
            <Text style={tw`text-3xl font-black tracking-tighter`}>
              <Text style={tw`text-primary`}>
                {typedText.slice(0, 5)}
              </Text>
              <Text style={tw`text-gray-900`}>
                {typedText.slice(5)}
              </Text>
              {typedText.length > 0 && <Text style={tw`text-secondary`}>.</Text>}
            </Text>
          </View>
        </Animated.View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 9999,
  },
  splashCircle: {
    position: 'absolute',
    width: width * 0.8,
    height: width * 0.8,
    borderRadius: (width * 0.8) / 2,
    backgroundColor: '#F97316', // Orange accent color
    opacity: 0.1,
  },
});
