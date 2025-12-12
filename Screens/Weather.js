import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const API_KEY = "08823f38819142b79e7191555251112";

const WeatherScreen = ({ route }) => {
  const city = route?.params?.city || "Islamabad";

  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // -------------------------------
  // API CALL FUNCTION
  // -------------------------------
  const fetchWeather = async () => {
    try {
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data || data.error) throw new Error("Invalid City");

      setWeather(data);
      setLoading(false);
    } catch (err) {
      console.log("ERROR =>", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, [city]);

  // -------------------------------
  // LOADING UI
  // -------------------------------
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="black" />
        <Text style={{ marginTop: 15 }}>Fetching Weather...</Text>
      </View>
    );
  }

  // -------------------------------
  // ERROR UI
  // -------------------------------
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={{ fontSize: 18, color: "red" }}>
          Unable to fetch weather. Check city name.
        </Text>
      </View>
    );
  }

  // -------------------------------
  // EXTRACT DATA
  // -------------------------------
  const current = weather.current;
  const forecast = weather.forecast.forecastday;

  return (
    <View style={[styles.container, { backgroundColor: "#E3F2FD" }]}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 40 }}>


        <View style={styles.topSection}>
          <Text style={styles.emoji}>{current.condition.text.includes("rain") ? "🌧️" : "☀️"}</Text>
          <Text style={styles.city}>{city}</Text>
          <Text style={styles.condition}>{current.condition.text}</Text>
          <Text style={styles.temp}>{current.temp_c}°</Text>
          <Text style={styles.feels}>Feels like {current.feelslike_c}°</Text>
        </View>


        <View style={styles.card}>
          <View style={styles.row}>
            <View style={styles.info}>
              <MaterialCommunityIcons name="water-percent" size={32} color="#3498db" />
              <Text style={styles.label}>Humidity</Text>
              <Text style={styles.value}>{current.humidity}%</Text>
            </View>

            <View style={styles.info}>
              <MaterialCommunityIcons name="weather-windy" size={32} color="#2ecc71" />
              <Text style={styles.label}>Wind Speed</Text>
              <Text style={styles.value}>{current.wind_kph} km/h</Text>
            </View>
          </View>
        </View>


        <View style={styles.card}>
          <Text style={styles.forecastTitle}>Next Few Days ♡</Text>

          {forecast.slice(0, 6).map((day, i) => (
            <View key={i} style={styles.forecastRow}>
              <Text style={styles.dayText}>
                {i === 0 ? "Today" : i === 1 ? "Tomorrow" : day.date}
              </Text>

              <Text style={styles.dayEmoji}>
                {day.day.condition.text.includes("rain") ? "🌧️" :
                 day.day.condition.text.includes("cloud") ? "☁️" : "☀️"}
              </Text>

              <Text style={styles.dayTemp}>
                {Math.round(day.day.maxtemp_c)}° / {Math.round(day.day.mintemp_c)}°
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.footer}>Made with ♡ for Pakistan</Text>
      </ScrollView>
    </View>
  );
};

// -------------------------
// STYLES
// -------------------------
const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },

  topSection: { alignItems: 'center', marginTop: 70, paddingHorizontal: 20 },
  emoji: { fontSize: 100, marginBottom: 10 },
  city: { fontSize: 38, fontWeight: 'bold', color: '#2c3e50', marginBottom: 5 },
  condition: { fontSize: 20, color: '#34495e', fontStyle: 'italic', marginBottom: 10 },
  temp: { fontSize: 90, fontWeight: '200', color: '#2c3e50' },
  feels: { fontSize: 18, color: '#7f8c8d', marginTop: 5 },

  card: { 
    margin: 20, marginTop: 30, backgroundColor: 'white',
    borderRadius: 25, padding: 25, elevation: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15, shadowRadius: 15,
  },

  row: { flexDirection: 'row', justifyContent: 'space-around' },
  info: { alignItems: 'center' },
  label: { marginTop: 8, fontSize: 15, color: '#7f8c8d' },
  value: { marginTop: 5, fontSize: 22, fontWeight: 'bold', color: '#2c3e50' },

  forecastTitle: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 15 },
  forecastRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f0f0f0'
  },

  dayText: { fontSize: 17, fontWeight: '600', color: '#2c3e50' },
  dayEmoji: { fontSize: 26 },
  dayTemp: { fontSize: 16, color: '#3498db', fontWeight: '500' },

  footer: { textAlign: 'center', marginTop: 20, fontSize: 14, color: '#95a5a6', fontStyle: 'italic' },
});

export default WeatherScreen;
