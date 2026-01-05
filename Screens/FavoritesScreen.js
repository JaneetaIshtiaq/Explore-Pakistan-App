import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

const FavoritesScreen = () => {
  const { favorites, removeFromFavorites, clearAllFavorites } = useAuth();
  const navigation = useNavigation();

  const handleRemoveFavorite = (cityName) => {
    Alert.alert(
      "Remove from Favorites",
      `Are you sure you want to remove ${cityName} from favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: () => {
            removeFromFavorites(cityName);
            Alert.alert("✅ Removed", `${cityName} removed from favorites`);
          }
        }
      ]
    );
  };

  const handleClearAll = () => {
    if (favorites.length === 0) {
      Alert.alert("No Favorites", "You don't have any favorites to clear.");
      return;
    }

    Alert.alert(
      "Clear All Favorites",
      `Are you sure you want to remove all ${favorites.length} favorites?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Clear All", 
          style: "destructive",
          onPress: () => {
            clearAllFavorites();
            Alert.alert("✅ Cleared", "All favorites have been removed.");
          }
        }
      ]
    );
  };

  const navigateToCityDetail = (cityName) => {
    navigation.navigate('CityDetail', { cityName });
  };

  const renderFavoriteItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.favoriteItem}
      onPress={() => navigateToCityDetail(item.name)}
      activeOpacity={0.7}
    >
      <Image 
        source={{ uri: item.image || "https://via.placeholder.com/100" }} 
        style={styles.cityImage}
      />
      
      <View style={styles.favoriteInfo}>
        <Text style={styles.cityName}>{item.name}</Text>
        <Text style={styles.cityDisplay} numberOfLines={1}>
          {item.display || item.name}
        </Text>
      </View>
      
      <TouchableOpacity 
        style={styles.removeButton}
        onPress={() => handleRemoveFavorite(item.name)}
      >
        <Ionicons name="close-circle" size={28} color="#e74c3c" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="heart-outline" size={80} color="#ddd" />
      <Text style={styles.emptyTitle}>No Favorites Yet</Text>
      <Text style={styles.emptyText}>
        Tap the ❤️ heart icon on any city to add it to your favorites!
      </Text>
      <TouchableOpacity 
        style={styles.exploreButton}
        onPress={() => navigation.navigate('Home')}
      >
        <Ionicons name="compass-outline" size={20} color="white" />
        <Text style={styles.exploreButtonText}>Explore Cities</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Favorite Cities</Text>
        <View style={styles.headerStats}>
          <Ionicons name="heart" size={20} color="#e74c3c" />
          <Text style={styles.favoriteCount}>{favorites.length}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      {favorites.length > 0 && (
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={[styles.actionButton, styles.clearButton]}
            onPress={handleClearAll}
          >
            <Ionicons name="trash-outline" size={18} color="white" />
            <Text style={styles.actionButtonText}>Clear All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Favorites List */}
      <FlatList
        data={favorites}
        renderItem={renderFavoriteItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#187c3a',
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  headerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  favoriteCount: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
    fontSize: 16,
  },
  actionsContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  clearButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 14,
  },
  listContainer: {
    flexGrow: 1,
    padding: 15,
  },
  favoriteItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  cityImage: {
    width: 70,
    height: 70,
    borderRadius: 10,
    marginRight: 15,
  },
  favoriteInfo: {
    flex: 1,
  },
  cityName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  cityDisplay: {
    fontSize: 14,
    color: '#666',
  },
  removeButton: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#777',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 30,
    marginBottom: 30,
  },
  exploreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#187c3a',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
  },
  exploreButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});

export default FavoritesScreen;