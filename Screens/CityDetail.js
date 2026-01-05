import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// Unsplash API Configuration
const ACCESS_KEY = "jc_3gNhV36lhccTFQkAhw65EGZg0Zn5PlPhmtRNgabI";
const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

// City Data with descriptions only - Images will come from API
const cityData = {
  'Hunza': {
    description: 'The Hunza Valley is a mountainous valley in the northern part of the Gilgit-Baltistan region of Pakistan. Often referred to as "Heaven on Earth," it is famous for its longevity, the majestic Rakaposhi peak, and the ancient Baltit and Altit Forts. The valley offers distinct beauty in every season, from the cherry blossoms of spring to the golden hues of autumn. It is a major stop on the ancient Silk Road.',
    spots: ['Attabad Lake', 'Rakaposhi Peak', 'Baltit Fort'],
  },
  'Islamabad': {
    description: 'Islamabad is the capital city of Pakistan and the tenth largest city in the country. The city is well-known for its high standard of living, safety, and abundant greenery. It is home to the Faisal Mosque, the largest mosque in South Asia, and the Pakistan Monument. The city is located at the foothills of the Margalla Hills.',
    spots: ['Faisal Mosque', 'Daman-e-Koh', 'Pakistan Monument'],
  },
  'Lahore': {
    description: 'Lahore is the cultural capital of Pakistan and the second-largest city. Known for its rich history, Mughal architecture, and delicious food. The city is home to the UNESCO World Heritage Sites: Lahore Fort and Shalimar Gardens. Lahore is also famous for its vibrant bazaars and lively culture.',
    spots: ['Badshahi Mosque', 'Lahore Fort', 'Minar-e-Pakistan'],
  },
  'Peshawar': {
    description: 'Peshawar is the capital of Khyber Pakhtunkhwa province and one of the oldest cities in Pakistan with a history dating back to at least 539 BCE. Known as the "City of Flowers", it is famous for its rich cultural heritage, historical bazaars, and traditional Pashtun hospitality.',
    spots: ['Qissa Khwani Bazaar', 'Bala Hisar Fort', 'Islamia College'],
  },
  'Murree': {
    description: 'Murree is a popular hill station near Islamabad, known for its pleasant climate and scenic beauty. Located in the Pir Panjal Range, it offers breathtaking views of snow-capped mountains. Murree is famous for its Mall Road, colonial architecture, and lush green hills.',
    spots: ['Mall Road', 'Patriata', 'Ayubia'],
  },
  'Abbottabad': {
    description: 'Abbottabad is a beautiful hill station in Khyber Pakhtunkhwa, known for its pleasant weather, educational institutions, and scenic beauty. It is located in the Orash Valley and surrounded by the Sarban Hills. The city is famous for its pine trees and British colonial architecture.',
    spots: ['Ilyasi Mosque', 'Shimla Hill', 'Kakul Academy'],
  },
  'Naran': {
    description: 'Naran is a popular tourist destination in Kaghan Valley, known for its breathtaking landscapes, lakes, and mountains. It serves as a base for trekking to Saiful Muluk Lake and other high-altitude lakes. The valley remains covered in snow for most of the year.',
    spots: ['Saiful Muluk Lake', 'Lulusar Lake', 'Babusar Pass'],
  },
  'Gilgit': {
    description: 'Gilgit is the capital city of Gilgit-Baltistan, serving as a major tourist destination and hub for expeditions to the Karakoram mountains. It is located in a broad valley near the confluence of the Gilgit and Hunza rivers. The city is a gateway to some of the world\'s highest peaks.',
    spots: ['Kargah Buddha', 'Naltar Valley', 'Gilgit River'],
  },
  'Rawalpindi': {
    description: 'Rawalpindi is the fourth-largest city in Pakistan and twin city of Islamabad. It is an important military and commercial center. The city is known for its vibrant bazaars, historical sites, and as the headquarters of the Pakistan Army.',
    spots: ['Rawalpindi Stadium', 'Ayub Park', 'Raja Bazaar'],
  },
  'Multan': {
    description: 'Multan is known as the "City of Saints" due to its large number of Sufi shrines. It is one of the oldest cities in South Asia with a history dating back over 5,000 years. The city is famous for its blue pottery, ornamental glasswork, and handicrafts.',
    spots: ['Shah Rukn-e-Alam', 'Multan Fort', 'Ghanta Ghar'],
  },
};

