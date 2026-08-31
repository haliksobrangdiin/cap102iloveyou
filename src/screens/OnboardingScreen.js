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
  SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = ({ navigation }) => {
  const [showSplash, setShowSplash] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef(null);
  const scrollX = useRef(new Animated.Value(0)).current;
  const loadingProgress = useRef(new Animated.Value(0)).current;
  const splashFade = useRef(new Animated.Value(1)).current;

  const slides = [
    {
      id: '1',
      subtitle: 'Rooted in Nature, Powered by Technology',
      image: require('../assets/logo.png'),
      description: 'Your AI-powered cassava disease detection assistant',
      icon: 'leaf-outline',
    },
    {
      id: '2',
      title: 'Protect Your Harvest',
      subtitle: 'Instantly detect cassava diseases with our AI-powered scanner.',
      image: require('../assets/SecondSlide.png'),
      description: 'Get expert treatment advice in seconds',
      icon: 'scan-outline',
    },
    {
      id: '3',
      title: 'Smart Farming',
      subtitle: 'Monitor crop health and get real-time insights.',
      image: require('../assets/ThirdSlide.png'),
      description: 'Make informed decisions with data-driven analysis',
      icon: 'stats-chart-outline',
    },
    {
      id: '4',
      title: 'Grow Your Income',
      subtitle: 'Connect with farmers, negotiate fair prices, and earn more.',
      image: require('../assets/LastSlide.png'),
      description: 'Buy and sell root crops directly through the marketplace',
      icon: 'storefront-outline',
    },
  ];

  useEffect(() => {
    Animated.timing(loadingProgress, {
      toValue: 100,
      duration: 2500,
      useNativeDriver: false,
    }).start(() => {
      Animated.timing(splashFade, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowSplash(false);
      });
    });
  }, []);

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
      setCurrentIndex(currentIndex + 1);
    } else {
      navigation.replace('Login');
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: currentIndex - 1,
        animated: true,
      });
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSkip = () => {
    navigation.replace('Login');
  };

  const renderItem = ({ item, index }) => {
    const isLast = index === slides.length - 1;
    const isFirstSlide = index === 0;
    const isSecondSlide = index === 1;

    const getButtonText = () => {
      if (isLast) return 'Get Started';
      return 'Next';
    };

    const showWhitePlate = !isFirstSlide;

    return (
      <View style={styles.slide}>
        <StatusBar barStyle="dark-content" />

        {/* Skip Button - Top Right (Slightly tucked in) */}
        <View style={styles.topNavigation}>
          {!isLast && (
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text style={styles.skipButtonText}>Skip</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.contentWrapper}>
          <View style={styles.imageContainer}>
            <View
              style={
                showWhitePlate ? styles.imageWrapper : styles.imageWrapperPlain
              }
            >
              <Image
                source={item.image}
                style={styles.mainImage}
                resizeMode={showWhitePlate ? 'cover' : 'contain'}
              />

              {isSecondSlide && (
                <View style={styles.scannerOverlay}>
                  <View style={styles.scannerCornerTL} />
                  <View style={styles.scannerCornerTR} />
                  <View style={styles.scannerCornerBL} />
                  <View style={styles.scannerCornerBR} />
                  <View style={styles.scanningLine} />
                </View>
              )}

              {isSecondSlide && (
                <View style={styles.aiTag}>
                  <Ionicons name="bulb-outline" size={14} color="#FFFFFF" />
                  <Text style={styles.aiTagText}>AI Detection</Text>
                </View>
              )}
            </View>
          </View>

          <View style={styles.contentContainer}>
            {isFirstSlide ? (
              <>
                {item.title && <Text style={styles.titleFirst}>{item.title}</Text>}
                <Text style={styles.subtitleFirst}>{item.subtitle}</Text>
                <Text style={styles.descriptionFirst}>{item.description}</Text>
              </>
            ) : (
              <>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                {item.description && (
                  <Text style={styles.description}>{item.description}</Text>
                )}
              </>
            )}
          </View>
        </View>

        <View style={styles.navigationContainer}>
          {/* Dots */}
          <View style={styles.dotsContainer}>
            {slides.map((_, i) => {
              const inputRange = [
                (i - 1) * width,
                i * width,
                (i + 1) * width,
              ];

              const dotWidth = scrollX.interpolate({
                inputRange,
                outputRange: [8, 32, 8],
                extrapolate: 'clamp',
              });

              const dotOpacity = scrollX.interpolate({
                inputRange,
                outputRange: [0.4, 1, 0.4],
                extrapolate: 'clamp',
              });

              return (
                <Animated.View
                  key={i}
                  style={[
                    styles.dot,
                    {
                      width: dotWidth,
                      opacity: dotOpacity,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Bottom Navigation */}
          <View style={styles.bottomNavigation}>
            {/* Back Button */}
            {!isFirstSlide && (
              <TouchableOpacity
                style={styles.backButton}
                onPress={handleBack}
                activeOpacity={0.85}
              >
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            )}

            {/* Next/Get Started Button */}
            <TouchableOpacity
              style={[styles.nextButton, isFirstSlide && styles.nextButtonFullWidth]}
              onPress={handleNext}
              activeOpacity={0.85}
            >
              <Text style={styles.nextButtonText}>{getButtonText()}</Text>
              {!isLast && (
                <Ionicons name="arrow-forward" size={20} color="#FFFFFF" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const renderSplash = () => {
    const loadingWidth = loadingProgress.interpolate({
      inputRange: [0, 100],
      outputRange: ['0%', '100%'],
    });

    return (
      <Animated.View
        style={[
          styles.splashContainer,
          {
            opacity: splashFade,
          },
        ]}
      >
        <StatusBar barStyle="dark-content" />
        
        <View style={styles.splashBackground}>
          <View style={styles.splashGradient1} />
          <View style={styles.splashGradient2} />
          <View style={styles.splashGradient3} />
        </View>

        <View style={styles.splashContent}>
          <View style={styles.splashLogoWrapper}>
            <Image
              source={require('../assets/emblem.png')}
              style={styles.splashLogo}
              resizeMode="contain"
            />
          </View>

          <View style={styles.splashTextContainer}>
            <Text style={styles.splashTitle}>RootCare</Text>
            <Text style={styles.splashSubtitle}>
              Rooted in Nature, <Text style={styles.splashSubtitleAccent}>Powered by Technology</Text>
            </Text>
          </View>

          <View style={styles.splashLoadingContainer}>
            <View style={styles.splashLoadingBarTrack}>
              <Animated.View
                style={[
                  styles.splashLoadingBarFill,
                  { width: loadingWidth },
                ]}
              />
            </View>

            <View style={styles.splashLoadingLabel}>
              <Text style={styles.splashLoadingText}>Initializing Field Data</Text>
            </View>
          </View>
        </View>

        <View style={styles.splashDeco1} />
        <View style={styles.splashDeco2} />
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {showSplash ? (
        renderSplash()
      ) : (
        <FlatList
          ref={flatListRef}
          data={slides}
          renderItem={renderItem}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false }
          )}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(event.nativeEvent.contentOffset.x / width);
            setCurrentIndex(index);
          }}
          scrollEnabled={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF8F6',
  },
  splashContainer: {
    flex: 1,
    backgroundColor: '#FFF8F6',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  splashBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'hidden',
  },
  splashGradient1: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '50%',
    height: '50%',
    backgroundColor: '#FFF1ED',
    borderRadius: 999,
    transform: [{ scale: 2 }],
    opacity: 0.5,
  },
  splashGradient2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: '50%',
    height: '50%',
    backgroundColor: '#A3F69C',
    borderRadius: 999,
    transform: [{ scale: 2 }],
    opacity: 0.3,
  },
  splashGradient3: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: '30%',
    height: '30%',
    backgroundColor: '#CBFFC2',
    borderRadius: 999,
    transform: [{ scale: 2 }],
    opacity: 0.2,
  },
  splashContent: {
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  splashLogoWrapper: {
    marginBottom: 16,
  },
  splashLogo: {
    width: 350,
    height: 350,
  },
  splashTextContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  splashTitle: {
    fontSize: 40,
    fontWeight: '700',
    color: '#0D631B',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: '#40493D',
    textAlign: 'center',
  },
  splashSubtitleAccent: {
    fontWeight: '600',
    color: '#0D631B',
  },
  splashLoadingContainer: {
    width: '80%',
    maxWidth: 300,
    alignItems: 'center',
  },
  splashLoadingBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(191, 202, 186, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  splashLoadingBarFill: {
    height: '100%',
    backgroundColor: '#2E7D32',
    borderRadius: 2,
  },
  splashLoadingLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  splashLoadingText: {
    fontSize: 10,
    fontWeight: '500',
    color: '#707A6C',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  splashDeco1: {
    position: 'absolute',
    top: 40,
    right: 30,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(152, 98, 0, 0.1)',
  },
  splashDeco2: {
    position: 'absolute',
    bottom: 60,
    left: 20,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'rgba(122, 86, 73, 0.1)',
  },
  slide: {
    width,
    height: height,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF8F6',
  },

  topNavigation: {
    position: 'absolute',
    top: 85,
    right: 35,
    zIndex: 10,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#707A6C',
    letterSpacing: 0.3,
  },
  contentWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 16,
    marginTop: 40, // Added margin to make room for the Skip button
  },
  imageWrapper: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(191, 202, 186, 0.2)',
  },
  imageWrapperPlain: {
    width: '100%',
    maxWidth: 280,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  scannerOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    right: 16,
    bottom: 16,
    borderWidth: 2,
    borderColor: 'rgba(136, 217, 130, 0.5)',
    borderRadius: 8,
  },
  scannerCornerTL: {
    position: 'absolute',
    top: -2,
    left: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0D631B',
    borderTopLeftRadius: 4,
  },
  scannerCornerTR: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 20,
    height: 20,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0D631B',
    borderTopRightRadius: 4,
  },
  scannerCornerBL: {
    position: 'absolute',
    bottom: -2,
    left: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderColor: '#0D631B',
    borderBottomLeftRadius: 4,
  },
  scannerCornerBR: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 20,
    height: 20,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderColor: '#0D631B',
    borderBottomRightRadius: 4,
  },
  scanningLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#88d982',
    opacity: 0.8,
    top: '50%',
  },
  aiTag: {
    position: 'absolute',
    top: 20,
    right: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(46, 125, 50, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  aiTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  titleFirst: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0D631B',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitleFirst: {
    fontSize: 15,
    fontWeight: '400',
    color: '#40493D',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 4,
  },
  descriptionFirst: {
    fontSize: 14,
    fontWeight: '400',
    color: '#707A6C',
    textAlign: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#2C160E',
    textAlign: 'center',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: '#40493D',
    textAlign: 'center',
    lineHeight: 22,
  },
  description: {
    fontSize: 14,
    fontWeight: '400',
    color: '#707A6C',
    textAlign: 'center',
    marginTop: 4,
  },
  navigationContainer: {
    alignItems: 'center',
    gap: 12,
    paddingBottom: 10,
    width: '100%',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0D631B',
  },
  bottomNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    gap: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1A4D1E',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    flex: 1,
    shadowColor: '#1A4D1E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 12,
    flex: 1,
    gap: 8,
    shadowColor: '#2E7D32',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonFullWidth: {
    flex: 1,
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
});

export default OnboardingScreen;