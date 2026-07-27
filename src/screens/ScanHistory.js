import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const HistoryScreen = ({ navigation }) => {
  // Sample history data with proper structure
  const [historyData] = useState([
    {
      id: '1',
      title: 'Cassava Mosaic Disease',
      subtitle: 'Viral Infection Detected',
      detail: 'Confidence: 94.7% | Severity: High',
      extra: 'Scanned: Jan 15, 2024 • 2:30 PM',
      image: require('../assets/CassavaMosaic.png'), // Replace with your image
    },
    {
      id: '2',
      title: 'Brown Spot Disease',
      subtitle: 'Fungal Infection Detected',
      detail: 'Confidence: 87.2% | Severity: Medium',
      extra: 'Scanned: Jan 14, 2024 • 11:15 AM',
      image: require('../assets/BrownSpot.png'), // Replace with your image
    },
    {
      id: '3',
      title: 'Cassava Green Mite',
      subtitle: 'Pest Infestation Detected',
      detail: 'Confidence: 92.1% | Severity: High',
      extra: 'Scanned: Jan 12, 2024 • 9:45 AM',
      image: require('../assets/GreenMite.png'), // Replace with your image
    },
    {
      id: '4',
      title: 'Healthy Cassava Leaf',
      subtitle: 'No Disease Detected',
      detail: 'Confidence: 98.3% | Status: Healthy',
      extra: 'Scanned: Jan 10, 2024 • 4:20 PM',
      image: require('../assets/HealthyLeaf.png'), // Replace with your image
    },
    {
      id: '5',
      title: 'Cassava Bacterial Blight',
      subtitle: 'Bacterial Infection Detected',
      detail: 'Confidence: 89.5% | Severity: Medium',
      extra: 'Scanned: Jan 8, 2024 • 10:00 AM',
      image: require('../assets/BacterialBlight.png'), // Replace with your image
    },
    {
      id: '6',
      title: 'Cassava Anthracnose',
      subtitle: 'Fungal Disease Detected',
      detail: 'Confidence: 85.9% | Severity: Low',
      extra: 'Scanned: Jan 5, 2024 • 1:30 PM',
      image: require('../assets/Anthracnose.png'), // Replace with your image
    },
  ]);

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
      <View style={styles.cardRow}>
        {/* Image Container */}
        <View style={styles.imageContainer}>
          <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
        </View>
        
        {/* Content Container */}
        <View style={styles.historyContent}>
          <Text style={styles.historyTitle}>{item.title}</Text>
          <Text style={styles.historySubtitle}>{item.subtitle}</Text>
          <Text style={styles.historyDetail}>{item.detail}</Text>
          <Text style={styles.historyExtra}>{item.extra}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SCAN HISTORY</Text>
      </View>

      {/* History List */}
      <FlatList
        data={historyData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
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
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  historyCard: {
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: 8,
    overflow: 'hidden',
    marginRight: 12,
    backgroundColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
  },
  historyContent: {
    flex: 1,
    gap: 2,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 12,
    color: '#444444',
    marginBottom: 2,
    fontWeight: '500',
  },
  historyDetail: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyExtra: {
    fontSize: 10,
    color: '#888888',
  },
});

export default HistoryScreen;