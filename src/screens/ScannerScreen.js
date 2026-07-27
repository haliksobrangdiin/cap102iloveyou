import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ScannerScreen = ({ navigation }) => {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery permissions to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const analyzeImage = () => {
    if (!image) {
      Alert.alert('No Image', 'Please take a photo or upload an image first.');
      return;
    }
    navigation.navigate('Result', { imageUri: image });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SCAN LEAF</Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.subtitle}>Take a photo or upload an image of the cassava leaf</Text>

        <View style={styles.imageContainer}>
          {image ? (
            <Image source={{ uri: image }} style={styles.image} />
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="leaf-outline" size={60} color="#C77A58" />
              <Text style={styles.placeholderText}>No Image Selected</Text>
            </View>
          )}
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.cameraButton]} onPress={takePhoto} activeOpacity={0.85}>
            <Ionicons name="camera-outline" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Take Photo</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.galleryButton]} onPress={pickImage} activeOpacity={0.85}>
            <Ionicons name="images-outline" size={22} color="#FFFFFF" />
            <Text style={styles.buttonText}>Upload Image</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.button, styles.analyzeButton]} 
          onPress={analyzeImage}
          activeOpacity={0.85}
        >
          <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
          <Text style={styles.analyzeButtonText}>Analyze Leaf</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 52;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCC8AC',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  header: {
    width: '100%',
    minHeight: HEADER_HEIGHT,
    backgroundColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#5C4B3A',
    textAlign: 'center',
    marginBottom: 20,
    fontWeight: '500',
  },
  imageContainer: {
    width: '100%',
    height: 300,
    backgroundColor: '#E4D3BB',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  placeholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#8A7A66',
    fontSize: 16,
    marginTop: 10,
    fontWeight: '500',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 16,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  cameraButton: {
    backgroundColor: '#C77A58',
    width: '48%',
  },
  galleryButton: {
    backgroundColor: '#8A7A66',
    width: '48%',
  },
  analyzeButton: {
    backgroundColor: '#B86D4F',
    flexDirection: 'row',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    shadowColor: '#B86D4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  analyzeButtonText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default ScannerScreen;