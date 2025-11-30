import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, Dimensions, ImageBackground, Modal 
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

// Background image
const bgImage = require('../assets/image.jpeg');
const { width } = Dimensions.get("window");

export default function Signup({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalCallback, setModalCallback] = useState(null);

  // Handle signup
  const handleSignup = async () => {
    if (!name || !email || !password || !confirmPassword) {
      showModal("Error", "Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Error", "Passwords do not match!");
      return;
    }

    try {
      const existingUser = await AsyncStorage.getItem(email);
      if (existingUser !== null) {
        showModal("Error", "Account already exists with this email!");
        return;
      }

      await AsyncStorage.setItem(email, JSON.stringify({ name, email, password }));
      showModal("Success", "Account created successfully!", () => {
        navigation.navigate("Login"); // ✅ Navigate after account creation
      });

    } catch (error) {
      console.error(error);
      showModal("Error", "Something went wrong!");
    }
  };

  // Show modal
  const showModal = (title, message, callback = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    setModalCallback(() => callback);
  };

  // Close modal
  const closeModal = () => {
    setModalVisible(false);
    if (modalCallback) {
      modalCallback();
      setModalCallback(null);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground source={bgImage} style={styles.background}>
        <View style={styles.overlay} />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.keyboardView}
        >
          <View style={styles.formContainer}>
            <Text style={styles.subtitle}>Create your account</Text>

            <TextInput 
              placeholder="Full Name" 
              style={styles.input} 
              value={name} 
              onChangeText={setName} 
              placeholderTextColor="#666"
            />
            <TextInput 
              placeholder="Email" 
              style={styles.input} 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none" 
              placeholderTextColor="#666"
            />

            <View style={styles.passwordContainer}>
              <TextInput 
                placeholder="Password" 
                style={styles.passwordInput} 
                value={password} 
                onChangeText={setPassword} 
                secureTextEntry={!showPassword} 
                placeholderTextColor="#666"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="gray"/>
              </TouchableOpacity>
            </View>

            <View style={styles.passwordContainer}>
              <TextInput 
                placeholder="Confirm Password" 
                style={styles.passwordInput} 
                value={confirmPassword} 
                onChangeText={setConfirmPassword} 
                secureTextEntry={!showPassword} 
                placeholderTextColor="#666"
              />
            </View>

            <TouchableOpacity onPress={handleSignup} style={{ width: "100%" }}>
              <LinearGradient colors={["#006400", "#00b300"]} start={[0,0]} end={[1,0]} style={styles.button}>
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link always navigates */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text style={styles.loginLink}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>

      {/* Modal */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text style={{ marginBottom: 15 }}>{modalMessage}</Text>
            <TouchableOpacity style={styles.okButton} onPress={closeModal}>
              <Text style={styles.okButtonText}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex:1, width },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor:'rgba(0,0,0,0.2)' },
  keyboardView: { flex:1, justifyContent:'center', alignItems:'center', width:'100%' },
  formContainer: { backgroundColor:'rgba(255,255,255,0.95)', padding:20, borderRadius:25, width:width*0.95, maxWidth:500, elevation:10 },
  subtitle: { fontSize:18, color:'#006400', marginBottom:20, textAlign:'center', fontWeight:'bold' },
  input: { width:'100%', borderWidth:1, borderColor:'#006400', borderRadius:12, padding:12, marginBottom:12, backgroundColor:'#fff', fontSize:16 },
  passwordContainer: { flexDirection:'row', width:'100%', borderWidth:1, borderColor:'#006400', borderRadius:12, paddingHorizontal:12, alignItems:'center', marginBottom:12, backgroundColor:'#fff' },
  passwordInput: { flex:1, paddingVertical:12, fontSize:16 },
  button: { padding:14, borderRadius:12, alignItems:'center', marginTop:5, marginBottom:15 },
  buttonText: { color:'#fff', fontSize:17, fontWeight:'bold' },
  loginContainer: { flexDirection:'row', justifyContent:'center', marginTop:5, alignItems:'center' },
  loginText: { color:'#666', fontSize:14 },
  loginLink: { color:'blue', fontSize:14, fontWeight:'bold', marginLeft:3 },
  modalOverlay: { flex:1, backgroundColor:'rgba(0,0,0,0.4)', justifyContent:'center', alignItems:'center' },
  modal: { backgroundColor:'white', padding:25, borderRadius:8, alignItems:'center', width:'80%' },
  modalTitle: { fontWeight:'bold', fontSize:18, marginBottom:10, color:'#187c3a' },
  okButton: { backgroundColor:'#187c3a', paddingVertical:8, paddingHorizontal:25, borderRadius:5 },
  okButtonText: { color:'#fff', fontWeight:'bold', fontSize:16 }
});
