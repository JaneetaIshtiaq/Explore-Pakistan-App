import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// City data with descriptions and tourist spots
const cityData = {
  'Hunza': {
    image: 'https://img.lemde.fr/2025/06/23/0/0/5568/3712/1440/960/60/0/e4b359d_upload-1-vfe4vhskzug6-landrin1.jpg',
    description: 'Hunza Valley is a mountainous valley in the Gilgit-Baltistan region, known for its stunning natural beauty, crystal clear waters, and snow-capped peaks. It is a paradise for nature lovers and adventure seekers.',
    spots: [
      {
        name: 'Attabad Lake',
        image: 'https://plus.unsplash.com/premium_photo-1666437879448-6a96e71e502b?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      {
        name: 'Rakaposhi View',
        image: 'https://images.unsplash.com/photo-1683548503315-bb949615f80b?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8cmFrYXBvc2hpJTIwdmlld3xlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Baltit Fort',
        image: 'https://plus.unsplash.com/premium_photo-1697729751540-7d56d522b52c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFsdGl0JTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D',
      },
    ],
  },
  'Islamabad': {
    image: 'https://media.istockphoto.com/id/519767045/photo/shah-faisal-mosque-islamabad-pakistan.jpg?s=612x612&w=0&k=20&c=YOdDSuvmaLxQUaOMlrv58-NnqWqqlNju-w3PiaT_FuY=',
    description: 'Islamabad is the capital city of Pakistan, known for its modern infrastructure, lush greenery, and the iconic Faisal Mosque. The city offers a perfect blend of nature and urban development.',
    spots: [
      {
        name: 'Faisal Mosque',
        image: 'https://plus.unsplash.com/premium_photo-1697730196206-7d8f455766bf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFpc2FsJTIwbW9zcXVlfGVufDB8fDB8fHww',
      },
      {
        name: 'Pakistan Moment',
        image: 'https://images.unsplash.com/photo-1752778965513-1486681c6745?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cGFraXN0YW4lMjBtb21lbnR8ZW58MHx8MHx8fDA%3D',
      },
      {
        name: 'Daman-e-Koh',
        image: 'https://media.istockphoto.com/id/697841832/photo/the-dam.webp?a=1&b=1&s=612x612&w=0&k=20&c=_80qnsmH-j0ZVO3P6PHYeEZWtzth9_R5MNnZhvGuk3g=',
      },
    ],
  },
  'Lahore': {
    image: 'https://t4.ftcdn.net/jpg/03/20/99/65/360_F_320996529_wTC3BL4FQSPSw5A0b7FSZF5rRuMwxuNj.jpg',
    description: 'Lahore is a vibrant and historic city in Pakistan, known for its rich culture, beautiful architecture and bustling markets. The city is home to iconic landmarks such as the Badshahi Mosque, Lahore Fort, and the Shalimar Gardens.',
    spots: [
      {
        name: 'Badshahi Mosque',
        image: 'https://plus.unsplash.com/premium_photo-1697730390709-48bebc012175?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFkc2hhaGklMjBtb3NxdWV8ZW58MHx8MHx8fDA%3D',
      },
      {
        name: 'Lahore Fort',
        image: 'https://images.unsplash.com/photo-1711980057309-d777c92a5804?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bGFob3JlJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Shalimar Gardens',
        image: 'https://images.unsplash.com/photo-1722953035530-4f2a5ca5e058?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2hhbGltYXIlMjBnYXJkZW58ZW58MHx8MHx8fDA%3D',
      },
    ],
  },
  'Peshawar': {
    image: 'https://thumbs.dreamstime.com/b/islamia-college-peshawar-pakistan-educational-institution-located-city-khyber-pakhtunkhwa-province-50150158.jpg',
    description: 'Peshawar is one of the oldest cities in South Asia, known for its rich Pashtun culture, historical bazaars, and ancient heritage. It serves as the gateway to the Khyber Pass.',
    spots: [
      {
        name: 'Islamia College',
        image: 'https://images.unsplash.com/photo-1583050993230-063b163ae2df?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8aXNhbG1pYSUyMGNvbGxlZ2V8ZW58MHx8MHx8fDA%3D',
      },
      {
        name: 'Bala Hisar Fort',
        image: 'https://plus.unsplash.com/premium_photo-1694475385208-8215484816a8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8YmFsYSUyMGhpc2FyJTIwZm9ydHxlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Qissa Khawani Bazaar',
        image: 'https://media.istockphoto.com/id/1484639024/photo/dehli-gate-market-in-lahore.webp?a=1&b=1&s=612x612&w=0&k=20&c=L1hAxRYqYpEEpHFar3TfxNLxn26CYo6XjDKP3PLeBYk=',
      },
    ],
  },
  'Murree': {
    image: 'https://thumbs.dreamstime.com/b/snowy-hills-pakistan-situated-muree-top-moonlight-hotels-254172858.jpg',
    description: 'Murree is a popular hill station located in the Himalayan foothills, known for its pleasant weather, scenic views, and colonial architecture. It is a favorite summer retreat for tourists.',
    spots: [
      {
        name: 'Mall Road',
        image: 'https://images.unsplash.com/photo-1651781379744-43d73ea61d13?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8bWFsbCUyMHJvYWR8ZW58MHx8MHx8fDA%3D',
      },
      {
        name: 'Patriata (New Murree)',
        image: 'https://images.unsplash.com/photo-1629574494582-54ae9a599656?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FzaG1pciUyMHBvaW50fGVufDB8fDB8fHww',
      },
      {
        name: 'Kashmir Point',
        image: 'https://images.unsplash.com/photo-1629574494582-54ae9a599656?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2FzaG1pciUyMHBvaW50fGVufDB8fDB8fHww',
      },
    ],
  },
  'Abbottabad': {
    image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a3/f5/6f/caption.jpg?w=1200&h=-1&s=1',
    description: 'Abbottabad is a scenic city in the Hazara region of Khyber Pakhtunkhwa, known for its pleasant climate, lush green hills, and proximity to popular tourist destinations like Nathia Gali and Ayubia.',
    spots: [
      {
        name: 'Ilyasi Mosque',
        image: 'https://media.istockphoto.com/id/943842242/photo/al-jazzar-mosque.webp?a=1&b=1&s=612x612&w=0&k=20&c=Vpj7ALLjoxQm5eVcj5H1fCC11oaw75sXs_l8CXq0DQ4=',
      },
      {
        name: 'Shimla Hill',
        image: 'https://images.unsplash.com/photo-1655884569008-97ee67cd6e72?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2hpbWxhJTIwaGlsbHxlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Thandiani',
        image: 'https://plus.unsplash.com/premium_photo-1733493684000-9e32eaf89c60?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8dGhhbmRpYW5pfGVufDB8fDB8fHww',
      },
    ],
  },
  'Naran': {
    image: 'https://t3.ftcdn.net/jpg/02/57/97/00/360_F_257970006_AdhgnZEVu0lYxMFKYJpzAEV6vuVbvd9v.jpg',
    description: 'Naran and Kaghan are picturesque valleys in the Mansehra District, famous for their stunning lakes, lush meadows, and majestic mountains. They are popular destinations for tourists and trekkers.',
    spots: [
      {
        name: 'Saif-ul-Malook Lake',
        image: 'https://images.unsplash.com/photo-1694327454153-b457288a8462?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c2FpZi11bC1tYWxvb2t8ZW58MHx8MHx8fDA%3D',
      },
      {
        name: 'Ansoo Lake',
        image: 'https://media.istockphoto.com/id/1002877188/photo/lake-with-drill.webp?a=1&b=1&s=612x612&w=0&k=20&c=cTX4J67XHpNpWI297Bpu6KEEtZixFb5LPQUCMyfCeCo=',
      },
      {
        name: 'Lulusar Lake',
        image: 'https://images.unsplash.com/photo-1672940035201-db5d3777b40d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bHVsdXNhciUyMGxha2V8ZW58MHx8MHx8fDA%3D',
      },
    ],
  },
  'Gilgit': {
    image: 'https://plus.unsplash.com/premium_photo-1664304370732-9374eac016f9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lsZ2l0JTIwYmFsdGlzdGFufGVufDB8fDB8fHww',
    description: 'Gilgit-Baltistan is a region of breathtaking natural beauty, home to some of the world\'s highest mountain peaks including K2, and spectacular valleys, glaciers, and lakes.',
    spots: [
      {
        name: 'K2 Base Camp',
        image: 'https://images.unsplash.com/photo-1625643186516-5cbd4ed620c9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8azIlMjBiYXNlJTIwY2FtcHxlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Deosai Plains',
        image: 'https://images.unsplash.com/photo-1672940139420-143f859a3548?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZGVvc2FpJTIwcGxhaW5zfGVufDB8fDB8fHww',
      },
      {
        name: 'Fairy Meadows',
        image: 'https://images.unsplash.com/photo-1664872756573-8b56401ee6b8?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8ZmFpcnklMjBtZWFkb3dzfGVufDB8fDB8fHww',
      },
    ],
  },
  'Rawalpindi': {
    image: 'https://i.ytimg.com/vi/Duotim58xWQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD4DNrkKDwHOmCpiRsGV1PLJK5Jxw',
    description: 'Rawalpindi is a bustling city adjacent to Islamabad, known for its vibrant bazaars, military heritage, and historical sites. It serves as a major commercial and military hub of Pakistan.',
    spots: [
      {
        name: 'Raja Bazaar',
        image: 'https://images.unsplash.com/photo-1720507334744-02dce2b6794d?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJhamElMjBiYXphcnxlbnwwfHwwfHx8MA%3D%3D',
      },
      {
        name: 'Ayub National Park',
        image: 'https://media.istockphoto.com/id/1492617357/photo/waterfall.webp?a=1&b=1&s=612x612&w=0&k=20&c=DZabfvaesXFEBXTduPIen5zxE90OMoUVSUOG885a5ag=',
      },
      {
        name: 'Lok Virsa Museum',
        image: 'https://images.unsplash.com/photo-1716016761758-85ee3d6c3c01?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bG9rJTIwdmlyc2ElMjBtdXNldW18ZW58MHx8MHx8fDA%3D',
      },
    ],
  },
};

