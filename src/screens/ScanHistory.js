// screens/HistoryScreen.js - Complete with Filter Modal (Bottom Bar Removed)
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
  Modal,
  ScrollView,
  TextInput,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const { width } = Dimensions.get('window');

// RootCare Design System tokens
const colors = {
  surface: '#FFF8F6',
  'surface-dim': '#FBD1C4',
  'surface-container': '#FFE9E3',
  'surface-container-low': '#FFF1ED',
  'surface-container-high': '#FFE2DA',
  'on-surface': '#2C160E',
  'on-surface-variant': '#40493D',
  outline: '#707A6C',
  'outline-variant': '#BFCABA',
  primary: '#0D631B',
  'on-primary': '#FFFFFF',
  'primary-container': '#2E7D32',
  'primary-fixed-dim': '#88D982',
  secondary: '#7A5649',
  'on-secondary': '#FFFFFF',
  tertiary: '#774C00',
  error: '#BA1A1A',
  background: '#FFF8F6',
};

const typography = {
  'headline-sm': { fontFamily: 'Montserrat', fontSize: 20, fontWeight: '600', lineHeight: 28 },
  'body-md': { fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', lineHeight: 24 },
  'label-lg': { fontFamily: 'Open Sans', fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.1 },
  'label-sm': { fontFamily: 'Open Sans', fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

const spacing = { xs: 4, sm: 12, md: 16, lg: 24, xl: 32, marginMobile: 20 };

const rounded = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };

const HEADER_HEIGHT = 56;
const MIN_TOUCH = 48;

// Helper function to get badge style
const getTypeBadgeStyle = (type) => {
  switch(type) {
    case 'Viral': return styles.viralBadge;
    case 'Fungal': return styles.fungalBadge;
    case 'Bacterial': return styles.bacterialBadge;
    case 'Pest': return styles.pestBadge;
    case 'Healthy': return styles.healthyBadge;
    default: return {};
  }
};

const getSeverityColor = (severity) => {
  switch(severity) {
    case 'High': return '#E74C3C';
    case 'Medium': return '#F39C12';
    case 'Low': return '#27AE60';
    case 'None': return '#2ECC71';
    default: return colors['on-surface-variant'];
  }
};

const getAccuracyColor = (accuracy) => {
  if (accuracy >= 90) return styles.accuracyHigh;
  if (accuracy >= 70) return styles.accuracyMedium;
  return styles.accuracyLow;
};

// Sample data
const sampleData = [
  {
    id: '1',
    title: 'Cassava Mosaic Disease',
    subtitle: 'Viral Infection Detected',
    detail: 'Severity: High',
    extra: 'Scanned: Jan 15, 2024 . 2:30 PM',
    image: require('../assets/CassavaMosaic.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-15T14:30:00',
    diseaseType: 'Viral',
    severity: 'High',
    accuracy: 94.7,
    description: 'A viral disease that causes yellow mosaic patterns on leaves. Infected plants show stunted growth and reduced yield.',
    treatment: 'Remove infected plants immediately. Use resistant varieties and control whitefly vectors with appropriate pesticides.',
    prevention: 'Plant certified disease-free cuttings. Practice crop rotation and maintain proper field sanitation.',
    symptoms: 'Yellow mosaic patterns on leaves, stunted growth, distorted leaves.',
    notes: 'Found in the northern field. Affected about 30% of the crop.',
  },
  {
    id: '2',
    title: 'Brown Spot Disease',
    subtitle: 'Fungal Infection Detected',
    detail: 'Severity: Medium',
    extra: 'Scanned: Jan 14, 2024 . 11:15 AM',
    image: require('../assets/BrownSpot.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-14T11:15:00',
    diseaseType: 'Fungal',
    severity: 'Medium',
    accuracy: 87.2,
    description: 'Fungal disease causing brown spots on leaves. Lesions start as small water-soaked spots that enlarge and turn brown.',
    treatment: 'Apply appropriate fungicides. Ensure proper drainage and avoid overhead irrigation.',
    prevention: 'Practice crop rotation. Use resistant varieties and maintain proper plant spacing.',
    symptoms: 'Brown circular spots on leaves, yellow halos around spots, leaf drop.',
    notes: '',
  },
  {
    id: '3',
    title: 'Cassava Green Mite',
    subtitle: 'Pest Infestation Detected',
    detail: 'Severity: High',
    extra: 'Scanned: Jan 12, 2024 . 9:45 AM',
    image: require('../assets/GreenMite.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-12T09:45:00',
    diseaseType: 'Pest',
    severity: 'High',
    accuracy: 92.1,
    description: 'Pest infestation causing leaf damage and stunted growth. Green mites feed on plant sap, causing yellowing and curling.',
    treatment: 'Apply appropriate miticides or pesticides. Introduce natural predators like predatory mites.',
    prevention: 'Regular monitoring of fields. Use resistant varieties and maintain good field hygiene.',
    symptoms: 'Yellowing leaves, curled leaves, stunted growth, visible mites on leaves.',
    notes: '',
  },
  {
    id: '4',
    title: 'Healthy Cassava Leaf',
    subtitle: 'No Disease Detected',
    detail: 'Status: Healthy',
    extra: 'Scanned: Jan 10, 2024 . 4:20 PM',
    image: require('../assets/HealthyLeaf.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-10T16:20:00',
    diseaseType: 'Healthy',
    severity: 'None',
    accuracy: 98.3,
    description: 'The leaf appears healthy with no signs of disease. Continue maintaining good agricultural practices.',
    treatment: 'Continue current maintenance practices. Regular monitoring is recommended.',
    prevention: 'Maintain proper farming practices. Regular inspection and early detection.',
    symptoms: 'No visible symptoms. Healthy green leaves with normal growth.',
    notes: '',
  },
  {
    id: '5',
    title: 'Cassava Bacterial Blight',
    subtitle: 'Bacterial Infection Detected',
    detail: 'Severity: Medium',
    extra: 'Scanned: Jan 8, 2024 . 10:00 AM',
    image: require('../assets/BacterialBlight.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-08T10:00:00',
    diseaseType: 'Bacterial',
    severity: 'Medium',
    accuracy: 89.5,
    description: 'Bacterial infection causing blight on leaves and stems. Angular water-soaked lesions that turn brown and necrotic.',
    treatment: 'Remove infected plants. Apply copper-based bactericides and maintain proper field hygiene.',
    prevention: 'Use disease-free planting material. Practice crop rotation and avoid overhead irrigation.',
    symptoms: 'Angular water-soaked lesions, brown spots with yellow halos, wilting.',
    notes: '',
  },
  {
    id: '6',
    title: 'Cassava Anthracnose',
    subtitle: 'Fungal Disease Detected',
    detail: 'Severity: Low',
    extra: 'Scanned: Jan 5, 2024 . 1:30 PM',
    image: require('../assets/Anthracnose.png'),
    isArchived: false,
    isSaved: false,
    archivedAt: null,
    createdAt: '2024-01-05T13:30:00',
    diseaseType: 'Fungal',
    severity: 'Low',
    accuracy: 85.9,
    description: 'Fungal disease causing lesions on leaves and stems. Small brown spots that enlarge and develop dark margins.',
    treatment: 'Apply appropriate fungicides. Improve air circulation and maintain proper drainage.',
    prevention: 'Avoid overhead irrigation. Practice crop rotation and use resistant varieties.',
    symptoms: 'Brown lesions on leaves, dark margins around spots, stem cankers.',
    notes: '',
  },
];

const HistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'saved' | 'archived'
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isExporting, setIsExporting] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detailed'
  
  const [historyData, setHistoryData] = useState(sampleData);

  const diseaseTypes = ['All', 'Viral', 'Fungal', 'Bacterial', 'Pest', 'Healthy'];

  const getFilteredData = () => {
    let filtered = historyData.filter(item => {
      if (activeTab === 'active') return !item.isArchived && !item.isSaved;
      if (activeTab === 'saved') return item.isSaved && !item.isArchived;
      if (activeTab === 'archived') return item.isArchived;
      return true;
    });

    if (selectedFilter !== 'All') {
      filtered = filtered.filter(item => item.diseaseType === selectedFilter);
    }

    switch(sortBy) {
      case 'newest': filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); break;
      case 'oldest': filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)); break;
      case 'name': filtered.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'accuracy': filtered.sort((a, b) => b.accuracy - a.accuracy); break;
      default: break;
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const handleSave = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const newData = historyData.map(item => {
      if (item.id === id) {
        return { ...item, isSaved: !item.isSaved };
      }
      return item;
    });
    setHistoryData(newData);
  };

  const handleArchive = (id) => {
    Alert.alert(
      'Archive Scan',
      'Move this scan to archive?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'default',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const newData = historyData.map(item => {
              if (item.id === id) {
                return { ...item, isArchived: true, archivedAt: new Date().toISOString() };
              }
              return item;
            });
            setHistoryData(newData);
          }
        }
      ]
    );
  };

  const handleRestore = (id) => {
    Alert.alert(
      'Restore Scan',
      'Move this scan back to active?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Restore', 
          style: 'default',
          onPress: () => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            const newData = historyData.map(item => {
              if (item.id === id) {
                return { ...item, isArchived: false, archivedAt: null };
              }
              return item;
            });
            setHistoryData(newData);
          }
        }
      ]
    );
  };

  const handleViewDetails = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedItem(item);
    setDetailModalVisible(true);
  };

  const openNotesModal = (item) => {
    setSelectedItem(item);
    setNoteText(item.notes || '');
    setNotesModalVisible(true);
  };

  const saveNote = () => {
    if (!noteText.trim()) {
      Alert.alert('Empty Note', 'Please enter a note before saving.');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const updatedData = historyData.map(item => {
      if (item.id === selectedItem.id) {
        return { ...item, notes: noteText.trim() };
      }
      return item;
    });

    setHistoryData(updatedData);
    setSelectedItem({ ...selectedItem, notes: noteText.trim() });
    setNotesModalVisible(false);
    Alert.alert('OK Note Saved', 'Your note has been added to this scan.');
  };

  const exportReport = async (item) => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      // Export logic here
      setIsExporting(false);
    } catch (error) {
      console.error('Export error:', error);
      setIsExporting(false);
    }
  };

  const getDateKey = (item) => {
    const date = new Date(item.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderSectionHeader = (dateKey) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{dateKey}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );

  const renderItem = ({ item, index }) => {
    const currentDateKey = getDateKey(item);
    let showHeader = false;
    
    if (index === 0) {
      showHeader = true;
    } else {
      const previousItem = filteredData[index - 1];
      const prevDateKey = getDateKey(previousItem);
      showHeader = currentDateKey !== prevDateKey;
    }

    return (
      <View>
        {showHeader && renderSectionHeader(currentDateKey)}
        {viewMode === 'list' ? renderListItem({ item }) : renderDetailedItem({ item })}
      </View>
    );
  };

  const renderListItem = ({ item }) => {
    const isArchived = item.isArchived;
    const isSaved = item.isSaved;

    return (
      <TouchableOpacity 
        style={styles.cardWrapper}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.historyCard, isArchived && styles.archivedCard]}>
          <View style={styles.cardRow}>
            <View style={styles.imageContainer}>
              <Image source={item.image} style={styles.thumbnail} resizeMode="cover" />
            </View>
            
            <View style={styles.historyContent}>
              <View style={styles.titleRow}>
                <Text style={styles.historyTitle}>{item.title}</Text>
                <View style={styles.badgeRow}>
                  {isSaved && (
                    <View style={styles.savedBadge}>
                      <Ionicons name="bookmark" size={10} color="#FFFFFF" />
                    </View>
                  )}
                  {isArchived && (
                    <View style={styles.archivedBadge}>
                      <Text style={styles.archivedBadgeText}>ARCHIVED</Text>
                    </View>
                  )}
                </View>
              </View>
              <Text style={styles.historySubtitle}>{item.subtitle}</Text>
              
              <View style={styles.detailRow}>
                <View style={styles.accuracyContainer}>
                  <View style={styles.accuracyBarTrack}>
                    <View 
                      style={[
                        styles.accuracyBarFill, 
                        { width: `${item.accuracy}%` },
                        getAccuracyColor(item.accuracy)
                      ]} 
                    />
                  </View>
                  <Text style={styles.accuracyText}>{item.accuracy}%</Text>
                </View>
                <View style={[styles.typeBadge, getTypeBadgeStyle(item.diseaseType)]}>
                  <Text style={styles.typeBadgeText}>{item.diseaseType}</Text>
                </View>
              </View>
              
              <View style={styles.extraRow}>
                <Text style={styles.historyExtra}>
                  {isArchived ? `Archived: ${new Date(item.archivedAt).toLocaleDateString()}` : item.extra}
                </Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleSave(item.id)}
                activeOpacity={0.6}
              >
                <Ionicons 
                  name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                  size={20} 
                  color={isSaved ? colors.primary : colors.secondary} 
                />
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => isArchived ? handleRestore(item.id) : handleArchive(item.id)}
                activeOpacity={0.6}
              >
                <Ionicons 
                  name={isArchived ? 'refresh-outline' : 'archive-outline'} 
                  size={20} 
                  color={isArchived ? '#4CAF50' : colors.secondary} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderDetailedItem = ({ item }) => {
    const isArchived = item.isArchived;
    const isSaved = item.isSaved;

    return (
      <TouchableOpacity 
        style={styles.detailedCardWrapper}
        onPress={() => handleViewDetails(item)}
        activeOpacity={0.7}
      >
        <View style={[styles.detailedCard, isArchived && styles.archivedCard]}>
          <Image source={item.image} style={styles.detailedImage} resizeMode="cover" />
          <View style={styles.detailedContent}>
            <View style={styles.detailedHeader}>
              <Text style={styles.detailedTitle}>{item.title}</Text>
              <View style={styles.badgeRow}>
                {isSaved && (
                  <View style={styles.savedBadge}>
                    <Ionicons name="bookmark" size={12} color="#FFFFFF" />
                  </View>
                )}
                {isArchived && (
                  <View style={styles.archivedBadge}>
                    <Text style={styles.archivedBadgeText}>ARCHIVED</Text>
                  </View>
                )}
              </View>
            </View>
            <Text style={styles.detailedSubtitle}>{item.subtitle}</Text>
            <Text style={styles.detailedDescription} numberOfLines={2}>
              {item.description}
            </Text>
            <View style={styles.detailedFooter}>
              <View style={styles.detailedStat}>
                <Text style={styles.detailedStatLabel}>Accuracy</Text>
                <View style={styles.detailedAccuracyBar}>
                  <View style={styles.accuracyBarTrack}>
                    <View 
                      style={[
                        styles.accuracyBarFill, 
                        { width: `${item.accuracy}%` },
                        getAccuracyColor(item.accuracy)
                      ]} 
                    />
                  </View>
                  <Text style={styles.detailedStatValue}>{item.accuracy}%</Text>
                </View>
              </View>
              <View style={styles.detailedStat}>
                <Text style={styles.detailedStatLabel}>Severity</Text>
                <Text style={[styles.detailedStatValue, { color: getSeverityColor(item.severity) }]}>
                  {item.severity}
                </Text>
              </View>
            </View>
            <View style={styles.detailedActions}>
              <View style={[styles.typeBadge, getTypeBadgeStyle(item.diseaseType)]}>
                <Text style={styles.typeBadgeText}>{item.diseaseType}</Text>
              </View>
              <View style={styles.detailedActionButtons}>
                <TouchableOpacity 
                  style={styles.detailedActionButton}
                  onPress={() => handleSave(item.id)}
                >
                  <Ionicons 
                    name={isSaved ? 'bookmark' : 'bookmark-outline'} 
                    size={18} 
                    color={isSaved ? colors.primary : colors.secondary} 
                  />
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.detailedActionButton}
                  onPress={() => isArchived ? handleRestore(item.id) : handleArchive(item.id)}
                >
                  <Ionicons 
                    name={isArchived ? 'refresh-outline' : 'archive-outline'} 
                    size={18} 
                    color={isArchived ? '#4CAF50' : colors.secondary} 
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTabCount = (tab) => {
    if (tab === 'active') return historyData.filter(item => !item.isArchived && !item.isSaved).length;
    if (tab === 'saved') return historyData.filter(item => item.isSaved && !item.isArchived).length;
    if (tab === 'archived') return historyData.filter(item => item.isArchived).length;
    return 0;
  };

  // Filter Modal
  const renderFilterModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={filterModalVisible}
      onRequestClose={() => setFilterModalVisible(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Filter & Sort</Text>
            <TouchableOpacity 
              onPress={() => setFilterModalVisible(false)}
              style={styles.modalCloseButton}
            >
              <Ionicons name="close" size={24} color={colors['on-surface']} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Disease Type Filter */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Disease Type</Text>
              <View style={styles.filterOptions}>
                {diseaseTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.filterChip,
                      selectedFilter === type && styles.filterChipActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSelectedFilter(type);
                    }}
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        selectedFilter === type && styles.filterChipTextActive,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Sort Options */}
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>Sort By</Text>
              <View style={styles.sortOptions}>
                {[
                  { id: 'newest', label: 'Newest First' },
                  { id: 'oldest', label: 'Oldest First' },
                  { id: 'name', label: 'Alphabetical' },
                  { id: 'accuracy', label: 'Accuracy' },
                ].map((option) => (
                  <TouchableOpacity
                    key={option.id}
                    style={[
                      styles.sortOption,
                      sortBy === option.id && styles.sortOptionActive,
                    ]}
                    onPress={() => {
                      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                      setSortBy(option.id);
                    }}
                  >
                    <Text
                      style={[
                        styles.sortOptionText,
                        sortBy === option.id && styles.sortOptionTextActive,
                      ]}
                    >
                      {option.label}
                    </Text>
                    {sortBy === option.id && (
                      <Ionicons name="checkmark" size={18} color={colors.secondary} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Apply Button */}
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setFilterModalVisible(false)}
            >
              <Text style={styles.applyButtonText}>Apply Filters</Text>
            </TouchableOpacity>

            {/* Reset Button */}
            <TouchableOpacity
              style={styles.resetButton}
              onPress={() => {
                setSelectedFilter('All');
                setSortBy('newest');
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
            >
              <Text style={styles.resetButtonText}>Reset Filters</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Detail Modal
  const renderDetailModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={detailModalVisible}
        onRequestClose={() => setDetailModalVisible(false)}
      >
        <View style={styles.detailModalOverlay}>
          <View style={styles.detailModalContent}>
            <View style={styles.detailModalHeader}>
              <TouchableOpacity 
                style={styles.detailCloseButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setDetailModalVisible(false);
                }}
              >
                <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
              </TouchableOpacity>
              <Text style={styles.detailModalTitle}>Analysis Details</Text>
              <TouchableOpacity 
                style={styles.detailExportButton}
                onPress={() => exportReport(selectedItem)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color={colors.secondary} />
                ) : (
                  <Ionicons name="download-outline" size={24} color={colors.secondary} />
                )}
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.detailScrollContent}
            >
              <View style={styles.detailImageContainer}>
                <Image source={selectedItem.image} style={styles.detailImage} resizeMode="cover" />
                <View style={[styles.detailTypeBadge, getTypeBadgeStyle(selectedItem.diseaseType)]}>
                  <Text style={styles.detailTypeBadgeText}>{selectedItem.diseaseType}</Text>
                </View>
              </View>

              <Text style={styles.detailDiseaseName}>{selectedItem.title}</Text>
              <Text style={styles.detailSubtitle}>{selectedItem.subtitle}</Text>

              <View style={styles.detailStatsRow}>
                <View style={styles.detailStat}>
                  <Text style={styles.detailStatValue}>{selectedItem.accuracy}%</Text>
                  <Text style={styles.detailStatLabel}>Accuracy</Text>
                </View>
                <View style={styles.detailStatDivider} />
                <View style={styles.detailStat}>
                  <View style={[styles.detailSeverityDot, { backgroundColor: getSeverityColor(selectedItem.severity) }]} />
                  <Text style={styles.detailStatValue}>{selectedItem.severity}</Text>
                  <Text style={styles.detailStatLabel}>Severity</Text>
                </View>
                <View style={styles.detailStatDivider} />
                <View style={styles.detailStat}>
                  <Text style={styles.detailStatValue}>
                    {new Date(selectedItem.createdAt).toLocaleDateString()}
                  </Text>
                  <Text style={styles.detailStatLabel}>Date</Text>
                </View>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Description</Text>
                <Text style={styles.detailSectionText}>{selectedItem.description}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Symptoms</Text>
                <Text style={styles.detailSectionText}>{selectedItem.symptoms}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Treatment</Text>
                <Text style={styles.detailSectionText}>{selectedItem.treatment}</Text>
              </View>

              <View style={styles.detailSection}>
                <Text style={styles.detailSectionTitle}>Prevention</Text>
                <Text style={styles.detailSectionText}>{selectedItem.prevention}</Text>
              </View>

              <View style={styles.detailSection}>
                <View style={styles.detailSectionHeader}>
                  <Text style={styles.detailSectionTitle}>Notes</Text>
                  <TouchableOpacity
                    onPress={() => {
                      setDetailModalVisible(false);
                      setTimeout(() => openNotesModal(selectedItem), 300);
                    }}
                  >
                    <Ionicons name="create-outline" size={20} color={colors.secondary} />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.detailSectionText, selectedItem.notes ? styles.hasNotes : styles.noNotes]}>
                  {selectedItem.notes || 'No notes added. Tap the pencil icon to add notes.'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  // Notes Modal
  const renderNotesModal = () => {
    if (!selectedItem) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={notesModalVisible}
        onRequestClose={() => setNotesModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, styles.notesModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Notes</Text>
              <TouchableOpacity 
                onPress={() => setNotesModalVisible(false)}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={colors['on-surface']} />
              </TouchableOpacity>
            </View>

            <Text style={styles.notesForText}>
              Notes for: {selectedItem.title}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder="Enter your observations, field location, treatment notes..."
              placeholderTextColor={colors.outline}
              multiline
              value={noteText}
              onChangeText={setNoteText}
              textAlignVertical="top"
            />

            <View style={styles.notesActions}>
              <TouchableOpacity
                style={[styles.notesButton, styles.notesCancelButton]}
                onPress={() => setNotesModalVisible(false)}
              >
                <Text style={styles.notesCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.notesButton, styles.notesSaveButton]}
                onPress={saveNote}
              >
                <Text style={styles.notesSaveText}>Save Note</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Simplified Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Scan History</Text>
        <View style={styles.headerActions}>
          {/* Grid/List toggle button */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => {
              const nextMode = viewMode === 'list' ? 'detailed' : 'list';
              setViewMode(nextMode);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'grid-outline' : 'list-outline'} 
              size={22} 
              color={colors['on-surface']} 
            />
          </TouchableOpacity>
          {/* Filter/Sort button */}
          <TouchableOpacity
            style={styles.headerIconButton}
            onPress={() => setFilterModalVisible(true)}
            activeOpacity={0.7}
          >
            <Ionicons name="options-outline" size={22} color={colors['on-surface']} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        {['active', 'saved', 'archived'].map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.toggleButton,
              activeTab === tab && styles.toggleButtonActive,
            ]}
            onPress={() => setActiveTab(tab)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.toggleText,
                activeTab === tab && styles.toggleTextActive,
              ]}
            >
              {tab === 'active' ? 'Active' : tab === 'saved' ? 'Saved' : 'Archived'}
              {' '}
              <Text style={styles.toggleCount}>({getTabCount(tab)})</Text>
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          key={viewMode}
          ListHeaderComponent={
            <View style={styles.filterInfo}>
              <Text style={styles.filterInfoText}>
                {selectedFilter !== 'All' ? `Filter: ${selectedFilter} . ` : ''}
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'name' ? 'A-Z' : 'Accuracy'}
                {' . '}
                View: {viewMode === 'list' ? 'List' : 'Detailed'}
              </Text>
            </View>
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Ionicons 
            name={activeTab === 'active' ? 'document-text-outline' : activeTab === 'saved' ? 'bookmark-outline' : 'archive-outline'} 
            size={60} 
            color={colors.secondary} 
          />
          <Text style={styles.emptyText}>
            {activeTab === 'active' ? 'No active scans' : activeTab === 'saved' ? 'No saved scans' : 'No archived scans'}
          </Text>
          <Text style={styles.emptySubtext}>
            {activeTab === 'active' 
              ? 'Your scan results will appear here' 
              : activeTab === 'saved'
              ? 'Save scans to access them quickly'
              : 'Archived scans will appear here'}
          </Text>
        </View>
      )}

      {renderFilterModal()}
      {renderDetailModal()}
      {renderNotesModal()}
    </SafeAreaView>
  );
};

