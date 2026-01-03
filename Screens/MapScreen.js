import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // Static city markers
  const cityMarkers = [
    { name: 'Lahore', coords: { latitude: 31.5497, longitude: 74.3436 } },
    { name: 'Islamabad', coords: { latitude: 33.6844, longitude: 73.0479 } },
    { name: 'Gilgit', coords: { latitude: 35.9208, longitude: 74.3083 } },
    { name: 'Hunza', coords: { latitude: 36.3295, longitude: 74.7760 } },
    { name: 'Abbottabad', coords: { latitude: 34.1688, longitude: 73.2215 } },
    { name: 'Peshawar', coords: { latitude: 34.0151, longitude: 71.5249 } },
    { name: 'Naran', coords: { latitude: 34.9065, longitude: 73.6822 } },
    { name: 'Rawalpindi', coords: { latitude: 33.5973, longitude: 73.0479 } },
    { name: 'Murree', coords: { latitude: 33.9069, longitude: 73.3911 } },
  ];

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 1,   // Adjust zoom level
        longitudeDelta: 1,
      });
    })();
  }, []);

  if (!location) {
    return (
      <View style={styles.center}>
        <Text>{errorMsg ? errorMsg : 'Fetching location...'}</Text>
      </View>
    );
  }

  return (
    <MapView style={styles.map} initialRegion={location}>
      {/* Current location */}
      <Marker
        coordinate={{ latitude: location.latitude, longitude: location.longitude }}
        title="You are here"
        pinColor="blue"
      />

      {/* Other city markers */}
      {cityMarkers.map((city, index) => (
        <Marker
          key={index}
          coordinate={city.coords}
          title={city.name}
          pinColor="red"
        />
      ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