export default function CityDetail({ route, navigation }) {
  const { cityName } = route.params;
  const city = cityData[cityName];

  if (!city) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>City data not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Main City Image */}
      <Image source={{ uri: city.image }} style={styles.mainImage} />

      {/* Description Section */}
      <View style={styles.contentContainer}>
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{city.description}</Text>

        {/* Tourist Spots Section */}
        <Text style={styles.sectionTitle}>Top Tourist Spots</Text>
        <View style={styles.spotsContainer}>
          {city.spots.map((spot, index) => (
            <View key={index} style={styles.spotCard}>
              <Image source={{ uri: spot.image }} style={styles.spotImage} />
              <Text style={styles.spotName}>{spot.name}</Text>
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
  mainImage: {
    width: width,
    height: 250,
    resizeMode: 'cover',
  },
  contentContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 10,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#555',
    lineHeight: 24,
    textAlign: 'justify',
    marginBottom: 20,
  },
  spotsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  spotCard: {
    width: (width - 60) / 3,
    marginBottom: 15,
    alignItems: 'center',
  },
  spotImage: {
    width: '100%',
    height: 200, // Increased height to 200
    borderRadius: 12,
    marginBottom: 8,
  },
  spotName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    flexWrap: 'wrap',
  },
  errorText: {
    fontSize: 18,
    color: '#999',
    textAlign: 'center',
    marginTop: 50,
  },
});