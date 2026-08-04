// screens/RegisterScreen.js
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
  Alert,
  ActivityIndicator,
  Image,
  Modal,
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
  error: '#BA1A1A',
  'on-error': '#FFFFFF',
  background: '#FFF8F6',
  'on-background': '#2C160E',
};

// Custom Modal Component (reused from LoginScreen)
const CustomModal = ({ visible, onClose, title, message, type = 'success', onConfirm }) => {
  const getIcon = () => {
    switch(type) {
      case 'success':
        return { name: 'checkmark-circle', color: '#27AE60' };
      case 'error':
        return { name: 'alert-circle', color: colors.error };
      case 'warning':
        return { name: 'warning', color: '#F39C12' };
      default:
        return { name: 'information-circle', color: colors.primary };
    }
  };

  const icon = getIcon();

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={[styles.modalIconContainer, { backgroundColor: icon.color + '15' }]}>
            <Ionicons name={icon.name} size={48} color={icon.color} />
          </View>
          <Text style={styles.modalTitle}>{title}</Text>
          <Text style={styles.modalMessage}>{message}</Text>
          <View style={styles.modalButtonContainer}>
            {type === 'success' ? (
              <TouchableOpacity
                style={[styles.modalButton, styles.modalPrimaryButton]}
                onPress={onConfirm || onClose}
                activeOpacity={0.8}
              >
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalCancelButton]}
                  onPress={onClose}
                  activeOpacity={0.8}
                >
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.modalButton, styles.modalPrimaryButton]}
                  onPress={onConfirm || onClose}
                  activeOpacity={0.8}
                >
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

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    suffix: '',
    sex: '',
    dob: '',
    civilStatus: '',
    nationality: '',
    religion: '',
    address: '',
    province: '',
    city: '',
    barangay: '',
    zipCode: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [noMiddleName, setNoMiddleName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  
  // Modal states
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

  const closeModal = () => {
    setModalVisible(false);
  };

  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleRegister = () => {
    // Basic validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      showModal('Error', 'Please fill in all required fields.', 'error');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      showModal('Error', 'Passwords do not match.', 'error');
      return;
    }

    if (!isTermsChecked) {
      showModal('Error', 'Please agree to the Terms of Service and Privacy Policy.', 'error');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      showModal('Error', 'Please enter a valid email address.', 'error');
      return;
    }

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);

    // Simulate registration API call
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showModal(
        '🎉 Registration Successful!',
        'Your account has been created successfully. Please login to continue.',
        'success',
        () => navigation.replace('Login')
      );
    }, 1500);
  };

  const handleLogin = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={require('../assets/logo.png')}
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Join RootCare to start managing your farm smarter.</Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            {/* Personal Information */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              {/* First Name */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.firstName && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.firstName}
                    onChangeText={(text) => updateField('firstName', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.firstName) && styles.floatingLabelActive]}>
                    First Name *
                  </Text>
                </View>
              </View>

              {/* Middle Name */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.middleName && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.middleName}
                    onChangeText={(text) => updateField('middleName', text)}
                    autoCapitalize="words"
                    editable={!noMiddleName}
                  />
                  <Text style={[styles.floatingLabel, (formData.middleName) && styles.floatingLabelActive]}>
                    Middle Name
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.checkboxRow}
                  onPress={() => setNoMiddleName(!noMiddleName)}
                  activeOpacity={0.7}
                >
                  <View style={[styles.checkbox, noMiddleName && styles.checkboxChecked]}>
                    {noMiddleName && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>No middle name</Text>
                </TouchableOpacity>
              </View>

              {/* Last Name */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.lastName && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.lastName}
                    onChangeText={(text) => updateField('lastName', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.lastName) && styles.floatingLabelActive]}>
                    Last Name *
                  </Text>
                </View>
              </View>

              {/* Suffix */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.suffix && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.suffix}
                    onChangeText={(text) => updateField('suffix', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.suffix) && styles.floatingLabelActive]}>
                    Suffix
                  </Text>
                </View>
              </View>

              {/* Sex */}
              <View style={styles.sexContainer}>
                <Text style={styles.sexLabel}>Sex *</Text>
                <View style={styles.sexOptions}>
                  <TouchableOpacity
                    style={[styles.sexOption, formData.sex === 'male' && styles.sexOptionActive]}
                    onPress={() => updateField('sex', 'male')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.sexOptionText, formData.sex === 'male' && styles.sexOptionTextActive]}>
                      Male
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.sexOption, formData.sex === 'female' && styles.sexOptionActive]}
                    onPress={() => updateField('sex', 'female')}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.sexOptionText, formData.sex === 'female' && styles.sexOptionTextActive]}>
                      Female
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Date of Birth */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.dob && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.dob}
                    onChangeText={(text) => updateField('dob', text)}
                  />
                  <Text style={[styles.floatingLabel, (formData.dob) && styles.floatingLabelActive]}>
                    Date of Birth
                  </Text>
                </View>
              </View>

              {/* Civil Status */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.civilStatus && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.civilStatus}
                    onChangeText={(text) => updateField('civilStatus', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.civilStatus) && styles.floatingLabelActive]}>
                    Civil Status
                  </Text>
                </View>
              </View>

              {/* Nationality */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.nationality && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.nationality}
                    onChangeText={(text) => updateField('nationality', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.nationality) && styles.floatingLabelActive]}>
                    Nationality
                  </Text>
                </View>
              </View>

              {/* Religion */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.religion && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.religion}
                    onChangeText={(text) => updateField('religion', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.religion) && styles.floatingLabelActive]}>
                    Religion
                  </Text>
                </View>
              </View>
            </View>

            {/* Contact & Address */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact &amp; Address</Text>

              {/* Address */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.address && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.address}
                    onChangeText={(text) => updateField('address', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.address) && styles.floatingLabelActive]}>
                    Complete Address *
                  </Text>
                </View>
              </View>

              {/* Province */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.province && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.province}
                    onChangeText={(text) => updateField('province', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.province) && styles.floatingLabelActive]}>
                    Province *
                  </Text>
                </View>
              </View>

              {/* City */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.city && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.city}
                    onChangeText={(text) => updateField('city', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.city) && styles.floatingLabelActive]}>
                    City/Municipality *
                  </Text>
                </View>
              </View>

              {/* Barangay */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.barangay && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.barangay}
                    onChangeText={(text) => updateField('barangay', text)}
                    autoCapitalize="words"
                  />
                  <Text style={[styles.floatingLabel, (formData.barangay) && styles.floatingLabelActive]}>
                    Barangay *
                  </Text>
                </View>
              </View>

              {/* Zip Code */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.zipCode && styles.inputFilled]}>
                  <TextInput
                    style={styles.input}
                    placeholder=" "
                    value={formData.zipCode}
                    onChangeText={(text) => updateField('zipCode', text)}
                    keyboardType="numeric"
                  />
                  <Text style={[styles.floatingLabel, (formData.zipCode) && styles.floatingLabelActive]}>
                    Zip Code
                  </Text>
                </View>
              </View>

              {/* Phone */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.phone && styles.inputFilled]}>
                  <Ionicons name="call-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder=" "
                    value={formData.phone}
                    onChangeText={(text) => updateField('phone', text)}
                    keyboardType="phone-pad"
                  />
                  <Text style={[styles.floatingLabel, (formData.phone) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>
                    Phone Number
                  </Text>
                </View>
              </View>

              {/* Email */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.email && styles.inputFilled]}>
                  <Ionicons name="mail-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon]}
                    placeholder=" "
                    value={formData.email}
                    onChangeText={(text) => updateField('email', text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                  />
                  <Text style={[styles.floatingLabel, (formData.email) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>
                    Email Address *
                  </Text>
                </View>
              </View>
            </View>

            {/* Account Security */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Security</Text>

              {/* Photo Upload Placeholder */}
              <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
                <Ionicons name="add-a-photo" size={32} color={colors.outline} />
                <Text style={styles.photoUploadText}>Upload Profile Photo</Text>
                <Text style={styles.photoUploadSubtext}>PNG, JPG up to 5MB</Text>
              </TouchableOpacity>

              {/* Password */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.password && styles.inputFilled]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon, styles.passwordInput]}
                    placeholder=" "
                    value={formData.password}
                    onChangeText={(text) => updateField('password', text)}
                    secureTextEntry={!showPassword}
                  />
                  <Text style={[styles.floatingLabel, (formData.password) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>
                    Password *
                  </Text>
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowPassword(!showPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors['on-surface-variant']}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.confirmPassword && styles.inputFilled]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput
                    style={[styles.input, styles.inputWithIcon, styles.passwordInput]}
                    placeholder=" "
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateField('confirmPassword', text)}
                    secureTextEntry={!showConfirmPassword}
                  />
                  <Text style={[styles.floatingLabel, (formData.confirmPassword) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>
                    Confirm Password *
                  </Text>
                  <TouchableOpacity
                    style={styles.eyeIcon}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                    activeOpacity={0.7}
                  >
                    <Ionicons
                      name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'}
                      size={22}
                      color={colors['on-surface-variant']}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            {/* Consent & Action */}
            <View style={styles.consentSection}>
              <TouchableOpacity
                style={styles.termsRow}
                onPress={() => setIsTermsChecked(!isTermsChecked)}
                activeOpacity={0.7}
              >
                <View style={[styles.checkbox, isTermsChecked && styles.checkboxChecked]}>
                  {isTermsChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink}>Terms of Service</Text> and <Text style={styles.termsLink}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
                onPress={handleRegister}
                activeOpacity={0.85}
                disabled={isLoading}
              >
                {isLoading ? (
                  <ActivityIndicator size="small" color={colors['on-primary']} />
                ) : (
                  <>
                    <Text style={styles.signUpButtonText}>Sign Up</Text>
                    <Ionicons name="person-add-outline" size={20} color={colors['on-primary']} />
                  </>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Login Link */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Custom Modal */}
      <CustomModal
        visible={modalVisible}
        onClose={closeModal}
        title={modalTitle}
        message={modalMessage}
        type={modalType}
        onConfirm={modalOnConfirm}
      />
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
  // Header
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: colors['surface-container-lowest'],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors['surface-container-highest'],
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  logo: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['primary-container'],
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
    textAlign: 'center',
  },
  // Form
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    fontFamily: 'Montserrat_600SemiBold',
    borderBottomWidth: 1,
    borderBottomColor: colors['surface-container-low'],
    paddingBottom: 8,
    marginBottom: 12,
  },
  // Input
  inputWrapper: {
    marginBottom: 12,
  },
  inputContainer: {
    position: 'relative',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    backgroundColor: colors['surface-container-lowest'],
    height: 56,
  },
  inputFilled: {
    borderColor: colors['primary-container'],
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
  inputWithIcon: {
    paddingLeft: 44,
  },
  passwordInput: {
    paddingRight: 48,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 18,
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 16,
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
    pointerEvents: 'none',
  },
  floatingLabelWithIcon: {
    left: 44,
  },
  floatingLabelActive: {
    top: 6,
    fontSize: 12,
    color: colors['primary-container'],
    backgroundColor: colors['surface-container-lowest'],
    paddingHorizontal: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
    padding: 4,
  },
  // Checkbox
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    paddingHorizontal: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: colors.outline,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: colors['primary-container'],
    borderColor: colors['primary-container'],
  },
  checkboxLabel: {
    fontSize: 12,
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
  },
  // Sex
  sexContainer: {
    marginBottom: 12,
  },
  sexLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors['on-surface'],
    marginBottom: 8,
    fontFamily: 'OpenSans_500Medium',
  },
  sexOptions: {
    flexDirection: 'row',
    backgroundColor: colors['surface-container-low'],
    borderRadius: 8,
    padding: 4,
  },
  sexOption: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 6,
  },
  sexOptionActive: {
    backgroundColor: colors['primary-container'],
  },
  sexOptionText: {
    fontSize: 14,
    color: colors['on-surface'],
    fontFamily: 'OpenSans_400Regular',
  },
  sexOptionTextActive: {
    color: colors['on-primary'],
    fontWeight: '600',
  },
  // Photo Upload
  photoUpload: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderWidth: 2,
    borderColor: colors['outline-variant'],
    borderStyle: 'dashed',
    borderRadius: 8,
    backgroundColor: colors['surface-container-low'],
    marginBottom: 12,
  },
  photoUploadText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors['on-surface'],
    fontFamily: 'OpenSans_500Medium',
    marginTop: 4,
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
    marginTop: 2,
  },
  // Consent
  consentSection: {
    marginTop: 8,
  },
  termsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsText: {
    fontSize: 14,
    color: colors['on-surface'],
    fontFamily: 'OpenSans_400Regular',
    flex: 1,
  },
  termsLink: {
    color: colors['primary-container'],
    fontWeight: '600',
    fontFamily: 'OpenSans_600SemiBold',
  },
  // Sign Up Button
  signUpButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors['primary-container'],
    borderRadius: 8,
    height: 48,
    gap: 8,
    shadowColor: colors['primary-container'],
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  signUpButtonDisabled: {
    opacity: 0.6,
  },
  signUpButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-primary'],
    fontFamily: 'OpenSans_600SemiBold',
  },
  // Divider
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginTop: 16,
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
  // Login Link
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors['on-surface-variant'],
    fontFamily: 'OpenSans_400Regular',
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['primary-container'],
    fontFamily: 'OpenSans_600SemiBold',
    marginLeft: 4,
  },
  // ===== MODAL STYLES =====
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

export default RegisterScreen;