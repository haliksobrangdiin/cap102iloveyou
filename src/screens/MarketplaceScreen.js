// screens/MarketplaceScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  TextInput,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Sample marketplace data - using placeholder images
const marketItems = [
  {
    id: '1',
    name: 'Cassava Tubers',
    price: '$1.45',
    unit: '/ kg',
    image: null, // Will use placeholder
    seller: 'GreenFarm Co.',
    rating: 4.8,
    orders: 234,
    badge: 'Organic',
  },
  {
    id: '2',
    name: 'Cassava Chips',
    price: '$3.20',
    unit: '/ bag',
    image: null,
    seller: 'Sunrise Harvest',
    rating: 4.5,
    orders: 189,
    badge: 'Premium',
  },
  {
    id: '3',
    name: 'Cassava Flour',
    price: '$2.80',
    unit: '/ kg',
    image: null,
    seller: 'RootCare Direct',
    rating: 4.9,
    orders: 312,
    badge: 'Best Seller',
  },
  {
    id: '4',
    name: 'Cassava Starch',
    price: '$4.50',
    unit: '/ kg',
    image: null,
    seller: 'AgriTech Supplies',
    rating: 4.3,
    orders: 156,
    badge: 'New',
  },
];

const MarketplaceScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Fresh', 'Processed', 'Premium', 'Organic'];

  const filteredItems = marketItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.marketItem}
      activeOpacity={0.8}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        // Navigate to item detail
      }}
    >
      {/* Placeholder image with icon */}
      <View style={styles.itemImagePlaceholder}>
        <Ionicons name="leaf-outline" size={40} color="#0D631B" />
      </View>
      <View style={styles.itemBadge}>
        <Text style={styles.itemBadgeText}>{item.badge}</Text>
      </View>
      <View style={styles.itemInfo}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSeller}>{item.seller}</Text>
        <View style={styles.itemMeta}>
          <View style={styles.itemRating}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.itemRatingText}>{item.rating}</Text>
          </View>
          <Text style={styles.itemOrders}>{item.orders} orders</Text>
        </View>
        <View style={styles.itemPriceRow}>
          <Text style={styles.itemPrice}>{item.price}</Text>
          <Text style={styles.itemUnit}>{item.unit}</Text>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#2C160E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
          <Ionicons name="cart-outline" size={24} color="#2C160E" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#707A6C" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#707A6C"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#707A6C" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedCategory(category);
            }}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Market Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#BFCABA" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  // ========== HEADER ==========
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191, 202, 186, 0.3)',
    backgroundColor: 'rgba(255, 248, 246, 0.95)',
  },
  backButton: {
    padding: 4,
    minWidth: 40,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C160E',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerAction: {
    padding: 4,
    minWidth: 40,
    alignItems: 'flex-end',
  },
  // ========== SEARCH ==========
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#2C160E',
    padding: 0,
  },
  // ========== CATEGORIES ==========
  categoriesContainer: {
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
    marginRight: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#0D631B',
    borderColor: '#0D631B',
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#40493D',
  },
  categoryTextActive: {
    color: '#FFFFFF',
  },
  // ========== MARKET ITEMS ==========
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  marketItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
  },
  itemImagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0D631B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  itemBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C160E',
  },
  itemSeller: {
    fontSize: 12,
    color: '#707A6C',
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRatingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2C160E',
  },
  itemOrders: {
    fontSize: 11,
    color: '#707A6C',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D631B',
  },
  itemUnit: {
    fontSize: 12,
    color: '#707A6C',
    marginLeft: 4,
  },
  addButton: {
    marginLeft: 'auto',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D631B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ========== EMPTY STATE ==========
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C160E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#707A6C',
    marginTop: 4,
  },
});

export default MarketplaceScreen;