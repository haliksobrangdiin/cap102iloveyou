// navigation/MainTabs.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CustomTabBar from '../components/CustomTabBar';
import HomeScreen from '../screens/HomeScreen';
import ChatbotScreen from '../screens/ChatbotScreen';
import ScannerStack from './ScannerStack';
import HistoryScreen from '../screens/ScanHistory';
import SettingsScreen from '../screens/SettingsScreen';
import MarketplaceScreen from '../screens/MarketplaceScreen';

const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{ 
        headerShown: false,
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chatbot" component={ChatbotScreen} />
      
      {/* Scanner Stack - Hidden entirely (Handles Scanner + Result internally) */}
      <Tab.Screen 
        name="Scanner" 
        component={ScannerStack}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
      
      <Tab.Screen name="History" component={HistoryScreen} />
      
      {/* Settings - Hidden entirely */}
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarStyle: { display: 'none' },
        }}
      />
      
      {/* Marketplace - hidden from tab bar */}
      <Tab.Screen 
        name="Marketplace" 
        component={MarketplaceScreen}
        options={{
          tabBarButton: () => null, // Hide from tab bar
        }}
      />
    </Tab.Navigator>
  );
} 