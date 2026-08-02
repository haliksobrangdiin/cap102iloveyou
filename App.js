// App.js
import 'react-native-gesture-handler';
import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import OnboardingScreen from './src/screens/OnboardingScreen';
import MainTabs from './src/navigation/MainTabs';

const App = () => {
  const [isOnboarding, setIsOnboarding] = useState(true);

  return (
    <NavigationContainer>
      {isOnboarding ? (
        <OnboardingScreen onFinish={() => setIsOnboarding(false)} />
      ) : (
        <MainTabs />
      )}
      <Toast />
    </NavigationContainer>
  );
};

export default App;