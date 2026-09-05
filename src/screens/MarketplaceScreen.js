// screens/MarketplaceScreen.js - COMPLETE CLEAN VERSION
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TextInput,
  FlatList,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

// Sample marketplace data
const initialMarketItems = [
  {
    id: '1',
    name: 'Cassava Tubers',
    price: '$1.45',
    unit: '/ kg',
    image: null,
    seller: 'GreenFarm Co.',
    sellerId: 'user1',
    rating: 4.8,
    orders: 234,
    badge: 'Organic',
    description: 'Fresh organic cassava tubers harvested this week.',
    location: 'Lagos, Nigeria',
    postedDate: '2 days ago',
    isUserProduct: false,
  },
  {
    id: '2',
    name: 'Cassava Chips',
    price: '$3.20',
    unit: '/ bag',
    image: null,
    seller: 'Sunrise Harvest',
    sellerId: 'user2',
    rating: 4.5,
    orders: 189,
    badge: 'Premium',
    description: 'Premium quality cassava chips, perfect for snacking.',
    location: 'Ibadan, Nigeria',
    postedDate: '5 days ago',
    isUserProduct: false,
  },
  {
    id: '3',
    name: 'Cassava Flour',
    price: '$2.80',
    unit: '/ kg',
    image: null,
    seller: 'RootCare Direct',
    sellerId: 'user3',
    rating: 4.9,
    orders: 312,
    badge: 'Best Seller',
    description: 'Finely ground cassava flour for baking.',
    location: 'Abuja, Nigeria',
    postedDate: '1 week ago',
    isUserProduct: false,
  },
  {
    id: '4',
    name: 'Cassava Starch',
    price: '$4.50',
    unit: '/ kg',
    image: null,
    seller: 'AgriTech Supplies',
    sellerId: 'user4',
    rating: 4.3,
    orders: 156,
    badge: 'New',
    description: 'High-quality cassava starch for industrial use.',
    location: 'Port Harcourt, Nigeria',
    postedDate: '3 days ago',
    isUserProduct: false,
  },
];

// Sample chat data
const initialChats = [
  {
    id: 'chat1',
    sellerId: 'user1',
    sellerName: 'GreenFarm Co.',
    productId: '1',
    productName: 'Cassava Tubers',
    lastMessage: 'Yes, I have 50kg available.',
    timestamp: '10:30 AM',
    unread: 2,
    messages: [
      { id: 'm1', text: 'Hello! I\'m interested in your cassava tubers.', sender: 'user', time: '10:00 AM' },
      { id: 'm2', text: 'Hi! Yes, they\'re still available. How much do you need?', sender: 'seller', time: '10:05 AM' },
      { id: 'm3', text: 'I need about 5kg. Can we meet?', sender: 'user', time: '10:15 AM' },
      { id: 'm4', text: 'Yes, I have 50kg available.', sender: 'seller', time: '10:30 AM' },
    ]
  }
];

