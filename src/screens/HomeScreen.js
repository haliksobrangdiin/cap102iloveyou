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
  Modal,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const recipes = [
  {
    id: '1',
    image: require('../assets/CassavaCake.png'),
    title: 'Cassava Cake with Custard Toppings',
    description: 'made with grated cassava and coconut milk. Soft and moist with a creamy flan topping, this classic Filipino treat is the ultimate snack or dessert.',
    ingredients: [
      '2 cups grated cassava',
      '1 can coconut milk',
      '1 can condensed milk',
      '3 eggs',
      '1 cup sugar',
      '1 tsp vanilla extract',
      'Butter for greasing',
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Mix all ingredients together in a large bowl.',
      'Pour mixture into greased baking pan.',
      'Bake for 45-50 minutes until golden brown.',
      'Let cool before serving.',
    ],
    prepTime: '15 minutes',
    cookTime: '50 minutes',
    servings: '8-10 servings',
  },
  // ... keep all your recipe data
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const scanScale = useState(new Animated.Value(1))[0];

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipePress = (recipe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  // Pulse animation for scan button
  const startPulse = () => {
    Animated.sequence([
      Animated.timing(scanScale, {
        toValue: 1.03,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(scanScale, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start(() => startPulse());
  };

  React.useEffect(() => {
    startPulse();
  }, []);

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setModalVisible(false);
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#5C3D2E" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Recipe Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <Image source={selectedRecipe.image} style={styles.modalImage} resizeMode="cover" />
              
              <Text style={styles.modalRecipeTitle}>{selectedRecipe.title}</Text>
              <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>

              <View style={styles.modalInfoRow}>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="time-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>Prep: {selectedRecipe.prepTime}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="flame-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>Cook: {selectedRecipe.cookTime}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="people-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>{selectedRecipe.servings}</Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Ingredients</Text>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={styles.modalBullet} />
                    <Text style={styles.modalListItemText}>{ingredient}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Instructions</Text>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={[styles.modalBullet, styles.modalNumberBullet]}>
                      <Text style={styles.modalNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.modalListItemText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Greeting */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.avatarContainer}>
              <Image 
                source={require('../assets/logo.png')} 
                style={styles.avatar}
                resizeMode="cover"
              />
            </View>
            <View style={styles.headerTextContainer}>
              <Text style={styles.greetingText}>Welcome back</Text>
              <Text style={styles.headerTitle}>RootCare</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Ionicons name="notifications-outline" size={24} color="#0D631B" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Greeting & Weather */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextBlock}>
            <Text style={styles.greetingTitle}>Good morning, Farmer!</Text>
            <Text style={styles.greetingSubtitle}>Your crops are thriving today.</Text>
          </View>
          <View style={styles.weatherCard}>
            <Ionicons name="sunny" size={24} color="#774C00" />
            <Text style={styles.weatherTemp}>28°C</Text>
            <Text style={styles.weatherLabel}>Sunny</Text>
          </View>
        </View>

        {/* Main CTA: Scan Leaf */}
        <Animated.View style={[styles.scanCard, { transform: [{ scale: scanScale }] }]}>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
              navigation.navigate('Scanner');
            }}
            activeOpacity={0.9}
          >
            <View style={styles.scanCardContent}>
              <View style={styles.scanIconContainer}>
                <Ionicons name="scan-outline" size={32} color="#2E7D32" />
              </View>
              <View style={styles.scanTextContainer}>
                <Text style={styles.scanTitle}>Scan Your Crop</Text>
                <Text style={styles.scanDescription}>
                  AI-powered disease detection for cassava &amp; roots
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        </Animated.View>

        {/* Bento Grid Quick Actions */}
        <View style={styles.bentoGrid}>
          {/* Marketplace Card */}
          <TouchableOpacity 
            style={[styles.bentoCard, styles.marketplaceCard]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Navigate to marketplace
            }}
            activeOpacity={0.8}
          >
            <View style={styles.bentoCardHeader}>
              <View style={styles.bentoIconContainer}>
                <Ionicons name="storefront-outline" size={20} color="#7A5649" />
              </View>
              <Text style={styles.bentoBadge}>+2.4%</Text>
            </View>
            <View style={styles.bentoCardFooter}>
              <Text style={styles.bentoLabel}>Marketplace</Text>
              <Text style={styles.bentoValue}>Cassava Price</Text>
              <Text style={styles.bentoPrice}>
                $1.45 <Text style={styles.bentoPriceUnit}>/ kg</Text>
              </Text>
            </View>
          </TouchableOpacity>

          {/* Weather Alert Card */}
          <TouchableOpacity 
            style={[styles.bentoCard, styles.weatherAlertCard]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              // Navigate to weather
            }}
            activeOpacity={0.8}
          >
            <View style={styles.bentoCardHeader}>
              <View style={styles.weatherAlertIconContainer}>
                <Ionicons name="cloud-done-outline" size={20} color="#FFF8F6" />
              </View>
            </View>
            <View style={styles.bentoCardFooter}>
              <Text style={styles.weatherAlertLabel}>Weather Alerts</Text>
              <Text style={styles.weatherAlertValue}>Perfect Conditions</Text>
              <Text style={styles.bentoDescription}>
                Ideal for fertilizer application today.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Crop Health Summary */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthTitle}>Overall Health</Text>
            <Text style={styles.healthStatus}>85% Stable</Text>
          </View>
          <View style={styles.healthContent}>
            <View style={styles.healthRing}>
              <View style={styles.healthRingPlaceholder}>
                <Text style={styles.healthRingText}>85%</Text>
              </View>
            </View>
            <View style={styles.healthStats}>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Total Fields</Text>
                <Text style={styles.healthStatValue}>3 Fields</Text>
              </View>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Area Coverage</Text>
                <Text style={styles.healthStatValue}>12.4 Acres</Text>
              </View>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Biological Risk</Text>
                <Text style={[styles.healthStatValue, styles.healthStatLow]}>Low</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <View style={styles.activityHeader}>
            <Text style={styles.activityTitle}>Recent Activity</Text>
            <TouchableOpacity>
              <Text style={styles.activityViewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.activityList}>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, styles.activityIconGreen]}>
                <Ionicons name="analytics-outline" size={20} color="#0D631B" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityItemTitle}>Last Scan: Healthy</Text>
                <Text style={styles.activityItemSubtitle}>Field A • 2 hours ago</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#707A6C" />
            </View>
            <View style={styles.activityItem}>
              <View style={[styles.activityIcon, styles.activityIconBeige]}>
                <Ionicons name="cash-outline" size={20} color="#7A5649" />
              </View>
              <View style={styles.activityContent}>
                <Text style={styles.activityItemTitle}>Market Sale: +$120</Text>
                <Text style={styles.activityItemSubtitle}>Processed Tubers • Yesterday</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#707A6C" />
            </View>
          </View>
        </View>
      </ScrollView>

      {renderRecipeModal()}
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 80;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  // ========== HEADER ==========
  header: {
    width: '100%',
    backgroundColor: 'rgba(255, 248, 246, 0.8)',
    backdropFilter: 'blur(20px)',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191, 202, 186, 0.3)',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#A3F69C',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  headerTextContainer: {
    flexDirection: 'column',
  },
  greetingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#40493D',
    fontFamily: 'OpenSans_500Medium',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#0D631B',
    fontFamily: 'Montserrat_600SemiBold',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ========== GREETING SECTION ==========
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  greetingTextBlock: {
    flex: 1,
    paddingRight: 12,
  },
  greetingTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#2C160E',
    fontFamily: 'Montserrat_700Bold',
  },
  greetingSubtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: '#40493D',
    fontFamily: 'OpenSans_400Regular',
  },
  weatherCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    minWidth: 72,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherTemp: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'Montserrat_600SemiBold',
  },
  weatherLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#707A6C',
    fontFamily: 'OpenSans_500Medium',
  },
  // ========== SCAN CARD ==========
  scanCard: {
    marginBottom: 24,
  },
  scanButton: {
    backgroundColor: '#2E7D32',
    borderRadius: 32,
    padding: 24,
    overflow: 'hidden',
    shadowColor: '#0D631B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 6,
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  scanIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
  },
  scanDescription: {
    fontSize: 16,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'OpenSans_400Regular',
  },
  // ========== BENTO GRID ==========
  bentoGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  bentoCard: {
    flex: 1,
    borderRadius: 24,
    padding: 20,
    minHeight: 160,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    justifyContent: 'space-between',
  },
  marketplaceCard: {
    backgroundColor: '#FFDBCF',
  },
  weatherAlertCard: {
    backgroundColor: '#986200',
  },
  bentoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(122, 86, 73, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherAlertIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 248, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0D631B',
    fontFamily: 'OpenSans_700Bold',
  },
  bentoCardFooter: {
    gap: 2,
  },
  bentoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#7A5649',
    fontFamily: 'OpenSans_600SemiBold',
  },
  bentoValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'Montserrat_600SemiBold',
  },
  weatherAlertLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 248, 246, 0.85)',
    fontFamily: 'OpenSans_600SemiBold',
  },
  weatherAlertValue: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Montserrat_600SemiBold',
  },
  bentoPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0D631B',
    fontFamily: 'OpenSans_700Bold',
  },
  bentoPriceUnit: {
    fontSize: 12,
    fontWeight: '400',
    color: '#40493D',
    fontFamily: 'OpenSans_400Regular',
  },
  bentoDescription: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'OpenSans_400Regular',
  },
  // ========== HEALTH CARD ==========
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  healthHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  healthTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'Montserrat_600SemiBold',
  },
  healthStatus: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D631B',
    fontFamily: 'OpenSans_700Bold',
  },
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 24,
  },
  healthRing: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthRingPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  healthRingText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D631B',
    fontFamily: 'Montserrat_700Bold',
  },
  healthStats: {
    flex: 1,
    gap: 8,
  },
  healthStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthStatLabel: {
    fontSize: 14,
    fontWeight: '400',
    color: '#40493D',
    fontFamily: 'OpenSans_400Regular',
  },
  healthStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'OpenSans_600SemiBold',
  },
  healthStatLow: {
    color: '#0D631B',
  },
  // ========== ACTIVITY SECTION ==========
  activitySection: {
    marginBottom: 24,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'Montserrat_600SemiBold',
  },
  activityViewAll: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0D631B',
    fontFamily: 'OpenSans_600SemiBold',
  },
  activityList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1ED',
    padding: 16,
    borderRadius: 16,
    gap: 16,
  },
  activityIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activityIconGreen: {
    backgroundColor: '#A3F69C',
  },
  activityIconBeige: {
    backgroundColor: '#FFDBCF',
  },
  activityContent: {
    flex: 1,
  },
  activityItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C160E',
    fontFamily: 'OpenSans_600SemiBold',
  },
  activityItemSubtitle: {
    fontSize: 12,
    fontWeight: '500',
    color: '#40493D',
    fontFamily: 'OpenSans_500Medium',
  },
  // ========== SCROLL CONTENT ==========
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 90, // Added bottom padding for tab bar
  },
  // ========== RECIPE MODAL ==========
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5EDE3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalRecipeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5C3D2E',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C77A58',
    marginBottom: 10,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  modalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C77A58',
    marginTop: 7,
  },
  modalNumberBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalNumberText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalListItemText: {
    flex: 1,
    fontSize: 13,
    color: '#4A3A2A',
    lineHeight: 20,
  },
});

export default HomeScreen;