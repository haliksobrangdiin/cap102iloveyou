// screens/ScannerScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

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
  bodyMd: { fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', lineHeight: 24 },
  labelLg: { fontFamily: 'Open Sans', fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.1 },
};

const spacing = { xs: 4, sm: 12, md: 16, lg: 24, xl: 32, marginMobile: 20 };

const rounded = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };

const HEADER_HEIGHT = 56; // multiple of 8, per vertical rhythm rule
const MIN_TOUCH = 48; // preferred touch target for outdoor "field" use

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

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

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      navigation.navigate('Result', { imageUri: image });
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header — Montserrat headline-sm on Forest Green */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan Disease</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>
          Take a photo or upload an image of the cassava leaf
        </Text>

        {/* Image Container — Level 1 card: 8px radius, brown-tinted 4px-blur shadow */}
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
              <Ionicons name="leaf-outline" size={60} color={colors.primaryFixedDim} />
              <Text style={styles.placeholderText}>No image selected</Text>
            </View>
          )}
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Analyzing your leaf…</Text>
          </View>
        )}

        {/* Button Row — pill-shaped secondary actions, 48px min height */}
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

        {/* Primary Action — pill-shaped, full width, Level 2 elevation (12px blur) */}
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  header: {
    width: '100%',
    minHeight: HEADER_HEIGHT,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
  },
  headerText: {
    ...typography.headlineSm,
    color: colors.onPrimary,
  },
  content: {
    flex: 1,
    padding: spacing.marginMobile, // 20px per mobile margin rule
    alignItems: 'center',
  },
  subtitle: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surfaceContainerLow,
    borderRadius: rounded.DEFAULT, // 8px — standard card radius
    borderWidth: 2,
    borderColor: colors.primaryFixedDim,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: spacing.lg,
    // Level 1 card shadow per design system: brown-tinted, 4px blur
    shadowColor: 'rgba(93, 64, 55, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
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
    width: 44, // full 44x44 touch target per design system minimum
    height: 44,
    borderRadius: rounded.full,
    backgroundColor: 'rgba(44, 22, 14, 0.55)', // on-surface at reduced opacity, reads over any photo
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    ...typography.bodyMd,
    color: colors.onSurfaceVariant,
    marginTop: spacing.sm,
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
    borderRadius: rounded.full, // pill-shaped per design system
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
    borderRadius: rounded.full, // pill-shaped primary action
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    // Level 2 elevation per design system: 12px blur, prominent focus
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