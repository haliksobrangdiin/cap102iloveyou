// screens/ScannerScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ImageBackground,
  StyleSheet,
  Platform,
  Alert,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

// RootCare Design System tokens
const colors = {
  surface: '#FFF8F6',
  surfaceContainer: '#FFE9E3',
  surfaceContainerLow: '#FFF1ED',
  onSurface: '#2C160E',
  onSurfaceVariant: '#40493D',
  primary: '#0D631B',
  onPrimary: '#FFFFFF',
  primaryContainer: '#2E7D32',
  onPrimaryContainer: '#CBFFC2',
  primaryFixedDim: '#88D982',
  secondary: '#7A5649',
  onSecondary: '#FFFFFF',
  outlineVariant: '#BFCABA',
  error: '#BA1A1A',
};

const typography = {
  headlineSm: { fontFamily: 'Montserrat', fontSize: 20, fontWeight: '600', lineHeight: 28 },
  headlineMd: { fontFamily: 'Montserrat', fontSize: 24, fontWeight: '600', lineHeight: 32 },
  bodyMd: { fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyLg: { fontFamily: 'Open Sans', fontSize: 18, fontWeight: '400', lineHeight: 28 },
  labelLg: { fontFamily: 'Open Sans', fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.1 },
};

const spacing = { xs: 4, sm: 12, md: 16, lg: 24, xl: 32, marginMobile: 20 };

const rounded = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };

const HEADER_HEIGHT = 56;
const MIN_TOUCH = 48;
const SCANNER_SIZE = width * 0.75;

