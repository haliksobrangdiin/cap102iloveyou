// screens/ResultScreen.js - ABSOLUTE FINAL (1-Second Delay, Saved Modal Works)
import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Modal, Platform, Dimensions, BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width, height } = Dimensions.get('window');

const colors = {
  surface: '#FFF8F6',
  surfaceContainerLow: '#FFF1ED',
  surfaceContainerHigh: '#FFE2DA',
  onSurface: '#2C160E',
  onSurfaceVariant: '#40493D',
  primary: '#0D631B',
  onPrimary: '#FFFFFF',
  primaryContainer: '#2E7D32',
  secondary: '#7A5649',
  onSecondary: '#FFFFFF',
  tertiary: '#774C00',
  outline: '#707A6C',
  outlineVariant: '#BFCABA',
};

const typography = {
  headlineSm: { fontFamily: 'Montserrat', fontSize: 20, fontWeight: '600', lineHeight: 28 },
  bodyMd: { fontFamily: 'Open Sans', fontSize: 16, fontWeight: '400', lineHeight: 24 },
  bodyLg: { fontFamily: 'Open Sans', fontSize: 18, fontWeight: '400', lineHeight: 28 },
  labelLg: { fontFamily: 'Open Sans', fontSize: 14, fontWeight: '600', lineHeight: 20, letterSpacing: 0.1 },
  labelSm: { fontFamily: 'Open Sans', fontSize: 12, fontWeight: '500', lineHeight: 16 },
};

const spacing = { xs: 4, sm: 12, md: 16, lg: 24, xl: 32, marginMobile: 20 };
const rounded = { sm: 4, DEFAULT: 8, md: 12, lg: 16, xl: 24, full: 9999 };
const HEADER_HEIGHT = 56;
const MIN_TOUCH = 48;

const findTabNavigator = (navigation) => {
  let nav = navigation.getParent();
  while (nav && nav.getState()?.type !== 'tab') {
    nav = nav.getParent();
  }
  return nav;
};

