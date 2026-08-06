// screens/ScannerScreen.js - UI Only (No TFLite)
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startScanLineAnimation();
    startPulseAnimation();
  }, []);

  const startScanLineAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0.95,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  // ===== MOCK ANALYSIS (UI Demo Only) =====
  const analyzeImage = async () => {
    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'No Image',
        text2: 'Please take a photo or upload an image first.',
      });
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    // Simulate AI analysis with mock data
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      // Mock prediction - randomly pick a disease for demo
      const mockResults = [
        { key: 'CMD', label: 'Cassava Mosaic Disease', confidence: 92 },
        { key: 'HEALTHY', label: 'Healthy Leaf', confidence: 97 },
        { key: 'CBB', label: 'Cassava Bacterial Blight', confidence: 88 },
        { key: 'CBSD', label: 'Cassava Brown Streak Disease', confidence: 85 },
        { key: 'CGM', label: 'Cassava Green Mottle', confidence: 90 },
      ];
      
      const randomResult = mockResults[Math.floor(Math.random() * mockResults.length)];

      Toast.show({
        type: 'success',
        text1: 'Analysis Complete ✅',
        text2: `${randomResult.label} (${randomResult.confidence}%)`,
        visibilityTime: 2500,
      });

      navigation.navigate('Result', {
        imageUri: image,
        diseaseKey: randomResult.key,
        diseaseLabel: randomResult.label,
        confidence: randomResult.confidence,
        scanDate: new Date().toISOString(),
      });
    }, 2000);
  };

  // ===== IMAGE PICKER FUNCTIONS =====
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Please grant gallery permissions to upload images.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Image Uploaded',
        text2: 'Your image is ready for analysis!',
        visibilityTime: 1500,
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Please grant camera permissions to take photos.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Photo Captured',
        text2: 'Your photo is ready for analysis!',
        visibilityTime: 1500,
      });
    }
  };

  // ===== RENDER =====
  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 90],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top Navigation */}
      <View style={styles.topNav}>
        <TouchableOpacity
          style={styles.navButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.navTitle}>Scan Disease</Text>
        <View style={styles.navRight}>
          <View style={styles.profileAvatar}>
            <Image
              source={require('../assets/logo.png')}
              style={styles.profileImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>

      {/* Camera View */}
      <View style={styles.cameraContainer}>
        <View style={styles.cameraBackground}>
          {image ? (
            <Image source={{ uri: image }} style={styles.backgroundImage} resizeMode="cover" />
          ) : (
            <View style={styles.backgroundPlaceholder}>
              <Ionicons name="leaf-outline" size={80} color="#88D982" opacity={0.5} />
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
          <View style={styles.cameraOverlay} />
        </View>

        {/* Scanning Frame */}
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />

            <Animated.View
              style={[
                styles.scanLine,
                { top: scanLineTranslate + '%' },
              ]}
            />

            <Animated.View
              style={[
                styles.pulseRing,
                { transform: [{ scale: pulseAnim }] },
              ]}
            />
          </View>
        </View>

        {/* Scanning Status */}
        {loading && (
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <View style={styles.pingDot} />
              <Text style={styles.statusLabel}>Analyzing...</Text>
            </View>
            <Text style={styles.statusDescription}>
              Processing your image with AI.
            </Text>
          </View>
        )}

        {/* Control Buttons */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity
            style={[styles.controlButton, styles.flashButton]}
            activeOpacity={0.7}
          >
            <Ionicons name="flash-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.shutterButton}
            onPress={takePhoto}
            activeOpacity={0.8}
            disabled={loading}
          >
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.controlButton, styles.galleryControlButton]}
            onPress={pickImage}
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Analyze Button */}
        {image && !loading && (
          <TouchableOpacity
            style={styles.analyzeButton}
            onPress={analyzeImage}
            activeOpacity={0.85}
          >
            <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>Analyze Leaf</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'rgba(0,0,0,0.3)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  navRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  profileAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    backgroundColor: '#A3F69C',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  cameraContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  cameraBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
  },
  backgroundPlaceholder: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    marginTop: 8,
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanFrame: {
    width: 280,
    height: 280,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: 'rgba(136, 217, 130, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  cornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 32,
    height: 32,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#88D982',
    borderTopLeftRadius: 12,
  },
  cornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 32,
    height: 32,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#88D982',
    borderTopRightRadius: 12,
  },
  cornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 32,
    height: 32,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#88D982',
    borderBottomLeftRadius: 12,
  },
  cornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#88D982',
    borderBottomRightRadius: 12,
  },
  scanLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#88D982',
    shadowColor: '#88D982',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 8,
  },
  pulseRing: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(136, 217, 130, 0.1)',
    borderRadius: 24,
  },
  statusContainer: {
    position: 'absolute',
    bottom: 160,
    left: 20,
    right: 20,
    alignItems: 'center',
    gap: 8,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#88D982',
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  statusDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 24,
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  flashButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  shutterButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
  },
  galleryControlButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  analyzeButton: {
    position: 'absolute',
    bottom: 130,
    left: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ScannerScreen;