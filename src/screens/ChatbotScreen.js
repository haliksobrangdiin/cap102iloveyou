import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you with your cassava farming today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;

    const userMessage = { id: Date.now().toString(), text: inputText, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(inputText),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('mosaic')) {
      return 'Cassava Mosaic Disease is caused by a virus. Remove infected plants immediately and plant resistant varieties.';
    } else if (lowerInput.includes('brown') || lowerInput.includes('spot')) {
      return 'Brown Spot Disease is caused by fungus. Apply fungicides and ensure proper drainage.';
    } else if (lowerInput.includes('harvest')) {
      return 'Cassava is typically harvested 8-12 months after planting. Harvest when leaves start to yellow and fall off.';
    } else {
      return 'Thank you for your question. I recommend consulting with a local agricultural extension officer for the best advice specific to your area.';
    }
  };

  const renderMessage = ({ item }) => (
    <View
      style={[
        styles.messageContainer,
        item.sender === 'user' ? styles.userMessage : styles.botMessage,
      ]}
    >
      <Text
        style={[
          styles.messageText,
          item.sender === 'user' ? styles.userText : styles.botText,
        ]}
      >
        {item.text}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Terracotta header bar */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Cassava Assistant</Text>
      </View>

      <KeyboardAvoidingView
        style={styles.chatArea}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={90}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.messagesList}
          showsVerticalScrollIndicator={false}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask about cassava diseases, farming tips..."
            placeholderTextColor="#8A7A66"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage} activeOpacity={0.85}>
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* REMOVED: Floating bottom navigation bar - Now handled by MainTabs */}
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 52;
// REMOVED: BOTTOM_BAR_HEIGHT - No longer needed
const BOTTOM_BAR_HEIGHT = 78; // Keep this for padding calculations

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DCC8AC',
    ...(Platform.OS === 'web' ? { height: '100vh', overflow: 'hidden' } : {}),
  },
  header: {
    width: '100%',
    minHeight: HEADER_HEIGHT,
    backgroundColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  chatArea: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
    paddingBottom: 20, 
    flexGrow: 1,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 10,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#C77A58',
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#E4D3BB',
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  userText: {
    color: '#FFFFFF',
  },
  botText: {
    color: '#333333',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20, // Changed from BOTTOM_BAR_HEIGHT + 12
    backgroundColor: '#DCC8AC',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 74, 50, 0.2)',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: 'rgba(139, 74, 50, 0.25)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 14,
    color: '#333333',
    backgroundColor: '#FFFFFF',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#C77A58',
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  // REMOVED: All bottomBar, tabItem, tabLabel, fabSlot, fabButton, fabLabel styles
  // These are now handled by CustomTabBar
});

export default ChatbotScreen;