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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as Haptics from 'expo-haptics';
import Toast from 'react-native-toast-message';

// ===== API CONFIGURATION =====
// YOUR COMPUTER'S IP ADDRESS FROM IPCONFIG
const COMPUTER_IP = '192.168.1.19';  // UPDATED WITH YOUR IP
const API_URL = `http://${COMPUTER_IP}:5000/predict`;
const HEALTH_URL = `http://${COMPUTER_IP}:5000/health`;

// Timeout helper for React Native
const fetchWithTimeout = (url, options = {}, timeout = 10000) => {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Request timed out'));
    }, timeout);

    fetch(url, options)
      .then(response => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch(error => {
        clearTimeout(timer);
        reject(error);
      });
  });
};

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isApiReady, setIsApiReady] = useState(false);
  const [apiCheckDone, setApiCheckDone] = useState(false);

  // Animation values
  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    startScanLineAnimation();
    startPulseAnimation();
    checkApiHealth();
  }, []);

  const checkApiHealth = async () => {
    console.log(`🔍 Checking API health at: ${HEALTH_URL}`);
    
    try {
      const response = await fetchWithTimeout(
        HEALTH_URL,
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        },
        5000 // 5 second timeout
      );

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Server healthy:', data);
        setIsApiReady(true);
        setApiCheckDone(true);
        Toast.show({
          type: 'success',
          text1: 'Server Connected ✅',
          text2: 'AI model is ready for scanning!',
          visibilityTime: 2000,
        });
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error('❌ Health check failed:', error);
      setIsApiReady(false);
      setApiCheckDone(true);
      
      let errorMessage = 'Make sure Flask server is running!';
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Cannot reach server. Check IP address and network!';
      } else if (error.message.includes('timed out')) {
        errorMessage = 'Server timeout. Check if Flask is running!';
      }
      
      Toast.show({
        type: 'error',
        text1: 'Server Connection Failed',
        text2: errorMessage,
        visibilityTime: 5000,
      });
      
      Alert.alert(
        'Server Connection Error',
        `Cannot connect to AI server at:\n${HEALTH_URL}\n\nTroubleshooting:\n1. Make sure Flask is running (python app.py)\n2. Your IP is: 192.168.1.19\n3. Both devices on same Wi-Fi\n4. Disable firewall temporarily\n\nError: ${error.message}`,
        [
          { text: 'Retry', onPress: () => checkApiHealth() },
          { text: 'Continue Anyway', onPress: () => setApiCheckDone(true) },
        ]
      );
    }
  };

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

  const preprocessImage = async (imageUri) => {
    console.log('🔄 Preprocessing image...');
    
    const manipulatedImage = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 224, height: 224 } }],
      { format: ImageManipulator.SaveFormat.JPEG, compress: 0.9 }
    );

    const response = await fetch(manipulatedImage.uri);
    const blob = await response.blob();
    
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        console.log('✅ Image preprocessed successfully');
        resolve(base64);
      };
      reader.onerror = (error) => {
        console.error('❌ Failed to read image:', error);
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  };

  const analyzeImage = async () => {
    if (!image) {
      Toast.show({
        type: 'error',
        text1: 'No Image',
        text2: 'Please take a photo or upload an image first.',
      });
      return;
    }

    if (!isApiReady) {
      await checkApiHealth();
      if (!isApiReady) {
        Toast.show({
          type: 'error',
          text1: 'Server Not Ready',
          text2: 'Please wait for the AI server to connect.',
          visibilityTime: 3000,
        });
        return;
      }
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      console.log('📸 Analyzing image...');
      const base64Image = await preprocessImage(image);

      console.log('📤 Sending request to:', API_URL);
      const response = await fetchWithTimeout(
        API_URL,
        {
          method: 'POST',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ image: base64Image }),
        },
        30000
      );

      console.log('📥 Response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Analysis failed');
      }

      const result = await response.json();
      console.log('✅ Analysis result:', result);

      if (result.success === false && result.error === 'not_cassava') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Toast.show({
          type: 'error',
          text1: 'Not a Cassava Leaf',
          text2: result.message || 'Please upload a clear image of a cassava leaf.',
          visibilityTime: 4000,
        });
        setLoading(false);
        return;
      }

      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Toast.show({
          type: 'success',
          text1: 'Analysis Complete ✅',
          text2: `${result.diseaseName} (${result.confidence}%)`,
          visibilityTime: 2500,
        });

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
      console.error('❌ Analysis error:', error);
      
      let errorMessage = 'There was an error analyzing the image.';
      if (error.message.includes('Network request failed')) {
        errorMessage = 'Cannot reach server. Check your network connection!';
      } else if (error.message.includes('timed out')) {
        errorMessage = 'Server took too long to respond. Try again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Toast.show({
        type: 'error',
        text1: 'Analysis Failed',
        text2: errorMessage,
        visibilityTime: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Please grant gallery permissions.',
      });
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Image Uploaded',
        text2: 'Tap "Analyze Leaf" to scan with AI',
        visibilityTime: 2000,
      });
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Toast.show({
        type: 'error',
        text1: 'Permission Denied',
        text2: 'Please grant camera permissions.',
      });
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Toast.show({
        type: 'success',
        text1: 'Photo Captured',
        text2: 'Tap "Analyze Leaf" to scan with AI',
        visibilityTime: 2000,
      });
    }
  };

  const scanLineTranslate = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 90],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
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

      {apiCheckDone && !isApiReady && (
        <View style={[styles.modelLoadingBar, styles.apiErrorBar]}>
          <Ionicons name="server-outline" size={18} color="#FFFFFF" />
          <Text style={styles.modelLoadingText}>Server Disconnected - Check IP</Text>
          <TouchableOpacity onPress={checkApiHealth} style={styles.retryButton}>
            <Ionicons name="refresh" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}

      {isApiReady && (
        <View style={styles.modelLoadingBar}>
          <Ionicons name="checkmark-circle" size={18} color="#FFFFFF" />
          <Text style={styles.modelLoadingText}>Server Connected ✅</Text>
        </View>
      )}

      {!apiCheckDone && (
        <View style={[styles.modelLoadingBar, styles.loadingBar]}>
          <ActivityIndicator size="small" color="#FFFFFF" />
          <Text style={styles.modelLoadingText}>Connecting to AI Server...</Text>
        </View>
      )}

      <View style={styles.cameraContainer}>
        <View style={styles.cameraBackground}>
          {image ? (
            <Image source={{ uri: image }} style={styles.backgroundImage} resizeMode="cover" />
          ) : (
            <View style={styles.backgroundPlaceholder}>
              <Ionicons name="leaf-outline" size={80} color="#88D982" opacity={0.5} />
              <Text style={styles.placeholderText}>No Image Selected</Text>
              <Text style={styles.placeholderSubText}>Take a photo or upload from gallery</Text>
            </View>
          )}
          <View style={styles.cameraOverlay} />
        </View>

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

        {loading && (
          <View style={styles.statusContainer}>
            <View style={styles.statusHeader}>
              <View style={styles.pingDot} />
              <Text style={styles.statusLabel}>Analyzing...</Text>
            </View>
            <Text style={styles.statusDescription}>
              Processing your image with AI.
            </Text>
            <ActivityIndicator size="large" color="#88D982" style={{ marginTop: 10 }} />
          </View>
        )}

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

        {image && !loading && (
          <TouchableOpacity
            style={[
              styles.analyzeButton,
              !isApiReady && styles.analyzeButtonDisabled
            ]}
            onPress={analyzeImage}
            activeOpacity={0.85}
            disabled={!isApiReady}
          >
            <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
            <Text style={styles.analyzeButtonText}>
              {isApiReady ? 'Analyze Leaf' : 'Waiting for Server...'}
            </Text>
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
  modelLoadingBar: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(46, 125, 50, 0.95)',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 20,
    gap: 12,
  },
  apiErrorBar: {
    backgroundColor: 'rgba(255, 0, 0, 0.85)',
  },
  loadingBar: {
    backgroundColor: 'rgba(255, 165, 0, 0.9)',
  },
  modelLoadingText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  retryButton: {
    padding: 4,
    marginLeft: 8,
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
    fontSize: 18,
    marginTop: 8,
    fontWeight: '600',
  },
  placeholderSubText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 13,
    marginTop: 4,
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
    shadowColor: '#88D982',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 4,
    elevation: 4,
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
  analyzeButtonDisabled: {
    backgroundColor: '#666666',
    opacity: 0.7,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ScannerScreen;