export default function CityDetail() {
  const navigation = useNavigation();
  const route = useRoute();
  
  const cityName = route?.params?.cityName || 'Hunza';
  const cityInfo = cityData[cityName];

  // State for images
  const [mainImage, setMainImage] = useState(null);
  const [spotImages, setSpotImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Calculate card width based on number of spots
  const numSpots = cityInfo?.spots?.length || 3;
  const spotsPerRow = 3; // 3 spots per row
  const gap = 10; // Gap between cards
  const totalGap = gap * (spotsPerRow - 1);
  const cardWidth = (width - 40 - totalGap) / spotsPerRow; // 40 = padding (20*2)

  // Fetch random images from Unsplash
  useEffect(() => {
    if (cityInfo) {
      fetchCityImages();
    }
  }, [cityName]);

  const fetchCityImages = async () => {
    setLoading(true);
    setError(null);

    try {
      // Fetch main city image
      const mainResponse = await axios.get(UNSPLASH_URL, {
        params: {
          query: `${cityName} Pakistan landscape`,
          per_page: 30,
          orientation: 'landscape'
        },
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
      });

      // Fetch images for tourist spots
      const spotPromises = cityInfo.spots.map(spot => 
        axios.get(UNSPLASH_URL, {
          params: {
            query: `${spot} Pakistan`,
            per_page: 10,
          },
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        })
      );

      const [mainData, ...spotDataArray] = await Promise.all([
        mainResponse,
        ...spotPromises
      ]);

      // Set main image
      if (mainData.data.results.length > 0) {
        const randomIndex = Math.floor(Math.random() * mainData.data.results.length);
        setMainImage(mainData.data.results[randomIndex].urls.regular);
      } else {
        // Fallback image if no results
        setMainImage('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
      }

      // Set spot images
      const spotImagesData = spotDataArray.map((spotData, index) => {
        if (spotData.data.results.length > 0) {
          const randomIndex = Math.floor(Math.random() * spotData.data.results.length);
          return {
            name: cityInfo.spots[index],
            image: spotData.data.results[randomIndex].urls.small
          };
        } else {
          // Fallback for spot images
          return {
            name: cityInfo.spots[index],
            image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          };
        }
      });

      setSpotImages(spotImagesData);
      setLoading(false);

    } catch (err) {
      console.error('Error fetching images:', err);
      setError('Failed to load images. Please check your connection.');
      
      // Set fallback images
      setMainImage('https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80');
      
      const fallbackSpots = cityInfo.spots.map(spot => ({
        name: spot,
        image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
      }));
      setSpotImages(fallbackSpots);
      
      setLoading(false);
    }
  };

  const handleWeatherPress = () => {
    if (navigation && navigation.navigate) {
      navigation.navigate('Weather', { city: cityName });
    } else {
      alert('Cannot navigate to weather screen');
    }
  };

  const handleRetry = () => {
    fetchCityImages();
  };

  if (!cityInfo) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>City information not found for "{cityName}"</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#187c3a" />
        <Text style={styles.loadingText}>Loading beautiful images of {cityName}...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Main City Image */}
      {mainImage && (
        <Image 
          source={{ uri: mainImage }} 
          style={styles.mainImage}
          resizeMode="cover"
        />
      )}

      {/* Error Message */}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorMessage}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>About {cityName}</Text>
        <Text style={styles.description}>{cityInfo.description}</Text>

        <Text style={styles.sectionTitle}>Top Tourist Spots in {cityName}</Text>
        
        {/* Tourist Spots Grid */}
        <View style={styles.spotsContainer}>
          {spotImages.map((spot, index) => (
            <View 
              key={index} 
              style={[
                styles.spotCard, 
                { 
                  width: cardWidth,
                  marginRight: index % spotsPerRow < spotsPerRow - 1 ? gap : 0,
                  marginBottom: 15
                }
              ]}
            >
              <Image 
                source={{ uri: spot.image }} 
                style={styles.spotImage}
                resizeMode="cover"
              />
              <Text numberOfLines={2} style={styles.spotName}>{spot.name}</Text>
            </View>
          ))}
          
          {/* Add empty views to fill the row if needed */}
          {numSpots % spotsPerRow !== 0 && (
            Array.from({ length: spotsPerRow - (numSpots % spotsPerRow) }).map((_, index) => (
              <View 
                key={`empty-${index}`} 
                style={[
                  styles.emptyCard, 
                  { 
                    width: cardWidth,
                    marginRight: index < spotsPerRow - (numSpots % spotsPerRow) - 1 ? gap : 0
                  }
                ]} 
              />
            ))
          )}
        </View>

        {/* Weather Button */}
        <TouchableOpacity
          style={styles.weatherButton}
          onPress={handleWeatherPress}
          activeOpacity={0.7}
        >
          <Text style={styles.weatherButtonText}>
            🌤️ Check Weather for {cityName}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#187c3a',
    marginTop: 20,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 20,
  },
  errorContainer: {
    backgroundColor: '#ffebee',
    padding: 15,
    margin: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  errorMessage: {
    color: '#c62828',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#187c3a',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  mainImage: {
    width: width,
    height: 350,
    backgroundColor: '#f0f0f0',
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#187c3a',
    marginBottom: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  spotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  spotCard: {
    alignItems: 'center',
  },
  emptyCard: {
    // Empty card to fill the row
  },
  spotImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#f0f0f0',
  },
  spotName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 5,
  },
  weatherButton: {
    marginTop: 30,
    marginBottom: 20,
    backgroundColor: '#187c3a',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  weatherButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});