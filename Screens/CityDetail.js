import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import axios from 'axios';
import { useNavigation, useRoute } from '@react-navigation/native';

const { width } = Dimensions.get('window');

// API Configuration
const ACCESS_KEY = "jc_3gNhV36lhccTFQkAhw65EGZg0Zn5PlPhmtRNgabI";
const UNSPLASH_URL = "https://api.unsplash.com/search/photos";

// Data Object
const cityData = {
  'Hunza': {
    defaultImage: 'https://img.lemde.fr/2025/06/23/0/0/5568/3712/1440/960/60/0/e4b359d_upload-1-vfe4vhskzug6-landrin1.jpg',
    description: 'The Hunza Valley is a mountainous valley in the northern part of the Gilgit-Baltistan region of Pakistan. Often referred to as "Heaven on Earth," it is famous for its longevity, the majestic Rakaposhi peak, and the ancient Baltit and Altit Forts. The valley offers distinct beauty in every season, from the cherry blossoms of spring to the golden hues of autumn. It is a major stop on the ancient Silk Road.',
    spots: ['Attabad Lake', 'Rakaposhi View', 'Baltit Fort'],
  },
  'Islamabad': {
    defaultImage: 'https://example.com/islamabad.jpg',
    description: 'Islamabad is the capital city of Pakistan. It is known for its high standard of living, safety, and abundant greenery.',
    spots: ['Faisal Mosque', 'Daman-e-Koh', 'Pakistan Monument'],
  },
  'Lahore': {
    defaultImage: 'https://example.com/lahore.jpg',
    description: 'Lahore is the cultural capital of Pakistan, famous for its Mughal architecture, food, and vibrant culture.',
    spots: ['Badshahi Mosque', 'Lahore Fort', 'Minar-e-Pakistan'],
  },
  'Karachi': {
    defaultImage: 'https://example.com/karachi.jpg',
    description: 'Karachi is the largest city and economic hub of Pakistan, located on the Arabian Sea coast.',
    spots: ['Clifton Beach', 'Mazar-e-Quaid', 'Port Grand'],
  },
  'Swat': {
    defaultImage: 'https://example.com/swat.jpg',
    description: 'Swat Valley is known as the "Switzerland of the East" for its stunning mountains, lakes, and waterfalls.',
    spots: ['Malam Jabba', 'Kalam Valley', 'Mahodand Lake'],
  },
  'Murree': {
    defaultImage: 'https://example.com/murree.jpg',
    description: 'Murree is a popular hill station near Islamabad, known for its pleasant climate and scenic beauty.',
    spots: ['Mall Road', 'Patriata', 'Ayubia'],
  },
};

export default function CityDetail() {
  // Use hooks to get navigation and route props
  const navigation = useNavigation();
  const route = useRoute();
  
  const cityName = route?.params?.cityName || 'Hunza';
  const cityInfo = cityData[cityName];

  const [mainImage, setMainImage] = useState(cityInfo?.defaultImage);
  const [spotImages, setSpotImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (cityInfo) {
      fetchDynamicImages();
    }
  }, [cityName]);

  const fetchDynamicImages = async () => {
    setLoading(true);
    let usedIds = new Set(); 
    try {
      const mainQuery = `${cityName} Pakistan travel nature`;
      const mainReq = axios.get(UNSPLASH_URL, {
        params: { query: mainQuery, per_page: 30 },
        headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
      });

      const spotRequests = cityInfo.spots.map((spot) =>
        axios.get(UNSPLASH_URL, {
          params: { query: `${spot} Pakistan`, per_page: 10 },
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        })
      );

      const [mainRes, ...spotRes] = await Promise.all([mainReq, ...spotRequests]);
      const mainPool = mainRes.data.results || [];
      
      if (mainPool.length > 0) {
        const randomIdx = Math.floor(Math.random() * mainPool.length);
        const selected = mainPool[randomIdx];
        setMainImage(selected.urls.regular);
        usedIds.add(selected.id); 
      }

      const spotsWithImages = cityInfo.spots.map((name, index) => {
        const spotSpecificPool = spotRes[index].data.results || [];
        let selectedUrl = null;
        const validSpotImages = spotSpecificPool.filter(img => !usedIds.has(img.id));
        if (validSpotImages.length > 0) {
          const rand = Math.floor(Math.random() * validSpotImages.length);
          const winner = validSpotImages[rand];
          selectedUrl = winner.urls.small;
          usedIds.add(winner.id); 
        } else {
          const validBackupImages = mainPool.filter(img => !usedIds.has(img.id));
          if (validBackupImages.length > 0) {
            const rand = Math.floor(Math.random() * validBackupImages.length);
            const winner = validBackupImages[rand];
            selectedUrl = winner.urls.small;
            usedIds.add(winner.id); 
          } else {
            selectedUrl = 'https://via.placeholder.com/300x400?text=No+Photo';
          }
        }
        return {
          name: name,
          image: selectedUrl,
        };
      });

      setSpotImages(spotsWithImages);
      setLoading(false);
    } catch (error) {
      console.error("API Error:", error);
      const fallbackSpots = cityInfo.spots.map(name => ({
        name: name,
        image: cityInfo.defaultImage
      }));
      setSpotImages(fallbackSpots);
      setLoading(false);
    }
  };

  const handleWeatherPress = () => {
    if (navigation && navigation.navigate) {
      console.log('Navigating to Weather screen with city:', cityName);
      navigation.navigate('Weather', { city: cityName });
    } else {
      console.error('Navigation not available');
      alert('Cannot navigate to weather screen');
    }
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
        <Text style={styles.loadingText}>Finding unique photos...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: mainImage }} style={styles.mainImage} />

      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{cityInfo.description}</Text>

        <Text style={styles.sectionTitle}>Top Tourist Spots</Text>
        <View style={styles.spotsContainer}>
          {spotImages.map((spot, index) => (
            <View key={index} style={styles.spotCard}>
              <Image source={{ uri: spot.image }} style={styles.spotImage} />
              <Text numberOfLines={2} style={styles.spotName}>{spot.name}</Text>
            </View>
          ))}
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
  },
  errorText: {
    fontSize: 18,
    color: '#d32f2f',
    textAlign: 'center',
    padding: 20,
  },
  loadingText: {
    fontSize: 16,
    color: '#187c3a',
    marginTop: 10,
  },
  mainImage: {
    width: width,
    height: 350,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#187c3a',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#444',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 10,
  },
  spotsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  spotCard: {
    width: (width - 50) / 3,
    alignItems: 'center',
    marginBottom: 15,
  },
  spotImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: '#eee',
    resizeMode: 'cover',
  },
  spotName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
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