// Styles following the design system
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  header: {
    width: '100%',
    minHeight: HEADER_HEIGHT,
    backgroundColor: colors.surface,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors['outline-variant'],
  },
  headerText: {
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerIconButton: {
    padding: spacing.xs,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: colors['surface-container-low'],
    margin: spacing.md,
    borderRadius: rounded.md,
    padding: spacing.xs,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    borderRadius: rounded.DEFAULT,
  },
  toggleButtonActive: {
    backgroundColor: colors.primary,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-surface-variant'],
  },
  toggleTextActive: {
    color: colors['on-primary'],
  },
  toggleCount: {
    fontSize: 12,
    fontWeight: '400',
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 100, // Added padding for tab bar
  },
  filterInfo: {
    paddingHorizontal: spacing.xs,
    paddingBottom: spacing.sm,
  },
  filterInfoText: {
    fontSize: 12,
    color: colors['on-surface-variant'],
    fontWeight: '500',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['on-surface'],
    marginRight: spacing.sm,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors['outline-variant'],
  },
  cardWrapper: {
    marginBottom: spacing.sm,
  },
  historyCard: {
    backgroundColor: colors['surface-container-low'],
    borderRadius: rounded.DEFAULT,
    padding: spacing.sm,
    shadowColor: 'rgba(93, 64, 55, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  archivedCard: {
    opacity: 0.7,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageContainer: {
    width: 70,
    height: 70,
    borderRadius: rounded.DEFAULT,
    overflow: 'hidden',
    marginRight: spacing.sm,
    backgroundColor: colors.secondary,
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
    justifyContent: 'space-between',
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors['on-surface'],
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 4,
  },
  savedBadge: {
    backgroundColor: colors.primary,
    width: 20,
    height: 20,
    borderRadius: rounded.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  archivedBadge: {
    backgroundColor: colors['on-surface-variant'],
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: rounded.sm,
  },
  archivedBadgeText: {
    fontSize: 8,
    color: colors['on-primary'],
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  historySubtitle: {
    fontSize: 12,
    color: colors['on-surface-variant'],
    fontWeight: '500',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  accuracyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    minWidth: 100,
  },
  accuracyBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors['outline-variant'],
    borderRadius: 3,
    overflow: 'hidden',
    maxWidth: 100,
  },
  accuracyBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  accuracyHigh: { backgroundColor: '#27AE60' },
  accuracyMedium: { backgroundColor: '#F39C12' },
  accuracyLow: { backgroundColor: '#E74C3C' },
  accuracyText: {
    fontSize: 10,
    color: colors['on-surface-variant'],
    fontWeight: '600',
    minWidth: 35,
  },
  typeBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: rounded.full,
  },
  typeBadgeText: {
    fontSize: 9,
    color: colors['on-primary'],
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  viralBadge: { backgroundColor: '#E74C3C' },
  fungalBadge: { backgroundColor: '#F39C12' },
  bacterialBadge: { backgroundColor: '#3498DB' },
  pestBadge: { backgroundColor: '#27AE60' },
  healthyBadge: { backgroundColor: '#2ECC71' },
  extraRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  historyExtra: {
    fontSize: 10,
    color: colors.outline,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    padding: spacing.xs,
  },
  // Detailed View Styles
  detailedCardWrapper: {
    marginBottom: spacing.md,
  },
  detailedCard: {
    backgroundColor: colors['surface-container-low'],
    borderRadius: rounded.DEFAULT,
    overflow: 'hidden',
    shadowColor: 'rgba(93, 64, 55, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailedImage: {
    width: '100%',
    height: 160,
  },
  detailedContent: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['on-surface'],
    flex: 1,
  },
  detailedSubtitle: {
    fontSize: 13,
    color: colors['on-surface-variant'],
    fontWeight: '500',
  },
  detailedDescription: {
    fontSize: 12,
    color: colors.outline,
    lineHeight: 18,
  },
  detailedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: colors['surface-container'],
    borderRadius: rounded.DEFAULT,
    padding: spacing.sm,
    marginTop: spacing.xs,
  },
  detailedStat: {
    alignItems: 'center',
    gap: 2,
  },
  detailedStatLabel: {
    fontSize: 10,
    color: colors['on-surface-variant'],
    fontWeight: '500',
  },
  detailedStatValue: {
    fontSize: 13,
    fontWeight: '600',
    color: colors['on-surface'],
  },
  detailedAccuracyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    width: '100%',
  },
  detailedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  detailedActionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  detailedActionButton: {
    padding: spacing.xs,
  },
  // Empty State
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors['on-surface'],
    marginTop: spacing.md,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors['on-surface-variant'],
    marginTop: spacing.xs,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.surface,
    borderRadius: rounded.xl,
    padding: spacing.lg,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
    paddingBottom: spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: colors['outline-variant'],
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  modalCloseButton: {
    padding: spacing.xs,
  },
  modalSection: {
    marginBottom: spacing.md,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-surface'],
    marginBottom: spacing.sm,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  filterChip: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.md,
    borderRadius: rounded.full,
    backgroundColor: colors['surface-container-low'],
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterChipText: {
    fontSize: 12,
    color: colors['on-surface'],
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: colors['on-primary'],
  },
  sortOptions: {
    gap: spacing.xs,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: rounded.DEFAULT,
    backgroundColor: colors['surface-container-low'],
  },
  sortOptionActive: {
    backgroundColor: colors['surface-container'],
    borderWidth: 1,
    borderColor: colors.secondary,
  },
  sortOptionText: {
    fontSize: 13,
    color: colors['on-surface'],
  },
  sortOptionTextActive: {
    color: colors.secondary,
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: rounded.DEFAULT,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  applyButtonText: {
    color: colors['on-primary'],
    fontSize: 16,
    fontWeight: '700',
  },
  resetButton: {
    backgroundColor: 'transparent',
    paddingVertical: spacing.sm,
    borderRadius: rounded.DEFAULT,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  resetButtonText: {
    color: colors['on-surface-variant'],
    fontSize: 14,
    fontWeight: '600',
  },
  // Detail Modal
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: rounded.xl,
    borderTopRightRadius: rounded.xl,
    padding: spacing.lg,
    maxHeight: '90%',
    minHeight: '70%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  detailCloseButton: {
    padding: spacing.xs,
  },
  detailExportButton: {
    padding: spacing.xs,
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  detailScrollContent: {
    paddingBottom: spacing.lg,
  },
  detailImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: rounded.DEFAULT,
    overflow: 'hidden',
    marginBottom: spacing.md,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailTypeBadge: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: rounded.full,
  },
  detailTypeBadgeText: {
    fontSize: 12,
    color: colors['on-primary'],
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailDiseaseName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors['on-surface'],
    marginBottom: spacing.xs,
  },
  detailSubtitle: {
    fontSize: 14,
    color: colors['on-surface-variant'],
    marginBottom: spacing.md,
  },
  detailStatsRow: {
    flexDirection: 'row',
    backgroundColor: colors['surface-container-low'],
    borderRadius: rounded.DEFAULT,
    padding: spacing.md,
    marginBottom: spacing.md,
    justifyContent: 'space-around',
  },
  detailStat: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  detailStatLabel: {
    fontSize: 11,
    color: colors['on-surface-variant'],
    marginTop: 2,
  },
  detailStatDivider: {
    width: 1,
    backgroundColor: colors['outline-variant'],
  },
  detailSeverityDot: {
    width: 10,
    height: 10,
    borderRadius: rounded.full,
    marginBottom: spacing.xs,
  },
  detailSection: {
    marginBottom: spacing.md,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.secondary,
  },
  detailSectionText: {
    fontSize: 14,
    color: colors['on-surface'],
    lineHeight: 22,
  },
  hasNotes: {
    color: colors['on-surface'],
  },
  noNotes: {
    color: colors['on-surface-variant'],
    fontStyle: 'italic',
  },
  // Notes Modal
  notesModalContent: {
    maxHeight: '60%',
  },
  notesForText: {
    fontSize: 14,
    color: colors['on-surface'],
    marginBottom: spacing.sm,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: colors['surface-container-low'],
    borderRadius: rounded.DEFAULT,
    padding: spacing.md,
    minHeight: 150,
    fontSize: 14,
    color: colors['on-surface'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    textAlignVertical: 'top',
  },
  notesActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  notesButton: {
    flex: 1,
    paddingVertical: spacing.sm,
    borderRadius: rounded.DEFAULT,
    alignItems: 'center',
  },
  notesCancelButton: {
    backgroundColor: colors['surface-container-low'],
  },
  notesSaveButton: {
    backgroundColor: colors.primary,
  },
  notesCancelText: {
    color: colors['on-surface'],
    fontWeight: '600',
  },
  notesSaveText: {
    color: colors['on-primary'],
    fontWeight: '600',
  },
});

export default HistoryScreen;