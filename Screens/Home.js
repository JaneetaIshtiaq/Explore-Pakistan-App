import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  TextInput,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

function HomeScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();
  const isLargeScreen = width > 800;
  const cardWidth = isLargeScreen ? '30%' : '45%';

  // --- CITIES DATA ---
  const initialCities = [
    { name: "Hunza", display: "Hunza Valley" },
    { name: "Islamabad", display: "Islamabad" },
    { name: "Lahore", display: "Lahore" },
    { name: "Peshawar", display: "Peshawar" },
    { name: "Murree", display: "Murree" },
    { name: "Abbottabad", display: "Abbottabad" },
    { name: "Naran", display: "Naran Kaghan" },
    { name: "Gilgit", display: "Gilgit Baltistan" },
    { name: "Rawalpindi", display: "Rawalpindi" },
    { name: "Multan", display: "Multan" }, // Capital 'M'
  ];

  const [cities, setCities] = useState(initialCities);
  const [location, setLocation] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Added search state

  // --- CITY IMAGES ---
  const cityImages = {
    Hunza: "https://img.lemde.fr/2025/06/23/0/0/5568/3712/1440/960/60/0/e4b359d_upload-1-vfe4vhskzug6-landrin1.jpg",
    Islamabad: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSugOkrZ9TgqncgUivGtobDfS3nAubP_cXDoA&s",
    Lahore: "https://t4.ftcdn.net/jpg/03/20/99/65/360_F_320996529_wTC3BL4FQSPSw5A0b7FSZF5rRuMwxuNj.jpg",
    Peshawar: "https://thumbs.dreamstime.com/b/islamia-college-peshawar-pakistan-50150158.jpg",
    Murree: "https://thumbs.dreamstime.com/b/snowy-hills-pakistan-254172858.jpg",
    Abbottabad: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a3/f5/6f/caption.jpg",
    Naran: "https://t3.ftcdn.net/jpg/02/57/97/00/360_F_257970006_AdhgnZEVu0lYxMFKYJpzAEV6vuVbvd9v.jpg",
    Gilgit: "https://plus.unsplash.com/premium_photo-1664304370732-9374eac016f9",
    Rawalpindi: "https://i.ytimg.com/vi/Duotim58xWQ/hq720.jpg",
    Multan: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRs7JgBCMVIvMrlG2Hon_8IsakzdPBJ_UnKCg&s", 
  };

  // Filter cities based on search
  const filteredCities = cities.filter(city =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    city.display.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // --- LOAD PROFILE IMAGE ---
  useEffect(() => {
    (async () => {
      try {
        const savedImage = await AsyncStorage.getItem('profileImage');
        if (savedImage) setProfileImage(savedImage);
      } catch (e) {
        console.log('Failed to load image');
      }
    })();
  }, []);

  // --- PICK IMAGE FUNCTION ---
  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Denied', 'Sorry, we need camera permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfileImage(imageUri);
      await AsyncStorage.setItem('profileImage', imageUri);
    }
  };

  // --- ACCELEROMETER ---
  useEffect(() => {
    let subscription = Accelerometer.addListener(({ x, y, z }) => {
      const totalAcceleration = Math.sqrt(x * x + y * y + z * z);
      if (totalAcceleration > 1.5) shuffleCities();
    });
    Accelerometer.setUpdateInterval(300);
    return () => subscription && subscription.remove();
  }, []);

  const shuffleCities = () => {
    setCities(prevCities => {
      const shuffled = [...prevCities];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      return shuffled;
    });
  };

  // --- LOCATION ---
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc.coords);
    })();
  }, []);

  const openMap = () => {
    if (!location) {
      Alert.alert('Location not available yet', 'Please wait...');
      return;
    }
    navigation.navigate('Map', { userLocation: location });
  };

  // --- RENDER ---
  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="light" />
        
        {/* Header with Camera */}
        <View style={styles.topHeader}>
          <View>
            <Text style={styles.welcomeLabel}>Welcome Back,</Text>
            <Text style={styles.usernameLabel}>Traveler!</Text>
          </View>

          <TouchableOpacity onPress={pickImage} style={styles.profileContainer}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <View style={styles.placeholderImage}>
                <Ionicons name="camera" size={24} color="#187c3a" />
              </View>
            )}
            <View style={styles.addIcon}>
              <Ionicons name="add-circle" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Banner Image */}
        <ImageBackground
          source={require('../assets/pak.jpg')}
          style={[styles.bgimg, { height: width > 800 ? width * 0.5 : width * 0.9 }]}
        >
          <View style={styles.overlay} />
          <Text style={styles.maintext}>Discover the beauty of Pakistan</Text>
          <TouchableOpacity style={styles.button} onPress={openMap}>
            <Text style={styles.buttonText}>Open Map</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.container2}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#187c3a" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search cities..."
            placeholderTextColor="#187c3a"
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
            value={searchQuery}
            onChangeText={setSearchQuery} // Added onChangeText
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#187c3a" />
            </TouchableOpacity>
          )}
        </View>

        <Text style={styles.citiesheading}>Featured Cities</Text>

        {/* Cities Cards */}
        <View style={styles.cards}>
          {filteredCities.length > 0 ? (
            filteredCities.map((city, index) => (
              <View key={index} style={[styles.card, { width: cardWidth }]}>
                <ImageBackground
                  source={{ uri: cityImages[city.name] }}
                  style={styles.cardbg}
                  imageStyle={{ borderRadius: 15 }}
                >
                  <View style={styles.overlay} />
                  <View style={styles.cardContent}>
                    <Text style={styles.cardtext}>{city.display}</Text>
                    <TouchableOpacity
                      style={styles.exploreButtonFull}
                      onPress={() => navigation.navigate('CityDetail', { cityName: city.name })}
                    >
                      <Ionicons name="compass-outline" size={16} color="white" />
                      <Text style={styles.buttonTextSmall}> Explore</Text>
                    </TouchableOpacity>
                  </View>
                </ImageBackground>
              </View>
            ))
          ) : (
            <View style={styles.noResults}>
              <Ionicons name="search-outline" size={50} color="#ccc" />
              <Text style={styles.noResultsText}>No cities found</Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    backgroundColor: '#187c3a', 
    paddingBottom: 40 
  },
  topHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 25,
    marginTop: 20,
    marginBottom: 10
  },
  welcomeLabel: { 
    color: 'rgba(255,255,255,0.8)', 
    fontSize: 14 
  },
  usernameLabel: { 
    color: 'white', 
    fontSize: 24, 
    fontWeight: 'bold' 
  },
  profileContainer: { 
    position: 'relative' 
  },
  profileImage: { 
    width: 55, 
    height: 55, 
    borderRadius: 30, 
    borderWidth: 2, 
    borderColor: 'white' 
  },
  placeholderImage: { 
    width: 55, 
    height: 55, 
    borderRadius: 30, 
    backgroundColor: 'white', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  addIcon: { 
    position: 'absolute', 
    bottom: -2, 
    right: -2, 
    backgroundColor: '#187c3a', 
    borderRadius: 10, 
    borderWidth: 1, 
    borderColor: 'white' 
  },
  bgimg: { 
    marginHorizontal: 10, 
    marginTop: 10, 
    borderRadius: 20, 
    overflow: 'hidden', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  overlay: { 
    ...StyleSheet.absoluteFillObject, 
    backgroundColor: 'rgba(0,0,0,0.4)' 
  },
  maintext: { 
    fontSize: 32, 
    color: 'white', 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginHorizontal: 20 
  },
  button: { 
    backgroundColor: '#187c3a', 
    paddingHorizontal: 30, 
    paddingVertical: 12, 
    borderRadius: 25, 
    marginTop: 20 
  },
  buttonText: { 
    color: 'white', 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
  container2: { 
    backgroundColor: 'white', 
    flex: 1, 
    borderTopLeftRadius: 30, 
    borderTopRightRadius: 30, 
    marginTop: -20 
  },
  searchContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'white', 
    borderRadius: 25, 
    paddingHorizontal: 15, 
    marginHorizontal: 20, 
    marginTop: 30, 
    marginBottom: 20, 
    elevation: 5 
  },
  citiesheading: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#333', 
    marginLeft: 30, 
    marginBottom: 20 
  },
  cards: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'center',
    minHeight: 300 
  },
  card: { 
    borderRadius: 15, 
    margin: 8, 
    height: 220, 
    overflow: 'hidden', 
    elevation: 6, 
    backgroundColor: '#fff' 
  },
  cardbg: { 
    flex: 1, 
    justifyContent: 'flex-end' 
  },
  cardContent: { 
    padding: 15, 
    alignItems: 'center' 
  },
  cardtext: { 
    color: 'white', 
    fontSize: 19, 
    fontWeight: 'bold', 
    textAlign: 'center', 
    marginBottom: 12 
  },
  exploreButtonFull: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: 'rgba(24,124,58,0.95)', 
    paddingVertical: 10, 
    borderRadius: 20, 
    width: '100%' 
  },
  buttonTextSmall: { 
    color: 'white', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  noResults: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
    width: '100%'
  },
  noResultsText: {
    fontSize: 18,
    color: '#999',
    marginTop: 10
  }
});

export default HomeScreen;