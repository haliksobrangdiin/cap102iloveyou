// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, ActivityIndicator } from 'react-native';
import Toast from 'react-native-toast-message';
import { supabase } from './src/utils/supabaseClient';

import OnboardingScreen from './src/screens/OnboardingScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import MainTabs from './src/navigation/MainTabs';
import ScannerScreen from './src/screens/ScannerScreen';
import ResultScreen from './src/screens/ResultScreen';

const Stack = createStackNavigator();

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(!!session);
        }
      } catch (error) {
        console.error('Session check error:', error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event);
      setIsAuthenticated(!!session);
    });

    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF8F6' }}>
        <ActivityIndicator size="large" color="#0D631B" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer>
        <Stack.Navigator 
          screenOptions={{ headerShown: false }}
          initialRouteName={isAuthenticated ? 'MainTabs' : 'Onboarding'}
        >
          {/* Always include ALL screens */}
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Scanner" component={ScannerScreen} />
          <Stack.Screen name="Result" component={ResultScreen} />
        </Stack.Navigator>
      </NavigationContainer>
      <Toast />
    </>
  );
};

export default App;