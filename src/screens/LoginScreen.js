// screens/LoginScreen.js
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  ActivityIndicator,
  Image,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
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
  error: '#BA1A1A',
  'on-error': '#FFFFFF',
  background: '#FFF8F6',
  'on-background': '#2C160E',
};

const CustomModal = ({ visible, onClose, title, message, type = 'success', onConfirm }) => {
  const getIcon = () => {
    switch(type) {
      case 'success': return { name: 'checkmark-circle', color: '#27AE60' };
      case 'error': return { name: 'alert-circle', color: colors.error };
      case 'warning': return { name: 'warning', color: '#F39C12' };
      default: return { name: 'information-circle', color: colors.primary };
    }
  };

  const icon = getIcon();

  const handleActionPress = () => {
    onClose(); 
    if (onConfirm) {
      setTimeout(() => {
        onConfirm();
      }, 300);
    }
  };

  return (
    <Modal transparent={true} visible={visible} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalIconContainer, { backgroundColor: icon.color + '15' }]}>
            <Ionicons name={icon.name} size={48} color={icon.color} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtonContainer}>
            {type === 'success' ? (
              <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={handleActionPress} activeOpacity={0.8}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={handleActionPress} activeOpacity={0.8}>
                  <Text style={styles.modalButtonText}>OK</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  const showModal = (title, message, type = 'success', onConfirm = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalType(type);
    setModalOnConfirm(() => onConfirm);
    setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showModal('Missing Information', 'Please enter both email and password.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showModal('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    try {
      console.log('🔍 Attempting login with:', email.trim());
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        
        let message = 'An error occurred during login.';
        if (error.message.includes('Invalid login credentials')) {
          message = 'Invalid email or password. Please try again.';
        } else if (error.message.includes('Email not confirmed')) {
          message = 'Please confirm your email address before logging in.';
        }
        
        console.error('❌ Login error:', error.message);
        showModal('Error', message, 'error');
      } else {
        console.log('✅ Login successful!');
        console.log('Session:', data.session ? 'created' : 'none');
        console.log('User:', data.user?.email);
        
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showModal(
          'Welcome Back! 🎉',
          'You have successfully logged in to RootCare.',
          'success',
          () => navigation.replace('MainTabs')
        );
      }
    } catch (error) {
      console.error('❌ Login exception:', error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showModal('Error', 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    showModal(
      'Guest Mode',
      'Continue as a guest? You\'ll have limited access to features.',
      'warning',
      () => {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.replace('MainTabs');
      }
    );
  };

  const handleForgotPassword = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    
    if (!email) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showModal('Email Required', 'Please enter your email address first.', 'warning');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      showModal('Invalid Email', 'Please enter a valid email address.', 'warning');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
      
      if (error) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        showModal('Error', 'Failed to send password reset email. Please try again.', 'error');
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        showModal(
          'Password Reset Sent',
          'Check your email for password reset instructions.',
          'success',
          () => closeModal()
        );
      }
    } catch (error) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      showModal('Error', 'An unexpected error occurred. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.navigate('Register');
  };

  const formContent = (
    <>
      <View style={styles.logoSection}>
        <View style={styles.logoContainer}>
          <Image source={require('../assets/logo.png')} style={styles.logo} resizeMode="contain" />
        </View>
        <Text style={styles.welcomeText}>Welcome Back</Text>
        <Text style={styles.subtitleText}>Sign in to manage your fields</Text>
      </View>

      <View style={styles.formContainer}>
        {/* Email Input */}
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, emailFocused && styles.inputFocused]}>
            <TextInput
              style={styles.input}
              placeholder=" "
              value={email}
              onChangeText={setEmail}
              onFocus={() => setEmailFocused(true)}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text pointerEvents="none" style={[styles.floatingLabel, (emailFocused || email) && styles.floatingLabelActive]}>
              Email Address
            </Text>
          </View>
        </View>

        {/* Password Input */}
        <View style={styles.inputWrapper}>
          <View style={[styles.inputContainer, passwordFocused && styles.inputFocused]}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder=" "
              value={password}
              onChangeText={setPassword}
              onFocus={() => setPasswordFocused(true)}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
            />
            <Text pointerEvents="none" style={[styles.floatingLabel, (passwordFocused || password) && styles.floatingLabelActive]}>
              Password
            </Text>
            <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
              <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors['on-surface-variant']} />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.forgotPasswordContainer} onPress={handleForgotPassword} activeOpacity={0.7}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.loginButton, isLoading && styles.loginButtonDisabled]} onPress={handleLogin} activeOpacity={0.85} disabled={isLoading}>
          {isLoading ? (
            <ActivityIndicator size="small" color={colors['on-primary']} />
          ) : (
            <>
              <Text style={styles.loginButtonText}>Login</Text>
              <Ionicons name="arrow-forward" size={20} color={colors['on-primary']} />
            </>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or</Text>
          <View style={styles.dividerLine} />
        </View>

        <TouchableOpacity style={styles.googleButton} onPress={() => { Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light); showModal('Google Sign In', 'Google authentication will be available soon!', 'info'); }} activeOpacity={0.7}>
          <View style={styles.googleIcon}><Text style={styles.googleIconText}>G</Text></View>
          <Text style={styles.googleButtonText}>Continue with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.guestButton} onPress={handleGuestLogin} activeOpacity={0.7}>
          <Ionicons name="person-outline" size={20} color={colors.primary} />
          <Text style={styles.guestButtonText}>Continue as Guest</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={handleRegister} activeOpacity={0.7}>
          <Text style={styles.registerLink}>Register</Text>
        </TouchableOpacity>
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {Platform.OS === 'ios' ? (
        <KeyboardAvoidingView behavior="padding" style={styles.keyboardView}>
          <ScrollView 
            contentContainerStyle={styles.scrollContent} 
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            {formContent}
          </ScrollView>
        </KeyboardAvoidingView>
      ) : (
        <ScrollView 
          contentContainerStyle={styles.scrollContent} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {formContent}
        </ScrollView>
      )}

      <CustomModal visible={modalVisible} onClose={closeModal} title={modalTitle} message={modalMessage} type={modalType} onConfirm={modalOnConfirm} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.surface,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    width: 100,
    height: 100,
    borderRadius: 12,
    backgroundColor: colors['surface-container-lowest'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: colors['surface-container-highest'],
  },
  logo: {
    width: 80,
    height: 80,
  },
  welcomeText: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  subtitleText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
  },
  formContainer: {
    backgroundColor: colors['surface-container-lowest'],
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: colors['surface-container-low'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 1,
  },
  inputWrapper: {
    marginBottom: 16,
  },
  inputContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    backgroundColor: colors['surface-container-lowest'],
    height: 56,
  },
  inputFocused: {
    borderColor: colors.primary,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 1,
  },
  input: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 16,
    color: colors['on-surface'],
    fontFamily: 'OpenSans_400Regular',
  },
  passwordInput: {
    paddingRight: 48,
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 16,
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
  },
  floatingLabelActive: {
    top: 6,
    fontSize: 12,
    color: colors.primary,
    backgroundColor: colors['surface-container-lowest'],
    paddingHorizontal: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    padding: 4,
  },
  forgotPasswordContainer: {
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 8,
    height: 56,
    gap: 8,
    marginBottom: 16,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-primary'],
    fontFamily: 'OpenSans_600SemiBold',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors['outline-variant'],
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors['on-surface-variant'],
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'OpenSans_500Medium',
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['surface-container'],
    borderWidth: 1,
    borderColor: colors['outline-variant'],
    borderRadius: 8,
    height: 56,
    gap: 12,
    marginBottom: 12,
  },
  googleIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4285F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleIconText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  googleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-surface'],
    fontFamily: 'OpenSans_600SemiBold',
  },
  guestButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 8,
    height: 48,
    gap: 8,
  },
  guestButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  registerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  registerText: {
    fontSize: 16,
    fontWeight: '400',
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
  },
  registerLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'OpenSans_600SemiBold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: colors['surface-container-lowest'],
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['on-surface'],
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '400',
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalPrimaryButton: {
    backgroundColor: colors.primary,
  },
  modalCancelButton: {
    backgroundColor: colors['surface-container-low'],
  },
  modalButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors['on-primary'],
    fontFamily: 'OpenSans_600SemiBold',
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors['on-surface'],
    fontFamily: 'OpenSans_600SemiBold',
  },
});

export default LoginScreen;