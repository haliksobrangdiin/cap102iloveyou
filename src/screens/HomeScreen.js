// HomeScreen.js
import React, { useState, useEffect } from 'react';
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
  Modal,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useNavigation } from '@react-navigation/native';
import { supabase } from '../utils/supabaseClient';

const { width, height } = Dimensions.get('window');

// ===== IMPORT YOUR BACKGROUND IMAGES =====
import backgroundImage from '../assets/screen.png';
import weatherImage from '../assets/weather.png';
import marketImage from '../assets/market.png';
import alertsImage from '../assets/alerts.png';

// ===== STATIC CONTENT =====
const weatherAlerts = [
  {
    id: '1',
    type: 'Rain Advisory',
    severity: 'Moderate',
    icon: 'rainy',
    title: 'Light Rain Expected',
    description: 'Light rain expected in your area tomorrow morning. Good for crop growth.',
    recommendation: 'Consider applying fertilizer before the rain.',
    time: 'Tomorrow, 6:00 AM',
  },
  {
    id: '2',
    type: 'Sunny',
    severity: 'Good',
    icon: 'sunny',
    title: 'Perfect Growing Conditions',
    description: 'Sunny with moderate temperatures. Ideal for cassava growth.',
    recommendation: 'Great day for field work and planting.',
    time: 'Today, 12:00 PM',
  },
];

const fertilizerTips = [
  {
    id: '1',
    title: '🌱 Compost Application',
    description: 'Apply 5-10 tons of compost per hectare 2 weeks before planting.',
    timing: 'Before Planting',
  },
  {
    id: '2',
    title: '🧪 Nitrogen Fertilizer',
    description: 'Apply 60-80 kg N/ha at 4-6 weeks after planting for optimal growth.',
    timing: '4-6 Weeks After Planting',
  },
  {
    id: '3',
    title: '💧 Potassium & Phosphorus',
    description: 'Apply 50-100 kg K2O/ha and 40-60 kg P2O5/ha during early growth.',
    timing: '2-3 Months After Planting',
  },
];

