import React, { useState } from 'react';
import { 
  View, Text, TextInput, Pressable, StyleSheet, ImageBackground, Modal, ActivityIndicator 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

// --- FIREBASE IMPORTS ---
import { auth } from '../firebaseConfig'; 
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // UI States
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleLogin = async () => {
    // 1. Input Check
    if (!email || !password) {
      showModal('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);

    try {
      // 2. Firebase se Login Check karein
      await signInWithEmailAndPassword(auth, email, password);
      
      // 3. Agar success ho jaye:
      setLoading(false);
      showModal('Success', 'Login Successful!');

      // Thori der baad Home screen par le jayen
      setTimeout(() => {
        setModalVisible(false);
        // Stack reset kar rahe hain taake back button dabane se wapis login par na aye
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainTabs' }], 
        });
      }, 1000);

    } catch (error) {
      setLoading(false);
      console.error(error);
      
      // Error Messages ko User Friendly banaya
      let msg = 'Something went wrong!';
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        msg = 'Invalid Email or Password';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Email format is invalid';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Too many failed attempts. Try again later.';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Check your internet connection.';
      }

      showModal('Error', msg);
    }
  };

  // Modal dikhane ka helper function
  const showModal = (title, msg) => {
    setModalTitle(title);
    setModalMessage(msg);
    setModalVisible(true);
  };

  return (
    <ImageBackground source={require('../assets/image.jpeg')} style={styles.bg}>
      <View style={styles.form}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          placeholder="Email"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable 
            style={styles.button} 
            onPress={handleLogin}
            disabled={loading} // Loading ke waqt button disable
        >
          {loading ? (
             <ActivityIndicator color="white" />
          ) : (
             <Text style={styles.buttonText}>Login</Text>
          )}
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </View>

      {/* Modal for messages */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={[styles.modalTitle, { color: modalTitle === 'Error' ? 'red' : '#187c3a' }]}>
                {modalTitle}
            </Text>
            <Text style={{textAlign: 'center', marginBottom: 15}}>{modalMessage}</Text>
            <Pressable onPress={() => setModalVisible(false)} style={styles.okBtn}>
              <Text style={styles.okBtnText}>OK</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.95)',
    padding: 25,
    borderRadius: 15,
    alignItems: 'center',
    elevation: 5
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#187c3a',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    backgroundColor: 'white',
    fontSize: 16
  },
  button: {
    backgroundColor: '#187c3a',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
  signupText: {
    color: '#006400',
    marginTop: 15,
    fontWeight: '500'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
    elevation: 10
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 20,
    marginBottom: 10,
  },
  okBtn: {
    backgroundColor: '#187c3a',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10
  },
  okBtnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16
  },
});