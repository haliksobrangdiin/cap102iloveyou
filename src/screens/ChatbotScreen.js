import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Alert,
  Image,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as Haptics from 'expo-haptics';

const ChatbotScreen = ({ navigation }) => {
  const [messages, setMessages] = useState([
    { id: '1', text: 'Hello! How can I help you with your cassava farming today?', sender: 'bot' },
  ]);
  const [inputText, setInputText] = useState('');
  const [suggestedTopics] = useState([
    { id: '1', text: 'What are the best cassava varieties to plant?', icon: 'leaf-outline' },
    { id: '2', text: 'How do I treat cassava mosaic disease?', icon: 'medical-outline' },
    { id: '3', text: 'When is the right time to harvest cassava?', icon: 'calendar-outline' },
    { id: '4', text: 'What type of fertilizer is best for cassava?', icon: 'flower-outline' },
    { id: '5', text: 'How to prepare cassava soil properly?', icon: 'earth-outline' },
    { id: '6', text: 'What are common pests affecting cassava?', icon: 'bug-outline' },
  ]);
  const [conversationHistory, setConversationHistory] = useState([
    { id: '1', title: 'Cassava Mosaic Disease', date: 'Today, 2:30 PM', preview: 'How to identify and treat mosaic disease' },
    { id: '2', title: 'Brown Spot Disease', date: 'Yesterday, 11:15 AM', preview: 'Treatment for brown spot disease' },
    { id: '3', title: 'Harvesting Tips', date: 'Jan 12, 2024', preview: 'Best practices for harvesting cassava' },
    { id: '4', title: 'Fertilizer Guide', date: 'Jan 10, 2024', preview: 'Optimal fertilizer application for cassava' },
    { id: '5', title: 'Cassava Pest Control', date: 'Jan 8, 2024', preview: 'Managing cassava pests naturally' },
    { id: '6', title: 'Soil Preparation', date: 'Jan 5, 2024', preview: 'How to prepare soil for cassava planting' },
  ]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [showHistory, setShowHistory] = useState(false);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const [attachments, setAttachments] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  const sendMessage = (text) => {
    if (!text || !text.trim()) return;

    const userMessage = { id: Date.now().toString(), text: text.trim(), sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setShowSuggestions(false);

    setTimeout(() => {
      const botResponse = {
        id: (Date.now() + 1).toString(),
        text: getBotResponse(text),
        sender: 'bot',
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const getBotResponse = (userInput) => {
    const lowerInput = userInput.toLowerCase();
    if (lowerInput.includes('mosaic')) {
      return 'Cassava Mosaic Disease is caused by a virus spread by whiteflies. Remove infected plants immediately, plant resistant varieties, and control whitefly populations. Always use disease-free planting materials.';
    } else if (lowerInput.includes('brown') || lowerInput.includes('spot')) {
      return 'Brown Spot Disease is caused by the fungus Cercospora henningsii. Apply copper-based fungicides, ensure proper drainage, practice crop rotation, and remove infected leaves. Plant disease-resistant varieties when possible.';
    } else if (lowerInput.includes('harvest')) {
      return 'Cassava is typically harvested 8-12 months after planting depending on the variety. Harvest when leaves start to yellow and fall off, and the stems become woody. The roots should be firm and well-developed. Avoid harvesting during rainy periods.';
    } else if (lowerInput.includes('fertilizer') || lowerInput.includes('fertilize')) {
      return 'Cassava responds well to balanced fertilization. Apply 60-90 kg N/ha, 20-30 kg P/ha, and 60-90 kg K/ha. Use organic compost or manure for better soil structure. Split nitrogen applications for optimal uptake.';
    } else if (lowerInput.includes('soil') || lowerInput.includes('prepare')) {
      return 'Cassava grows best in well-drained, sandy loam soils with pH 5.5-6.5. Prepare soil by deep plowing (25-30 cm), remove weeds, and incorporate organic matter. Create ridges or mounds for better drainage and root development.';
    } else if (lowerInput.includes('pest') || lowerInput.includes('insect')) {
      return 'Common cassava pests include cassava mealybug, whiteflies, and green mites. Control through biological methods (natural predators), resistant varieties, and proper field sanitation. Use neem-based pesticides for organic control.';
    } else if (lowerInput.includes('variety') || lowerInput.includes('plant')) {
      return 'There are many cassava varieties. Choose based on your purpose: sweet varieties for direct consumption (e.g., TMS 98/0505), bitter varieties for starch production (e.g., TMS 97/0524). Always select disease-resistant, high-yielding varieties adapted to your region.';
    } else {
      return 'I understand your question about cassava farming. For specific advice, I recommend consulting with your local agricultural extension officer. They can provide recommendations tailored to your specific region and conditions.';
    }
  };

  const handleTopicPress = (topic) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    sendMessage(topic.text);
  };

  const handleNewChat = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setMessages([
      { id: '1', text: 'Hello! How can I help you with your cassava farming today?', sender: 'bot' },
    ]);
    setShowSuggestions(true);
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant gallery permissions to upload images of your cassava plants for diagnosis.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, { id: Date.now().toString(), uri: result.assets[0].uri, type: 'image' }]);
      setShowAttachmentMenu(false);
      Alert.alert('✅ Uploaded', 'Cassava image attached successfully! Our experts can now analyze your crop.');
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera permissions to take photos of your cassava plants for diagnosis.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setAttachments([...attachments, { id: Date.now().toString(), uri: result.assets[0].uri, type: 'image' }]);
      setShowAttachmentMenu(false);
      Alert.alert('✅ Captured', 'Cassava photo captured successfully! Our team can now assess your crop health.');
    }
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter(att => att.id !== id));
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

  const renderSuggestedTopic = ({ item }) => (
    <TouchableOpacity 
      style={styles.topicItem}
      onPress={() => handleTopicPress(item)}
      activeOpacity={0.7}
    >
      <Ionicons name={item.icon} size={20} color="#5C3D2E" />
      <Text style={styles.topicText}>{item.text}</Text>
      <Ionicons name="chevron-forward" size={16} color="#8A7A66" />
    </TouchableOpacity>
  );

  const renderHistoryItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.historyItem}
      onPress={() => {
        setShowHistory(false);
        // Load conversation logic here
      }}
      activeOpacity={0.7}
    >
      <View style={styles.historyItemContent}>
        <Text style={styles.historyItemTitle}>{item.title}</Text>
        <Text style={styles.historyItemPreview} numberOfLines={1}>{item.preview}</Text>
        <Text style={styles.historyItemDate}>{item.date}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#8A7A66" />
    </TouchableOpacity>
  );

  const renderAttachment = ({ item }) => (
    <View style={styles.attachmentItem}>
      <Image source={{ uri: item.uri }} style={styles.attachmentImage} />
      <TouchableOpacity 
        style={styles.attachmentRemove}
        onPress={() => removeAttachment(item.id)}
      >
        <Ionicons name="close-circle" size={20} color="#E74C3C" />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with menu */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.menuButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowHistory(!showHistory);
          }}
        >
          <Ionicons name="menu-outline" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Cassava Assistant</Text>
        <TouchableOpacity 
          style={styles.newChatButton}
          onPress={handleNewChat}
        >
          <Ionicons name="create-outline" size={22} color="#FFFFFF" />
        </TouchableOpacity>
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
          ListHeaderComponent={
            showSuggestions && messages.length === 1 ? (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsHeader}>Cassava Farming Questions</Text>
                <FlatList
                  data={suggestedTopics}
                  renderItem={renderSuggestedTopic}
                  keyExtractor={(item) => item.id}
                  scrollEnabled={false}
                  contentContainerStyle={styles.suggestionsList}
                />
              </View>
            ) : null
          }
        />

        {/* Attachments preview */}
        {attachments.length > 0 && (
          <View style={styles.attachmentsContainer}>
            <FlatList
              data={attachments}
              renderItem={renderAttachment}
              keyExtractor={(item) => item.id}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.attachmentsList}
            />
          </View>
        )}

        {/* Input area */}
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.attachButton}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setShowAttachmentMenu(!showAttachmentMenu);
            }}
          >
            <Ionicons name="attach-outline" size={24} color="#8A7A66" />
          </TouchableOpacity>

          <TextInput
            style={styles.input}
            placeholder="Ask about cassava farming..."
            placeholderTextColor="#8A7A66"
            value={inputText}
            onChangeText={setInputText}
            multiline
          />

          {inputText.length > 0 ? (
            <TouchableOpacity 
              style={styles.sendButton} 
              onPress={() => sendMessage(inputText)} 
              activeOpacity={0.85}
            >
              <Ionicons name="send" size={18} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.micButton}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                Alert.alert('🎤 Voice Recording', 'Voice input for cassava farming questions coming soon!');
              }}
              activeOpacity={0.85}
            >
              <Ionicons name="mic-outline" size={22} color="#8A7A66" />
            </TouchableOpacity>
          )}
        </View>

        {/* Attachment menu modal */}
        <Modal
          visible={showAttachmentMenu}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowAttachmentMenu(false)}
        >
          <TouchableOpacity 
            style={styles.attachmentMenuOverlay}
            activeOpacity={1}
            onPress={() => setShowAttachmentMenu(false)}
          >
            <View style={styles.attachmentMenu}>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={takePhoto}>
                <Ionicons name="camera-outline" size={24} color="#5C3D2E" />
                <Text style={styles.attachmentMenuText}>Take Photo of Cassava</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={pickImage}>
                <Ionicons name="images-outline" size={24} color="#5C3D2E" />
                <Text style={styles.attachmentMenuText}>Upload Cassava Image</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.attachmentMenuItem} onPress={() => setShowAttachmentMenu(false)}>
                <Ionicons name="close-circle-outline" size={24} color="#E74C3C" />
                <Text style={[styles.attachmentMenuText, { color: '#E74C3C' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>

      {/* History sidebar modal */}
      <Modal
        visible={showHistory}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowHistory(false)}
      >
        <View style={styles.historySidebar}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>Cassava Chats</Text>
            <TouchableOpacity onPress={() => setShowHistory(false)}>
              <Ionicons name="close" size={24} color="#5C3D2E" />
            </TouchableOpacity>
          </View>
          <FlatList
            data={conversationHistory}
            renderItem={renderHistoryItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.historyList}
            ListEmptyComponent={
              <View style={styles.historyEmpty}>
                <Ionicons name="leaf-outline" size={48} color="#C77A58" />
                <Text style={styles.historyEmptyText}>No cassava conversations yet</Text>
              </View>
            }
          />
          <TouchableOpacity 
            style={styles.historyNewChat}
            onPress={() => {
              setShowHistory(false);
              handleNewChat();
            }}
          >
            <Ionicons name="add-circle-outline" size={24} color="#FFFFFF" />
            <Text style={styles.historyNewChatText}>New Chat</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 52;

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuButton: {
    padding: 4,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  newChatButton: {
    padding: 4,
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
  // Suggested Topics
  suggestionsContainer: {
    backgroundColor: 'rgba(228, 211, 187, 0.5)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  suggestionsHeader: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5C3D2E',
    marginBottom: 12,
  },
  suggestionsList: {
    gap: 4,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE3',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 6,
    gap: 10,
  },
  topicText: {
    flex: 1,
    fontSize: 14,
    color: '#5C3D2E',
  },
  // Attachments
  attachmentsContainer: {
    paddingHorizontal: 12,
    paddingBottom: 8,
  },
  attachmentsList: {
    gap: 8,
  },
  attachmentItem: {
    position: 'relative',
    marginRight: 8,
  },
  attachmentImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  attachmentRemove: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
  },
  // Input
  inputContainer: {
    flexDirection: 'row',
    padding: 12,
    paddingBottom: 20,
    backgroundColor: '#DCC8AC',
    borderTopWidth: 1,
    borderTopColor: 'rgba(139, 74, 50, 0.2)',
    alignItems: 'flex-end',
    gap: 8,
  },
  attachButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    justifyContent: 'center',
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
  micButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E4D3BB',
  },
  // Attachment Menu
  attachmentMenuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  attachmentMenu: {
    backgroundColor: '#F5EDE3',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
  },
  attachmentMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 122, 88, 0.2)',
  },
  attachmentMenuText: {
    fontSize: 16,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  // History Sidebar
  historySidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 340,
    backgroundColor: '#F5EDE3',
    shadowColor: '#000',
    shadowOffset: { width: 4, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 48,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 122, 88, 0.2)',
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  historyList: {
    padding: 16,
    paddingBottom: 80,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(199, 122, 88, 0.1)',
  },
  historyItemContent: {
    flex: 1,
    gap: 2,
  },
  historyItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#5C3D2E',
  },
  historyItemPreview: {
    fontSize: 13,
    color: '#8A7A66',
  },
  historyItemDate: {
    fontSize: 11,
    color: '#B0A090',
  },
  historyNewChat: {
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
    backgroundColor: '#C77A58',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  historyNewChatText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historyEmpty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  historyEmptyText: {
    fontSize: 16,
    color: '#8A7A66',
  },
});

export default ChatbotScreen;