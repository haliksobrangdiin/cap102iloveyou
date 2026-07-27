import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ResultScreen = ({ route, navigation }) => {
  const { imageUri } = route.params || {};

  const diseaseData = {
    name: 'Cassava Mosaic Disease',
    description: 'A viral disease that causes yellow mosaic patterns on leaves.',
    treatment: 'Remove infected plants, use resistant varieties, control whitefly vectors.',
    prevention: 'Plant certified disease-free cuttings, practice crop rotation.',
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>ANALYSIS RESULTS</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}

        <View style={styles.resultCard}>
          <View style={styles.diseaseHeader}>
            <Ionicons name="alert-circle" size={28} color="#C77A58" />
            <Text style={styles.diseaseName}>{diseaseData.name}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="document-text-outline" size={20} color="#C77A58" />
              <Text style={styles.sectionTitle}>Description</Text>
            </View>
            <Text style={styles.sectionText}>{diseaseData.description}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="medkit-outline" size={20} color="#C77A58" />
              <Text style={styles.sectionTitle}>Treatment</Text>
            </View>
            <Text style={styles.sectionText}>{diseaseData.treatment}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="shield-checkmark-outline" size={20} color="#C77A58" />
              <Text style={styles.sectionTitle}>Prevention</Text>
            </View>
            <Text style={styles.sectionText}>{diseaseData.prevention}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, styles.scanButton]}
            onPress={() => navigation.navigate('Scanner')}
            activeOpacity={0.85}
          >
            <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Scan Another</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.homeButton]}
            onPress={() => navigation.navigate('Home')}
            activeOpacity={0.85}
          >
            <Ionicons name="home-outline" size={20} color="#FFFFFF" />
            <Text style={styles.buttonText}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
    paddingBottom: 20,
  },
  imageContainer: {
    width: '100%',
    height: 250,
    backgroundColor: '#E4D3BB',
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#C77A58',
    overflow: 'hidden',
    marginBottom: 16,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  resultCard: {
    backgroundColor: '#E4D3BB',
    borderRadius: 15,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  diseaseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 12,
  },
  diseaseName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3D2E',
    textAlign: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(199, 122, 88, 0.3)',
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  sectionText: {
    fontSize: 14,
    color: '#4A3A2A',
    lineHeight: 22,
    paddingLeft: 28,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  scanButton: {
    backgroundColor: '#C77A58',
  },
  homeButton: {
    backgroundColor: '#8A7A66',
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    letterSpacing: 0.5,
  },
});

export default ResultScreen;