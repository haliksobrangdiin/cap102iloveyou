// screens/SettingsScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Alert,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const colors = {
  surface: '#FFF8F6',
  'surface-dim': '#FBD1C4',
  'surface-container': '#FFE9E3',
  'surface-container-low': '#FFF1ED',
  'surface-container-high': '#FFE2DA',
  'surface-container-highest': '#FFDBD0',
  'surface-container-lowest': '#FFFFFF',
  'on-surface': '#2C160E',
  'on-surface-variant': '#40493D',
  outline: '#707A6C',
  'outline-variant': '#BFCABA',
  primary: '#0D631B',
  'on-primary': '#FFFFFF',
  'primary-container': '#2E7D32',
  'on-primary-container': '#CBFFC2',
  'primary-fixed': '#A3F69C',
  'primary-fixed-dim': '#88D982',
  secondary: '#7A5649',
  'on-secondary': '#FFFFFF',
  'secondary-container': '#FDCDBC',
  'on-secondary-container': '#795548',
  tertiary: '#774C00',
  'tertiary-container': '#986200',
  'on-tertiary-container': '#FFEEDE',
  error: '#BA1A1A',
  'on-error': '#FFFFFF',
  'error-container': '#FFDAD6',
  'on-error-container': '#93000A',
  background: '#FFF8F6',
  'on-background': '#2C160E',
  'surface-variant': '#FFDBD0',
  'surface-tint': '#1B6D24',
};

