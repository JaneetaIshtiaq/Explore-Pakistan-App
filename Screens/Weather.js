
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const WeatherScreen = ({ route }) => {
  const city = route?.params?.city || 'Islamabad';

  const cityWeather = {
    Hunza:      { temp: 6,  feel: 4,  hum: 38, wind: 8,  cond: "Crystal Clear Sky",    bg: "#B3E5FC", emoji: "❄️" },
    Islamabad:  { temp: 23, feel: 22, hum: 55, wind: 12, cond: "Pleasant Sunny Day",    bg: "#FFECB3", emoji: "☀️" },
    Lahore:     { temp: 27, feel: 28, hum: 62, wind: 10, cond: "Warm with Light Haze",   bg: "#FFCCBC", emoji: "🌫️" },
    Murree:     { temp: 9,  feel: 6,  hum: 72, wind: 18, cond: "Cool Misty Morning",     bg: "#CFD8DC", emoji: "☁️" },
    Naran:      { temp: 4,  feel: 1,  hum: 45, wind: 15, cond: "Snowy Paradise",         bg: "#E8F5E9", emoji: "❄️" },
    Gilgit:     { temp: 8,  feel: 5,  hum: 40, wind: 14, cond: "Crisp Mountain Air",     bg: "#E1F5FE", emoji: "⛰️" },
    Peshawar:   { temp: 25, feel: 24, hum: 58, wind: 11, cond: "Bright & Breezy",        bg: "#FCE4EC", emoji: "☀️" },
    Abbottabad: { temp: 18, feel: 17, hum: 60, wind: 9,  cond: "Cool & Refreshing",      bg: "#E0F2F1", emoji: "🌿" },
    Rawalpindi: { temp: 24, feel: 23, hum: 59, wind: 10, cond: "Perfectly Pleasant",     bg: "#FFF9C4", emoji: "☀️" },
  };

  const weather = cityWeather[city] || cityWeather.Islamabad;

  return (
    <View style={[styles.container, { backgroundColor: weather.bg }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>

    
        <View style={styles.topSection}>
          <Text style={styles.emoji}>{weather.emoji}</Text>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.condition}>{weather.cond}</Text>
          <Text style={styles.temp}>{weather.temp}°</Text>
          <Text style={styles.feels}>Feels like {weather.feel}°</Text>
        </View>

     
        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.info}>
              <MaterialCommunityIcons name="water-percent" size={32} color="#3498db" />
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{weather.hum}%</Text>
            </View>
            <View style={styles.info}>
              <MaterialCommunityIcons name="weather-windy" size={32} color="#2ecc71" />
              <Text style={styles.label}>Wind Speed</Text>
              <Text style={styles.value}>{weather.wind} km/h</Text>
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.forecastTitle}>Next Few Days ♡</Text>
          {["Today", "Tomorrow", "Day After", "Later"].map((day, i) => (
            <View key={i} style={styles.forecastRow}>
              <Text style={styles.dayText}>{day}</Text>
              <Text style={styles.dayEmoji}>{i === 0 ? "☀️" : i === 1 ? "⛅" : i === 2 ? "☁️" : "🌙"}</Text>
              <Text style={styles.dayTemp}>{weather.temp + 2 - i*2}° / {weather.temp - 5 - i*2}°</Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Made with ♡ for Pakistan</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  topSection: { alignItems: 'center', marginTop: 70, paddingHorizontal: 20 },
  emoji: { fontSize: 100, marginBottom: 10 },
  city: { fontSize: 38, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  condition: { fontSize: 20, color: '#34495e', fontStyle: 'italic', marginBottom: 10 },
  temp: { fontSize: 90, fontWeight: '200', color: '#2c3e50' },
  feels: { fontSize: 18, color: '#7f8c8d', marginTop: 5 },

  card: { 
    margin: 20, 
    marginTop: 30, 
    backgroundColor: 'white', 
    borderRadius: 25, 
    padding: 25, 
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 15,
  },
  row: { flexDirection: 'row', justifyContent: 'space-around' },
  info: { alignItems: 'center' },
  label: { marginTop: 8, fontSize: 15, color: '#7f8c8d' },
  value: { marginTop: 5, fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },

  forecastTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', color: '#2c3e50', marginBottom: 15 },
  forecastRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  dayText: { fontSize: 17, fontWeight: '600', color: '#2c3e50' },
  dayEmoji: { fontSize: 26 },
  dayTemp: { fontSize: 16, color: '#3498db', fontWeight: '500' },

  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#95a5a6', fontStyle: 'italic' },
});

export default WeatherScreen;