import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Dimensions,
  StatusBar,
  Image,
  Animated,
  Easing,
} from 'react-native';
import onboardingData from '../data/onboardingData';
import { colors } from '../styles/colors';

const { width, height } = Dimensions.get('window');

// Only slides from index 2 onward ("content" slides) count toward the dash indicator.
// Slide 0 (icon-only) and slide 1 (welcome) are intro slides and don't show it.
const DASH_START_INDEX = 2;

// Pagination dot sizing (track is always DOT_MAX_WIDTH; the colored fill
// scales down to DOT_MIN_WIDTH via transform for inactive dots).
const DOT_MAX_WIDTH = 24;
const DOT_MIN_WIDTH = 10;

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Animation values for Slide 2 (Welcome)
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const welcomeTopTranslate = useRef(new Animated.Value(30)).current;
  const welcomeTopOpacity = useRef(new Animated.Value(0)).current;
  const welcomeAccentTranslate = useRef(new Animated.Value(30)).current;
  const welcomeAccentOpacity = useRef(new Animated.Value(0)).current;
  const welcomeDescTranslate = useRef(new Animated.Value(30)).current;
  const welcomeDescOpacity = useRef(new Animated.Value(0)).current;

  const handleNext = () => {
    if (currentIndex < onboardingData.length - 1) {
      flatListRef.current.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('MainTabs'); // Changed from 'Home' to 'MainTabs'
    }
  };

  // Trigger animations when reaching Slide 2 (index 1)
  useEffect(() => {
    if (currentIndex === 1) {
      // Reset animations
      logoScale.setValue(0.8);
      logoOpacity.setValue(0);
      welcomeTopTranslate.setValue(30);
      welcomeTopOpacity.setValue(0);
      welcomeAccentTranslate.setValue(30);
      welcomeAccentOpacity.setValue(0);
      welcomeDescTranslate.setValue(30);
      welcomeDescOpacity.setValue(0);

      // Step 1: Logo fades in with scale up (0.8 → 1.5)
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1.5,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
      ]).start();

      // Step 2: "WELCOME TO" slides up with fade in (after 400ms)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(welcomeTopTranslate, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(welcomeTopOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 400);

      // Step 3: "ROOTCARE" slides up with fade in (after 200ms)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(welcomeAccentTranslate, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(welcomeAccentOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 600);

      // Step 4: Subtitle slides up with fade in (after 200ms)
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(welcomeDescTranslate, {
            toValue: 0,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(welcomeDescOpacity, {
            toValue: 1,
            duration: 600,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
        ]).start();
      }, 800);

      // After all elements are visible, wait 2 seconds, then navigate to Slide 3
      const autoNavigate = setTimeout(() => {
        if (currentIndex === 1) {
          flatListRef.current?.scrollToIndex({
            index: 2,
            animated: true,
          });
          setCurrentIndex(2);
        }
      }, 2800);

      return () => clearTimeout(autoNavigate);
    }
  }, [currentIndex]);

  // Get content slides (excluding first two)
  const contentSlides = onboardingData.slice(DASH_START_INDEX);

  const renderItem = ({ item, index }) => {
    const isFirst = index === 0;
    const isWelcome = index === 1;
    const isContentSlide = index >= DASH_START_INDEX;
    const contentIndex = index - DASH_START_INDEX;

    // FIX: Determine button text based on slide position
    const getButtonText = () => {
      if (isFirst) return 'START';
      if (index === onboardingData.length - 1) return 'GET STARTED';
      return 'NEXT';
    };

    return (
      <View style={[
        styles.slide,
        isWelcome && styles.welcomeSlide
      ]}>
        <StatusBar barStyle="dark-content" />

        {/* First Slide - uses logo.png */}
        {isFirst && (
          <View style={styles.logoContainer}>
            <Image 
              source={require('../assets/logo.png')} 
              style={styles.logo} 
              resizeMode="contain"
            />
          </View>
        )}

        {/* Second Slide - Welcome with exact positioning - uses logo.png */}
        {isWelcome && (
          <View style={styles.welcomeContainer}>
            {/* Logo - Use logo.png for second slide */}
            <Animated.View 
              style={[
                styles.logoWrapper,
                {
                  transform: [{ scale: logoScale }],
                  opacity: logoOpacity,
                }
              ]}
            >
              <Image 
                source={require('../assets/logo.png')} 
                style={[styles.welcomeLogo, styles.logoShadow]} 
                resizeMode="contain"
              />
            </Animated.View>

            {/* Text Content - Left aligned in lower section */}
            <View style={styles.welcomeBlock}>
              <Animated.Text 
                style={[
                  styles.welcomeTop,
                  styles.textShadow,
                  {
                    transform: [{ translateY: welcomeTopTranslate }],
                    opacity: welcomeTopOpacity,
                  }
                ]}
              >
                {item.titleTop}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.welcomeAccent,
                  styles.accentShadow,
                  {
                    transform: [{ translateY: welcomeAccentTranslate }],
                    opacity: welcomeAccentOpacity,
                  }
                ]}
              >
                {item.titleAccent}
              </Animated.Text>
              <Animated.Text 
                style={[
                  styles.welcomeDescription,
                  styles.textShadow,
                  {
                    transform: [{ translateY: welcomeDescTranslate }],
                    opacity: welcomeDescOpacity,
                  }
                ]}
              >
                {item.description}
              </Animated.Text>
            </View>
          </View>
        )}

        {/* Content Slides (3, 4, 5) - Use images in order */}
        {isContentSlide && (
          <>
            <View style={styles.contentContainer}>
              {/* Slide 3 - uses SecondSlide.png */}
              {index === 2 && (
                <Image 
                  source={require('../assets/SecondSlide.png')} 
                  style={styles.contentImage} 
                  resizeMode="contain"
                />
              )}
              {/* Slide 4 - uses ThirdSlide.png */}
              {index === 3 && (
                <Image 
                  source={require('../assets/ThirdSlide.png')} 
                  style={styles.contentImage} 
                  resizeMode="contain"
                />
              )}
              {/* Slide 5 - uses LastSlide.png */}
              {index === 4 && (
                <Image 
                  source={require('../assets/LastSlide.png')} 
                  style={styles.contentImage} 
                  resizeMode="contain"
                />
              )}
              <Text style={styles.contentTitle}>{item.title}</Text>
            </View>

            {/* Pagination Dots - Only for content slides (3, 4, 5) */}
            <View style={styles.paginationContainer}>
              {contentSlides.map((_, i) => {
                const actualIndex = i + DASH_START_INDEX;

                const inputRange = [
                  (actualIndex - 1) * width,
                  actualIndex * width,
                  (actualIndex + 1) * width,
                ];

                const fillScale = scrollX.interpolate({
                  inputRange,
                  outputRange: [DOT_MIN_WIDTH / DOT_MAX_WIDTH, 1, DOT_MIN_WIDTH / DOT_MAX_WIDTH],
                  extrapolate: 'clamp',
                });

                const fillOpacity = scrollX.interpolate({
                  inputRange,
                  outputRange: [0, 1, 0],
                  extrapolate: 'clamp',
                });

                return (
                  <View key={i} style={styles.dotTrack}>
                    <Animated.View
                      style={[
                        styles.dotFill,
                        {
                          opacity: fillOpacity,
                          transform: [{ scaleX: fillScale }],
                        },
                      ]}
                    />
                  </View>
                );
              })}
            </View>
          </>
        )}

        {/* Button - hidden on welcome slide, shown on others */}
        {!isWelcome && (
          <TouchableOpacity style={styles.button} onPress={handleNext} activeOpacity={0.85}>
            {/* FIX: Use the getButtonText function instead of isFirst directly */}
            <Text style={styles.buttonText}>{getButtonText()}</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <FlatList
      ref={flatListRef}
      data={onboardingData}
      renderItem={renderItem}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      getItemLayout={(data, index) => ({
        length: width,
        offset: width * index,
        index,
      })}
      onScrollToIndexFailed={(info) => {
        setTimeout(() => {
          flatListRef.current?.scrollToIndex({ index: info.index, animated: true });
        }, 100);
      }}
      onScroll={Animated.event(
        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
        { useNativeDriver: true }
      )}
      onMomentumScrollEnd={(event) => {
        const index = Math.round(event.nativeEvent.contentOffset.x / width);
        setCurrentIndex(index);
      }}
      scrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    height,
    backgroundColor: '#D2BEA3',
    paddingHorizontal: 32,
    paddingBottom: 56,
    justifyContent: 'space-between',
  },
  welcomeSlide: {
    backgroundColor: '#D2BEA3',
    paddingHorizontal: 39,
  },
  // First Slide Styles
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 40,
  },
  logo: {
    width: 600,
    height: 600,
    marginBottom: 16,
  },
  logoText: {
    fontSize: 32,
    fontWeight: '800',
    color: '#D8B07C',
    letterSpacing: 3,
  },
  // Welcome Slide Styles - Exact positioning
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 40,
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    alignSelf: 'center',
  },
  welcomeLogo: {
    width: 450,
    height: 450,
  },
  logoShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },
  welcomeBlock: {
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 10,
  },
  welcomeTop: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
    textAlign: 'left',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  welcomeAccent: {
    fontSize: 40,
    fontWeight: '800',
    color: '#C97B5B',
    marginBottom: 12,
    textAlign: 'left',
    letterSpacing: 1,
  },
  welcomeDescription: {
    fontSize: 12,
    fontWeight: '500',
    color: '#FFFFFF',
    lineHeight: 18,
    textAlign: 'left',
    maxWidth: '90%',
  },
  textShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 3,
  },
  accentShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.25)',
    textShadowOffset: { width: 2, height: 3 },
    textShadowRadius: 4,
  },
  // Content Slides Styles
  contentContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  contentImage: {
    width: width * 0.5,
    height: height * 0.3,
    marginBottom: 20,
    borderRadius: 12,
  },
  contentTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.onboardingText,
    textAlign: 'center',
    lineHeight: 27,
    textTransform: 'uppercase',
  },
  // Pagination Styles
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    height: 20,
  },
  paginationDot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  dotTrack: {
    width: DOT_MAX_WIDTH,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: '#D8B07C',
    overflow: 'hidden',
  },
  dotFill: {
    width: '100%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#B86D4F',
  },
  button: {
    backgroundColor: '#B86D4F',
    paddingVertical: 15,
    borderRadius: 30,
    width: '100%',
    alignItems: 'center',
    shadowColor: '#B86D4F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: colors.onboardingText,
    fontSize: 14,
    fontWeight: 'bold',
    letterSpacing: 1.2,
  },
});

export default OnboardingScreen;