const SettingsScreen = ({ navigation }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);

  const languages = ['English', 'Français', 'Yoruba'];

  const handleLanguageSelect = (language) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedLanguage(language);
  };

  const toggleDarkMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDarkMode(!isDarkMode);
  };

  const handleExit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      'Exit App',
      'Are you sure you want to exit RootCare?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light),
        },
        {
          text: 'Exit',
          style: 'destructive',
          onPress: () => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            navigation.reset({
              index: 0,
              routes: [{ name: 'Onboarding' }],
            });
          },
        },
      ]
    );
  };

  const themeColors = {
    background: isDarkMode ? '#1A1A1A' : colors.surface,
    surface: isDarkMode ? '#2C2C2C' : colors['surface-container-lowest'],
    surfaceSecondary: isDarkMode ? '#3D3D3D' : colors['surface-container-low'],
    surfaceTertiary: isDarkMode ? '#4A4A4A' : colors['surface-container'],
    text: isDarkMode ? '#FFFFFF' : colors['on-surface'],
    textSecondary: isDarkMode ? '#B0B0B0' : colors['on-surface-variant'],
    primary: isDarkMode ? colors['primary-fixed-dim'] : colors.primary,
    primaryContainer: isDarkMode ? colors['primary-fixed-dim'] : colors['primary-container'],
    border: isDarkMode ? '#444444' : colors['outline-variant'],
    card: isDarkMode ? '#2C2C2C' : colors['surface-container-lowest'],
    error: colors.error,
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      edges={['top']}
    >
      {/* ===== HEADER WITH SEARCH REMOVED ===== */}
      <View style={[styles.header, { backgroundColor: themeColors.background }]}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color={themeColors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: themeColors.text }]}>
          Settings
        </Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: 100 },
        ]}
      >
        {/* ===== PROFILE SECTION ===== */}
        <View
          style={[
            styles.profileSection,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <View style={styles.profileAvatar}>
            <Text style={styles.profileInitial}>A</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: themeColors.text }]}>
              Adeola Johnson
            </Text>
            <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>
              adeola@rootcare.farm
            </Text>
            <View
              style={[
                styles.profileBadge,
                { backgroundColor: themeColors.primary },
              ]}
            >
              <Text style={[styles.profileBadgeText, { color: colors['on-primary'] }]}>
                PREMIUM PLAN
              </Text>
            </View>
          </View>
        </View>

        {/* ===== ACCOUNT SECTION ===== */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
            Account
          </Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="person-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Edit Profile
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Change Password
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="shield-checkmark-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Security & Privacy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* ===== PREFERENCES SECTION ===== */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
            Preferences
          </Text>

          <Text style={[styles.label, { color: themeColors.textSecondary }]}>
            App Language
          </Text>
          <View style={styles.languageContainer}>
            {languages.map((language) => (
              <TouchableOpacity
                key={language}
                style={[
                  styles.languageOption,
                  {
                    backgroundColor:
                      selectedLanguage === language
                        ? themeColors.primary
                        : themeColors.surfaceTertiary,
                  },
                ]}
                onPress={() => handleLanguageSelect(language)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.languageText,
                    {
                      color:
                        selectedLanguage === language
                          ? colors['on-primary']
                          : themeColors.text,
                    },
                  ]}
                >
                  {language}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ===== APPEARANCE SECTION ===== */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
            Appearance
          </Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: themeColors.text }]}>
                Dark Mode
              </Text>
              <Text style={[styles.switchSubtext, { color: themeColors.textSecondary }]}>
                {isDarkMode ? 'On' : 'Off'}
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
              thumbColor={colors['on-primary']}
            />
          </View>
        </View>

        {/* ===== NOTIFICATIONS SECTION ===== */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
            Notifications
          </Text>

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: themeColors.text }]}>
                Push Notifications
              </Text>
              <Text style={[styles.switchSubtext, { color: themeColors.textSecondary }]}>
                Get real-time alerts
              </Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
              thumbColor={colors['on-primary']}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: themeColors.text }]}>
                Weather Alerts
              </Text>
              <Text style={[styles.switchSubtext, { color: themeColors.textSecondary }]}>
                Weather warnings for your area
              </Text>
            </View>
            <Switch
              value={weatherAlerts}
              onValueChange={setWeatherAlerts}
              trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
              thumbColor={colors['on-primary']}
            />
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <View style={styles.switchRow}>
            <View>
              <Text style={[styles.switchLabel, { color: themeColors.text }]}>
                Market Updates
              </Text>
              <Text style={[styles.switchSubtext, { color: themeColors.textSecondary }]}>
                Cassava market price updates
              </Text>
            </View>
            <Switch
              value={marketUpdates}
              onValueChange={setMarketUpdates}
              trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
              thumbColor={colors['on-primary']}
            />
          </View>
        </View>

        {/* ===== SUPPORT & INFO SECTION ===== */}
        <View
          style={[
            styles.section,
            {
              backgroundColor: themeColors.surface,
              borderColor: themeColors.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: themeColors.primary }]}>
            Support & Info
          </Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="help-buoy-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Help Center
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="document-text-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Terms of Service
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}>
            <View style={styles.menuItemLeft}>
              <Ionicons
                name="shield-outline"
                size={20}
                color={colors.secondary}
              />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={themeColors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* ===== LOG OUT BUTTON ===== */}
        <TouchableOpacity
          style={[styles.exitButton, { borderColor: themeColors.error }]}
          onPress={handleExit}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={themeColors.error} />
          <Text style={[styles.exitText, { color: themeColors.error }]}>
            Log Out
          </Text>
        </TouchableOpacity>

        <Text style={[styles.versionText, { color: themeColors.textSecondary }]}>
          RootCare Version 2.4.1 (Stable)
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  // ===== HEADER STYLES =====
  header: {
    width: '100%',
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    padding: 4,
    minWidth: 40,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerSpacer: {
    minWidth: 40,
  },
  scrollContent: {
    padding: 16,
  },
  // Profile Section
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 16,
    shadowColor: 'rgba(93, 64, 55, 0.08)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 2,
  },
  profileAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#0D631B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  profileInitial: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
  },
  profileEmail: {
    fontSize: 13,
    marginTop: 2,
  },
  profileBadge: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    borderRadius: 12,
    marginTop: 4,
    alignSelf: 'flex-start',
  },
  profileBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  // Section
  section: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    shadowColor: 'rgba(93, 64, 55, 0.06)',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  // Menu Items
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  menuItemText: {
    fontSize: 15,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 2,
  },
  // Language
  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  languageOption: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageText: {
    fontSize: 13,
    fontWeight: '500',
  },
  // Switch
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  switchSubtext: {
    fontSize: 12,
    marginTop: 1,
  },
  // Exit Button
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    marginTop: 4,
    marginBottom: 8,
  },
  exitText: {
    fontSize: 15,
    fontWeight: '600',
  },
  versionText: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 8,
  },
});

export default SettingsScreen;