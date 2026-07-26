import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

const ResultScreen = ({ route, navigation }) => {
  const { imageUri } = route.params || {};

  const diseaseData = {
    name: 'Cassava Mosaic Disease',
    description: 'A viral disease that causes yellow mosaic patterns on leaves.',
    treatment: 'Remove infected plants, use resistant varieties, control whitefly vectors.',
    prevention: 'Plant certified disease-free cuttings, practice crop rotation.',
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>🔬 Analysis Results</Text>

      {imageUri && (
        <Image source={{ uri: imageUri }} style={styles.image} />
      )}

      <View style={styles.resultCard}>
        <Text style={styles.diseaseName}>{diseaseData.name}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Description</Text>
          <Text style={styles.sectionText}>{diseaseData.description}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>💊 Treatment</Text>
          <Text style={styles.sectionText}>{diseaseData.treatment}</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🛡️ Prevention</Text>
          <Text style={styles.sectionText}>{diseaseData.prevention}</Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.scanButton]} 
          onPress={() => navigation.navigate('ScannerMain')}
        >
          <Text style={styles.buttonText}>🔄 Scan Another</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.homeButton]} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.buttonText}>🏠 Home</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: 300,
    borderRadius: 15,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  resultCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  diseaseName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 15,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2e7d32',
    marginBottom: 5,
  },
  sectionText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    width: '48%',
    alignItems: 'center',
  },
  scanButton: {
    backgroundColor: '#1976d2',
  },
  homeButton: {
    backgroundColor: '#388e3c',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ResultScreen;