const cropCareTips = [
  {
    id: '1',
    icon: '🌿',
    title: 'Weed Control',
    description: 'Regular weeding helps reduce competition for nutrients and water.',
  },
  {
    id: '2',
    icon: '💧',
    title: 'Water Management',
    description: 'Maintain soil moisture but avoid waterlogging. Water deeply once a week.',
  },
  {
    id: '3',
    icon: '🧪',
    title: 'Pest Management',
    description: 'Monitor regularly for pest infestation. Use organic pesticides if needed.',
  },
  {
    id: '4',
    icon: '🌾',
    title: 'Harvesting',
    description: 'Cassava is ready 8-12 months after planting. Check by brushing soil away.',
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const getDaysInMonth = (month, year) => new Date(year, month + 1, 0).getDate();
const getFirstDayOfMonth = (month, year) => new Date(year, month, 1).getDay();

// ===== WEATHER ALERT MODAL =====
const WeatherAlertModal = ({ visible, onClose }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const currentMonth = selectedDate.getMonth();
  const currentYear = selectedDate.getFullYear();

  const changeMonth = (offset) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setSelectedDate(newDate);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const days = [];
    const today = new Date();

    for (let i = 0; i < firstDay; i++) {
      days.push(<View key={`empty-${i}`} style={styles.calendarDayEmpty} />);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      const isToday = i === today.getDate() &&
                      currentMonth === today.getMonth() &&
                      currentYear === today.getFullYear();
      const isWeekend = new Date(currentYear, currentMonth, i).getDay() === 0 ||
                        new Date(currentYear, currentMonth, i).getDay() === 6;

      const isGoodDay = [5, 10, 15, 20, 25].includes(i);

      days.push(
        <TouchableOpacity
          key={`day-${i}`}
          style={[
            styles.calendarDay,
            isToday && styles.calendarDayToday,
            isGoodDay && styles.calendarDayGood,
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          }}
        >
          <Text style={[
            styles.calendarDayText,
            isToday && styles.calendarDayTextToday,
            isWeekend && styles.calendarDayTextWeekend,
            isGoodDay && styles.calendarDayTextGood,
          ]}>
            {i}
          </Text>
          {isGoodDay && (
            <View style={styles.calendarDot} />
          )}
        </TouchableOpacity>
      );
    }

    return days;
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalHeaderLeft}>
              <Ionicons name="cloud-outline" size={24} color="#0D631B" />
              <Text style={styles.modalHeaderTitle}>Weather & Care Guide</Text>
            </View>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                onClose();
              }}
            >
              <Ionicons name="close" size={24} color="#2C160E" />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.modalScrollContent}
          >
            <View style={styles.weatherSummary}>
              <View style={styles.weatherSummaryLeft}>
                <Ionicons name="sunny" size={32} color="#F59E0B" />
                <View>
                  <Text style={styles.weatherSummaryTemp}>28°C</Text>
                  <Text style={styles.weatherSummaryDesc}>Sunny • Perfect Conditions</Text>
                </View>
              </View>
              <View style={styles.weatherSummaryRight}>
                <Text style={styles.weatherSummaryLabel}>Humidity</Text>
                <Text style={styles.weatherSummaryValue}>65%</Text>
              </View>
            </View>

            <View style={styles.calendarSection}>
              <View style={styles.calendarHeader}>
                <TouchableOpacity onPress={() => changeMonth(-1)}>
                  <Ionicons name="chevron-back" size={20} color="#2C160E" />
                </TouchableOpacity>
                <Text style={styles.calendarTitle}>
                  {MONTHS[currentMonth]} {currentYear}
                </Text>
                <TouchableOpacity onPress={() => changeMonth(1)}>
                  <Ionicons name="chevron-forward" size={20} color="#2C160E" />
                </TouchableOpacity>
              </View>

              <View style={styles.calendarGrid}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                  <View key={day} style={styles.calendarDayHeader}>
                    <Text style={styles.calendarDayHeaderText}>{day}</Text>
                  </View>
                ))}
                {renderCalendar()}
              </View>

              <View style={styles.calendarLegend}>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendGood]} />
                  <Text style={styles.legendText}>Good Planting Day</Text>
                </View>
                <View style={styles.legendItem}>
                  <View style={[styles.legendDot, styles.legendToday]} />
                  <Text style={styles.legendText}>Today</Text>
                </View>
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="flask-outline" size={22} color="#0D631B" />
                <Text style={styles.sectionTitle}>Fertilizer Application Tips</Text>
              </View>
              {fertilizerTips.map((tip) => (
                <View key={tip.id} style={styles.tipCard}>
                  <Text style={styles.tipTitle}>{tip.title}</Text>
                  <Text style={styles.tipDescription}>{tip.description}</Text>
                  <View style={styles.tipTiming}>
                    <Ionicons name="time-outline" size={14} color="#F59E0B" />
                    <Text style={styles.tipTimingText}>{tip.timing}</Text>
                  </View>
                </View>
              ))}
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="leaf-outline" size={22} color="#0D631B" />
                <Text style={styles.sectionTitle}>Root Crop Care Guide</Text>
              </View>
              <View style={styles.careGrid}>
                {cropCareTips.map((tip) => (
                  <View key={tip.id} style={styles.careCard}>
                    <Text style={styles.careIcon}>{tip.icon}</Text>
                    <Text style={styles.careTitle}>{tip.title}</Text>
                    <Text style={styles.careDescription}>{tip.description}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.sectionContainer}>
              <View style={styles.sectionHeader}>
                <Ionicons name="warning-outline" size={22} color="#F97316" />
                <Text style={styles.sectionTitle}>Weather Alerts</Text>
              </View>
              {weatherAlerts.map((alert) => (
                <View key={alert.id} style={styles.alertItem}>
                  <View style={styles.alertIconContainer}>
                    <Ionicons name={alert.icon === 'rainy' ? 'rainy-outline' : 'sunny-outline'} size={24} color="#0D631B" />
                  </View>
                  <View style={styles.alertContent}>
                    <Text style={styles.alertTitle}>{alert.title}</Text>
                    <Text style={styles.alertDescription}>{alert.description}</Text>
                    <View style={styles.alertTime}>
                      <Ionicons name="time-outline" size={14} color="#707A6C" />
                      <Text style={styles.alertTimeText}>{alert.time}</Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const HomeScreen = ({ navigation }) => {
  const scanScale = useState(new Animated.Value(1))[0];
  const [weatherModalVisible, setWeatherModalVisible] = useState(false);
  
  const [displayName, setDisplayName] = useState('RootCare');
  const [profileLoading, setProfileLoading] = useState(true);

  const [streakData, setStreakData] = useState({
    count: 5,
    scannedToday: [true, true, true, true, true, false, false],
  });

  const [refreshing, setRefreshing] = useState(false);

  const fetchUserProfile = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError || !session) {
        console.log('No active session (guest mode)');
        setDisplayName('RootCare');
        setProfileLoading(false);
        return;
      }
      
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        if (!userError.message.includes('Auth session missing')) {
          console.error('Error fetching user:', userError.message);
        }
        setDisplayName('RootCare');
        setProfileLoading(false);
        return;
      }
      
      if (user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('display_name, first_name, last_name')
          .eq('id', user.id)
          .single();
        
        if (profileError) {
          console.error('Error fetching profile:', profileError.message);
          setDisplayName('RootCare');
        } else if (profile) {
          const name = profile.display_name || 
                      `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
                      'RootCare';
          setDisplayName(name);
        } else {
          setDisplayName('RootCare');
        }
      } else {
        setDisplayName('RootCare');
      }
    } catch (error) {
      console.error('Unexpected error fetching profile:', error);
      setDisplayName('RootCare');
    } finally {
      setProfileLoading(false);
    }
  };

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
    fetchUserProfile();
    
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed in HomeScreen:', event);
      if (event === 'SIGNED_IN' || event === 'SIGNED_OUT' || event === 'TOKEN_REFRESHED') {
        fetchUserProfile();
      }
    });
    
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    
    await fetchUserProfile();
    
    setTimeout(() => {
      setStreakData({
        count: 5,
        scannedToday: [true, true, true, true, true, false, false],
      });
      
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setRefreshing(false);
    }, 1500);
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
              <Text style={styles.headerTitle}>
                {profileLoading ? 'Loading...' : displayName}
              </Text>
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
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={['#0D631B']}
            tintColor="#0D631B"
            title="Refreshing..."
            titleColor="#0D631B"
          />
        }
      >
        {/* Greeting & Weather */}
        <View style={styles.greetingSection}>
          <View style={styles.greetingTextBlock}>
            <Text style={styles.greetingTitle}>
              Good morning, {profileLoading ? 'Farmer' : displayName.split(' ')[0]}!
            </Text>
            <Text style={styles.greetingSubtitle}>Your crops are thriving today.</Text>
          </View>
          
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

          <TouchableOpacity 
            style={styles.bentoCardWrapper}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setWeatherModalVisible(true);
            }}
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

        {/* Scan Streak Tracker */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <View style={styles.streakIconContainer}>
              <Ionicons name="flame" size={26} color="#F59E0B" />
            </View>
            <View style={styles.streakTextContainer}>
              <Text style={styles.streakCount}>{streakData.count}-Day Streak</Text>
              <Text style={styles.streakMessage}>
                You've scanned your crops {streakData.count} days in a row!
              </Text>
            </View>
          </View>
          <View style={styles.streakDaysRow}>
            {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((day, index) => {
              const isDone = streakData.scannedToday[index];
              return (
                <View key={index} style={styles.streakDayItem}>
                  <View style={[styles.streakDayDot, isDone && styles.streakDayDotActive]}>
                    {isDone && <Ionicons name="checkmark" size={12} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.streakDayLabel}>{day}</Text>
                </View>
              );
            })}
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

      {/* Weather Alert Modal */}
      <WeatherAlertModal
        visible={weatherModalVisible}
        onClose={() => setWeatherModalVisible(false)}
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
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 80,
  },
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
  bentoGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
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
  marketplaceOverlay: {
    flex: 1,
    padding: 14,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 219, 207, 0.78)',
  },
  marketplaceCard: {
    backgroundColor: 'transparent',
  },
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
  streakCard: {
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
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  streakIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakTextContainer: {
    flex: 1,
  },
  streakCount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#2C160E',
    marginBottom: 2,
  },
  streakMessage: {
    fontSize: 12,
    fontWeight: '400',
    color: '#40493D',
    lineHeight: 16,
  },
  streakDaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 202, 186, 0.3)',
  },
  streakDayItem: {
    alignItems: 'center',
    gap: 6,
  },
  streakDayDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F1EDE9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  streakDayDotActive: {
    backgroundColor: '#F59E0B',
  },
  streakDayLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#707A6C',
  },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF8F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '92%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  modalHeaderTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
  },
  modalCloseButton: {
    padding: 4,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFF1ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  weatherSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  weatherSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  weatherSummaryTemp: {
    fontSize: 24,
    fontWeight: '700',
    color: '#2C160E',
  },
  weatherSummaryDesc: {
    fontSize: 14,
    fontWeight: '400',
    color: '#40493D',
  },
  weatherSummaryRight: {
    alignItems: 'center',
  },
  weatherSummaryLabel: {
    fontSize: 12,
    fontWeight: '400',
    color: '#707A6C',
  },
  weatherSummaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  calendarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDayHeader: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 4,
  },
  calendarDayHeaderText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#707A6C',
  },
  calendarDay: {
    width: '14.28%',
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 20,
    position: 'relative',
  },
  calendarDayEmpty: {
    width: '14.28%',
    paddingVertical: 6,
  },
  calendarDayToday: {
    backgroundColor: '#0D631B',
  },
  calendarDayGood: {
    backgroundColor: 'rgba(13, 99, 27, 0.1)',
  },
  calendarDayText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#2C160E',
  },
  calendarDayTextToday: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  calendarDayTextWeekend: {
    color: '#DC2626',
  },
  calendarDayTextGood: {
    color: '#0D631B',
    fontWeight: '600',
  },
  calendarDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#0D631B',
    position: 'absolute',
    bottom: 0,
  },
  calendarLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 16,
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 202, 186, 0.3)',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  legendGood: {
    backgroundColor: 'rgba(13, 99, 27, 0.3)',
  },
  legendToday: {
    backgroundColor: '#0D631B',
  },
  legendText: {
    fontSize: 11,
    color: '#40493D',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  tipCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  tipTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C160E',
    marginBottom: 4,
  },
  tipDescription: {
    fontSize: 13,
    color: '#40493D',
    marginBottom: 6,
    lineHeight: 18,
  },
  tipTiming: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tipTimingText: {
    fontSize: 11,
    color: '#F59E0B',
    fontWeight: '500',
  },
  careGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  careCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    width: '48%',
  },
  careIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  careTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2C160E',
    marginBottom: 4,
  },
  careDescription: {
    fontSize: 11,
    color: '#40493D',
    lineHeight: 16,
  },
  alertItem: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    gap: 12,
  },
  alertIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(13, 99, 27, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2C160E',
    marginBottom: 2,
  },
  alertDescription: {
    fontSize: 13,
    color: '#40493D',
    marginBottom: 4,
  },
  alertTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  alertTimeText: {
    fontSize: 11,
    color: '#707A6C',
  },
});

export default HomeScreen;