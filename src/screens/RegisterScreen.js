// screens/RegisterScreen.js
import React, { useState, useCallback, useMemo } from 'react';
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
  success: '#27AE60',
};

const SUFFIX_OPTIONS = ['', 'Jr.', 'Sr.', 'I', 'II', 'III', 'IV', 'V'];

const TERMS_CONTENT = `
TERMS OF SERVICE
Last Updated: January 2024
1. ACCEPTANCE OF TERMS
By using RootCare, you agree to be bound by these Terms of Service.
2. DESCRIPTION OF SERVICE
RootCare provides AI-powered disease detection for cassava plants, farming insights, and marketplace connectivity.
3. USER OBLIGATIONS
- You must provide accurate information
- You are responsible for maintaining account security
- You must not misuse the service
4. PRIVACY POLICY
Your data is protected according to our Privacy Policy.
5. INTELLECTUAL PROPERTY
All content and AI models are property of RootCare.
6. LIMITATION OF LIABILITY
RootCare provides information for educational purposes only.
7. TERMINATION
We reserve the right to terminate accounts for violations.
8. CONTACT
For questions, contact us at support@rootcare.com
`;

const PRIVACY_CONTENT = `
PRIVACY POLICY
Last Updated: January 2024
1. INFORMATION WE COLLECT
- Personal information (name, email, phone)
- Farm data and location
- Images uploaded for disease detection
- Usage data and analytics
2. HOW WE USE YOUR DATA
- To provide disease detection services
- To improve our AI models
- To send notifications and updates
- To connect you with marketplace partners
3. DATA SECURITY
We implement industry-standard security measures to protect your data.
4. DATA SHARING
We do not sell your personal data. Data is shared only with:
- Service providers who assist our operations
- Agricultural partners (with your consent)
5. YOUR RIGHTS
- Access your data
- Request data deletion
- Opt-out of marketing communications
6. COOKIES
We use cookies to improve user experience.
7. CHANGES TO POLICY
We will notify you of any material changes.
8. CONTACT
Privacy concerns: privacy@rootcare.com
`;