const ResultScreen = ({ route, navigation }) => {
  const { imageUri, scanDate, diseaseKey, diseaseLabel, confidence } = route.params || {};
  const [isSaved, setIsSaved] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [savedModalVisible, setSavedModalVisible] = useState(false);

  const pendingActionRef = useRef(null);
  const isMountedRef = useRef(true);
  const isSavedRef = useRef(isSaved);

  useEffect(() => {
    isMountedRef.current = true;
    return () => { isMountedRef.current = false; };
  }, []);

  useEffect(() => {
    isSavedRef.current = isSaved;
  }, [isSaved]);

  // Reset modals immediately when leaving this screen
  useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      setConfirmVisible(false);
      setSavedModalVisible(false);
      pendingActionRef.current = null;
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    if (confirmVisible || savedModalVisible) {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }
  }, [confirmVisible, savedModalVisible]);


  const diseaseData = DISEASE_INFO[diseaseKey] || { ...DISEASE_INFO.CMD, name: diseaseLabel || DISEASE_INFO.CMD.name };
  
  const scannedAt = scanDate ? new Date(scanDate) : new Date();
  const formattedDate = scannedAt.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  const formattedTime = scannedAt.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

  const saveResult = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setIsSaved(true);
  };

  const goHome = () => {
    const tabNav = findTabNavigator(navigation);
    if (tabNav) {
      tabNav.reset({ index: 0, routes: [{ name: 'Home' }] });
    } else {
      navigation.navigate('Home');
    }
  };

  const goToScanner = () => {
    const tabNav = findTabNavigator(navigation);
    if (tabNav) {
      tabNav.reset({ index: 0, routes: [{ name: 'Scanner' }] });
    } else {
      navigation.navigate('Scanner');
    }
  };

  const showModal = (action) => {
    if (isSavedRef.current) {
      action();
      return;
    }
    pendingActionRef.current = action;
    setConfirmVisible(true);
  };

  const handleBackPress = () => showModal(goHome);
  const navigateToHome = () => showModal(goHome);
  const navigateToScanAgain = () => showModal(goToScanner);

  // ===== FINAL FIX: 1-SECOND DELAY =====
  const handleSaveAndContinue = () => {
    saveResult(); 
    setConfirmVisible(false); 
    
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    
    // 1. Show the "Saved!" modal immediately
    setSavedModalVisible(true);

    // 2. Wait exactly 1 second (1000ms), THEN navigate
    setTimeout(() => {
      if (action) action();
    }, 1000);
  };

  const handleDiscard = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setConfirmVisible(false);
    const action = pendingActionRef.current;
    pendingActionRef.current = null;
    if (action) action();
  };

  const handleCancel = () => {
    setConfirmVisible(false);
    pendingActionRef.current = null;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={28} color={colors.onSurface} />
        </TouchableOpacity>
        <Text style={[styles.headerText, { color: colors.onSurface }]}>Analysis Results</Text>
        <TouchableOpacity style={styles.headerAction} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={24} color={colors.onSurface} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {imageUri && (
          <View style={styles.imageContainer}>
            <Image source={{ uri: imageUri }} style={styles.image} />
          </View>
        )}

        <View style={styles.resultCard}>
          <View style={styles.diseaseHeader}>
            <Ionicons name="alert-circle" size={28} color={colors.tertiary} />
            <Text style={styles.diseaseName}>{diseaseData.name}</Text>
          </View>
          <View style={styles.scanDateRow}>
            <Ionicons name="calendar-outline" size={14} color={colors.onSurfaceVariant} />
            <Text style={styles.scanDateText}>Scanned {formattedDate} · {formattedTime}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Ionicons name="document-text-outline" size={20} color={colors.secondary} /><Text style={styles.sectionTitle}>Description</Text></View>
            <Text style={styles.sectionText}>{diseaseData.description}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Ionicons name="medkit-outline" size={20} color={colors.secondary} /><Text style={styles.sectionTitle}>Treatment</Text></View>
            <Text style={styles.sectionText}>{diseaseData.treatment}</Text>
          </View>
          <View style={styles.section}>
            <View style={styles.sectionHeader}><Ionicons name="shield-checkmark-outline" size={20} color={colors.secondary} /><Text style={styles.sectionTitle}>Prevention</Text></View>
            <Text style={styles.sectionText}>{diseaseData.prevention}</Text>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={[styles.button, styles.saveButton, isSaved && styles.savedButton]} onPress={saveResult} activeOpacity={0.85} disabled={isSaved}>
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} size={18} color={colors.onPrimary} />
            <Text style={styles.buttonText}>{isSaved ? 'Saved' : 'Save'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.scanButton]} onPress={navigateToScanAgain} activeOpacity={0.85}>
            <Ionicons name="scan-outline" size={18} color={colors.onSecondary} />
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.homeButton]} onPress={navigateToHome} activeOpacity={0.85}>
            <Ionicons name="home-outline" size={18} color={colors.onSurface} />
            <Text style={[styles.buttonText, styles.homeButtonText]}>Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={confirmVisible} transparent animationType="fade" onRequestClose={handleCancel} statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity style={styles.modalCloseButton} onPress={handleCancel} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors.onSurface} />
            </TouchableOpacity>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.modalScrollContent}>
              <Text style={styles.modalTitle}>Save this result?</Text>
              <Text style={styles.modalBody}>You haven't saved this analysis yet. Save it to your history before you go, or discard it.</Text>
              <TouchableOpacity style={[styles.button, styles.modalSaveButton]} onPress={handleSaveAndContinue} activeOpacity={0.85}>
                <Ionicons name="bookmark-outline" size={18} color={colors.onPrimary} />
                <Text style={styles.buttonText}>Save & Continue</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.button, styles.modalDiscardButton]} onPress={handleDiscard} activeOpacity={0.85}>
                <Text style={[styles.buttonText, styles.modalDiscardText]}>Discard</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalCancelButton} onPress={handleCancel} activeOpacity={0.7}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Saved Modal (Shows for exactly 1 second before navigating) */}
      <Modal visible={savedModalVisible} transparent animationType="fade" onRequestClose={() => {}} statusBarTranslucent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.savedModalCard}>
            <View style={styles.savedIconCircle}>
              <Ionicons name="checkmark" size={32} color={colors.onPrimary} />
            </View>
            <Text style={styles.savedModalTitle}>Saved!</Text>
            <Text style={styles.savedModalBody}>Scan result has been saved to history.</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.surface, ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}) },
  header: { width: '100%', minHeight: HEADER_HEIGHT, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 12, paddingHorizontal: 16, borderBottomWidth: 1, borderBottomColor: 'rgba(0,0,0,0.05)', backgroundColor: colors.surface },
  backButton: { padding: 4, minWidth: 40 },
  headerText: { fontSize: 18, fontWeight: '600', flex: 1, textAlign: 'center', letterSpacing: 0.3 },
  headerAction: { padding: 4, minWidth: 40, alignItems: 'flex-end' },
  scrollContent: { flexGrow: 1, padding: spacing.marginMobile, paddingBottom: 100 },
  imageContainer: { width: '100%', height: 250, backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.DEFAULT, borderWidth: 2, borderColor: colors.outlineVariant, overflow: 'hidden', marginBottom: spacing.md },
  image: { width: '100%', height: '100%', resizeMode: 'cover' },
  resultCard: { backgroundColor: colors.surfaceContainerLow, borderRadius: rounded.DEFAULT, padding: spacing.marginMobile, marginBottom: spacing.md, shadowColor: 'rgba(93, 64, 55, 0.08)', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 1, shadowRadius: 4, elevation: 2 },
  diseaseHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.sm - 2, marginBottom: spacing.xs },
  diseaseName: { ...typography.headlineSm, color: colors.onSurface, textAlign: 'center' },
  scanDateRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: spacing.xs, marginBottom: spacing.md },
  scanDateText: { ...typography.labelSm, color: colors.onSurfaceVariant },
  divider: { height: 1, backgroundColor: colors.outlineVariant, marginBottom: spacing.md },
  section: { marginBottom: spacing.md },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs + 2, marginBottom: spacing.xs + 2 },
  sectionTitle: { ...typography.labelLg, fontSize: 16, color: colors.onSurface },
  sectionText: { ...typography.bodyMd, fontSize: 14, color: colors.onSurfaceVariant, paddingLeft: 28 },
  buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs + 4 },
  button: { flexDirection: 'row', minHeight: MIN_TOUCH, paddingHorizontal: spacing.sm, borderRadius: rounded.full, alignItems: 'center', justifyContent: 'center', gap: spacing.xs + 2, flex: 1 },
  saveButton: { backgroundColor: colors.primaryContainer },
  savedButton: { opacity: 0.6 },
  scanButton: { backgroundColor: colors.secondary },
  homeButton: { backgroundColor: colors.surfaceContainerHigh, borderWidth: 1, borderColor: colors.outlineVariant },
  buttonText: { ...typography.labelSm, fontSize: 12, color: colors.onPrimary },
  homeButtonText: { color: colors.onSurface },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(44, 22, 14, 0.6)', justifyContent: 'center', alignItems: 'center', padding: spacing.md },
  modalCard: { width: '100%', maxWidth: 380, maxHeight: height * 0.75, backgroundColor: colors.surface, borderRadius: rounded.xl, padding: spacing.md, paddingTop: spacing.xl, paddingBottom: spacing.sm, shadowColor: 'rgba(93, 64, 55, 0.15)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16, elevation: 12, position: 'relative' },
  modalScrollContent: { flexGrow: 1, paddingBottom: spacing.xs },
  modalCloseButton: { position: 'absolute', top: spacing.sm, right: spacing.sm, width: 36, height: 36, borderRadius: rounded.full, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.surfaceContainerLow, zIndex: 10 },
  modalTitle: { ...typography.headlineSm, fontSize: 18, color: colors.onSurface, marginBottom: spacing.xs, textAlign: 'center', paddingRight: 24 },
  modalBody: { ...typography.bodyMd, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.md, lineHeight: 20 },
  modalSaveButton: { backgroundColor: colors.primaryContainer, marginBottom: spacing.xs, paddingVertical: spacing.sm, width: '100%', minHeight: 44 },
  modalDiscardButton: { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.outlineVariant, marginBottom: spacing.xs, paddingVertical: spacing.sm, width: '100%', minHeight: 44 },
  modalDiscardText: { color: colors.onSurfaceVariant },
  modalCancelButton: { minHeight: 40, alignItems: 'center', justifyContent: 'center', paddingVertical: spacing.xs, width: '100%' },
  modalCancelText: { ...typography.labelLg, fontSize: 14, color: colors.outline, fontWeight: '500' },
  savedModalCard: { width: '100%', maxWidth: 340, backgroundColor: colors.surface, borderRadius: rounded.xl, padding: spacing.xl, alignItems: 'center', shadowColor: 'rgba(93, 64, 55, 0.15)', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 1, shadowRadius: 16, elevation: 12 },
  savedIconCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primaryContainer, alignItems: 'center', justifyContent: 'center', marginBottom: spacing.md },
  savedModalTitle: { ...typography.headlineSm, fontSize: 20, color: colors.onSurface, marginBottom: spacing.xs, textAlign: 'center' },
  savedModalBody: { ...typography.bodyMd, fontSize: 14, color: colors.onSurfaceVariant, textAlign: 'center', marginBottom: spacing.lg, lineHeight: 20 },
});

export default ResultScreen;