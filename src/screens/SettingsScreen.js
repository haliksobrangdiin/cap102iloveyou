import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const SettingsScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = ['English', 'Filipino', 'Spanish', 'French', 'Chinese'];

  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    console.log(`Language changed to: ${language}`);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    console.log(`Dark mode: ${!isDarkMode}`);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={closeModal}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>SETTINGS</Text>
        <View style={styles.headerRight} />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, isDarkMode && styles.modalContentDark]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, isDarkMode && styles.textDark]}>Settings</Text>
              <TouchableOpacity 
                onPress={closeModal} 
                style={styles.closeButton}
                activeOpacity={0.7}
              >
                <Ionicons name="close" size={24} color={isDarkMode ? '#FFFFFF' : '#5C3D2E'} />
              </TouchableOpacity>
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Language Section */}
              <View style={[styles.section, isDarkMode && styles.sectionDark]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="language-outline" size={20} color={isDarkMode ? '#E4D3BB' : '#C77A58'} />
                  <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Language</Text>
                </View>
                <Text style={[styles.sectionSubtitle, isDarkMode && styles.textDarkSecondary]}>
                  Select your preferred language
                </Text>
                
                <View style={styles.languageContainer}>
                  {languages.map((language) => (
                    <TouchableOpacity
                      key={language}
                      style={[
                        styles.languageOption,
                        selectedLanguage === language && styles.languageOptionActive,
                        isDarkMode && styles.languageOptionDark,
                        isDarkMode && selectedLanguage === language && styles.languageOptionActiveDark,
                      ]}
                      onPress={() => handleLanguageSelect(language)}
                      activeOpacity={0.7}
                    >
                      <Text style={[
                        styles.languageText,
                        selectedLanguage === language && styles.languageTextActive,
                        isDarkMode && styles.textDark,
                        isDarkMode && selectedLanguage === language && styles.languageTextActiveDark,
                      ]}>
                        {language}
                      </Text>
                      {selectedLanguage === language && (
                        <Ionicons 
                          name="checkmark-circle" 
                          size={16} 
                          color={isDarkMode ? '#E4D3BB' : '#C77A58'} 
                        />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Theme Section */}
              <View style={[styles.section, isDarkMode && styles.sectionDark]}>
                <View style={styles.sectionHeader}>
                  <Ionicons name="color-palette-outline" size={20} color={isDarkMode ? '#E4D3BB' : '#C77A58'} />
                  <Text style={[styles.sectionTitle, isDarkMode && styles.textDark]}>Theme</Text>
                </View>
                <Text style={[styles.sectionSubtitle, isDarkMode && styles.textDarkSecondary]}>
                  Choose your preferred theme
                </Text>
                
                <View style={styles.themeContainer}>
                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      !isDarkMode && styles.themeOptionActive,
                      isDarkMode && styles.themeOptionDark,
                    ]}
                    onPress={() => setIsDarkMode(false)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.themePreview}>
                      <View style={[styles.themeColor, { backgroundColor: '#DCC8AC' }]} />
                      <View style={[styles.themeColor, { backgroundColor: '#C77A58' }]} />
                      <View style={[styles.themeColor, { backgroundColor: '#E4D3BB' }]} />
                    </View>
                    <View style={styles.themeInfo}>
                      <Text style={[styles.themeName, isDarkMode && styles.textDark]}>Light Mode</Text>
                      <Text style={[styles.themeDescription, isDarkMode && styles.textDarkSecondary]}>
                        Light and warm colors
                      </Text>
                    </View>
                    {!isDarkMode && (
                      <Ionicons name="checkmark-circle" size={20} color="#C77A58" />
                    )}
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      styles.themeOption,
                      isDarkMode && styles.themeOptionActive,
                      isDarkMode && styles.themeOptionDarkActive,
                    ]}
                    onPress={() => setIsDarkMode(true)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.themePreview}>
                      <View style={[styles.themeColor, { backgroundColor: '#2C2C2C' }]} />
                      <View style={[styles.themeColor, { backgroundColor: '#1A1A1A' }]} />
                      <View style={[styles.themeColor, { backgroundColor: '#3D3D3D' }]} />
                    </View>
                    <View style={styles.themeInfo}>
                      <Text style={[styles.themeName, isDarkMode && styles.textDark]}>Dark Mode</Text>
                      <Text style={[styles.themeDescription, isDarkMode && styles.textDarkSecondary]}>
                        Dark and modern colors
                      </Text>
                    </View>
                    {isDarkMode && (
                      <Ionicons name="checkmark-circle" size={20} color="#E4D3BB" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>

              {/* Apply Button */}
              <TouchableOpacity 
                style={[styles.applyButton, isDarkMode && styles.applyButtonDark]}
                onPress={closeModal}
                activeOpacity={0.85}
              >
                <Text style={[styles.applyButtonText, isDarkMode && styles.applyButtonTextDark]}>
                  Apply Settings
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCC8AC',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  header: {
    width: '100%',
    minHeight: 52,
    backgroundColor: '#C77A58',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  backButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 1,
    flex: 1,
    textAlign: 'center',
  },
  headerRight: {
    width: 32,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#F5EDE3',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    maxHeight: '80%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 8,
  },
  modalContentDark: {
    backgroundColor: '#2C2C2C',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 122, 88, 0.3)',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    paddingBottom: 4,
  },
  section: {
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  sectionDark: {
    backgroundColor: '#3D3D3D',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666666',
    marginBottom: 10,
    paddingLeft: 28,
  },
  textDark: {
    color: '#FFFFFF',
  },
  textDarkSecondary: {
    color: '#B0B0B0',
  },
  languageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    paddingLeft: 28,
  },
  languageOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE3',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  languageOptionActive: {
    backgroundColor: '#C77A58',
    borderColor: '#C77A58',
  },
  languageOptionDark: {
    backgroundColor: '#4A4A4A',
  },
  languageOptionActiveDark: {
    backgroundColor: '#6B4F3A',
    borderColor: '#E4D3BB',
  },
  languageText: {
    fontSize: 13,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  languageTextActive: {
    color: '#FFFFFF',
  },
  languageTextActiveDark: {
    color: '#FFFFFF',
  },
  themeContainer: {
    gap: 10,
    paddingLeft: 28,
  },
  themeOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE3',
    padding: 10,
    borderRadius: 10,
    gap: 10,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  themeOptionActive: {
    borderColor: '#C77A58',
  },
  themeOptionDark: {
    backgroundColor: '#4A4A4A',
  },
  themeOptionDarkActive: {
    borderColor: '#E4D3BB',
  },
  themePreview: {
    flexDirection: 'row',
    gap: 3,
  },
  themeColor: {
    width: 20,
    height: 20,
    borderRadius: 4,
  },
  themeInfo: {
    flex: 1,
  },
  themeName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  themeDescription: {
    fontSize: 11,
    color: '#888888',
  },
  applyButton: {
    backgroundColor: '#C77A58',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#C77A58',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
    marginTop: 4,
  },
  applyButtonDark: {
    backgroundColor: '#6B4F3A',
    shadowColor: '#6B4F3A',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  applyButtonTextDark: {
    color: '#FFFFFF',
  },
});

export default SettingsScreen;