import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, Image, Dimensions, ScrollView, StatusBar } from 'react-native';
import { X } from 'lucide-react-native';
import { tw } from '../lib/tailwind';

interface ImageGalleryProps {
  images: string[];
  children: React.ReactNode;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, children }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const { width, height } = Dimensions.get('window');

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        {children}
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <StatusBar barStyle="light-content" translucent backgroundColor="rgba(0,0,0,0.95)" />
        <View style={tw`flex-1 bg-black/95`}>
          {/* Close Button */}
          <View style={tw`absolute top-8 right-6 z-50`}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={tw`h-12 w-12 rounded-full bg-white/20 items-center justify-center backdrop-blur`}
            >
              <X size={24} color="#FFF" />
            </TouchableOpacity>
          </View>

          {/* Image Counter */}
          <View style={tw`absolute top-8 left-6 z-50`}>
            <Text style={tw`text-white font-bold text-lg`}>
              {currentImageIndex + 1} / {images.length}
            </Text>
          </View>

          {/* Main Image */}
          <View style={[tw`flex-1 items-center justify-center`, { width, height }]}>
            <Image
              source={{ uri: images[currentImageIndex] }}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
            />
          </View>

          {/* Navigation Controls */}
          {images.length > 1 && (
            <View style={tw`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent px-6 py-8`}>
              <View style={tw`flex-row justify-between items-center`}>
                <TouchableOpacity
                  onPress={handlePrevious}
                  style={tw`h-14 w-14 rounded-full bg-white/20 items-center justify-center backdrop-blur border border-white/30`}
                >
                  <Text style={tw`text-white font-black text-2xl`}>‹</Text>
                </TouchableOpacity>

                {/* Dots Indicator */}
                <View style={tw`flex-row gap-2`}>
                  {images.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        tw`h-2 rounded-full`,
                        {
                          width: index === currentImageIndex ? 24 : 8,
                          backgroundColor: index === currentImageIndex ? '#FFF' : 'rgba(255,255,255,0.5)',
                        },
                      ]}
                    />
                  ))}
                </View>

                <TouchableOpacity
                  onPress={handleNext}
                  style={tw`h-14 w-14 rounded-full bg-white/20 items-center justify-center backdrop-blur border border-white/30`}
                >
                  <Text style={tw`text-white font-black text-2xl`}>›</Text>
                </TouchableOpacity>
              </View>

              {/* Image Caption */}
              <Text style={tw`text-white/70 text-sm text-center mt-6`}>
                {currentImageIndex + 1} of {images.length}
              </Text>
            </View>
          )}
        </View>
      </Modal>
    </>
  );
};

export default ImageGallery;
