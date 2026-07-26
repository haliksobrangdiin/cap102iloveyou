import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ScannerScreen from '../screens/ScannerScreen';
import ResultScreen from '../screens/ResultScreen';

const Stack = createStackNavigator();

// Nested inside the "Scanner" tab so ScannerScreen -> ResultScreen can push
// on top of the tab bar, while Home/Chatbot/History/Settings stay flat tabs.
export default function ScannerStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ScannerMain" component={ScannerScreen} />
      <Stack.Screen name="Result" component={ResultScreen} />
    </Stack.Navigator>
  );
}