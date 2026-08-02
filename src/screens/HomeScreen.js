import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
  Platform,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

// ===== IMPORT YOUR BACKGROUND IMAGES =====
import backgroundImage from '../assets/screen.png';
import weatherImage from '../assets/weather.png';
import marketImage from '../assets/market.png';
import alertsImage from '../assets/alerts.png';

const HomeScreen = ({ navigation }) => {
  const scanScale = useState(new Animated.Value(1))[0];
  
  // ===== DYNAMIC HEALTH DATA =====
  const [healthData, setHealthData] = useState({
    percentage: 85,
    status: 'Stable',
    fields: 3,
    area: '12.4',
    risk: 'Low',
  });

  const startPulse = () => {
    Animated.sequence([
      Animated.timing(scanScale, {
        toValue: 1.02,
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

  // ===== DYNAMIC PROGRESS CIRCLE COMPONENT =====
  const ProgressCircle = ({ percentage, size = 80, strokeWidth = 6, color = '#0D631B' }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = (percentage / 100) * circumference;
    const halfCircle = circumference / 2;

    // Determine status color based on percentage
    const getColor = () => {
      if (percentage >= 80) return '#0D631B';  // Green - Healthy
      if (percentage >= 60) return '#F59E0B';  // Yellow - Moderate
      if (percentage >= 40) return '#F97316';  // Orange - Warning
      return '#DC2626';  // Red - Critical
    };

    const ringColor = color || getColor();

    return (
      <View style={[styles.healthRing, { width: size, height: size, borderRadius: size / 2 }]}>
        <View style={[styles.healthRingBackground, { width: size, height: size, borderRadius: size / 2 }]}>
          {/* Background circle (gray track) */}
          <View
            style={[
              styles.ringTrack,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: '#E8F5E9',
              },
            ]}
          />
          
          {/* Progress circle - Left half */}
          {percentage > 50 && (
            <View
              style={[
                styles.ringHalf,
                styles.ringLeft,
                {
                  width: size,
                  height: size,
                  borderRadius: size / 2,
                  borderWidth: strokeWidth,
                  borderColor: ringColor,
                  transform: [{ rotate: `${(percentage - 50) / 50 * 180}deg` }],
                },
              ]}
            />
          )}
          
          {/* Progress circle - Right half */}
          <View
            style={[
              styles.ringHalf,
              styles.ringRight,
              {
                width: size,
                height: size,
                borderRadius: size / 2,
                borderWidth: strokeWidth,
                borderColor: ringColor,
                transform: [{ rotate: `${percentage / 50 * 180}deg` }],
              },
            ]}
          />

          {/* Center circle with text */}
          <View
            style={[
              styles.healthRingCenter,
              {
                width: size - strokeWidth * 2 - 4,
                height: size - strokeWidth * 2 - 4,
                borderRadius: (size - strokeWidth * 2 - 4) / 2,
              },
            ]}
          >
            <Text style={[styles.healthRingText, { fontSize: size * 0.22 }]}>
              {percentage}%
            </Text>
          </View>
        </View>
      </View>
    );
  };

  // ===== DYNAMIC STATUS TEXT =====
  const getStatusColor = (percentage) => {
    if (percentage >= 80) return '#0D631B';
    if (percentage >= 60) return '#F59E0B';
    if (percentage >= 40) return '#F97316';
    return '#DC2626';
  };

  const getStatusText = (percentage) => {
    if (percentage >= 80) return 'Excellent';
    if (percentage >= 60) return 'Stable';
    if (percentage >= 40) return 'Caution';
    return 'Critical';
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
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
          
          {/* Weather Card with Image */}
          <ImageBackground
            source={weatherImage}
            style={styles.weatherCard}
            imageStyle={styles.weatherCardImage}
            resizeMode="cover"
          >
            <View style={styles.weatherCardOverlay}>
              <Ionicons name="sunny" size={20} color="#FFFFFF" />
              <Text style={styles.weatherTemp}>28°C</Text>
              <Text style={styles.weatherLabel}>Sunny</Text>
            </View>
          </ImageBackground>
        </View>

        {/* Scan Card */}
        <Animated.View style={[styles.scanCard, { transform: [{ scale: scanScale }] }]}>
          <ImageBackground
            source={backgroundImage}
            style={styles.scanCardBackground}
            imageStyle={styles.scanCardImage}
            resizeMode="cover"
          >
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
                  <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
                </View>
                <View style={styles.scanTextContainer}>
                  <Text style={styles.scanTitle}>Scan Your Crop</Text>
                  <Text style={styles.scanDescription}>
                    AI-powered disease detection for cassava &amp; roots
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </ImageBackground>
        </Animated.View>

        {/* Bento Grid Quick Actions */}
        <View style={styles.bentoGrid}>
          {/* Marketplace Card with Image */}
          <TouchableOpacity 
            style={styles.bentoCardWrapper}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              navigation.navigate('Marketplace');
            }}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={marketImage}
              style={[styles.bentoCard, styles.marketplaceCard]}
              imageStyle={styles.bentoCardImage}
              resizeMode="cover"
            >
              <View style={styles.marketplaceOverlay}>
                <View style={styles.bentoCardHeader}>
                  <View style={styles.bentoIconContainer}>
                    <Ionicons name="storefront-outline" size={18} color="#7A5649" />
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
              </View>
            </ImageBackground>
          </TouchableOpacity>

          {/* Weather Alerts Card with Image */}
          <TouchableOpacity 
            style={styles.bentoCardWrapper}
            onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
            activeOpacity={0.8}
          >
            <ImageBackground
              source={alertsImage}
              style={[styles.bentoCard, styles.weatherAlertCard]}
              imageStyle={styles.bentoCardImage}
              resizeMode="cover"
            >
              <View style={styles.weatherAlertOverlay}>
                <View style={styles.bentoCardHeader}>
                  <View style={styles.weatherAlertIconContainer}>
                    <Ionicons name="cloud-done-outline" size={18} color="#FFF8F6" />
                  </View>
                </View>
                <View style={styles.bentoCardFooter}>
                  <Text style={styles.weatherAlertLabel}>Weather Alerts</Text>
                  <Text style={styles.weatherAlertValue}>Perfect Conditions</Text>
                  <Text style={styles.bentoDescription}>
                    Ideal for fertilizer application today.
                  </Text>
                </View>
              </View>
            </ImageBackground>
          </TouchableOpacity>
        </View>

        {/* ===== DYNAMIC HEALTH CARD ===== */}
        <View style={styles.healthCard}>
          <View style={styles.healthHeader}>
            <Text style={styles.healthTitle}>Overall Health</Text>
            <Text 
              style={[
                styles.healthStatus, 
                { color: getStatusColor(healthData.percentage) }
              ]}
            >
              {healthData.percentage}% {getStatusText(healthData.percentage)}
            </Text>
          </View>
          <View style={styles.healthContent}>
            <ProgressCircle 
              percentage={healthData.percentage} 
              size={80} 
              strokeWidth={6}
            />
            <View style={styles.healthStats}>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Total Fields</Text>
                <Text style={styles.healthStatValue}>{healthData.fields} Fields</Text>
              </View>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Area Coverage</Text>
                <Text style={styles.healthStatValue}>{healthData.area} Acres</Text>
              </View>
              <View style={styles.healthStatItem}>
                <Text style={styles.healthStatLabel}>Biological Risk</Text>
                <Text style={[styles.healthStatValue, styles.healthStatLow]}>
                  {healthData.risk}
                </Text>
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
    width: '100%',
    backgroundColor: 'rgba(255, 248, 246, 0.95)',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    gap: 10,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
    fontSize: 10,
    fontWeight: '500',
    color: '#40493D',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0D631B',
  },
  notificationButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // ========== SCROLL CONTENT ==========
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
  // ========== GREETING SECTION ==========
  greetingSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greetingTextBlock: {
    flex: 1,
    paddingRight: 10,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#2C160E',
    marginBottom: 1,
  },
  greetingSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: '#40493D',
  },
  // ========== WEATHER CARD WITH IMAGE ==========
  weatherCard: {
    borderRadius: 14,
    overflow: 'hidden',
    minWidth: 64,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  weatherCardImage: {
    borderRadius: 14,
  },
  weatherCardOverlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  weatherTemp: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  weatherLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  // ========== SCAN CARD ==========
  scanCard: {
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#0D631B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 5,
  },
  scanCardBackground: {
    width: '100%',
    height: 76,
  },
  scanCardImage: {
    borderRadius: 16,
  },
  scanButton: {
    backgroundColor: 'rgba(46, 125, 50, 0.85)',
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
  },
  scanCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  scanIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanTextContainer: {
    flex: 1,
  },
  scanTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 1,
  },
  scanDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  // ========== BENTO GRID ==========
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  // ========== BENTO CARD WRAPPER ==========
  bentoCardWrapper: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  bentoCard: {
    flex: 1,
    minHeight: 110,
    justifyContent: 'center',
  },
  bentoCardImage: {
    borderRadius: 16,
  },
  // ========== MARKETPLACE CARD ==========
  marketplaceOverlay: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 219, 207, 0.78)',
  },
  marketplaceCard: {
    backgroundColor: 'transparent',
  },
  // ========== WEATHER ALERTS CARD ==========
  weatherAlertOverlay: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(152, 98, 0, 0.75)',
  },
  weatherAlertCard: {
    backgroundColor: 'transparent',
  },
  bentoCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bentoIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(122, 86, 73, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  weatherAlertIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 248, 246, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  bentoBadge: {
    fontSize: 10,
    fontWeight: '700',
    color: '#0D631B',
  },
  bentoCardFooter: {
    gap: 1,
  },
  bentoLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#7A5649',
  },
  bentoValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C160E',
  },
  weatherAlertLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 248, 246, 0.85)',
  },
  weatherAlertValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  bentoPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0D631B',
  },
  bentoPriceUnit: {
    fontSize: 10,
    fontWeight: '400',
    color: '#40493D',
  },
  bentoDescription: {
    fontSize: 11,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.85)',
  },
  // ========== HEALTH CARD - DYNAMIC ==========
  healthCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
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
    marginBottom: 14,
  },
  healthTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  healthStatus: {
    fontSize: 13,
    fontWeight: '700',
  },
  healthContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  // ===== DYNAMIC PROGRESS CIRCLE =====
  healthRing: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  healthRingBackground: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  ringTrack: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderStyle: 'solid',
  },
  ringHalf: {
    position: 'absolute',
    top: 0,
    left: 0,
    borderStyle: 'solid',
  },
  ringLeft: {
    borderRightColor: 'transparent',
  },
  ringRight: {
    borderLeftColor: 'transparent',
    transform: [{ rotate: '0deg' }],
  },
  healthRingCenter: {
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  healthRingText: {
    fontWeight: '700',
    color: '#0D631B',
  },
  healthStats: {
    flex: 1,
    gap: 6,
  },
  healthStatItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  healthStatLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#40493D',
  },
  healthStatValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2C160E',
  },
  healthStatLow: {
    color: '#0D631B',
  },
  // ========== ACTIVITY SECTION ==========
  activitySection: {
    marginBottom: 16,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  activityViewAll: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0D631B',
  },
  activityList: {
    gap: 10,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF1ED',
    padding: 14,
    borderRadius: 14,
    gap: 14,
  },
  activityIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
    fontSize: 13,
    fontWeight: '600',
    color: '#2C160E',
  },
  activityItemSubtitle: {
    fontSize: 11,
    fontWeight: '500',
    color: '#40493D',
  },
});

export default HomeScreen;