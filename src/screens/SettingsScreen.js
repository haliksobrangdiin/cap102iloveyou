// screens/SettingsScreen.js - FIXED BOTTOM SHEET LAYOUT
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  ScrollView,
  Switch,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../utils/supabaseClient';

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
  const [pushNotifications, setPushNotifications] = useState(true);
  const [weatherAlerts, setWeatherAlerts] = useState(true);
  const [marketUpdates, setMarketUpdates] = useState(false);

  const [exitConfirmVisible, setExitConfirmVisible] = useState(false);

  const [activeModal, setActiveModal] = useState(null);

  const [firstName, setFirstName] = useState('Adeola');
  const [middleName, setMiddleName] = useState('');
  const [surname, setSurname] = useState('Johnson');
  const [profileImage, setProfileImage] = useState(null);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const toggleDarkMode = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsDarkMode(!isDarkMode);
  };

  const handleExit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setExitConfirmVisible(true);
  };

  const cancelExit = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setExitConfirmVisible(false);
  };

  const confirmExit = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setExitConfirmVisible(false);
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Supabase logout error:', error);
      } else {
        console.log('✅ Successfully logged out');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      navigation.reset({
        index: 0,
        routes: [{ name: 'Onboarding' }],
      });
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  const themeColors = {
    background: isDarkMode ? '#1A1A1A' : colors.surface,
    surface: isDarkMode ? '#2C2C2C' : colors['surface-container-lowest'],
    surfaceSecondary: isDarkMode ? '#3D3D3D' : colors['surface-container-low'],
    surfaceTertiary: isDarkMode ? '#4A4A4A' : colors['surface-container'],
    text: isDarkMode ? '#FFFFFF' : colors['on-surface'],
    textSecondary: isDarkMode ? '#B0B0B0' : colors['on-surface-variant'],
    accent: isDarkMode ? colors['primary-fixed-dim'] : colors.primary,
    primary: isDarkMode ? colors['primary-fixed-dim'] : colors['primary-container'],
    border: isDarkMode ? '#444444' : colors['outline-variant'],
    card: isDarkMode ? '#2C2C2C' : colors['surface-container-lowest'],
    error: colors.error,
  };

  const renderModal = () => {
    if (!activeModal) return null;

    const modalTitles = {
      profile: 'Edit Profile',
      password: 'Change Password',
      security: 'Security & Privacy',
      help: 'Help Center',
      terms: 'Terms of Service',
      privacy: 'Privacy Policy',
    };

    return (
      <Modal
        visible={!!activeModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setActiveModal(null)}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContainer, { backgroundColor: themeColors.background }]}>
            
            <View style={[styles.modalHeader, { borderBottomColor: themeColors.border }]}>
              <TouchableOpacity onPress={() => setActiveModal(null)} style={styles.modalBackButton}>
                <Ionicons name="close" size={24} color={themeColors.text} />
              </TouchableOpacity>
              <Text style={[styles.modalHeaderTitle, { color: themeColors.text }]}>
                {modalTitles[activeModal]}
              </Text>
              <View style={{ width: 40 }} />
            </View>

            <ScrollView 
              style={styles.modalScrollView}
              contentContainerStyle={styles.modalScrollContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
              {activeModal === 'profile' && (
                <>
                  <View style={styles.profileImageContainer}>
                    <TouchableOpacity onPress={pickImage}>
                      {profileImage ? (
                        <Image source={{ uri: profileImage }} style={styles.profileAvatarLarge} />
                      ) : (
                        <View style={[styles.profileAvatarLarge, { backgroundColor: themeColors.accent }]}>
                          <Text style={styles.profileInitialLarge}>{firstName.charAt(0)}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.editPhotoButton} onPress={pickImage}>
                      <Ionicons name="camera" size={16} color="#FFFFFF" />
                    </TouchableOpacity>
                  </View>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>First Name</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={firstName}
                      onChangeText={setFirstName}
                      placeholder="First Name"
                      placeholderTextColor={themeColors.textSecondary}
                    />
                  </View>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>Middle Name</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={middleName}
                      onChangeText={setMiddleName}
                      placeholder="Middle Name"
                      placeholderTextColor={themeColors.textSecondary}
                    />
                  </View>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>Surname</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="person-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={surname}
                      onChangeText={setSurname}
                      placeholder="Surname"
                      placeholderTextColor={themeColors.textSecondary}
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.modalSaveButton}
                    onPress={() => {
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      setActiveModal(null);
                    }}
                  >
                    <Text style={styles.modalSaveButtonText}>Save Changes</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeModal === 'password' && (
                <>
                  <Text style={styles.modalDescription}>Enter your current password and set a new, secure password.</Text>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>Current Password</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={currentPassword}
                      onChangeText={setCurrentPassword}
                      placeholder="Enter current password"
                      placeholderTextColor={themeColors.textSecondary}
                      secureTextEntry
                    />
                  </View>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>New Password</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={newPassword}
                      onChangeText={setNewPassword}
                      placeholder="Enter new password"
                      placeholderTextColor={themeColors.textSecondary}
                      secureTextEntry
                    />
                  </View>

                  <Text style={[styles.modalSectionTitle, { color: themeColors.textSecondary }]}>Confirm New Password</Text>
                  <View style={[styles.inputContainer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <Ionicons name="lock-closed-outline" size={20} color={themeColors.textSecondary} />
                    <TextInput
                      style={[styles.input, { color: themeColors.text }]}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                      placeholder="Confirm new password"
                      placeholderTextColor={themeColors.textSecondary}
                      secureTextEntry
                    />
                  </View>

                  <TouchableOpacity 
                    style={styles.modalSaveButton}
                    onPress={() => {
                      if (newPassword !== confirmPassword) {
                        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                        return;
                      }
                      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                      setActiveModal(null);
                    }}
                  >
                    <Text style={styles.modalSaveButtonText}>Update Password</Text>
                  </TouchableOpacity>
                </>
              )}

              {activeModal === 'security' && (
                <>
                  <Text style={styles.modalDescription}>Manage how your data is secured and how you interact with RootCare.</Text>
                  
                  <View style={[styles.settingRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={styles.settingRowLeft}>
                      <Ionicons name="finger-print-outline" size={22} color={themeColors.textSecondary} />
                      <Text style={[styles.settingRowLabel, { color: themeColors.text }]}>Biometric Login</Text>
                    </View>
                    <Switch
                      value={false}
                      onValueChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
                      thumbColor={colors['on-primary']}
                    />
                  </View>

                  <View style={[styles.settingRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={styles.settingRowLeft}>
                      <Ionicons name="eye-off-outline" size={22} color={themeColors.textSecondary} />
                      <Text style={[styles.settingRowLabel, { color: themeColors.text }]}>Two-Factor Authentication</Text>
                    </View>
                    <Switch
                      value={false}
                      onValueChange={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      trackColor={{ false: '#D1D1D6', true: colors['primary-fixed-dim'] }}
                      thumbColor={colors['on-primary']}
                    />
                  </View>

                  <View style={[styles.settingRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={styles.settingRowLeft}>
                      <Ionicons name="trash-outline" size={22} color={themeColors.error} />
                      <Text style={[styles.settingRowLabel, { color: themeColors.error }]}>Delete Account</Text>
                    </View>
                    <TouchableOpacity onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}>
                      <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {activeModal === 'help' && (
                <View>
                  <Text style={styles.modalDescription}>We are here to assist you! Browse our frequently asked questions or contact support.</Text>

                  <View style={[styles.settingRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={styles.settingRowLeft}>
                      <Ionicons name="help-circle-outline" size={22} color={themeColors.textSecondary} />
                      <Text style={[styles.settingRowLabel, { color: themeColors.text }]}>How do I scan a plant?</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={themeColors.textSecondary} />
                  </View>

                  <View style={[styles.settingRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
                    <View style={styles.settingRowLeft}>
                      <Ionicons name="help-circle-outline" size={22} color={themeColors.textSecondary} />
                      <Text style={[styles.settingRowLabel, { color: themeColors.text }]}>Why is my result inaccurate?</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={18} color={themeColors.textSecondary} />
                  </View>

                  <TouchableOpacity style={styles.modalSaveButton} onPress={() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success)}>
                    <Text style={styles.modalSaveButtonText}>Contact Support</Text>
                  </TouchableOpacity>
                </View>
              )}

              {activeModal === 'terms' && (
                <View>
                  <Text style={styles.modalDescription}>Last Updated: January 2024</Text>
                  <Text style={styles.legalText}>
                    1. ACCEPTANCE OF TERMS {"\n\n"}
                    By using RootCare, you agree to be bound by these Terms of Service. {"\n\n"}
                    2. DESCRIPTION OF SERVICE {"\n\n"}
                    RootCare provides AI-powered disease detection for cassava plants, farming insights, and marketplace connectivity. {"\n\n"}
                    3. USER OBLIGATIONS {"\n\n"}
                    - You must provide accurate information {"\n"}
                    - You are responsible for maintaining account security {"\n"}
                    - You must not misuse the service {"\n\n"}
                    4. PRIVACY POLICY {"\n\n"}
                    Your data is protected according to our Privacy Policy.
                  </Text>
                </View>
              )}

              {activeModal === 'privacy' && (
                <View>
                  <Text style={styles.modalDescription}>Last Updated: January 2024</Text>
                  <Text style={styles.legalText}>
                    1. INFORMATION WE COLLECT {"\n\n"}
                    - Personal information (name, email, phone) {"\n"}
                    - Farm data and location {"\n"}
                    - Images uploaded for disease detection {"\n\n"}
                    2. HOW WE USE YOUR DATA {"\n\n"}
                    - To provide disease detection services {"\n"}
                    - To improve our AI models {"\n\n"}
                    3. DATA SECURITY {"\n\n"}
                    We implement industry-standard security measures to protect your data.
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: themeColors.background }]}
      edges={['top']}
    >
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
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 40 }]}
      >
        <TouchableOpacity
          style={[styles.profileSection, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          onPress={() => setActiveModal('profile')}
          activeOpacity={0.7}
        >
          {profileImage ? (
            <Image source={{ uri: profileImage }} style={styles.profileAvatar} />
          ) : (
            <View style={[styles.profileAvatar, { backgroundColor: themeColors.accent }]}>
              <Text style={styles.profileInitial}>A</Text>
            </View>
          )}
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: themeColors.text }]}>
              {firstName} {surname}
            </Text>
            <Text style={[styles.profileEmail, { color: themeColors.textSecondary }]}>
              adeola@rootcare.farm
            </Text>
            <View style={[styles.profileBadge, { backgroundColor: themeColors.primary }]}>
              <Text style={[styles.profileBadgeText, { color: colors['on-primary'] }]}>
                PREMIUM PLAN
              </Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
        </TouchableOpacity>

        <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.accent }]}>
            Account
          </Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('profile')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="person-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Edit Profile
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('password')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="lock-closed-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Change Password
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('security')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Security & Privacy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.accent }]}>
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

        <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.accent }]}>
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

        <View style={[styles.section, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <Text style={[styles.sectionTitle, { color: themeColors.accent }]}>
            Support & Info
          </Text>

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('help')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="help-buoy-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Help Center
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('terms')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="document-text-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Terms of Service
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>

          <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => setActiveModal('privacy')}>
            <View style={styles.menuItemLeft}>
              <Ionicons name="shield-outline" size={20} color={colors.secondary} />
              <Text style={[styles.menuItemText, { color: themeColors.text }]}>
                Privacy Policy
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color={themeColors.textSecondary} />
          </TouchableOpacity>
        </View>

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

      <Modal
        visible={exitConfirmVisible}
        transparent
        animationType="fade"
        onRequestClose={cancelExit}
      >
        <View style={styles.modalOverlayConfirm}>
          <View style={[styles.confirmModalCard, { backgroundColor: themeColors.surface }]}>
            <View style={styles.exitIconCircle}>
              <Ionicons name="log-out-outline" size={30} color={colors.error} />
            </View>

            <Text style={[styles.confirmModalTitle, { color: themeColors.text }]}>
              Logout App
            </Text>
            <Text style={[styles.confirmModalBody, { color: themeColors.textSecondary }]}>
              Are you sure you want to logout of RootCare?
            </Text>

            <TouchableOpacity
              style={styles.exitConfirmButton}
              onPress={confirmExit}
              activeOpacity={0.85}
            >
              <Text style={styles.exitConfirmButtonText}>Logout RootCare</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.confirmCancelButton}
              onPress={cancelExit}
              activeOpacity={0.7}
            >
              <Text style={[styles.confirmCancelText, { color: themeColors.textSecondary }]}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {renderModal()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 2,
    borderColor: 'rgba(0,0,0,0.1)',
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
  
  // ===== OVERLAYS (separated for centering vs bottom sheet) =====
  modalOverlayConfirm: {
    flex: 1,
    backgroundColor: 'rgba(44, 22, 14, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(44, 22, 14, 0.5)',
    justifyContent: 'flex-end', // CRITICAL FIX: Modal slides from bottom
    alignItems: 'center',
  },
  confirmModalCard: {
    width: '100%',
    maxWidth: 340,
    borderRadius: 24,
    padding: 32,
    alignItems: 'center',
    shadowColor: 'rgba(93, 64, 55, 0.15)',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 12,
  },
  exitIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors['error-container'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  confirmModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
    textAlign: 'center',
  },
  confirmModalBody: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  exitConfirmButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.error,
    borderRadius: 999,
    width: '100%',
    minHeight: 48,
    paddingHorizontal: 12,
  },
  exitConfirmButtonText: {
    color: colors['on-error'],
    fontSize: 14,
    fontWeight: '600',
  },
  confirmCancelButton: {
    minHeight: 40,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    marginTop: 4,
    width: '100%',
  },
  confirmCancelText: {
    fontSize: 14,
    fontWeight: '500',
  },

  // ===== FULL-SCREEN MODAL (Bottom Sheet) =====
  modalContainer: {
    width: '100%',
    height: '90%', // CRITICAL FIX: Takes up 90% of the screen
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 16,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
  },
  modalBackButton: {
    padding: 4,
    width: 40,
  },
  modalHeaderTitle: {
    fontSize: 18,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
  },
  modalScrollView: {
    flex: 1,
  },
  modalScrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  profileAvatarLarge: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitialLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editPhotoButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: colors.primary,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  modalSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 52,
    gap: 10,
  },
  input: {
    flex: 1,
    fontSize: 15,
  },
  modalSaveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  modalSaveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  modalDescription: {
    fontSize: 14,
    lineHeight: 21,
    marginBottom: 8,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
  },
  settingRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingRowLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  legalText: {
    fontSize: 14,
    lineHeight: 24,
    color: '#40493D',
  },
});

export default SettingsScreen;