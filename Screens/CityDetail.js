import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

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
    defaultImage: 'https://media.istockphoto.com/id/519767045/photo/shah-faisal-mosque-islamabad-pakistan.jpg?s=612x612&w=0&k=20&c=YOdDSuvmaLxQUaOMlrv58-NnqWqqlNju-w3PiaT_FuY=',
    description: 'Islamabad, the capital city of Pakistan, is renowned for its high standards of living, safety, and abundant greenery. Nestled against the backdrop of the Margalla Hills, the city is a masterpiece of modern urban planning. It features wide tree-lined streets, elegant public buildings, and the massive Faisal Mosque. It is a hub for politics, diplomacy, and nature lovers who enjoy hiking on the Margalla trails.',
    spots: ['Faisal Mosque', 'Pakistan Monument', 'Daman-e-Koh'],
  },
  'Lahore': {
    defaultImage: 'https://t4.ftcdn.net/jpg/03/20/99/65/360_F_320996529_wTC3BL4FQSPSw5A0b7FSZF5rRuMwxuNj.jpg',
    description: 'Lahore is the heart of Pakistan and the capital of the Punjab province. It is a city of gardens and a historical treasure trove, boasting magnificent Mughal-era architecture like the Badshahi Mosque and Lahore Fort. Known as the cultural capital, Lahore is famous for its lively food streets, bustling bazaars, and the warmth of its people. The saying goes, "Jinhe Lahore nai dekhya, o jamya e nai".',
    spots: ['Badshahi Mosque', 'Lahore Fort', 'Shalimar Gardens'],
  },
  'Peshawar': {
    defaultImage: 'https://thumbs.dreamstime.com/b/islamia-college-peshawar-pakistan-educational-institution-located-city-khyber-pakhtunkhwa-province-50150158.jpg',
    description: 'Peshawar is the capital of Khyber Pakhtunkhwa and one of the oldest living cities in South Asia. Standing at the eastern entrance of the Khyber Pass, it has been a center of trade and culture for centuries. The city is famous for its rich Pashtun hospitality, the historic Qissa Khwani Bazaar (Market of Storytellers), and delicious cuisine like Chapli Kabab and Namak Mandi Karahi.',
    spots: ['Islamia College Peshawar', 'Bala Hisar Fort', 'Qissa Khwani Bazaar'],
  },
  'Murree': {
    defaultImage: 'https://thumbs.dreamstime.com/b/snowy-hills-pakistan-situated-muree-top-moonlight-hotels-254172858.jpg',
    description: 'Murree is Pakistan’s most popular hill station, founded during the British colonial era. Located just an hour\'s drive from Islamabad, it offers cool summers and snowy winters. The town is centered around the famous Mall Road, lined with shops and restaurants. Tourists flock here to enjoy the chairlifts at Pindi Point and Patriata, and to witness the lush pine forests covered in snow.',
    spots: ['Murree Mall Road', 'Patriata Chair Lift', 'Kashmir Point'],
  },
  'Abbottabad': {
    defaultImage: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a3/f5/6f/caption.jpg?w=1200&h=-1&s=1',
    description: 'Abbottabad, known as the "City of Pines," is a gateway to the northern areas of Pakistan. It is famous for its pleasant weather, high-standard educational institutions, and the Pakistan Military Academy (PMA) Kakul. Surrounded by the Sarban Hills, it serves as a transit point for tourists heading to Naran and Nathia Gali, but also offers its own attractions like the beautiful Ilyasi Mosque and Shimla Hill park.',
    spots: ['Ilyasi Mosque', 'Shimla Hill Abbottabad', 'Thandiani'],
  },
  'Naran': {
    defaultImage: 'https://t3.ftcdn.net/jpg/02/57/97/00/360_F_257970006_AdhgnZEVu0lYxMFKYJpzAEV6vuVbvd9v.jpg',
    description: 'Naran is a medium-sized town in the upper Kaghan Valley and one of the most popular tourist destinations in Pakistan. It is situated on the banks of the Kunhar River. Naran serves as the base for visiting the legendary Saif-ul-Malook Lake, Lulusar Lake, and Babusar Top. The valley is known for its trout fishing, river rafting, and breathtaking alpine scenery.',
    spots: ['Saif-ul-Malook Lake', 'Ansoo Lake', 'Lulusar Lake'],
  },
  'Gilgit': {
    defaultImage: 'https://plus.unsplash.com/premium_photo-1664304370732-9374eac016f9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lsZ2l0JTIwYmFsdGlzdGFufGVufDB8fDB8fHww',
    description: 'Gilgit is the capital city of Gilgit-Baltistan and a major hub for mountaineers and trekkers heading to the Karakoram and Himalayan ranges. It is strategically located on the Karakoram Highway. The region is famous for its hanging bridges, ancient rock carvings, and proximity to Naltar Valley. It is a melting pot of various cultures and languages of the north.',
    spots: ['K2 Base Camp', 'Deosai Plains', 'Fairy Meadows'],
  },
  'Rawalpindi': {
    defaultImage: 'https://i.ytimg.com/vi/Duotim58xWQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD4DNrkKDwHOmCpiRsGV1PLJK5Jxw',
    description: 'Rawalpindi, commonly known as Pindi, is the twin city of Islamabad but carries a completely different vibe. It is a historic, bustling city with narrow streets, vibrant bazaars, and colonial-era architecture. It is the headquarters of the Pakistan Army and a major commercial hub. Raja Bazaar is its beating heart, offering everything from spices to fabrics in a chaotic yet energetic atmosphere.',
    spots: ['Raja Bazaar Rawalpindi', 'Ayub National Park', 'Lok Virsa Museum'],
  },
};

export default function CityDetail({ route, navigation }) {
  const cityName = route?.params?.cityName || 'Islamabad';
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
      
      // --- ALLOCATION PHASE ---

     
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
        } 
        else {
         
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
      // Fallback
      const fallbackSpots = cityInfo.spots.map(name => ({
        name: name,
        image: cityInfo.defaultImage
      }));
      setSpotImages(fallbackSpots);
      setLoading(false);
    }
  };

  if (!cityInfo) return null;

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={{ marginTop: 10 }}>Finding unique photos...</Text>
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
    color: '#000',
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
  },
  spotCard: {
    width: (width - 50) / 3, 
    alignItems: 'center',
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
});