// ================= CALENDAR MODAL COMPONENT =================
const CalendarModal = ({ visible, onClose, onSelectDate }) => {
  const today = new Date();
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth() + 1);
  const [selectedDay, setSelectedDay] = useState(today.getDate());

  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);

  const years = [];
  for (let y = today.getFullYear(); y >= 1900; y--) years.push(y);

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const handleMonthSelect = (monthIndex) => {
    setSelectedMonth(monthIndex + 1);
    setSelectedDay(1);
    setShowMonthDropdown(false);
  };

  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedDay(1);
    setShowYearDropdown(false);
  };

  const handleDone = () => {
    const formattedMonth = selectedMonth < 10 ? `0${selectedMonth}` : `${selectedMonth}`;
    const formattedDay = selectedDay < 10 ? `0${selectedDay}` : `${selectedDay}`;
    onSelectDate(formattedMonth, formattedDay, `${selectedYear}`);
    onClose();
  };

  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const firstDayOfWeek = new Date(selectedYear, selectedMonth - 1, 1).getDay(); 
  const daysArray = [];
  
  for (let i = 0; i < firstDayOfWeek; i++) daysArray.push(null);
  for (let i = 1; i <= daysInMonth; i++) daysArray.push(i);

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.calendarOverlay}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarHeader}>
            <Text style={styles.calendarTitle}>Select Date</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors['on-surface']} />
            </TouchableOpacity>
          </View>

          <View style={styles.calendarSelectors}>
            <TouchableOpacity 
              style={styles.selectorBox} 
              onPress={() => { setShowMonthDropdown(!showMonthDropdown); setShowYearDropdown(false); }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectorText}>{months[selectedMonth - 1]}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.primary} />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.selectorBox} 
              onPress={() => { setShowYearDropdown(!showYearDropdown); setShowMonthDropdown(false); }}
              activeOpacity={0.7}
            >
              <Text style={styles.selectorText}>{selectedYear}</Text>
              <Ionicons name="chevron-down" size={16} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {showMonthDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {months.map((month, index) => (
                  <TouchableOpacity
                    key={month}
                    style={[styles.dropdownItem, selectedMonth === index + 1 && styles.dropdownItemSelected]}
                    onPress={() => handleMonthSelect(index)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownItemText, selectedMonth === index + 1 && styles.dropdownItemTextSelected]}>{month}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {showYearDropdown && (
            <View style={styles.dropdownList}>
              <ScrollView style={{ maxHeight: 200 }}>
                {years.map((year) => (
                  <TouchableOpacity
                    key={year}
                    style={[styles.dropdownItem, selectedYear === year && styles.dropdownItemSelected]}
                    onPress={() => handleYearSelect(year)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.dropdownItemText, selectedYear === year && styles.dropdownItemTextSelected]}>{year}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          <View style={styles.calendarWeek}>
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
              <Text key={index} style={styles.calendarWeekText}>{day}</Text>
            ))}
          </View>

          <View style={styles.calendarGrid}>
            {daysArray.map((day, index) => {
              if (day === null) return <View key={index} style={styles.calendarDayEmpty} />;
              const isSelected = day === selectedDay;
              return (
                <TouchableOpacity
                  key={index}
                  style={[styles.calendarDay, isSelected && styles.calendarDaySelected]}
                  onPress={() => setSelectedDay(day)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.calendarDayText, isSelected && styles.calendarDayTextSelected]}>{day}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <TouchableOpacity style={styles.calendarDoneButton} onPress={handleDone} activeOpacity={0.8}>
            <Text style={styles.calendarDoneText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};
// ============================================================

const CustomModal = ({ visible, onClose, title, message, type = 'success', onConfirm }) => {
  const getIcon = () => {
    switch(type) {
      case 'success': return { name: 'checkmark-circle', color: colors.success };
      case 'error': return { name: 'alert-circle', color: colors.error };
      case 'warning': return { name: 'warning', color: '#F39C12' };
      default: return { name: 'information-circle', color: colors.primary };
    }
  };
  const icon = getIcon();

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
              <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={onConfirm || onClose} activeOpacity={0.8}>
                <Text style={styles.modalButtonText}>Continue</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity style={[styles.modalButton, styles.modalCancelButton]} onPress={onClose} activeOpacity={0.8}>
                  <Text style={styles.modalCancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.modalButton, styles.modalPrimaryButton]} onPress={onConfirm || onClose} activeOpacity={0.8}>
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

const TermsModal = ({ visible, onClose, onAccept, title, content }) => {
  const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);

  const handleScroll = (event) => {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    if (isBottom) setHasScrolledToBottom(true);
  };

  return (
    <Modal transparent={true} visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.termsModalOverlay}>
        <View style={styles.termsModalContainer}>
          <View style={styles.termsModalHeader}>
            <Text style={styles.termsModalTitle}>{title}</Text>
            <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
              <Ionicons name="close" size={24} color={colors['on-surface']} />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.termsScrollView} onScroll={handleScroll} scrollEventThrottle={16} showsVerticalScrollIndicator={true}>
            <Text style={styles.termsContentText}>{content}</Text>
          </ScrollView>
          <TouchableOpacity
            style={[styles.termsAcceptButton, !hasScrolledToBottom && styles.termsAcceptButtonDisabled]}
            onPress={() => { if (hasScrolledToBottom) { onAccept(); onClose(); } }}
            activeOpacity={0.7}
            disabled={!hasScrolledToBottom}
          >
            <Text style={styles.termsAcceptButtonText}>
              {hasScrolledToBottom ? 'I Understand & Accept' : 'Please scroll to the bottom to accept'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const RegisterScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '', middleName: '', lastName: '', suffix: '', sex: '',
    month: '', day: '', year: '', address: '', province: '', city: '',
    barangay: '', zipCode: '', phone: '', email: '', password: '', confirmPassword: '',
  });
  const [noMiddleName, setNoMiddleName] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isTermsChecked, setIsTermsChecked] = useState(false);
  const [isSuffixDropdownOpen, setIsSuffixDropdownOpen] = useState(false);
  const [age, setAge] = useState('');
  const [isCalendarVisible, setIsCalendarVisible] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('success');
  const [modalOnConfirm, setModalOnConfirm] = useState(null);

  const [termsModalVisible, setTermsModalVisible] = useState(false);
  const [termsModalType, setTermsModalType] = useState('');

  const [fieldErrors, setFieldErrors] = useState({});

  const showModal = (title, message, type = 'success', onConfirm = null) => {
    setModalTitle(title); setModalMessage(message); setModalType(type);
    setModalOnConfirm(() => onConfirm); setModalVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  const updateField = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFieldErrors(prev => {
      if (prev[field]) {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      }
      return prev;
    });
  }, []);

  const calculateAge = useCallback((month, day, year) => {
    if (!month || !day || !year) return '';
    const birthDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age > 0 ? age.toString() : '';
  }, []);

  const handleCalendarSelect = useCallback((month, day, year) => {
    setFormData(prev => {
      const newData = { ...prev, month, day, year };
      const calculatedAge = calculateAge(month, day, year);
      setAge(calculatedAge);
      return newData;
    });
  }, [calculateAge]);

  const validateForm = useCallback(() => {
    let errors = {};
    const required = ['firstName', 'lastName', 'sex', 'address', 'province', 'city', 'barangay', 'email', 'password', 'confirmPassword'];
    required.forEach(field => {
      if (!formData[field] || formData[field].length < 2) errors[field] = true;
    });
    if (formData.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) errors.email = true;
    }
    if (formData.phone && formData.phone.length !== 11) errors.phone = true;
    if (!formData.password || formData.password.length < 6) errors.password = true;
    if (!formData.confirmPassword || formData.confirmPassword !== formData.password) errors.confirmPassword = true;
    if (!isTermsChecked) {
      showModal('Error', 'Please agree to the Terms of Service to continue.', 'error');
      return false;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) {
      showModal('Error', 'Please fill in the required fields correctly.', 'error');
      return false;
    }
    return true;
  }, [formData, isTermsChecked]);

  const handleRegister = useCallback(() => {
    if (!validateForm()) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      showModal('🎉 Registration Successful!', 'Your account has been created successfully. Please login to continue.', 'success', () => navigation.replace('Login'));
    }, 1500);
  }, [validateForm, navigation]);

  const handleLogin = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  }, [navigation]);

  const openTermsModal = useCallback(() => {
    setTermsModalType('terms');
    setTermsModalVisible(true);
  }, []);

  const openPrivacyModal = useCallback(() => {
    setTermsModalType('privacy');
    setTermsModalVisible(true);
  }, []);

  const handleTermsAccept = useCallback(() => {
    setIsTermsChecked(true);
  }, []);

  const getInputStyle = useCallback((field) => {
    const value = formData[field];
    const hasError = fieldErrors[field];
    if (value && value.length > 0 && !hasError) return styles.inputValid;
    else if (value && value.length > 0 && hasError) return styles.inputError;
    return {};
  }, [formData, fieldErrors]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.keyboardView}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.header}>
            <Text style={styles.title}>Create Your Account</Text>
            <Text style={styles.subtitle}>Join RootCare to start managing your farm smarter.</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Personal Information</Text>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('firstName')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.firstName} onChangeText={(text) => updateField('firstName', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.firstName) && styles.floatingLabelActive]}>First Name *</Text>
                  {fieldErrors.firstName && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.firstName && !fieldErrors.firstName && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.middleName && styles.inputFilled]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.middleName} onChangeText={(text) => updateField('middleName', text)} autoCapitalize="words" editable={!noMiddleName} />
                  <Text style={[styles.floatingLabel, (formData.middleName) && styles.floatingLabelActive]}>Middle Name</Text>
                </View>
                <TouchableOpacity style={styles.checkboxRow} onPress={() => setNoMiddleName(!noMiddleName)} activeOpacity={0.7}>
                  <View style={[styles.checkbox, noMiddleName && styles.checkboxChecked]}>
                    {noMiddleName && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                  </View>
                  <Text style={styles.checkboxLabel}>No middle name</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('lastName')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.lastName} onChangeText={(text) => updateField('lastName', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.lastName) && styles.floatingLabelActive]}>Last Name *</Text>
                  {fieldErrors.lastName && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.lastName && !fieldErrors.lastName && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <TouchableOpacity style={[styles.inputContainer, styles.dropdownContainer]} onPress={() => setIsSuffixDropdownOpen(!isSuffixDropdownOpen)} activeOpacity={0.7}>
                  <Text style={[styles.input, formData.suffix ? styles.inputFilled : {}]}>{formData.suffix || 'Suffix'}</Text>
                  <Ionicons name={isSuffixDropdownOpen ? 'chevron-up' : 'chevron-down'} size={24} color={colors.outline} style={styles.dropdownIcon} />
                </TouchableOpacity>
                {isSuffixDropdownOpen && (
                  <View style={styles.dropdownList}>
                    {SUFFIX_OPTIONS.map((suffix) => (
                      <TouchableOpacity key={suffix || 'none'} style={[styles.dropdownItem, formData.suffix === suffix && styles.dropdownItemSelected]} onPress={() => { updateField('suffix', suffix); setIsSuffixDropdownOpen(false); }} activeOpacity={0.7}>
                        <Text style={[styles.dropdownItemText, formData.suffix === suffix && styles.dropdownItemTextSelected]}>{suffix || 'None'}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>

              <View style={styles.sexContainer}>
                <Text style={styles.sexLabel}>Sex at Birth *</Text>
                <View style={styles.sexOptions}>
                  <TouchableOpacity style={[styles.sexOption, formData.sex === 'male' && styles.sexOptionActive]} onPress={() => updateField('sex', 'male')} activeOpacity={0.7}>
                    <Text style={[styles.sexOptionText, formData.sex === 'male' && styles.sexOptionTextActive]}>Male</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={[styles.sexOption, formData.sex === 'female' && styles.sexOptionActive]} onPress={() => updateField('sex', 'female')} activeOpacity={0.7}>
                    <Text style={[styles.sexOptionText, formData.sex === 'female' && styles.sexOptionTextActive]}>Female</Text>
                  </TouchableOpacity>
                </View>
                {fieldErrors.sex && <Text style={styles.errorText}>Please select your sex</Text>}
              </View>

              {/* Date of Birth - Fixed Layout with Solid Label */}
              <View style={styles.inputWrapper}>
                <TouchableOpacity style={styles.dateInputContainer} onPress={() => setIsCalendarVisible(true)} activeOpacity={0.7}>
                  <View style={styles.dateIconContainer}>
                    <Ionicons name="calendar-outline" size={20} color={colors['outline-variant']} />
                  </View>
                  <View style={styles.dateTextContainer}>
                    <Text style={styles.dateLabel}>Date of Birth *</Text>
                    <Text style={[styles.dateValue, !formData.month && styles.datePlaceholder]}>
                      {formData.month && formData.day && formData.year ? 
                        `${formData.month}/${formData.day}/${formData.year}` : 'Select Date'}
                    </Text>
                  </View>
                </TouchableOpacity>
                {age && <Text style={styles.ageText}>Age: {age} years old</Text>}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact & Address</Text>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('address')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.address} onChangeText={(text) => updateField('address', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.address) && styles.floatingLabelActive]}>Complete Address *</Text>
                  {fieldErrors.address && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.address && !fieldErrors.address && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('province')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.province} onChangeText={(text) => updateField('province', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.province) && styles.floatingLabelActive]}>Province *</Text>
                  {fieldErrors.province && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.province && !fieldErrors.province && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('city')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.city} onChangeText={(text) => updateField('city', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.city) && styles.floatingLabelActive]}>City/Municipality *</Text>
                  {fieldErrors.city && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.city && !fieldErrors.city && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('barangay')]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.barangay} onChangeText={(text) => updateField('barangay', text)} autoCapitalize="words" />
                  <Text style={[styles.floatingLabel, (formData.barangay) && styles.floatingLabelActive]}>Barangay *</Text>
                  {fieldErrors.barangay && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.barangay && !fieldErrors.barangay && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, formData.zipCode && styles.inputFilled]}>
                  <TextInput style={styles.input} placeholder=" " value={formData.zipCode} onChangeText={(text) => updateField('zipCode', text)} keyboardType="numeric" />
                  <Text style={[styles.floatingLabel, (formData.zipCode) && styles.floatingLabelActive]}>Zip Code</Text>
                </View>
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('phone')]}>
                  <Ionicons name="call-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput style={[styles.input, styles.inputWithIcon]} placeholder=" " value={formData.phone} onChangeText={(text) => { const cleaned = text.replace(/[^0-9]/g, '').slice(0, 11); updateField('phone', cleaned); }} keyboardType="phone-pad" maxLength={11} />
                  <Text style={[styles.floatingLabel, (formData.phone) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>Phone Number (11 digits)</Text>
                  {fieldErrors.phone && formData.phone && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.phone && !fieldErrors.phone && formData.phone.length === 11 && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
                {fieldErrors.phone && formData.phone && <Text style={styles.errorText}>Phone must be 11 digits</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('email')]}>
                  <Ionicons name="mail-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput style={[styles.input, styles.inputWithIcon]} placeholder=" " value={formData.email} onChangeText={(text) => updateField('email', text)} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} />
                  <Text style={[styles.floatingLabel, (formData.email) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>Email Address *</Text>
                  {fieldErrors.email && formData.email && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.email && !fieldErrors.email && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                </View>
                {fieldErrors.email && formData.email && <Text style={styles.errorText}>Please enter a valid email address</Text>}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Security</Text>

              <TouchableOpacity style={styles.photoUpload} activeOpacity={0.7}>
                <Ionicons name="add-a-photo" size={32} color={colors.outline} />
                <Text style={styles.photoUploadText}>Upload Profile Photo</Text>
                <Text style={styles.photoUploadSubtext}>PNG, JPG up to 5MB</Text>
              </TouchableOpacity>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('password')]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput style={[styles.input, styles.inputWithIcon, styles.passwordInput]} placeholder=" " value={formData.password} onChangeText={(text) => updateField('password', text)} secureTextEntry={!showPassword} />
                  <Text style={[styles.floatingLabel, (formData.password) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>Password * (min 6 chars)</Text>
                  {fieldErrors.password && formData.password && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.password && !fieldErrors.password && formData.password.length >= 6 && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)} activeOpacity={0.7}>
                    <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors['on-surface-variant']} />
                  </TouchableOpacity>
                </View>
                {fieldErrors.password && formData.password && <Text style={styles.errorText}>Password must be at least 6 characters</Text>}
              </View>

              <View style={styles.inputWrapper}>
                <View style={[styles.inputContainer, getInputStyle('confirmPassword')]}>
                  <Ionicons name="lock-closed-outline" size={20} color={colors['outline-variant']} style={styles.inputIcon} />
                  <TextInput style={[styles.input, styles.inputWithIcon, styles.passwordInput]} placeholder=" " value={formData.confirmPassword} onChangeText={(text) => updateField('confirmPassword', text)} secureTextEntry={!showConfirmPassword} />
                  <Text style={[styles.floatingLabel, (formData.confirmPassword) && styles.floatingLabelActive, styles.floatingLabelWithIcon]}>Confirm Password *</Text>
                  {fieldErrors.confirmPassword && formData.confirmPassword && <Ionicons name="alert-circle" size={20} color={colors.error} style={styles.errorIcon} />}
                  {formData.confirmPassword && !fieldErrors.confirmPassword && formData.confirmPassword === formData.password && <Ionicons name="checkmark-circle" size={20} color={colors.success} style={styles.checkmarkIcon} />}
                  <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowConfirmPassword(!showConfirmPassword)} activeOpacity={0.7}>
                    <Ionicons name={showConfirmPassword ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors['on-surface-variant']} />
                  </TouchableOpacity>
                </View>
                {fieldErrors.confirmPassword && formData.confirmPassword && <Text style={styles.errorText}>Passwords do not match</Text>}
              </View>
            </View>

            <View style={styles.consentSection}>
              <TouchableOpacity style={styles.termsRow} onPress={() => { if (!isTermsChecked) { openTermsModal(); } else { setIsTermsChecked(false); } }} activeOpacity={0.7}>
                <View style={[styles.checkbox, isTermsChecked && styles.checkboxChecked]}>
                  {isTermsChecked && <Ionicons name="checkmark" size={14} color="#FFFFFF" />}
                </View>
                <Text style={styles.termsText}>
                  I agree to the <Text style={styles.termsLink} onPress={openTermsModal}>Terms of Service</Text> and <Text style={styles.termsLink} onPress={openPrivacyModal}>Privacy Policy</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]} onPress={handleRegister} activeOpacity={0.85} disabled={isLoading}>
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

            <View style={styles.dividerContainer}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity onPress={handleLogin} activeOpacity={0.7}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <CustomModal visible={modalVisible} onClose={closeModal} title={modalTitle} message={modalMessage} type={modalType} onConfirm={modalOnConfirm} />
      <TermsModal visible={termsModalVisible} onClose={() => setTermsModalVisible(false)} onAccept={handleTermsAccept} title={termsModalType === 'terms' ? 'Terms of Service' : 'Privacy Policy'} content={termsModalType === 'terms' ? TERMS_CONTENT : PRIVACY_CONTENT} />
      
      <CalendarModal 
        visible={isCalendarVisible} 
        onClose={() => setIsCalendarVisible(false)} 
        onSelectDate={handleCalendarSelect} 
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
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors['primary-container'],
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors['on-surface-variant'],
    textAlign: 'center',
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
    borderBottomWidth: 1,
    borderBottomColor: colors['surface-container-low'],
    paddingBottom: 8,
    marginBottom: 12,
  },
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
  inputValid: {
    borderColor: colors.success,
  },
  inputError: {
    borderColor: colors.error,
  },
  input: {
    width: '100%',
    height: '100%',
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 8,
    fontSize: 16,
    color: colors['on-surface'],
    paddingRight: 56,
  },
  inputWithIcon: {
    paddingLeft: 44,
    paddingRight: 64,
  },
  passwordInput: {
    paddingRight: 64,
  },
  inputIcon: {
    position: 'absolute',
    left: 12,
    top: 18,
  },
  errorIcon: {
    position: 'absolute',
    right: 44,
    top: 18,
  },
  checkmarkIcon: {
    position: 'absolute',
    right: 44,
    top: 18,
  },
  floatingLabel: {
    position: 'absolute',
    left: 16,
    top: 18,
    fontSize: 16,
    color: colors['on-surface-variant'],
    pointerEvents: 'none',
  },
  floatingLabelWithIcon: {
    left: 44,
    maxWidth: '70%',
  },
  floatingLabelActive: {
    top: 6,
    fontSize: 12,
    color: colors['primary-container'],
    backgroundColor: colors['surface-container-lowest'],
    paddingHorizontal: 4,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: 4,
    marginLeft: 4,
  },
  eyeIcon: {
    position: 'absolute',
    right: 8,
    top: 16,
    padding: 4,
  },
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
  },
  sexContainer: {
    marginBottom: 12,
  },
  sexLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors['on-surface'],
    marginBottom: 8,
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
  },
  sexOptionTextActive: {
    color: colors['on-primary'],
    fontWeight: '600',
  },
  // FIXED Date Input Styles
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    backgroundColor: colors['surface-container-lowest'],
    height: 56,
    paddingHorizontal: 16,
  },
  dateIconContainer: {
    marginRight: 12,
  },
  dateTextContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  dateLabel: {
    fontSize: 12,
    color: colors['primary-container'],
    marginBottom: 2,
  },
  dateValue: {
    fontSize: 16,
    color: colors['on-surface'],
  },
  datePlaceholder: {
    color: colors['on-surface-variant'],
  },
  ageText: {
    fontSize: 14,
    color: colors['primary-container'],
    fontWeight: '600',
    marginTop: 6,
  },
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
    marginTop: 4,
  },
  photoUploadSubtext: {
    fontSize: 12,
    color: colors['on-surface-variant'],
    marginTop: 2,
  },
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
    flex: 1,
  },
  termsLink: {
    color: colors['primary-container'],
    fontWeight: '600',
  },
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
  },
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
  },
  loginContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    fontSize: 14,
    color: colors['on-surface-variant'],
  },
  loginLink: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['primary-container'],
    marginLeft: 4,
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
    marginBottom: 8,
    textAlign: 'center',
  },
  modalMessage: {
    fontSize: 15,
    fontWeight: '400',
    color: colors['on-surface-variant'],
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
  },
  modalCancelButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors['on-surface'],
  },
  termsModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  termsModalContainer: {
    backgroundColor: colors['surface-container-lowest'],
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 24,
    elevation: 12,
  },
  termsModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  termsModalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  termsScrollView: {
    maxHeight: 400,
    marginBottom: 16,
  },
  termsContentText: {
    fontSize: 14,
    lineHeight: 24,
    color: colors['on-surface-variant'],
  },
  termsAcceptButton: {
    backgroundColor: colors['primary-container'],
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  termsAcceptButtonDisabled: {
    backgroundColor: colors['outline-variant'],
    opacity: 0.6,
  },
  termsAcceptButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-primary'],
  },
  dropdownContainer: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  dropdownIcon: {
    position: 'absolute',
    right: 12,
    top: 16,
  },
  dropdownList: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    backgroundColor: colors['surface-container-lowest'],
    borderWidth: 1,
    borderColor: colors.outline,
    borderRadius: 8,
    zIndex: 100,
    maxHeight: 200,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors['surface-container-low'],
  },
  dropdownItemSelected: {
    backgroundColor: colors['surface-container-low'],
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors['on-surface'],
  },
  dropdownItemTextSelected: {
    color: colors['primary-container'],
    fontWeight: '600',
  },
  // ================= CALENDAR STYLES =================
  calendarOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  calendarContainer: {
    backgroundColor: colors['surface-container-lowest'],
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calendarTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors['on-surface'],
  },
  calendarSelectors: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
    marginBottom: 16,
  },
  selectorBox: {
    flex: 1,
    height: 48,
    backgroundColor: colors['surface-container-low'],
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  selectorText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors['on-surface'],
  },
  calendarWeek: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  calendarWeekText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-surface-variant'],
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  calendarDayEmpty: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
  },
  calendarDay: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    marginBottom: 4,
  },
  calendarDaySelected: {
    backgroundColor: colors['primary-container'],
  },
  calendarDayText: {
    fontSize: 16,
    color: colors['on-surface'],
  },
  calendarDayTextSelected: {
    color: colors['on-primary'],
    fontWeight: '600',
  },
  calendarDoneButton: {
    backgroundColor: colors['primary-container'],
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
  },
  calendarDoneText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors['on-primary'],
  },
});

export default RegisterScreen;