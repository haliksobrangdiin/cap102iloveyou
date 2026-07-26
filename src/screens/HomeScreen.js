import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Dimensions, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../styles/colors';

const { width } = Dimensions.get('window');

// Swap these require() paths for your actual dish images.
const recipes = [
  {
    id: '1',
    image: require('../assets/CassavaCake.png'),
    title: 'Cassava Cake with Custard Topping',
    description:
      'made with grated cassava and coconut milk. Soft and moist with a creamy flan topping, this classic Filipino treat is the ultimate snack or dessert.',
  },
  {
    id: '2',
    image: require('../assets/CassavaCustard.png'),
    title: 'Cassava Cake',
    description:
      'is a classic Filipino dessert made from grated cassava (manioc). Combine the grated cassava, butter, milk, a portion of the cheese',
  },
  {
    id: '3',
    image: require('../assets/suman.png'),
    title: 'Steamed Cassava Suman',
    description:
      'is a delicious snack or dessert made with grated yucca and coconut milk. This Filipino cake is tasty, filling, and gluten-free.',
  },
  {
    id: '4',
    image: require('../assets/CassavaChips.png'),
    title: 'Crispy Cassava Chips',
    description:
      'thinly sliced cassava root, fried until golden and crunchy. A popular Filipino snack, often lightly salted or seasoned with chili and vinegar.',
  },
  {
    id: '5',
    image: require('../assets/CassavaBibingka.png'),
    title: 'Cassava Bibingka',
    description:
      'a soft, chewy rice-cake-style treat made from grated cassava, coconut milk, and sugar, traditionally baked and topped with a sprinkle of grated coconut.',
  },
  {
    id: '6',
    image: require('../assets/CassavaFries.png'),
    title: 'Cassava Fries',
    description:
      'cassava cut into fry-shaped sticks, deep-fried until crisp outside and soft inside. Served as a starchy alternative to potato fries, great with dips.',
  },
];

const HomeScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Empty terracotta header bar */}
      <View style={styles.header} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {recipes.map((recipe) => (
          <View key={recipe.id} style={styles.recipeCard}>
            <Image source={recipe.image} style={styles.recipeImage} resizeMode="cover" />
            <View style={styles.recipeTextBlock}>
              <Text style={styles.recipeTitle}>{recipe.title}</Text>
              <Text style={styles.recipeDescription}>{recipe.description}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      {/* REMOVED: Floating bottom navigation bar - Now handled by MainTabs */}
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
    height: HEADER_HEIGHT,
    backgroundColor: '#C77A58',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 20, // Changed from BOTTOM_BAR_HEIGHT + 32
  },
  // Recipe Cards
  recipeCard: {
    flexDirection: 'row',
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
    width: 95,
    height: 95,
    borderRadius: 8,
  },
  recipeTextBlock: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#222222',
    lineHeight: 19,
    marginBottom: 4,
  },
  recipeDescription: {
    fontSize: 13,
    color: '#333333',
    lineHeight: 18,
  },
  // REMOVED: All bottomBar, tabItem, tabLabel, fabSlot, fabButton, fabLabel styles
});

export default HomeScreen;