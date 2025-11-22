import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ImageBackground, ScrollView, TouchableOpacity, useWindowDimensions,TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
function HomeScreen()  {
  const { width, height } = useWindowDimensions();

  const isLargeScreen = width > 800; 
  const cardWidth = isLargeScreen ? '30%' : '45%';
  const bgHeight = isLargeScreen ? height * 0.7 : height * 0.4; 
  

  return (
    <ScrollView>
      <View style={styles.container}>
        <StatusBar style="auto" />
        <ImageBackground
          source={require('../assets/pak.jpg')}
          style={[styles.bgimg, { height: bgHeight }]}
        >
          <View style={styles.overlay} />
          <Text style={styles.maintext}>Discover the beauty of Pakistan</Text>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Start Exploring</Text>
          </TouchableOpacity>
        </ImageBackground>
      </View>

      <View style={styles.container2}>
        <View
  style={{
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginHorizontal: 20,
    marginBottom: 0,
    marginTop:30,
    shadowColor: '#187c3aff',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3, 
  }}
>
  <Ionicons name="search" size={20} color="#187c3aff" style={{ marginRight: 10 }} />
  <TextInput
    placeholder="Search cities..."
    placeholderTextColor="#187c3aff"
    style={{ flex: 1, fontSize: 16, paddingVertical: 8 }}
  />
</View>
        <Text style={styles.citiesheading}>Featured Cities</Text>
        <View style={styles.cards}>
          {[
            { name: "Hunza Valley", img: "https://img.lemde.fr/2025/06/23/0/0/5568/3712/1440/960/60/0/e4b359d_upload-1-vfe4vhskzug6-landrin1.jpg" },
            { name: "Islamabad", img: "https://media.istockphoto.com/id/519767045/photo/shah-faisal-mosque-islamabad-pakistan.jpg?s=612x612&w=0&k=20&c=YOdDSuvmaLxQUaOMlrv58-NnqWqqlNju-w3PiaT_FuY=" },
            { name: "Lahore", img: "https://t4.ftcdn.net/jpg/03/20/99/65/360_F_320996529_wTC3BL4FQSPSw5A0b7FSZF5rRuMwxuNj.jpg" },
            { name: "Peshawar", img: "https://thumbs.dreamstime.com/b/islamia-college-peshawar-pakistan-educational-institution-located-city-khyber-pakhtunkhwa-province-50150158.jpg" },
            { name: "Muree", img: "https://thumbs.dreamstime.com/b/snowy-hills-pakistan-situated-muree-top-moonlight-hotels-254172858.jpg" },
            { name: "Abottabad", img: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2d/a3/f5/6f/caption.jpg?w=1200&h=-1&s=1" },
            { name: "Naran Kaghan", img: "https://t3.ftcdn.net/jpg/02/57/97/00/360_F_257970006_AdhgnZEVu0lYxMFKYJpzAEV6vuVbvd9v.jpg" },
            { name: "Gilgit Baltistan", img: "https://plus.unsplash.com/premium_photo-1664304370732-9374eac016f9?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2lsZ2l0JTIwYmFsdGlzdGFufGVufDB8fDB8fHww" },
            { name: "Rawalpindi", img: "https://i.ytimg.com/vi/Duotim58xWQ/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLD4DNrkKDwHOmCpiRsGV1PLJK5Jxw" },
          ].map((city, index) => (
            <TouchableOpacity key={index} style={[styles.card, { width: cardWidth }]}>
              <ImageBackground
                source={{ uri: city.img }}
                style={styles.cardbg}
                imageStyle={{ borderRadius: 15 }}
              >
                <View style={styles.overlay} />
                <View style={styles.cardContent}>
                  <Text style={styles.cardtext}>{city.name}</Text>
                  <TouchableOpacity style={styles.cardButton}>
                    <Text style={styles.cardButtonText}>Explore</Text>
                  </TouchableOpacity>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#187c3aff',
    marginTop: 0,
    marginHorizontal: 0,
    paddingBottom: 40,
  },
  bgimg: {
    marginHorizontal: 10,
    marginTop: 30,
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  maintext: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 1,
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    ...StyleSheet.absoluteFillObject,
  },
  button: {
    backgroundColor: '#187c3aff',
    height: 50,
    width: 200,
    borderRadius: 20,
    marginTop: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  container2: {
    backgroundColor: 'white',
  },
  citiesheading: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 40,
    marginTop: 40,
    marginBottom: 40,
  },
  cards: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  card: {
    borderRadius: 15,
    margin: 8,
    height: 180,
    overflow: "hidden",
    elevation: 4,
  },
  cardbg: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  cardtext: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  cardButton: {
    backgroundColor: '#187c3aff',
    borderRadius: 15,
    paddingVertical: 6,
    paddingHorizontal: 20,
  },
  cardButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
});
export default HomeScreen;