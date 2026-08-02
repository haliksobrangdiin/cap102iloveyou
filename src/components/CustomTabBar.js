import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

// Custom tab bar to achieve the raised center "Scan" button look.
// Used as the `tabBar` prop on the bottom Tab.Navigator in MainTabs.js
export default function CustomTabBar({ state, navigation }) {
  const routeIcons = {
    Home: 'home-outline',
    Chatbot: 'chatbubble-ellipses-outline',
    History: 'time-outline',
    Settings: 'settings-outline',
  };

  const routeLabels = {
    Home: 'Home',
    Chatbot: 'Ask AI',
    History: 'Scan History',
    Settings: 'Settings',
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;

        // The center "Scanner" route gets special raised-button treatment
        if (route.name === 'Scanner') {
          return (
            <TouchableOpacity
              key={route.key}
              style={styles.scanButtonWrap}
              onPress={() => navigation.navigate(route.name)}
              activeOpacity={0.85}
            >
              <View style={styles.scanButton}>
                <Ionicons name="scan-outline" size={26} color={colors.textWhite} />
              </View>
              <Text style={styles.scanLabel}>Scan Leaves</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.tabItem}
            onPress={() => navigation.navigate(route.name)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={routeIcons[route.name]}
              size={22}
              color={isFocused ? colors.onboardingAccent : colors.textLight}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.onboardingAccent : colors.textLight },
              ]}
            >
              {routeLabels[route.name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
  },
  scanButtonWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  scanButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.onboardingAccent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -32,
    shadowColor: colors.onboardingAccentDark,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 8,
  },
  scanLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.onboardingAccent,
    marginTop: 2,
  },
});