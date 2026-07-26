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
  // Sample history data - replace with your actual data
  const [historyData] = useState([
    {
      id: '1',
      title: 'SADHBASNIASIDASNINMASN',
      subtitle: 'UHASHUASHUNAISANLUNDAX',
      detail: 'NAXSSA',
      extra: 'UHASHNUSASNHSNSASAXASNU AXS',
    },
    {
      id: '2',
      title: 'SADHBASNIASIDASNINMASN',
      subtitle: 'UHASHUASHUNAISANLUNDAX',
      detail: 'NAXSSA',
      extra: 'UHASHNUSASNHSNSASAXASNU AXS',
    },
    {
      id: '3',
      title: 'SADHBASNIASIDASNINMASN',
      subtitle: 'UHASHUASHUNAISANLUNDAX',
      detail: 'NAXSSA',
      extra: 'UHASHNUSASNHSNSASAXASNU AXS',
    },
    {
      id: '4',
      title: 'SADHBASNIASIDASNINMASN',
      subtitle: 'UHASHUASHUNAISANLUNDAX',
      detail: 'NAXSSA',
      extra: 'UHASHNUSASNHSNSASAXASNU AXS',
    },
  ]);

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity style={styles.historyCard} activeOpacity={0.7}>
      <View style={styles.historyContent}>
        <Text style={styles.historyTitle}>{item.title}</Text>
        <Text style={styles.historySubtitle}>{item.subtitle}</Text>
        <Text style={styles.historyDetail}>{item.detail}</Text>
        <Text style={styles.historyExtra}>{item.extra}</Text>
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

      {/* REMOVED: Floating bottom navigation bar - Now handled by MainTabs */}
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
    paddingBottom: 20, // Changed from BOTTOM_BAR_HEIGHT + 20
  },
  historyCard: {
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  historyContent: {
    gap: 4,
  },
  historyTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    marginBottom: 2,
  },
  historySubtitle: {
    fontSize: 13,
    color: '#444444',
    marginBottom: 2,
  },
  historyDetail: {
    fontSize: 12,
    color: '#555555',
    fontWeight: '600',
    marginBottom: 2,
  },
  historyExtra: {
    fontSize: 12,
    color: '#666666',
  },
  // REMOVED: All bottomBar, tabItem, tabLabel, fabSlot, fabButton, fabLabel styles
});

export default HistoryScreen;