import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator,
  Dimensions 
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { RefreshControl } from 'react-native';

const { width, height } = Dimensions.get('window');
const API_KEY = "08823f38819142b79e7191555251112";

// Professional gradient backgrounds based on weather and time
const getBackgroundGradient = (conditionText, isDay = true) => {
  const condition = conditionText.toLowerCase();
  
  if (condition.includes('sunny') || condition.includes('clear')) {
    return isDay 
      ? ['#FFD700', '#FF8C00', '#FF4500'] // Golden sunrise to orange
      : ['#0F2027', '#203A43', '#2C5364']; // Deep night blue
  } else if (condition.includes('partly cloudy')) {
    return ['#4A90E2', '#7FB3D5', '#A8D8EA']; // Soft blue gradient
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    return ['#636363', '#8E8E8E', '#B0B0B0']; // Gray gradient
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    return ['#2C3E50', '#34495E', '#4A6572']; // Rainy blue
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    return ['#1A1A2E', '#16213E', '#0F3460']; // Stormy dark
  } else if (condition.includes('snow') || condition.includes('ice')) {
    return ['#E3F2FD', '#BBDEFB', '#90CAF9']; // Icy blue
  } else if (condition.includes('fog') || condition.includes('mist')) {
    return ['#757575', '#9E9E9E', '#BDBDBD']; // Foggy gray
  } else {
    return isDay 
      ? ['#36D1DC', '#5B86E5', '#3A7BD5'] // Day blue gradient
      : ['#141E30', '#243B55', '#0F2027']; // Night gradient
  }
};

// Accurate emoji mapping
const getWeatherEmoji = (conditionText, isDay = true) => {
  const condition = conditionText.toLowerCase();
  
  if (condition.includes('sunny') || condition.includes('clear')) {
    return isDay ? '☀️' : '🌙';
  } else if (condition.includes('partly cloudy')) {
    return isDay ? '⛅' : '☁️';
  } else if (condition.includes('cloudy') || condition.includes('overcast')) {
    return '☁️';
  } else if (condition.includes('rain') && condition.includes('thunder')) {
    return '⛈️';
  } else if (condition.includes('rain') || condition.includes('drizzle')) {
    return '🌧️';
  } else if (condition.includes('thunder') || condition.includes('storm')) {
    return '🌩️';
  } else if (condition.includes('snow')) {
    return '❄️';
  } else if (condition.includes('ice')) {
    return '🧊';
  } else if (condition.includes('fog') || condition.includes('mist')) {
    return '🌫️';
  } else if (condition.includes('wind')) {
    return '💨';
  } else {
    return isDay ? '🌤️' : '🌙';
  }
};