// ===== IMPORT YOUR BACKGROUND IMAGE =====
import backgroundImage from '../assets/screen.png';
// Option 2: Remote URL
// const backgroundImage = { uri: 'https://your-image-url.com/screen.png' };

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Animation for scan line
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startScanAnimation();
  }, []);

  const startScanAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanAnim, {
          toValue: 1,
          duration: 3000,
          useNativeDriver: true,
        }),
        Animated.timing(scanAnim, {
          toValue: 0,
          duration: 3000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please grant gallery permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const removeImage = () => {
    setImage(null);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const analyzeImage = async () => {
    if (!image) {
      Alert.alert('No Image', 'Please take a photo or upload an image first.');
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Result', { imageUri: image });
    }, 2000);
  };

  // Scan line interpolation
  const scanLineTranslate = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-150, 150],
  });

  return (
    <ImageBackground
      source={backgroundImage}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      {/* ===== BLACK FADE OVERLAY ===== */}
      <View style={styles.overlay} />
      
      <SafeAreaView style={styles.container} edges={['top']}>
        {/* ===== HEADER ===== */}
        <View style={[styles.header, { backgroundColor: 'rgba(255, 248, 246, 0.92)' }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            activeOpacity={0.7}
          >
            <Ionicons name="chevron-back" size={28} color={colors.onSurface} />
          </TouchableOpacity>
          <Text style={[styles.headerText, { color: colors.onSurface }]}>
            Scan Leaf
          </Text>
          <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
            <Ionicons name="information-circle-outline" size={24} color={colors.onSurface} />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Description - with semi-transparent background for readability */}
          <View style={styles.descriptionWrapper}>
            <Text style={styles.description}>
              Take a clear photo or upload an image of the cassava leaf to detect potential diseases using AI.
            </Text>
          </View>

          {/* Image Container with Scanner Overlay */}
          <View style={styles.imageContainer}>
            {image ? (
              <>
                <Image source={{ uri: image }} style={styles.image} />
                <TouchableOpacity
                  style={styles.removeButton}
                  onPress={removeImage}
                  activeOpacity={0.85}
                  disabled={loading}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  <Ionicons name="close" size={20} color={colors.onPrimary} />
                </TouchableOpacity>
              </>
            ) : (
              <View style={styles.placeholder}>
                {/* Scanner Overlay */}
                <View style={styles.scannerOverlay}>
                  {/* Top-Left Corner */}
                  <View style={[styles.corner, styles.cornerTopLeft]} />
                  {/* Top-Right Corner */}
                  <View style={[styles.corner, styles.cornerTopRight]} />
                  {/* Bottom-Left Corner */}
                  <View style={[styles.corner, styles.cornerBottomLeft]} />
                  {/* Bottom-Right Corner */}
                  <View style={[styles.corner, styles.cornerBottomRight]} />
                  
                  {/* Animated Scanning Line */}
                  <Animated.View
                    style={[
                      styles.scanLine,
                      {
                        transform: [{ translateY: scanLineTranslate }],
                      },
                    ]}
                  />
                </View>

                {/* Leaf Icon in Center */}
                <View style={styles.placeholderIconWrapper}>
                  <View style={styles.placeholderIconBackground}>
                    <Ionicons name="leaf-outline" size={64} color={colors.primaryFixedDim} />
                  </View>
                </View>

                <Text style={styles.placeholderTitle}>Upload a Leaf Image</Text>
                <Text style={styles.placeholderSubtext}>
                  Tap the camera or gallery button below to get started
                </Text>
              </View>
            )}
          </View>

          {loading && (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Analyzing your leaf…</Text>
            </View>
          )}

          {/* Button Row */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.cameraButton]}
              onPress={takePhoto}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Ionicons name="camera-outline" size={22} color={colors.onPrimary} />
              <Text style={styles.buttonText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.galleryButton]}
              onPress={pickImage}
              activeOpacity={0.85}
              disabled={loading}
            >
              <Ionicons name="images-outline" size={22} color={colors.onSecondary} />
              <Text style={styles.buttonText}>Upload Image</Text>
            </TouchableOpacity>
          </View>

          {/* Primary Action */}
          <TouchableOpacity
            style={[styles.analyzeButton, loading && styles.disabledButton]}
            onPress={analyzeImage}
            activeOpacity={0.85}
            disabled={loading}
          >
            <Ionicons name="scan-outline" size={24} color={colors.onPrimary} />
            <Text style={styles.analyzeButtonText}>
              {loading ? 'Analyzing…' : 'Analyze Leaf'}
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  // ===== BACKGROUND IMAGE =====
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  // ===== BLACK FADE OVERLAY =====
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.25)', // Slight black fade - adjust opacity as needed
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  // ===== HEADER =====
  header: {
    width: '100%',
    minHeight: HEADER_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    backgroundColor: 'rgba(255, 248, 246, 0.92)',
  },
  backButton: {
    padding: 4,
    minWidth: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerAction: {
    padding: 4,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  content: {
    flex: 1,
    padding: spacing.marginMobile,
    alignItems: 'center',
    paddingBottom: 100,
  },
  // ===== DESCRIPTION with background =====
  descriptionWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.88)',
    borderRadius: rounded.DEFAULT,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    marginBottom: spacing.xl,
    width: '100%',
  },
  description: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    lineHeight: 24,
  },
  imageContainer: {
    width: '100%',
    height: 340,
    backgroundColor: 'rgba(255, 241, 237, 0.92)',
    borderRadius: rounded.md,
    borderWidth: 2,
    borderColor: colors.primaryFixedDim,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.lg,
    shadowColor: 'rgba(93, 64, 55, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    width: 44,
    height: 44,
    borderRadius: rounded.full,
    backgroundColor: 'rgba(44, 22, 14, 0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.lg,
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  // Scanner Overlay
  scannerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: colors.primaryFixedDim,
  },
  cornerTopLeft: {
    top: 20,
    left: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 4,
  },
  cornerTopRight: {
    top: 20,
    right: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 4,
  },
  cornerBottomLeft: {
    bottom: 20,
    left: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 4,
  },
  cornerBottomRight: {
    bottom: 20,
    right: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 4,
  },
  scanLine: {
    position: 'absolute',
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: 'rgba(136, 217, 130, 0.6)',
    shadowColor: colors.primaryFixedDim,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 4,
    borderRadius: 2,
  },
  placeholderIconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
    zIndex: 1,
  },
  placeholderIconBackground: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(136, 217, 130, 0.2)',
  },
  placeholderTitle: {
    ...typography.headlineSm,
    fontSize: 18,
    color: colors.onSurface,
    marginTop: spacing.sm,
    zIndex: 1,
  },
  placeholderSubtext: {
    ...typography.bodyMd,
    fontSize: 14,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginTop: spacing.xs,
    paddingHorizontal: spacing.lg,
    zIndex: 1,
  },
  loadingContainer: {
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  loadingText: {
    ...typography.labelLg,
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.md,
    borderRadius: rounded.full,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs + 4,
  },
  cameraButton: {
    backgroundColor: colors.primaryContainer,
  },
  galleryButton: {
    backgroundColor: colors.secondary,
  },
  analyzeButton: {
    backgroundColor: colors.primaryContainer,
    flexDirection: 'row',
    minHeight: MIN_TOUCH,
    paddingHorizontal: spacing.lg,
    borderRadius: rounded.full,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    shadowColor: 'rgba(93, 64, 55, 0.12)',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  disabledButton: {
    opacity: 0.6,
  },
  buttonText: {
    ...typography.labelLg,
    color: colors.onPrimary,
  },
  analyzeButtonText: {
    ...typography.labelLg,
    fontSize: 16,
    color: colors.onPrimary,
  },
});

export default ScannerScreen;