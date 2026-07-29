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
  Share,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system/legacy';

const HistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = useState('active');
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [notesModalVisible, setNotesModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  const [isExporting, setIsExporting] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'detailed'
  
  const [historyData, setHistoryData] = useState([
    {
      id: '1',
      title: 'Cassava Mosaic Disease',
      subtitle: 'Viral Infection Detected',
      detail: 'Severity: High',
      extra: 'Scanned: Jan 15, 2024 • 2:30 PM',
      image: require('../assets/CassavaMosaic.png'),
      isArchived: false,
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
      extra: 'Scanned: Jan 14, 2024 • 11:15 AM',
      image: require('../assets/BrownSpot.png'),
      isArchived: false,
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
      extra: 'Scanned: Jan 12, 2024 • 9:45 AM',
      image: require('../assets/GreenMite.png'),
      isArchived: false,
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
      extra: 'Scanned: Jan 10, 2024 • 4:20 PM',
      image: require('../assets/HealthyLeaf.png'),
      isArchived: false,
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
      extra: 'Scanned: Jan 8, 2024 • 10:00 AM',
      image: require('../assets/BacterialBlight.png'),
      isArchived: false,
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
      extra: 'Scanned: Jan 5, 2024 • 1:30 PM',
      image: require('../assets/Anthracnose.png'),
      isArchived: false,
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
  ]);

  const diseaseTypes = ['All', 'Viral', 'Fungal', 'Bacterial', 'Pest', 'Healthy'];

  const getFilteredData = () => {
    let filtered = historyData.filter(item => 
      activeTab === 'active' ? !item.isArchived : item.isArchived
    );

    if (selectedFilter !== 'All') {
      filtered = filtered.filter(item => item.diseaseType === selectedFilter);
    }

    if (sortBy === 'newest') {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === 'oldest') {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === 'name') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === 'accuracy') {
      filtered.sort((a, b) => b.accuracy - a.accuracy);
    }

    return filtered;
  };

  const filteredData = getFilteredData();

  const generateReportContent = (item) => {
    return `
============================================
        ROOTCARE - SCAN ANALYSIS REPORT
============================================

DISEASE INFORMATION
-------------------
Disease: ${item.title}
Type: ${item.diseaseType}
Accuracy: ${item.accuracy}%
Severity: ${item.severity}

DESCRIPTION
-----------
${item.description}

SYMPTOMS
--------
${item.symptoms || 'Not specified'}

TREATMENT
---------
${item.treatment}

PREVENTION
----------
${item.prevention}

SCAN DETAILS
------------
Date: ${new Date(item.createdAt).toLocaleString()}
Status: ${item.isArchived ? 'Archived' : 'Active'}

NOTES
-----
${item.notes || 'No notes added'}

============================================
Generated by RootCare - Cassava Disease Detection App
============================================
    `;
  };

  const downloadOnWeb = (content, fileName) => {
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportReport = async (item) => {
    try {
      setIsExporting(true);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

      const reportContent = generateReportContent(item);
      const fileName = `RootCare_Report_${item.title.replace(/\s/g, '_')}_${Date.now()}.txt`;

      if (Platform.OS === 'web') {
        downloadOnWeb(reportContent, fileName);
        Alert.alert('✅ Downloaded', 'Your report has been downloaded successfully!');
        setIsExporting(false);
        return;
      }

      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      await FileSystem.writeAsStringAsync(filePath, reportContent);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/plain',
          dialogTitle: 'Export Scan Report',
          UTI: 'public.plain-text',
        });
      } else {
        await Share.share({
          message: reportContent,
          title: 'RootCare Scan Report',
        });
      }

      Alert.alert('✅ Exported', 'Your report has been exported successfully!');

    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Error', 'Failed to export the report. Please try again.');
    } finally {
      setIsExporting(false);
    }
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
    Alert.alert('✅ Note Saved', 'Your note has been added to this scan.');
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
                return { 
                  ...item, 
                  isArchived: true, 
                  archivedAt: new Date().toISOString() 
                };
              }
              return item;
            });
            
            setHistoryData(newData);
            Alert.alert('✅ Archived', 'Scan has been moved to archive.');
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
                return { 
                  ...item, 
                  isArchived: false, 
                  archivedAt: null 
                };
              }
              return item;
            });
            
            setHistoryData(newData);
            Alert.alert('✅ Restored', 'Scan has been restored to active.');
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
      default: return '#8A7A66';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return styles.accuracyHigh;
    if (accuracy >= 70) return styles.accuracyMedium;
    return styles.accuracyLow;
  };

  // Get date key for grouping
  const getDateKey = (item) => {
    const date = new Date(item.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  };

  // Render section header for date grouping
  const renderSectionHeader = (dateKey) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{dateKey}</Text>
      <View style={styles.sectionHeaderLine} />
    </View>
  );

  // Render List View Item
  const renderListItem = ({ item }) => {
    const isArchived = item.isArchived;

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
                {isArchived && (
                  <View style={styles.archivedBadge}>
                    <Text style={styles.archivedBadgeText}>ARCHIVED</Text>
                  </View>
                )}
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
                {item.notes ? (
                  <Ionicons name="document-text-outline" size={12} color="#C77A58" />
                ) : null}
              </View>
            </View>

            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => isArchived ? handleRestore(item.id) : handleArchive(item.id)}
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
      </TouchableOpacity>
    );
  };

  // Render Detailed Card Item
  const renderDetailedItem = ({ item }) => {
    const isArchived = item.isArchived;

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
              {isArchived && (
                <View style={styles.archivedBadge}>
                  <Text style={styles.archivedBadgeText}>ARCHIVED</Text>
                </View>
              )}
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
              <View style={styles.detailedStat}>
                <Text style={styles.detailedStatLabel}>Date</Text>
                <Text style={styles.detailedStatValue}>
                  {new Date(item.createdAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
            <View style={styles.detailedActions}>
              <View style={[styles.typeBadge, getTypeBadgeStyle(item.diseaseType)]}>
                <Text style={styles.typeBadgeText}>{item.diseaseType}</Text>
              </View>
              <TouchableOpacity 
                style={styles.detailedActionButton}
                onPress={() => isArchived ? handleRestore(item.id) : handleArchive(item.id)}
              >
                <Ionicons 
                  name={isArchived ? 'refresh-outline' : 'archive-outline'} 
                  size={18} 
                  color={isArchived ? '#4CAF50' : '#C77A58'} 
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Main render function with date grouping
  const renderItem = ({ item, index }) => {
    // Check if this is the first item of a new date group
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
        {viewMode === 'list' && renderListItem({ item })}
        {viewMode === 'detailed' && renderDetailedItem({ item })}
      </View>
    );
  };

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
                <Ionicons name="close" size={24} color="#5C3D2E" />
              </TouchableOpacity>
            </View>

            <Text style={styles.notesForText}>
              Notes for: {selectedItem.title}
            </Text>

            <TextInput
              style={styles.notesInput}
              placeholder="Enter your observations, field location, treatment notes..."
              placeholderTextColor="#8A7A66"
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
                <Ionicons name="arrow-back" size={24} color="#5C3D2E" />
              </TouchableOpacity>
              <Text style={styles.detailModalTitle}>Analysis Details</Text>
              <TouchableOpacity 
                style={styles.detailExportButton}
                onPress={() => exportReport(selectedItem)}
                disabled={isExporting}
              >
                {isExporting ? (
                  <ActivityIndicator size="small" color="#C77A58" />
                ) : (
                  <Ionicons name="download-outline" size={24} color="#C77A58" />
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
                    <Ionicons name="create-outline" size={20} color="#C77A58" />
                  </TouchableOpacity>
                </View>
                <Text style={[styles.detailSectionText, selectedItem.notes ? styles.hasNotes : styles.noNotes]}>
                  {selectedItem.notes || 'No notes added. Tap the pencil icon to add notes.'}
                </Text>
              </View>

              <View style={styles.detailFooter}>
                <Text style={styles.detailFooterText}>
                  Scanned: {selectedItem.extra}
                </Text>
                {selectedItem.isArchived && (
                  <Text style={styles.detailFooterText}>
                    Archived: {new Date(selectedItem.archivedAt).toLocaleDateString()}
                  </Text>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

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
              <Ionicons name="close" size={24} color="#5C3D2E" />
            </TouchableOpacity>
          </View>

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
                    <Ionicons name="checkmark" size={18} color="#C77A58" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <TouchableOpacity
            style={styles.applyButton}
            onPress={() => setFilterModalVisible(false)}
          >
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerText}>SCAN HISTORY</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.viewModeButton}
            onPress={() => {
              const nextMode = viewMode === 'list' ? 'detailed' : 'list';
              setViewMode(nextMode);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Ionicons 
              name={viewMode === 'list' ? 'list-outline' : 'apps-outline'} 
              size={22} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons name="options-outline" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            activeTab === 'active' && styles.toggleButtonActive,
          ]}
          onPress={() => setActiveTab('active')}
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
          onPress={() => setActiveTab('archived')}
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

      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          key={viewMode} // Force re-render when view mode changes
          ListHeaderComponent={
            <View style={styles.filterInfo}>
              <Text style={styles.filterInfoText}>
                {selectedFilter !== 'All' ? `Filter: ${selectedFilter} • ` : ''}
                Sort: {sortBy === 'newest' ? 'Newest' : sortBy === 'oldest' ? 'Oldest' : sortBy === 'name' ? 'A-Z' : 'Accuracy'}
                {' • '}
                View: {viewMode === 'list' ? 'List' : 'Detailed'}
              </Text>
            </View>
          }
        />
      ) : (
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
      )}

      {renderFilterModal()}
      {renderDetailModal()}
      {renderNotesModal()}
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  viewModeButton: {
    padding: 4,
  },
  filterButton: {
    padding: 4,
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
  filterInfo: {
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  filterInfoText: {
    fontSize: 12,
    color: '#8A7A66',
    fontWeight: '500',
  },
  // Section Header Styles
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C3D2E',
    marginRight: 8,
  },
  sectionHeaderLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(199, 122, 88, 0.3)',
  },
  // List View Styles
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
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 4,
  },
  accuracyContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 100,
  },
  accuracyBarTrack: {
    flex: 1,
    height: 6,
    backgroundColor: '#D2C4B0',
    borderRadius: 3,
    overflow: 'hidden',
    maxWidth: 100,
  },
  accuracyBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  accuracyHigh: {
    backgroundColor: '#27AE60',
  },
  accuracyMedium: {
    backgroundColor: '#F39C12',
  },
  accuracyLow: {
    backgroundColor: '#E74C3C',
  },
  accuracyText: {
    fontSize: 10,
    color: '#555555',
    fontWeight: '600',
    minWidth: 35,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  typeBadgeText: {
    fontSize: 9,
    color: '#FFFFFF',
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
    gap: 4,
  },
  historyExtra: {
    fontSize: 10,
    color: '#888888',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  // Detailed View Styles
  detailedCardWrapper: {
    marginBottom: 14,
  },
  detailedCard: {
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  detailedImage: {
    width: '100%',
    height: 160,
  },
  detailedContent: {
    padding: 14,
    gap: 6,
  },
  detailedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailedTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222',
    flex: 1,
  },
  detailedSubtitle: {
    fontSize: 13,
    color: '#444444',
    fontWeight: '500',
  },
  detailedDescription: {
    fontSize: 12,
    color: '#666666',
    lineHeight: 18,
  },
  detailedFooter: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(199, 122, 88, 0.1)',
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
  },
  detailedStat: {
    alignItems: 'center',
    gap: 2,
  },
  detailedStatLabel: {
    fontSize: 10,
    color: '#8A7A66',
    fontWeight: '500',
  },
  detailedStatValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  detailedAccuracyBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    width: '100%',
  },
  detailedActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  detailedActionButton: {
    padding: 6,
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
    color: '#5C3D2E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A7A66',
    marginTop: 8,
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5EDE3',
    borderRadius: 20,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 122, 88, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalSection: {
    marginBottom: 20,
  },
  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#5C3D2E',
    marginBottom: 10,
  },
  filterOptions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  filterChip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    backgroundColor: '#E4D3BB',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  filterChipActive: {
    backgroundColor: '#C77A58',
    borderColor: '#C77A58',
  },
  filterChipText: {
    fontSize: 12,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
  sortOptions: {
    gap: 8,
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#E4D3BB',
  },
  sortOptionActive: {
    backgroundColor: '#D2BEA3',
    borderWidth: 1,
    borderColor: '#C77A58',
  },
  sortOptionText: {
    fontSize: 13,
    color: '#5C3D2E',
  },
  sortOptionTextActive: {
    color: '#C77A58',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#C77A58',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  applyButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  detailModalContent: {
    backgroundColor: '#F5EDE3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  detailModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailCloseButton: {
    padding: 4,
  },
  detailExportButton: {
    padding: 4,
  },
  detailModalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  detailScrollContent: {
    paddingBottom: 20,
  },
  detailImageContainer: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
  },
  detailImage: {
    width: '100%',
    height: '100%',
  },
  detailTypeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  detailTypeBadgeText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  detailDiseaseName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5C3D2E',
    marginBottom: 4,
  },
  detailSubtitle: {
    fontSize: 14,
    color: '#8A7A66',
    marginBottom: 16,
  },
  detailStatsRow: {
    flexDirection: 'row',
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    justifyContent: 'space-around',
  },
  detailStat: {
    alignItems: 'center',
  },
  detailStatValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  detailStatLabel: {
    fontSize: 11,
    color: '#8A7A66',
    marginTop: 2,
  },
  detailStatDivider: {
    width: 1,
    backgroundColor: 'rgba(199, 122, 88, 0.3)',
  },
  detailSeverityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 4,
  },
  detailSection: {
    marginBottom: 16,
  },
  detailSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailSectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#C77A58',
  },
  detailSectionText: {
    fontSize: 14,
    color: '#4A3A2A',
    lineHeight: 22,
  },
  hasNotes: {
    color: '#4A3A2A',
  },
  noNotes: {
    color: '#8A7A66',
    fontStyle: 'italic',
  },
  detailFooter: {
    marginTop: 8,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(199, 122, 88, 0.2)',
  },
  detailFooterText: {
    fontSize: 12,
    color: '#8A7A66',
    marginBottom: 4,
  },
  notesModalContent: {
    maxHeight: '60%',
  },
  notesForText: {
    fontSize: 14,
    color: '#5C3D2E',
    marginBottom: 12,
    fontWeight: '500',
  },
  notesInput: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    minHeight: 150,
    fontSize: 14,
    color: '#333333',
    borderWidth: 1,
    borderColor: '#E4D3BB',
    textAlignVertical: 'top',
  },
  notesActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  notesButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  notesCancelButton: {
    backgroundColor: '#E4D3BB',
  },
  notesSaveButton: {
    backgroundColor: '#C77A58',
  },
  notesCancelText: {
    color: '#5C3D2E',
    fontWeight: '600',
  },
  notesSaveText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});

export default HistoryScreen;