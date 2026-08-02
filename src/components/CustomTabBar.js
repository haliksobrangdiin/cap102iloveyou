// components/CustomTabBar.js
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// RootCare Design System tokens
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

const BOTTOM_BAR_HEIGHT = 72;
const FAB_SIZE = 64;

export default function CustomTabBar({ state, navigation }) {
  const routeConfig = {
    Home: { icon: 'home-outline', activeIcon: 'home', label: 'Home' },
    Chatbot: { icon: 'chatbubble-ellipses-outline', activeIcon: 'chatbubble-ellipses', label: 'Ask AI' },
    Scanner: { icon: 'scan-outline', activeIcon: 'scan', label: 'Scan Leaves', isCenter: true },
    History: { icon: 'time-outline', activeIcon: 'time', label: 'Scan History' },
    Settings: { icon: 'settings-outline', activeIcon: 'settings', label: 'Settings' },
    // Marketplace has no tab button (tabBarButton: () => null in MainTabs.js)
    // but it's still a registered route, so it still shows up in state.routes.
    // Mapping it here (and marking it hidden) stops the tab bar from crashing
    // when it tries to look up an icon/label for it.
    Marketplace: { icon: 'storefront-outline', activeIcon: 'storefront', label: 'Marketplace', hidden: true },
  };

  const currentRoute = state.routes[state.index].name;

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const config = routeConfig[route.name];

        // Skip rendering for hidden routes (e.g. Marketplace) or any route
        // that isn't mapped in routeConfig yet, instead of crashing.
        if (!config || config.hidden) {
          return null;
        }

        if (config.isCenter) {
          return (
            <View key={route.key} style={styles.fabSlot}>
              <TouchableOpacity
                style={styles.fabButton}
                onPress={() => navigation.navigate(route.name)}
                activeOpacity={0.85}
              >
                <Ionicons 
                  name={isFocused ? config.activeIcon : config.icon} 
                  size={28} 
                  color={colors['on-primary']} 
                />
              </TouchableOpacity>
              <Text style={[styles.fabLabel, { color: isFocused ? colors.primary : colors['on-surface-variant'] }]}>
                {config.label}
              </Text>
            </View>
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
              name={isFocused ? config.activeIcon : config.icon}
              size={24}
              color={isFocused ? colors.primary : colors['on-surface-variant']}
            />
            <Text
              style={[
                styles.tabLabel,
                { color: isFocused ? colors.primary : colors['on-surface-variant'] },
                isFocused && styles.tabLabelActive,
              ]}
            >
              {config.label}
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
    backgroundColor: colors['surface-container-lowest'],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 5 : 5,
    paddingHorizontal: 8,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 999,
    // Drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 202, 186, 0.2)',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    gap: 2,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '500',
    letterSpacing: 0.3,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '700',
  },
  fabSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    top: -(FAB_SIZE / 2 - 8),
  },
  fabButton: {
    width: FAB_SIZE,
    height: FAB_SIZE,
    borderRadius: FAB_SIZE / 2,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: colors['surface-container-lowest'],
    // FAB drop shadow
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
  fabLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 4,
    textAlign: 'center',
  },
});