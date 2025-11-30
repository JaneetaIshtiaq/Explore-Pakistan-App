import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  Modal,
  ActivityIndicator,
  StyleSheet,
  Text,
  Alert,
} from "react-native";
import axios from "axios";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Ionicons } from "@expo/vector-icons";
import ImageViewer from "react-native-image-zoom-viewer";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");
const imageSize = width / 2 - 20;

const UNSPLASH_URL = "https://api.unsplash.com/search/photos";
const ACCESS_KEY = "jc_3gNhV36lhccTFQkAhw65EGZg0Zn5PlPhmtRNgabI"; // replace with your key

export default function GalleryScreen() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const cities = [
        "Islamabad",
        "Lahore",
        "Karachi",
        "Peshawar",
        "Hunza Valley",
        "Murree",
        "Abbottabad",
        "Gilgit Baltistan",
        "Skardu",
        "Naran",
        "Swat Valley",
        "Chitral"
      ];
      let allImages = [];
      for (const city of cities) {
        const response = await axios.get(UNSPLASH_URL, {
          params: { query: city, per_page: 5 },
          headers: { Authorization: `Client-ID ${ACCESS_KEY}` },
        });
        const cityImages = response.data.results.map((item) => ({
          city: city,
          url: item.urls.regular,
        }));
        allImages = allImages.concat(cityImages);
      }
      setImages(allImages);
      setLoading(false);
    } catch (error) {
      Alert.alert("Error", "Failed to load images from Unsplash");
      console.error(error);
      setLoading(false);
    }
  };

  const openImage = (index) => {
    setCurrentIndex(index);
    setVisible(true);
  };

  const saveImage = async (url) => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Cannot save image without permission.");
        return;
      }

      const fileUri = FileSystem.cacheDirectory + url.split("/").pop().split("?")[0];
      const download = await FileSystem.downloadAsync(url, fileUri);

      const asset = await MediaLibrary.createAssetAsync(download.uri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
      Alert.alert("Success", "Image saved to gallery!");
    } catch (error) {
      Alert.alert("Error", "Failed to save image.");
      console.error(error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#187c3a" />
        <Text style={{ marginTop: 10, fontWeight: "500", color: "#555" }}>Loading Images...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        numColumns={2}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => openImage(index)}
            activeOpacity={0.9}
            style={styles.card}
          >
            <Image source={{ uri: item.url }} style={styles.image} />
            <LinearGradient
              colors={["rgba(0,0,0,0.6)", "transparent"]}
              style={styles.label}
            >
              <Text style={styles.cityName}>{item.city}</Text>
            </LinearGradient>
          </TouchableOpacity>
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <Modal visible={visible} transparent={true}>
        <ImageViewer
          imageUrls={images.map((img) => ({ url: img.url }))}
          index={currentIndex}
          enableSwipeDown
          onSwipeDown={() => setVisible(false)}
          saveToLocalByLongPress={true}
          backgroundColor="#000"
          renderHeader={() => (
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setVisible(false)}
            >
              <Ionicons name="close-circle" size={40} color="#fff" />
            </TouchableOpacity>
          )}
          onSave={(url) => saveImage(url)}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2", padding: 10 },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: {
    margin: 5,
    borderRadius: 15,
    overflow: "hidden",
    flex: 1,
    elevation: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
  },
  image: {
    width: imageSize,
    height: imageSize,
    borderRadius: 15,
  },
  label: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 5,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  cityName: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    top: 50,
    right: 20,
    zIndex: 10,
  },
});
