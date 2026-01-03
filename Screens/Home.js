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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Accelerometer } from 'expo-sensors';
import * as Location from 'expo-location';

function HomeScreen() {
  const { width } = useWindowDimensions();
  const navigation = useNavigation();

  const isLargeScreen = width > 800;
  const cardWidth = isLargeScreen ? '30%' : '45%';

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
  ];

  const [cities, setCities] = useState(initialCities);
  const [location, setLocation] = useState(null);

  const cityImages = {
    Hunza: "https://img.lemde.fr/2025/06/23/0/0/5568/3712/1440/960/60/0/e4b359d_upload-1-vfe4vhskzug6-landrin1.jpg",
    Islamabad: "https://media.istockphoto.com/id/519767045/photo/shah-faisal-mosque-islamabad-pakistan.jpg",
    Lahore: "https://t4.ftcdn.net/jpg/03/20/99/65/360_F_320996529_wTC3BL4FQSPSw5A0b7FSZF5rRuMwxuNj.jpg",
    Peshawar: "https://thumbs.dreamstime.com/b/islamia-college-peshawar-pakistan-50150158.jpg",
    Murree: "https://thumbs.dreamstime.com/b/snowy-hills-pakistan-254172858.jpg",
    Abbottabad: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a3/f5/6f/caption.jpg",
    Naran: "https://t3.ftcdn.net/jpg/02/57/97/00/360_F_257970006_AdhgnZEVu0lYxMFKYJpzAEV6vuVbvd9v.jpg",
    Gilgit: "https://plus.unsplash.com/premium_photo-1664304370732-9374eac016f9",
    Rawalpindi: "https://i.ytimg.com/vi/Duotim58xWQ/hq720.jpg",
  };

  // ------------------- ACCELEROMETER -------------------
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

  // ------------------- LOCATION -------------------
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Enable location to use Map feature');
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

  // ------------------- RENDER -------------------
  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
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
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#187c3a" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search cities..."
            placeholderTextColor="#187c3a"
            style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
          />
        </View>

        <Text style={styles.citiesheading}>Featured Cities</Text>

        <View style={styles.cards}>
          {cities.map((city, index) => (
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
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#187c3a', paddingBottom: 40 },
  bgimg: { marginHorizontal: 10, marginTop: 30, borderRadius: 20, overflow: 'hidden', justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)' },
  maintext: { fontSize: 32, color: 'white', fontWeight: 'bold', textAlign: 'center', marginHorizontal: 20 },
  button: { backgroundColor: '#187c3a', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25, marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  container2: { backgroundColor: 'white', flex: 1 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', borderRadius: 25, paddingHorizontal: 15, marginHorizontal: 20, marginTop: 30, marginBottom: 20, elevation: 5 },
  citiesheading: { fontSize: 28, fontWeight: 'bold', color: '#333', marginLeft: 30, marginBottom: 20 },
  cards: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  card: { borderRadius: 15, margin: 8, height: 220, overflow: 'hidden', elevation: 6, backgroundColor: '#fff' },
  cardbg: { flex: 1, justifyContent: 'flex-end' },
  cardContent: { padding: 15, alignItems: 'center' },
  cardtext: { color: 'white', fontSize: 19, fontWeight: 'bold', textAlign: 'center', marginBottom: 12 },
  exploreButtonFull: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(24,124,58,0.95)', paddingVertical: 10, borderRadius: 20, width: '100%' },
  buttonTextSmall: { color: 'white', fontWeight: 'bold', fontSize: 14 },
});

export default HomeScreen;
