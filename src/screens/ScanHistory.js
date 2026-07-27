import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const HistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [historyData, setHistoryData] = useState([
    {
      id: '1',
      title: 'Cassava Mosaic Disease',
      subtitle: 'Viral Infection Detected',
      detail: 'Confidence: 94.7% | Severity: High',
      extra: 'Scanned: Jan 15, 2024 • 2:30 PM',
      image: require('../assets/CassavaMosaic.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-15T14:30:00',
    },
    {
      id: '2',
      title: 'Brown Spot Disease',
      subtitle: 'Fungal Infection Detected',
      detail: 'Confidence: 87.2% | Severity: Medium',
      extra: 'Scanned: Jan 14, 2024 • 11:15 AM',
      image: require('../assets/BrownSpot.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-14T11:15:00',
    },
    {
      id: '3',
      title: 'Cassava Green Mite',
      subtitle: 'Pest Infestation Detected',
      detail: 'Confidence: 92.1% | Severity: High',
      extra: 'Scanned: Jan 12, 2024 • 9:45 AM',
      image: require('../assets/GreenMite.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-12T09:45:00',
    },
    {
      id: '4',
      title: 'Healthy Cassava Leaf',
      subtitle: 'No Disease Detected',
      detail: 'Confidence: 98.3% | Status: Healthy',
      extra: 'Scanned: Jan 10, 2024 • 4:20 PM',
      image: require('../assets/HealthyLeaf.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-10T16:20:00',
    },
    {
      id: '5',
      title: 'Cassava Bacterial Blight',
      subtitle: 'Bacterial Infection Detected',
      detail: 'Confidence: 89.5% | Severity: Medium',
      extra: 'Scanned: Jan 8, 2024 • 10:00 AM',
      image: require('../assets/BacterialBlight.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-08T10:00:00',
    },
    {
      id: '6',
      title: 'Cassava Anthracnose',
      subtitle: 'Fungal Disease Detected',
      detail: 'Confidence: 85.9% | Severity: Low',
      extra: 'Scanned: Jan 5, 2024 • 1:30 PM',
      image: require('../assets/Anthracnose.png'),
      isArchived: false,
      archivedAt: null,
      createdAt: '2024-01-05T13:30:00',
    },
  ]);

  // Get filtered data based on active tab
  const getFilteredData = () => {
    return historyData.filter(item => 
      activeTab === 'active' ? !item.isArchived : item.isArchived
    );
  };

  const filteredData = getFilteredData();

  // Handle archive - NO ALERT CONFIRMATION (for testing)
  const handleArchive = (id) => {
   
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Update state directly
    const newData = historyData.map(item => {
      if (item.id === id) {
        
        return { 
          ...item, 
          isArchived: true, 
          archivedAt: new Date().toISOString() 
        };
      }
      return item;
    });
    
   
    
    setHistoryData(newData);
    
   
  };

  const handleRestore = (id) => {
    
    
    // Haptic feedback
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    // Update state directly
    const newData = historyData.map(item => {
      if (item.id === id) {
        
        return { 
          ...item, 
          isArchived: false, 
          archivedAt: null 
        };
      }
      return item;
    });
    
 
    
    setHistoryData(newData);
    
  
  };

  // Render each history item
  const renderHistoryItem = ({ item }) => {
    const isArchived = item.isArchived;

    return (
      <View style={styles.cardWrapper}>
        <View style={[styles.historyCard, isArchived && styles.archivedCard]}>
          <View style={styles.cardRow}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
            </View>
            
            <View style={styles.historyContent}>
              <View style={styles.titleRow}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                {isArchived && (
                  <View style={styles.archivedBadge}>
                    <Text style={styles.archivedBadgeText}>ARCHIVED</Text>
                  </View>
                )}
              </View>
              <Text style={styles.historySubtitle}>{item.subtitle}</Text>
              <Text style={styles.historyDetail}>{item.detail}</Text>
              <Text style={styles.historyExtra}>
                {isArchived ? `Archived: ${new Date(item.archivedAt).toLocaleDateString()}` : item.extra}
              </Text>
            </View>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => {
                isArchived ? handleRestore(item.id) : handleArchive(item.id);
              }}
              activeOpacity={0.6}
            >
              <Ionicons 
                name={isArchived ? 'refresh-outline' : 'archive-outline'} 
                size={22} 
                color={isArchived ? '#4CAF50' : '#C77A58'} 
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>SCAN HISTORY</Text>
        <Text style={styles.countText}>{filteredData.length} items</Text>
      </View>

      {/* Toggle Buttons */}
      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'active' && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setActiveTab('active');
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'active' && styles.toggleTextActive,
            ]}
          >
            Active ({historyData.filter(item => !item.isArchived).length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'archived' && styles.toggleButtonActive,
          ]}
          onPress={() => {
            setActiveTab('archived');
          }}
          activeOpacity={0.7}
        >
          <Text
            style={[
              styles.toggleText,
              activeTab === 'archived' && styles.toggleTextActive,
            ]}
          >
            Archived ({historyData.filter(item => item.isArchived).length})
          </Text>
        </TouchableOpacity>
      </View>

      {/* History List */}
      <FlatList
        data={filteredData}
        renderItem={renderHistoryItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons 
              name={activeTab === 'active' ? 'document-text-outline' : 'archive-outline'} 
              size={60} 
              color="#C77A58" 
            />
            <Text style={styles.emptyText}>
              {activeTab === 'active' ? 'No active scans' : 'No archived scans'}
            </Text>
            <Text style={styles.emptySubtext}>
              {activeTab === 'active' 
                ? 'Your scan results will appear here' 
                : 'Archived scans will appear here'}
            </Text>
          </View>
        }
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
    flexDirection: 'row',
    justifyContent: 'space-between',
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
  countText: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.8,
    fontWeight: '500',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#E4D3BB',
    margin: 16,
    borderRadius: 12,
    padding: 4,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#C77A58',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8A7A66',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
    paddingBottom: 20,
  },
  cardWrapper: {
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  archivedCard: {
    backgroundColor: '#D2C4B0',
    opacity: 0.8,
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
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    flex: 1,
  },
  archivedBadge: {
    backgroundColor: '#8A7A66',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  archivedBadgeText: {
    fontSize: 8,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  historySubtitle: {
    fontSize: 12,
    color: '#444444',
    fontWeight: '500',
  },
  historyDetail: {
    fontSize: 11,
    color: '#555555',
    fontWeight: '600',
  },
  historyExtra: {
    fontSize: 10,
    color: '#888888',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C3D2E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A7A66',
    marginTop: 8,
  },
});

export default HistoryScreen;