import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';

const Button = ({ title, onPress, type = 'primary' }) => {
  return (
    <TouchableOpacity
      style={[styles.button, styles[type]]}
      onPress={onPress}
      activeOpacity={0.85}
    >
      <Text style={[styles.text, styles[`${type}Text`]]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: '#2e7d32',
  },
  secondary: {
    backgroundColor: '#1976d2',
  },
  danger: {
    backgroundColor: '#c62828',
  },
  // Pill-shaped orange button matching the onboarding/reference design
  onboarding: {
    backgroundColor: colors.onboardingAccent,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    shadowColor: colors.onboardingAccentDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 5,
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: { color: '#fff' },
  secondaryText: { color: '#fff' },
  dangerText: { color: '#fff' },
  onboardingText: { color: colors.onboardingText, letterSpacing: 1.5 },
});

export default Button;