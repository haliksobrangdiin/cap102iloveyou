// src/data/onboardingData.js
export const onboardingData = [
  {
    id: '1',
    // First slide - uses logo.png from assets
  },
  {
    id: '2',
    titleTop: 'WELCOME TO',
    titleAccent: 'ROOTCARE',
    description: 'Your smart companion for healthy cassava farming',
    image: require('../assets/SecondSlide.png'), // Path: src/assets/SecondSlide.png
  },
  {
    id: '3',
    title: 'WE PROVIDE TREATMENT FOR CASSAVA JUST FOR YOU',
    image: require('../assets/ThirdSlide.png'), // Path: src/assets/ThirdSlide.png
  },
  {
    id: '4',
    title: 'SAVE YOUR TIME SAVE YOUR BUSINESS!',
    image: require('../assets/LastSlide.png'), // Path: src/assets/LastSlide.png
  },
  {
    id: '5',
    title: 'WE PROVIDE TREATMENT FOR EVERY CASSAVA JUST FOR YOU',
    // image: require('../assets/FifthSlide.png'), // Uncomment when you have this image
  },
];

export default onboardingData;