const WeatherScreen = ({ route }) => {
  const city = route?.params?.city || "Islamabad";
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async () => {
    try {
      setRefreshing(true);
      const url = `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`;

      const res = await fetch(url);
      const data = await res.json();

      if (!data || data.error) throw new Error("Invalid City");

      setWeather(data);
      setLoading(false);
      setError(false);
    } catch (err) {
      console.log("ERROR =>", err);
      setError(true);
    } finally {
      setRefreshing(false);
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
      <LinearGradient
        colors={['#1a237e', '#283593', '#303f9f']}
        style={styles.loadingContainer}
      >
        <ActivityIndicator size="large" color="#FFFFFF" />
        <Text style={styles.loadingText}>Loading weather for {city}...</Text>
      </LinearGradient>
    );
  }

  // -------------------------------
  // ERROR UI
  // -------------------------------
  if (error) {
    return (
      <LinearGradient
        colors={['#c62828', '#d32f2f', '#f44336']}
        style={styles.errorContainer}
      >
        <MaterialCommunityIcons name="weather-cloudy-alert" size={80} color="#FFFFFF" />
        <Text style={styles.errorTitle}>Weather Unavailable</Text>
        <Text style={styles.errorText}>
          Unable to fetch weather data.{'\n'}Please check your internet connection.
        </Text>
        <MaterialCommunityIcons 
          name="refresh" 
          size={40} 
          color="#FFFFFF" 
          style={styles.refreshIcon}
          onPress={fetchWeather}
        />
      </LinearGradient>
    );
  }

  // -------------------------------
  // EXTRACT DATA
  // -------------------------------
  const current = weather.current;
  const forecast = weather.forecast.forecastday;
  const location = weather.location;
  
  // Check if it's daytime
  const currentHour = new Date().getHours();
  const isDayTime = currentHour >= 6 && currentHour < 18;
  
  // Get background and emoji
  const backgroundColors = getBackgroundGradient(current.condition.text, isDayTime);
  const currentEmoji = getWeatherEmoji(current.condition.text, isDayTime);

  // Format date nicely
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${days[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]}`;
  };

  // Format time
  const formatTime = (timeString) => {
    return timeString.replace(/AM|PM/, (match) => match.toLowerCase());
  };

  return (
    <LinearGradient
      colors={backgroundColors}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchWeather}
            tintColor="#FFFFFF"
            colors={['#FFFFFF']}
          />
        }
      >
        {/* HEADER SECTION */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <MaterialCommunityIcons name="map-marker" size={24} color="#FFFFFF" />
            <Text style={styles.locationText}>
              {location.name}, {location.country}
            </Text>
          </View>
          <Text style={styles.lastUpdated}>
            Updated: {new Date(current.last_updated).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </Text>
        </View>

        {/* CURRENT WEATHER */}
        <View style={styles.currentWeatherCard}>
          <View style={styles.weatherHeader}>
            <Text style={styles.weatherEmoji}>{currentEmoji}</Text>
            <View>
              <Text style={styles.conditionText}>{current.condition.text}</Text>
              <Text style={styles.currentDate}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
          </View>
          
          <View style={styles.temperatureContainer}>
            <Text style={styles.currentTemp}>{Math.round(current.temp_c)}°</Text>
            <Text style={styles.tempUnit}>C</Text>
          </View>
          
          <Text style={styles.feelsLike}>Feels like {Math.round(current.feelslike_c)}°C</Text>
          
          <View style={styles.currentStats}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="water" size={22} color="#87CEEB" />
              <Text style={styles.statValue}>{current.humidity}%</Text>
              <Text style={styles.statLabel}>Humidity</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="weather-windy" size={22} color="#ADD8E6" />
              <Text style={styles.statValue}>{current.wind_kph} km/h</Text>
              <Text style={styles.statLabel}>Wind</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="eye" size={22} color="#B0E0E6" />
              <Text style={styles.statValue}>{current.vis_km} km</Text>
              <Text style={styles.statLabel}>Visibility</Text>
            </View>
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="gauge" size={22} color="#9370DB" />
              <Text style={styles.statValue}>{current.pressure_mb}</Text>
              <Text style={styles.statLabel}>Pressure</Text>
            </View>
          </View>
        </View>

        {/* 7-DAY FORECAST */}
        <View style={styles.forecastContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="calendar-week" size={24} color="#FFFFFF" />
            <Text style={styles.sectionTitle}>3-Day Forecast</Text>
          </View>
          
          <View style={styles.forecastList}>
            {forecast.map((day, index) => {
              const dayEmoji = getWeatherEmoji(day.day.condition.text, true);
              const isToday = index === 0;
              
              return (
                <View 
                  key={index} 
                  style={[
                    styles.forecastItem,
                    isToday && styles.todayForecastItem
                  ]}
                >
                  <View style={styles.forecastDayInfo}>
                    <Text style={[
                      styles.forecastDay,
                      isToday && styles.todayText
                    ]}>
                      {index === 0 ? 'TODAY' : 
                       index === 1 ? 'TOMORROW' : 
                       new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                    </Text>
                    <Text style={[
                      styles.forecastDate,
                      isToday && styles.todayDate
                    ]}>
                      {formatDate(day.date)}
                    </Text>
                  </View>
                  
                  <View style={styles.forecastWeather}>
                    <Text style={styles.forecastEmoji}>{dayEmoji}</Text>
                    <Text style={styles.forecastCondition} numberOfLines={1}>
                      {day.day.condition.text}
                    </Text>
                  </View>
                  
                  <View style={styles.forecastTemps}>
                    <Text style={styles.highTemp}>{Math.round(day.day.maxtemp_c)}°</Text>
                    <Text style={styles.lowTemp}>{Math.round(day.day.mintemp_c)}°</Text>
                  </View>
                </View>
              );
            })}
          </View>
        </View>

        {/* SUNRISE & SUNSET */}
        {forecast[0]?.astro && (
          <View style={styles.sunContainer}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="weather-sunny" size={24} color="#FFFFFF" />
              <Text style={styles.sectionTitle}>Sun & Moon</Text>
            </View>
            
            <View style={styles.sunCards}>
              <LinearGradient
                colors={['#FF9800', '#FF5722']}
                style={styles.sunCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="weather-sunset-up" size={30} color="#FFFFFF" />
                <Text style={styles.sunTime}>{formatTime(forecast[0].astro.sunrise)}</Text>
                <Text style={styles.sunLabel}>SUNRISE</Text>
              </LinearGradient>
              
              <LinearGradient
                colors={['#2196F3', '#1976D2']}
                style={styles.sunCard}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <MaterialCommunityIcons name="weather-sunset-down" size={30} color="#FFFFFF" />
                <Text style={styles.sunTime}>{formatTime(forecast[0].astro.sunset)}</Text>
                <Text style={styles.sunLabel}>SUNSET</Text>
              </LinearGradient>
            </View>
          </View>
        )}

        {/* HOURLY FORECAST (Next 12 hours) */}
        <View style={styles.hourlyContainer}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#FFFFFF" />
            <Text style={styles.sectionTitle}>Hourly Forecast</Text>
          </View>
          
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.hourlyScroll}
          >
            {forecast[0]?.hour?.slice(0, 12).map((hour, index) => {
              const hourEmoji = getWeatherEmoji(hour.condition.text, hour.is_day === 1);
              const hourTime = new Date(hour.time).getHours();
              const displayTime = hourTime === 0 ? '12AM' : 
                                 hourTime < 12 ? `${hourTime}AM` : 
                                 hourTime === 12 ? '12PM' : `${hourTime - 12}PM`;
              
              return (
                <View key={index} style={styles.hourItem}>
                  <Text style={styles.hourTime}>{displayTime}</Text>
                  <Text style={styles.hourEmoji}>{hourEmoji}</Text>
                  <Text style={styles.hourTemp}>{Math.round(hour.temp_c)}°</Text>
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Data provided by WeatherAPI.com • {new Date().getFullYear()}
          </Text>
          <Text style={styles.poweredBy}>🌤️ Explore Pakistan Weather</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginTop: 20,
    fontFamily: 'System',
    fontWeight: '500',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  errorTitle: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    fontFamily: 'System',
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 30,
    fontFamily: 'System',
  },
  refreshIcon: {
    marginTop: 20,
    padding: 10,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 30,
  },
  header: {
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '70%',
  },
  locationText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 10,
    fontFamily: 'System',
  },
  lastUpdated: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 12,
    fontFamily: 'System',
    fontWeight: '500',
  },
  currentWeatherCard: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginHorizontal: 25,
    borderRadius: 30,
    padding: 25,
    marginTop: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  weatherHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 25,
  },
  weatherEmoji: {
    fontSize: 50,
    marginRight: 15,
  },
  conditionText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
  },
  currentDate: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 5,
    fontFamily: 'System',
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginBottom: 10,
  },
  currentTemp: {
    color: '#FFFFFF',
    fontSize: 86,
    fontWeight: '300',
    fontFamily: 'System',
    lineHeight: 86,
  },
  tempUnit: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 24,
    marginTop: 10,
    marginLeft: 5,
    fontFamily: 'System',
  },
  feelsLike: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'System',
    fontWeight: '500',
  },
  currentStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  statItem: {
    alignItems: 'center',
    width: '48%',
    marginBottom: 20,
    paddingVertical: 15,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginTop: 8,
    fontFamily: 'System',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'System',
    fontWeight: '500',
  },
  forecastContainer: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginLeft: 12,
    fontFamily: 'System',
  },
  forecastList: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  todayForecastItem: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 15,
    paddingHorizontal: 15,
    marginHorizontal: -5,
  },
  forecastDayInfo: {
    flex: 1.2,
  },
  forecastDay: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  todayText: {
    fontWeight: '800',
    color: '#FFD700',
  },
  forecastDate: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    marginTop: 3,
    fontFamily: 'System',
  },
  todayDate: {
    color: 'rgba(255,255,255,0.9)',
  },
  forecastWeather: {
    flex: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  forecastEmoji: {
    fontSize: 28,
    marginRight: 12,
  },
  forecastCondition: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'System',
  },
  forecastTemps: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  highTemp: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    fontFamily: 'System',
  },
  lowTemp: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 18,
    marginLeft: 8,
    fontFamily: 'System',
  },
  sunContainer: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  sunCards: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sunCard: {
    width: '48%',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  sunTime: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    marginTop: 15,
    fontFamily: 'System',
  },
  sunLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    marginTop: 5,
    fontFamily: 'System',
    fontWeight: '600',
    letterSpacing: 1,
  },
  hourlyContainer: {
    marginTop: 30,
    marginHorizontal: 25,
  },
  hourlyScroll: {
    marginTop: 10,
  },
  hourItem: {
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 15,
    marginRight: 10,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 15,
    minWidth: 80,
  },
  hourTime: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 8,
  },
  hourEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  hourTemp: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'System',
  },
  footer: {
    marginTop: 40,
    paddingHorizontal: 25,
    alignItems: 'center',
    paddingBottom: 30,
  },
  footerText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    textAlign: 'center',
    fontFamily: 'System',
    marginBottom: 10,
  },
  poweredBy: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default WeatherScreen;