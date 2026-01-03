import React, { useState } from "react";
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  KeyboardAvoidingView, Platform, Dimensions, ImageBackground, Modal, ActivityIndicator 
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

// --- FIREBASE IMPORTS (Added) ---
import { auth, db } from "../firebaseConfig"; 
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const bgImage = require('../assets/image.jpeg');
const { width } = Dimensions.get("window");

export default function Signup() {
  const navigation = useNavigation();
  
  // Form States
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state add kia

  // Modal States
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [modalCallback, setModalCallback] = useState(null);

  
  const handleSignup = async () => {
    // 1. Basic Validation
    if (!name || !email || !password || !confirmPassword) {
      showModal("Error", "Please fill all fields!");
      return;
    }

    if (password !== confirmPassword) {
      showModal("Error", "Passwords do not match!");
      return;
    }

    if (password.length < 6) {
      showModal("Error", "Password should be at least 6 characters.");
      return;
    }

    setIsLoading(true); // Loading start

    try {
      // 2. Firebase Authentication (Create User)
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 3. Save Extra Data to Firestore Database
      await setDoc(doc(db, "users", user.uid), {
        fullName: name,
        email: email,
        uid: user.uid,
        createdAt: new Date().toString(),
      });

      setIsLoading(false); // Loading stop

      // 4. Success Message
      showModal("Success", "Account created successfully!", () => {
        navigation.navigate("LoginScreen"); 
      });

    } catch (error) {
      setIsLoading(false); // Loading stop
      console.error(error);

      // Error Handling (User Friendly Messages)
      let msg = "Something went wrong!";
      if (error.code === 'auth/email-already-in-use') msg = "This email is already registered!";
      if (error.code === 'auth/invalid-email') msg = "Please enter a valid email address.";
      if (error.code === 'auth/network-request-failed') msg = "Internet connection failed.";
      
      showModal("Error", msg);
    }
  };

 
  const showModal = (title, message, callback = null) => {
    setModalTitle(title);
    setModalMessage(message);
    setModalVisible(true);
    setModalCallback(() => callback);
  };


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

            <TouchableOpacity 
              onPress={handleSignup} 
              style={{ width: "100%" }}
              disabled={isLoading} // Loading ke waqt button disable
            >
              <LinearGradient colors={["#006400", "#00b300"]} start={[0,0]} end={[1,0]} style={styles.button}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Login link always navigates */}
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate("LoginScreen")}>
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
            <Text style={[styles.modalTitle, { color: modalTitle === 'Error' ? 'red' : '#187c3a' }]}>
              {modalTitle}
            </Text>
            <Text style={{ marginBottom: 15, textAlign: 'center' }}>{modalMessage}</Text>
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
  modalTitle: { fontWeight:'bold', fontSize:18, marginBottom:10 },
  okButton: { backgroundColor:'#187c3a', paddingVertical:8, paddingHorizontal:25, borderRadius:5 },
  okButtonText: { color:'#fff', fontWeight:'bold', fontSize:16 }
});