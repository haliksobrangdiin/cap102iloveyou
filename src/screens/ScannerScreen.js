// screens/ScannerScreen.js
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Animated,
  Alert,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

// ===== API CONFIGURATION =====
const COMPUTER_IP = '192.168.1.19';  
const API_URL = `http://${COMPUTER_IP}:5000/predict`;
const HEALTH_URL = `http://${COMPUTER_IP}:5000/health`;

const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Request timed out')), timeout);
    fetch(url, options)
      .then(response => { clearTimeout(timer); resolve(response); })
      .catch(error => { clearTimeout(timer); reject(error); });
  });
};

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiCheckDone, setApiCheckDone] = useState(false);
  const [flashEnabled, setFlashEnabled] = useState(false);
  
  // Camera Permission
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef(null);

  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startScanLineAnimation();
    startPulseAnimation();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    try {
      const response = await fetchWithTimeout(HEALTH_URL, { method: 'GET' }, 5000);
      if (response.ok) {
        setIsApiReady(true);
        setApiCheckDone(true);
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      setIsApiReady(false);
      setApiCheckDone(true);
    }
  };

  const startScanLineAnimation = () => {
    // FIX: Use translateY instead of top percentage so it works with useNativeDriver: true
    scanLineAnim.setValue(0);
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, { toValue: 1, duration: 2500, useNativeDriver: true }),
        Animated.timing(scanLineAnim, { toValue: 0, duration: 2500, useNativeDriver: true }),
      ])
    ).start();
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0.95, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  };

  const preprocessImage = async (imageUri) => {
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
    );
    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  };

  const analyzeImage = async () => {
    if (!image) {
      Toast.show({ type: 'error', text1: 'No Image', text2: 'Please take a photo or upload an image first.' });
      return;
    }
    if (!isApiReady) {
      await checkApiHealth();
      if (!isApiReady) {
        Toast.show({ type: 'error', text1: 'Server Not Ready', text2: 'Please wait for the AI server to connect.' });
        return;
      }
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      const base64Image = await preprocessImage(image);
      const response = await fetchWithTimeout(
        API_URL,
        {
          method: 'POST',
          headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
          body: JSON.stringify({ image: base64Image }),
        },
        30000
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();

      if (result.success === false && result.error === 'not_cassava') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Toast.show({ type: 'error', text1: 'Not a Cassava Leaf', text2: result.message || 'Please upload a clear image of a cassava leaf.' });
        setLoading(false);
        return;
      }

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate('Result', {
          imageUri: image,
          diseaseKey: result.diseaseKey || 'UNKNOWN',
          diseaseLabel: result.diseaseName || 'Unknown Disease',
          confidence: result.confidence || 0,
          scanDate: new Date().toISOString(),
          description: result.description || 'No description available.',
          treatment: result.treatment || 'No treatment information available.',
          prevention: result.prevention || 'No prevention information available.',
          severity: result.severity || 'Unknown',
          symptoms: result.symptoms || 'No symptoms listed.',
          allProbabilities: result.allProbabilities || {},
          detectionMetrics: result.detection_metrics || {},
        });
      } else {
        throw new Error(result.message || 'Invalid response from server');
      }
    } catch (error) {
      let errorMessage = 'There was an error analyzing the image.';
      if (error.message.includes('Network request failed')) errorMessage = 'Cannot reach server. Check your network connection!';
      else if (error.message.includes('timed out')) errorMessage = 'Server took too long to respond. Try again.';
      else if (error.message) errorMessage = error.message;
      Toast.show({ type: 'error', text1: 'Analysis Failed', text2: errorMessage, visibilityTime: 5000 });
    } finally {
      setLoading(false);
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({ quality: 0.9 });
        setImage(photo.uri);
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch (error) {
        console.error('Error taking photo:', error);
      }
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({ type: 'error', text1: 'Permission Denied', text2: 'Please grant gallery permissions.' });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, quality: 0.9 });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [-140, 140], // Translates from top to bottom within the 280 frame
  });

  if (!permission) {
    // Camera permissions are still loading
    return <View style={styles.container} />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={60} color="#88D982" />
        <Text style={styles.permissionText}>We need your permission to show the camera</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      
      {/* Compressed Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.topControlBtn} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Scan Disease</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Camera View */}
      <View style={styles.cameraContainer}>
        {image ? (
          // Show captured/picked image for analysis
          <Image source={{ uri: image }} style={styles.previewImage} resizeMode="cover" />
        ) : (
          // Live Camera View
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
            enableTorch={flashEnabled}
          />
        )}
        
        {/* Dark Overlay */}
        <View style={styles.cameraOverlay} />

        {/* Scan Frame (Centered) */}
        <View style={styles.scanFrameContainer}>
          <View style={styles.scanFrame}>
            <View style={styles.cornerTL} />
            <View style={styles.cornerTR} />
            <View style={styles.cornerBL} />
            <View style={styles.cornerBR} />
            <Animated.View style={[styles.scanLine, { transform: [{ translateY: scanLineTranslate }] }]} />
            <Animated.View style={[styles.pulseRing, { transform: [{ scale: pulseAnim }] }]} />
          </View>
        </View>

        {/* Loading State */}
        {loading && (
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <ActivityIndicator size="small" color="#88D982" />
              <Text style={styles.statusLabel}>Analyzing...</Text>
            </View>
          </View>
        )}

        {/* Compressed Bottom Controls */}
        <View style={styles.bottomControls}>
          <TouchableOpacity style={styles.galleryButton} onPress={pickImage} activeOpacity={0.7}>
            <Ionicons name="images-outline" size={26} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.shutterButton} onPress={takePhoto} activeOpacity={0.8} disabled={loading}>
            <View style={styles.shutterInner} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.flashButton} onPress={() => setFlashEnabled(!flashEnabled)} activeOpacity={0.7}>
            <Ionicons name={flashEnabled ? "flash" : "flash-outline"} size={26} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Analyze Button (Only shows when image is present) */}
      {image && !loading && (
        <TouchableOpacity
          style={[styles.analyzeButton, !isApiReady && styles.analyzeButtonDisabled]}
          onPress={analyzeImage}
          activeOpacity={0.85}
          disabled={!isApiReady}
        >
          <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>
            {isApiReady ? 'Analyze Leaf' : 'Waiting for Server...'}
          </Text>
        </TouchableOpacity>
      )}
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  // Permission view styles
  permissionContainer: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  permissionText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
  },
  permissionButton: {
    backgroundColor: '#2E7D32',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  
  // Compressed Header
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 10,
  },
  topControlBtn: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  topTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Camera & Overlays
  cameraContainer: {
    flex: 1,
    position: 'relative',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
  },
  scanFrameContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
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
  
  // Compressed Bottom Controls
  statusContainer: {
    position: 'absolute',
    bottom: 140,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  bottomControls: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  galleryButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flashButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterButton: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 4,
  },
  shutterInner: {
    width: '100%',
    height: '100%',
    borderRadius: 35,
    backgroundColor: '#FFFFFF',
  },
  
  // Analyze Button
  analyzeButton: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: '#2E7D32',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 10,
  },
  analyzeButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default ScannerScreen;