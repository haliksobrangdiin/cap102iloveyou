import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  Platform,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');

const recipes = [
  {
    id: '1',
    image: require('../assets/CassavaCake.png'),
    title: 'Cassava Cake with Custard Toppings',
    description: 'made with grated cassava and coconut milk. Soft and moist with a creamy flan topping, this classic Filipino treat is the ultimate snack or dessert.',
    ingredients: [
      '2 cups grated cassava',
      '1 can coconut milk',
      '1 can condensed milk',
      '3 eggs',
      '1 cup sugar',
      '1 tsp vanilla extract',
      'Butter for greasing',
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Mix all ingredients together in a large bowl.',
      'Pour mixture into greased baking pan.',
      'Bake for 45-50 minutes until golden brown.',
      'Let cool before serving.',
    ],
    prepTime: '15 minutes',
    cookTime: '50 minutes',
    servings: '8-10 servings',
  },
  {
    id: '2',
    image: require('../assets/CassavaCustard.png'),
    title: 'Cassava Cake',
    description: 'is a classic Filipino dessert made from grated cassava (manioc). Combine the grated cassava, butter, milk, a portion of the cheese',
    ingredients: [
      '3 cups grated cassava',
      '1 cup butter, melted',
      '1 can evaporated milk',
      '1 can condensed milk',
      '2 eggs',
      '1 cup grated cheese',
      '1 tsp vanilla',
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Combine all ingredients in a bowl.',
      'Pour into greased baking dish.',
      'Bake for 40-45 minutes.',
      'Top with cheese and broil for 2-3 minutes.',
    ],
    prepTime: '20 minutes',
    cookTime: '45 minutes',
    servings: '8 servings',
  },
  {
    id: '3',
    image: require('../assets/suman.png'),
    title: 'Steamed Cassava Suman',
    description: 'is a delicious snack or dessert made with grated yucca and coconut milk. This Filipino cake is tasty, filling, and gluten-free.',
    ingredients: [
      '3 cups grated cassava',
      '1 cup coconut milk',
      '1 cup sugar',
      '1 tsp salt',
      'Banana leaves for wrapping',
    ],
    instructions: [
      'Mix cassava, coconut milk, sugar, and salt.',
      'Wrap mixture in banana leaves.',
      'Steam for 30-40 minutes.',
      'Serve with sugar or coconut jam.',
    ],
    prepTime: '25 minutes',
    cookTime: '40 minutes',
    servings: '6-8 pieces',
  },
  {
    id: '4',
    image: require('../assets/CassavaChips.png'),
    title: 'Crispy Cassava Chips',
    description: 'thinly sliced cassava root, fried until golden and crunchy. A popular Filipino snack, often lightly salted or seasoned with chili and vinegar.',
    ingredients: [
      '2 large cassava roots',
      'Oil for frying',
      'Salt to taste',
      'Optional: chili powder, vinegar',
    ],
    instructions: [
      'Peel and thinly slice cassava.',
      'Soak in water for 30 minutes.',
      'Pat dry completely.',
      'Deep fry until golden and crispy.',
      'Season with salt and desired spices.',
    ],
    prepTime: '30 minutes',
    cookTime: '15 minutes',
    servings: '4 servings',
  },
  {
    id: '5',
    image: require('../assets/CassavaBibingka.png'),
    title: 'Cassava Bibingka',
    description: 'a soft, chewy rice-cake-style treat made from grated cassava, coconut milk, and sugar, traditionally baked and topped with a sprinkle of grated coconut.',
    ingredients: [
      '3 cups grated cassava',
      '1 can coconut milk',
      '1 can condensed milk',
      '2 eggs',
      '1 cup sugar',
      'Grated coconut for topping',
    ],
    instructions: [
      'Preheat oven to 350°F (175°C).',
      'Mix all ingredients together.',
      'Pour into lined baking pan.',
      'Bake for 40-45 minutes.',
      'Top with grated coconut.',
    ],
    prepTime: '15 minutes',
    cookTime: '45 minutes',
    servings: '8 servings',
  },
  {
    id: '6',
    image: require('../assets/CassavaFries.png'),
    title: 'Cassava Fries',
    description: 'cassava cut into fry-shaped sticks, deep-fried until crisp outside and soft inside. Served as a starchy alternative to potato fries, great with dips.',
    ingredients: [
      '3 large cassava roots',
      'Oil for frying',
      'Salt to taste',
      'Optional: garlic powder, paprika',
    ],
    instructions: [
      'Peel and cut cassava into fry shapes.',
      'Boil for 5-7 minutes until slightly tender.',
      'Pat dry completely.',
      'Deep fry until golden and crispy.',
      'Season with salt and spices.',
    ],
    prepTime: '20 minutes',
    cookTime: '20 minutes',
    servings: '4 servings',
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredRecipes = recipes.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    recipe.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleRecipePress = (recipe) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedRecipe(recipe);
    setModalVisible(true);
  };

  const renderRecipeModal = () => {
    if (!selectedRecipe) return null;

    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <TouchableOpacity 
                style={styles.modalCloseButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  setModalVisible(false);
                }}
              >
                <Ionicons name="arrow-back" size={24} color="#5C3D2E" />
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Recipe Details</Text>
              <View style={{ width: 24 }} />
            </View>

            <ScrollView 
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScrollContent}
            >
              <Image source={selectedRecipe.image} style={styles.modalImage} resizeMode="cover" />
              
              <Text style={styles.modalRecipeTitle}>{selectedRecipe.title}</Text>
              <Text style={styles.modalDescription}>{selectedRecipe.description}</Text>

              <View style={styles.modalInfoRow}>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="time-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>Prep: {selectedRecipe.prepTime}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="flame-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>Cook: {selectedRecipe.cookTime}</Text>
                </View>
                <View style={styles.modalInfoItem}>
                  <Ionicons name="people-outline" size={18} color="#C77A58" />
                  <Text style={styles.modalInfoText}>{selectedRecipe.servings}</Text>
                </View>
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Ingredients</Text>
                {selectedRecipe.ingredients.map((ingredient, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={styles.modalBullet} />
                    <Text style={styles.modalListItemText}>{ingredient}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.modalSection}>
                <Text style={styles.modalSectionTitle}>Instructions</Text>
                {selectedRecipe.instructions.map((instruction, index) => (
                  <View key={index} style={styles.modalListItem}>
                    <View style={[styles.modalBullet, styles.modalNumberBullet]}>
                      <Text style={styles.modalNumberText}>{index + 1}</Text>
                    </View>
                    <Text style={styles.modalListItemText}>{instruction}</Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Search Bar */}
      <View style={styles.header}>
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#8A7A66" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor="#8A7A66"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity 
              onPress={() => setSearchQuery('')}
              style={styles.clearButton}
            >
              <Ionicons name="close-circle" size={20} color="#8A7A66" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredRecipes.length > 0 ? (
          filteredRecipes.map((recipe) => (
            <TouchableOpacity 
              key={recipe.id} 
              style={styles.recipeCard}
              onPress={() => handleRecipePress(recipe)}
              activeOpacity={0.7}
            >
              <Image source={recipe.image} style={styles.recipeImage} resizeMode="cover" />
              <View style={styles.recipeTextBlock}>
                <Text style={styles.recipeTitle}>{recipe.title}</Text>
                <Text style={styles.recipeDescription} numberOfLines={2}>
                  {recipe.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C77A58" />
            </TouchableOpacity>
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color="#C77A58" />
            <Text style={styles.emptyText}>No recipes found</Text>
            <Text style={styles.emptySubtext}>Try searching for something else</Text>
          </View>
        )}
      </ScrollView>

      {renderRecipeModal()}
    </SafeAreaView>
  );
};

const HEADER_HEIGHT = 80;

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
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5EDE3',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    paddingVertical: 8,
  },
  clearButton: {
    padding: 4,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20,
  },
  recipeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E4D3BB',
    borderRadius: 14,
    padding: 12,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recipeTextBlock: {
    flex: 1,
    marginLeft: 12,
    marginRight: 8,
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    lineHeight: 19,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 12,
    color: '#555555',
    lineHeight: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5C3D2E',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#8A7A66',
    marginTop: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#F5EDE3',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    minHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#5C3D2E',
  },
  modalScrollContent: {
    paddingBottom: 20,
  },
  modalImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 16,
  },
  modalRecipeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#5C3D2E',
    marginBottom: 8,
  },
  modalDescription: {
    fontSize: 14,
    color: '#555555',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#E4D3BB',
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modalInfoText: {
    fontSize: 12,
    color: '#5C3D2E',
    fontWeight: '500',
  },
  modalSection: {
    marginBottom: 16,
  },
  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#C77A58',
    marginBottom: 10,
  },
  modalListItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  modalBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#C77A58',
    marginTop: 7,
  },
  modalNumberBullet: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#C77A58',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  modalNumberText: {
    fontSize: 10,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  modalListItemText: {
    flex: 1,
    fontSize: 13,
    color: '#4A3A2A',
    lineHeight: 20,
  },
});

export default HomeScreen;