const MarketplaceScreen = ({ navigation }) => {
  const [marketItems, setMarketItems] = useState(initialMarketItems);
  const [searchQuery, setSearchQuery] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartModalVisible, setCartModalVisible] = useState(false);
  const [addProductModal, setAddProductModal] = useState(false);
  const [chatsModalVisible, setChatsModalVisible] = useState(false);
  const [chatModalVisible, setChatModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const [chats, setChats] = useState(initialChats);
  const [newMessage, setNewMessage] = useState('');

  // Filter items based on search only (NO CATEGORY FILTER)
  const filteredItems = marketItems.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getUnreadCount = () => {
    return chats.reduce((total, chat) => total + (chat.unread || 0), 0);
  };

  const addToCart = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const existingItem = cartItems.find(cart => cart.id === item.id);
    if (existingItem) {
      Alert.alert('Already in Cart', 'This item is already in your cart.');
      return;
    }
    setCartItems([...cartItems, { ...item, quantity: 1 }]);
    Alert.alert('Added to Cart', `${item.name} has been added to your cart.`);
  };

  const removeFromCart = (itemId) => {
    setCartItems(cartItems.filter(item => item.id !== itemId));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const updateQuantity = (itemId, increment) => {
    setCartItems(cartItems.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + increment;
        if (newQuantity < 1) return item;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }));
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const price = parseFloat(item.price.replace('$', ''));
      return total + (price * item.quantity);
    }, 0).toFixed(2);
  };

  const addNewProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.description) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const product = {
        id: Date.now().toString(),
        name: newProduct.name,
        price: `$${newProduct.price}`,
        unit: '/ kg',
        image: null,
        seller: 'You',
        sellerId: 'currentUser',
        rating: 0,
        orders: 0,
        badge: 'New',
        description: newProduct.description,
        location: newProduct.location || 'Your Location',
        postedDate: 'Just now',
        isUserProduct: true,
      };
      
      setMarketItems([product, ...marketItems]);
      setAddProductModal(false);
      setNewProduct({
        name: '',
        price: '',
        description: '',
        location: '',
      });
      setLoading(false);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', 'Your product has been listed!');
    }, 1500);
  };

  const openChat = (product) => {
    const existingChat = chats.find(chat => 
      chat.sellerId === product.sellerId && chat.productId === product.id
    );
    
    if (existingChat) {
      setSelectedChat(existingChat);
    } else {
      const newChat = {
        id: `chat${Date.now()}`,
        sellerId: product.sellerId,
        sellerName: product.seller,
        productId: product.id,
        productName: product.name,
        lastMessage: 'Start your conversation here...',
        timestamp: 'Just now',
        unread: 0,
        messages: [
          { id: 'm1', text: `Hello! I'm interested in your ${product.name}.`, sender: 'user', time: 'Just now' }
        ]
      };
      setChats([newChat, ...chats]);
      setSelectedChat(newChat);
    }
    setChatModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const openChatsList = () => {
    setChatsModalVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const sendMessage = () => {
    if (!newMessage.trim()) return;
    
    const updatedChats = chats.map(chat => {
      if (chat.id === selectedChat.id) {
        const newMsg = {
          id: `m${Date.now()}`,
          text: newMessage,
          sender: 'user',
          time: 'Just now'
        };
        return {
          ...chat,
          messages: [...chat.messages, newMsg],
          lastMessage: newMessage,
          timestamp: 'Just now',
          unread: 0
        };
      }
      return chat;
    });
    setChats(updatedChats);
    setSelectedChat(updatedChats.find(chat => chat.id === selectedChat.id));
    setNewMessage('');
  };

  const openChatFromList = (chat) => {
    const updatedChats = chats.map(c => {
      if (c.id === chat.id) {
        return { ...c, unread: 0 };
      }
      return c;
    });
    setChats(updatedChats);
    setSelectedChat({ ...chat, unread: 0 });
    setChatsModalVisible(false);
    setChatModalVisible(true);
  };

  // Render product item
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.marketItem}
      activeOpacity={0.8}
    >
      <View style={styles.itemImagePlaceholder}>
        <Ionicons name="leaf-outline" size={40} color="#0D631B" />
        {item.badge && (
          <View style={styles.itemBadge}>
            <Text style={styles.itemBadgeText}>{item.badge}</Text>
          </View>
        )}
        {item.isUserProduct && (
          <View style={[styles.itemBadge, { backgroundColor: '#2563EB', top: 32 }]}>
            <Text style={styles.itemBadgeText}>YOURS</Text>
          </View>
        )}
      </View>

      <View style={styles.itemInfo}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity 
            style={styles.chatButton}
            onPress={() => openChat(item)}
          >
            <Ionicons name="chatbubble-outline" size={18} color="#0D631B" />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.itemSeller}>{item.seller} · {item.location}</Text>
        
        <View style={styles.itemMeta}>
          <View style={styles.itemRating}>
            <Ionicons name="star" size={14} color="#F59E0B" />
            <Text style={styles.itemRatingText}>{item.rating || 'New'}</Text>
          </View>
          <Text style={styles.itemOrders}>{item.orders || 0} orders</Text>
          <Text style={styles.itemDate}>{item.postedDate}</Text>
        </View>
        
        <View style={styles.itemPriceRow}>
          <View style={styles.priceContainer}>
            <Text style={styles.itemPrice}>{item.price}</Text>
            <Text style={styles.itemUnit}>{item.unit}</Text>
          </View>
          
          {!item.isUserProduct ? (
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => addToCart(item)}
            >
              <Ionicons name="add" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => Alert.alert('Edit Product', 'Edit your product listing')}
            >
              <Ionicons name="create-outline" size={18} color="#0D631B" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render cart item
  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      <View style={styles.cartItemInfo}>
        <Text style={styles.cartItemName}>{item.name}</Text>
        <Text style={styles.cartItemPrice}>{item.price}</Text>
      </View>
      <View style={styles.cartItemActions}>
        <TouchableOpacity 
          style={styles.cartQuantityButton}
          onPress={() => updateQuantity(item.id, -1)}
        >
          <Ionicons name="remove" size={16} color="#2C160E" />
        </TouchableOpacity>
        <Text style={styles.cartQuantity}>{item.quantity}</Text>
        <TouchableOpacity 
          style={styles.cartQuantityButton}
          onPress={() => updateQuantity(item.id, 1)}
        >
          <Ionicons name="add" size={16} color="#2C160E" />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.cartRemoveButton}
          onPress={() => removeFromCart(item.id)}
        >
          <Ionicons name="trash-outline" size={16} color="#DC2626" />
        </TouchableOpacity>
      </View>
    </View>
  );

  // Render chat item in list
  const renderChatItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.chatListItem}
      onPress={() => openChatFromList(item)}
    >
      <View style={styles.chatListAvatar}>
        <Ionicons name="person-circle" size={50} color="#0D631B" />
      </View>
      <View style={styles.chatListInfo}>
        <View style={styles.chatListHeader}>
          <Text style={styles.chatListName}>{item.sellerName}</Text>
          <Text style={styles.chatListTime}>{item.timestamp}</Text>
        </View>
        <View style={styles.chatListFooter}>
          <Text style={styles.chatListMessage} numberOfLines={1}>
            {item.lastMessage}
          </Text>
          {item.unread > 0 && (
            <View style={styles.chatListBadge}>
              <Text style={styles.chatListBadgeText}>{item.unread}</Text>
            </View>
          )}
        </View>
        <Text style={styles.chatListProduct}>📦 {item.productName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
        >
          <Ionicons name="chevron-back" size={28} color="#2C160E" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.headerActions}>
          {/* Message Icon */}
          <TouchableOpacity 
            style={styles.headerAction} 
            activeOpacity={0.7}
            onPress={openChatsList}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="chatbubbles-outline" size={24} color="#2C160E" />
              {getUnreadCount() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getUnreadCount()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>

          {/* Cart Icon */}
          <TouchableOpacity 
            style={styles.headerAction} 
            activeOpacity={0.7}
            onPress={() => setCartModalVisible(true)}
          >
            <View style={styles.iconContainer}>
              <Ionicons name="cart-outline" size={24} color="#2C160E" />
              {getTotalCartItems() > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{getTotalCartItems()}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar - NO TAGS BELOW */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={20} color="#707A6C" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products..."
            placeholderTextColor="#707A6C"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#707A6C" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* NO CATEGORIES - Removed completely */}

      {/* Add Product Button */}
      <TouchableOpacity
        style={styles.addProductButton}
        onPress={() => setAddProductModal(true)}
      >
        <Ionicons name="add-circle" size={20} color="#FFFFFF" />
        <Text style={styles.addProductText}>Sell Your Product</Text>
      </TouchableOpacity>

      {/* Market Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#BFCABA" />
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try adjusting your search or list a product</Text>
          </View>
        }
      />

      {/* Cart Modal */}
      <Modal
        visible={cartModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCartModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Your Cart</Text>
              <TouchableOpacity onPress={() => setCartModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2C160E" />
              </TouchableOpacity>
            </View>

            {cartItems.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="cart-outline" size={64} color="#BFCABA" />
                <Text style={styles.emptyCartText}>Your cart is empty</Text>
              </View>
            ) : (
              <>
                <FlatList
                  data={cartItems}
                  renderItem={renderCartItem}
                  keyExtractor={(item) => item.id}
                  contentContainerStyle={styles.cartList}
                />
                <View style={styles.cartTotal}>
                  <Text style={styles.cartTotalLabel}>Total:</Text>
                  <Text style={styles.cartTotalPrice}>${getTotalPrice()}</Text>
                </View>
                <TouchableOpacity 
                  style={styles.checkoutButton}
                  onPress={() => {
                    Alert.alert(
                      'Proceed to Checkout',
                      `Total: $${getTotalPrice()}\nItems: ${getTotalCartItems()}\n\nContact sellers through chat to arrange delivery.`,
                      [
                        { text: 'OK', onPress: () => setCartModalVisible(false) }
                      ]
                    );
                  }}
                >
                  <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Chats List Modal */}
      <Modal
        visible={chatsModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatsModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Messages</Text>
              <TouchableOpacity onPress={() => setChatsModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2C160E" />
              </TouchableOpacity>
            </View>

            {chats.length === 0 ? (
              <View style={styles.emptyCart}>
                <Ionicons name="chatbubbles-outline" size={64} color="#BFCABA" />
                <Text style={styles.emptyCartText}>No conversations yet</Text>
                <Text style={styles.emptySubtext}>Start chatting with sellers about their products</Text>
              </View>
            ) : (
              <FlatList
                data={chats}
                renderItem={renderChatItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.chatListContainer}
              />
            )}
          </View>
        </View>
      </Modal>

      {/* Individual Chat Modal */}
      <Modal
        visible={chatModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setChatModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.chatModalContent}>
            <View style={styles.modalHeader}>
              <View style={styles.chatHeaderInfo}>
                <TouchableOpacity onPress={() => {
                  setChatModalVisible(false);
                  openChatsList();
                }}>
                  <Ionicons name="arrow-back" size={24} color="#2C160E" />
                </TouchableOpacity>
                <View>
                  <Text style={styles.chatSellerName}>{selectedChat?.sellerName}</Text>
                  <Text style={styles.chatProductName}>📦 {selectedChat?.productName}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={() => setChatModalVisible(false)}>
                <Ionicons name="close" size={24} color="#2C160E" />
              </TouchableOpacity>
            </View>

            <View style={styles.chatMessages}>
              {selectedChat?.messages.map((msg) => (
                <View 
                  key={msg.id}
                  style={[
                    styles.messageBubble,
                    msg.sender === 'user' ? styles.messageSent : styles.messageReceived
                  ]}
                >
                  <Text style={[
                    styles.messageText,
                    msg.sender === 'user' && styles.messageTextSent
                  ]}>
                    {msg.text}
                  </Text>
                  <Text style={[
                    styles.messageTime,
                    msg.sender === 'user' && styles.messageTimeSent
                  ]}>
                    {msg.time}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.chatInputContainer}>
              <TextInput
                style={styles.chatInput}
                placeholder="Type a message..."
                placeholderTextColor="#707A6C"
                value={newMessage}
                onChangeText={setNewMessage}
                onSubmitEditing={sendMessage}
              />
              <TouchableOpacity 
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Ionicons name="send" size={20} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Product Modal */}
      <Modal
        visible={addProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAddProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { maxHeight: '90%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>List Your Product</Text>
              <TouchableOpacity onPress={() => setAddProductModal(false)}>
                <Ionicons name="close" size={24} color="#2C160E" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.addProductForm}>
              <Text style={styles.formLabel}>Product Name *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Cassava Tubers"
                value={newProduct.name}
                onChangeText={(text) => setNewProduct({...newProduct, name: text})}
              />

              <Text style={styles.formLabel}>Price (per kg) *</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., 2.50"
                keyboardType="decimal-pad"
                value={newProduct.price}
                onChangeText={(text) => setNewProduct({...newProduct, price: text})}
              />

              <Text style={styles.formLabel}>Description *</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                placeholder="Describe your product..."
                multiline
                numberOfLines={4}
                value={newProduct.description}
                onChangeText={(text) => setNewProduct({...newProduct, description: text})}
              />

              <Text style={styles.formLabel}>Location</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g., Lagos, Nigeria"
                value={newProduct.location}
                onChangeText={(text) => setNewProduct({...newProduct, location: text})}
              />

              <TouchableOpacity
                style={styles.submitButton}
                onPress={addNewProduct}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.submitButtonText}>List Product</Text>
                )}
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
    backgroundColor: '#FFF8F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191, 202, 186, 0.3)',
    backgroundColor: 'rgba(255, 248, 246, 0.95)',
  },
  backButton: { padding: 4, minWidth: 40 },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C160E',
    flex: 1,
    textAlign: 'center',
    letterSpacing: 0.3,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 16,
  },
  headerAction: { padding: 4 },
  iconContainer: { position: 'relative' },
  badge: {
    position: 'absolute',
    top: -6,
    right: -8,
    backgroundColor: '#DC2626',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: { color: '#FFFFFF', fontSize: 10, fontWeight: 'bold' },

  searchContainer: { 
    paddingHorizontal: 16, 
    paddingVertical: 12,
    paddingBottom: 8,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#2C160E', padding: 0 },

  addProductButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0D631B',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingVertical: 10,
    borderRadius: 12,
    gap: 8,
  },
  addProductText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
  },

  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
  marketItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    flexDirection: 'row',
  },
  itemImagePlaceholder: {
    width: 110,
    height: 110,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  itemBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: '#0D631B',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    zIndex: 1,
  },
  itemBadgeText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  itemInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C160E',
    flex: 1,
  },
  chatButton: { padding: 4 },
  itemSeller: {
    fontSize: 12,
    color: '#707A6C',
    marginTop: 2,
  },
  itemMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  itemRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  itemRatingText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#2C160E',
  },
  itemOrders: {
    fontSize: 11,
    color: '#707A6C',
  },
  itemDate: {
    fontSize: 11,
    color: '#707A6C',
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0D631B',
  },
  itemUnit: {
    fontSize: 12,
    color: '#707A6C',
    marginLeft: 4,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#0D631B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2C160E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#707A6C',
    marginTop: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF8F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2C160E',
  },

  cartList: { paddingBottom: 16 },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191, 202, 186, 0.3)',
  },
  cartItemInfo: { flex: 1 },
  cartItemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C160E',
  },
  cartItemPrice: {
    fontSize: 12,
    color: '#0D631B',
    fontWeight: '600',
  },
  cartItemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  cartQuantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartQuantity: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C160E',
    minWidth: 20,
    textAlign: 'center',
  },
  cartRemoveButton: { padding: 4 },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyCartText: {
    fontSize: 16,
    color: '#707A6C',
    marginTop: 12,
  },
  cartTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 202, 186, 0.3)',
  },
  cartTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  cartTotalPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0D631B',
  },
  checkoutButton: {
    backgroundColor: '#0D631B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  chatListContainer: { paddingBottom: 16 },
  chatListItem: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(191, 202, 186, 0.2)',
    alignItems: 'center',
  },
  chatListAvatar: { marginRight: 12 },
  chatListInfo: { flex: 1 },
  chatListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  chatListTime: {
    fontSize: 12,
    color: '#707A6C',
  },
  chatListFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 2,
  },
  chatListMessage: {
    flex: 1,
    fontSize: 14,
    color: '#707A6C',
    marginRight: 8,
  },
  chatListBadge: {
    backgroundColor: '#0D631B',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  chatListBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  chatListProduct: {
    fontSize: 12,
    color: '#0D631B',
    marginTop: 2,
  },

  addProductForm: { maxHeight: '80%' },
  formLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2C160E',
    marginBottom: 4,
    marginTop: 12,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#2C160E',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitButton: {
    backgroundColor: '#0D631B',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },

  chatModalContent: {
    backgroundColor: '#FFF8F6',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    height: '80%',
  },
  chatHeaderInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chatSellerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C160E',
  },
  chatProductName: {
    fontSize: 12,
    color: '#707A6C',
  },
  chatMessages: {
    flex: 1,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
  },
  messageReceived: {
    backgroundColor: '#F3F4F6',
    alignSelf: 'flex-start',
  },
  messageSent: {
    backgroundColor: '#0D631B',
    alignSelf: 'flex-end',
  },
  messageText: {
    fontSize: 14,
    color: '#2C160E',
  },
  messageTextSent: {
    color: '#FFFFFF',
  },
  messageTime: {
    fontSize: 10,
    color: '#707A6C',
    marginTop: 4,
  },
  messageTimeSent: {
    color: 'rgba(255,255,255,0.7)',
  },
  chatInputContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(191, 202, 186, 0.3)',
  },
  chatInput: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.3)',
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D631B',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MarketplaceScreen;