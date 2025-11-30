import React, { useState } from 'react';
import { 
  View, Text, TextInput, Pressable, StyleSheet, ImageBackground, Modal 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalTitle, setModalTitle] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setModalTitle('Error');
      setModalMessage('Please enter both email and password');
      setModalVisible(true);
      return;
    }

    try {
      const userData = await AsyncStorage.getItem(email);
      if (!userData) {
        setModalTitle('Error');
        setModalMessage('No account found with this email');
      } else {
        const user = JSON.parse(userData);
        if (user.password === password) {
          setModalTitle('Success');
          setModalMessage('Login Successful!');
          setModalVisible(true);

          // Navigate after modal is visible for a short delay
          setTimeout(() => {
            setModalVisible(false);
            navigation.replace('MainTabs');
          }, 1000);
        } else {
          setModalTitle('Error');
          setModalMessage('Incorrect password');
          setModalVisible(true);
        }
      }
    } catch (error) {
      setModalTitle('Error');
      setModalMessage('Something went wrong!');
      setModalVisible(true);
      console.error(error);
    }
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
        />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Pressable style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable onPress={() => navigation.navigate('Signup')}>
          <Text style={styles.signupText}>Don't have an account? Sign Up</Text>
        </Pressable>
      </View>

      {/* Modal for messages */}
      <Modal transparent visible={modalVisible} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{modalTitle}</Text>
            <Text>{modalMessage}</Text>
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
    width: '80%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#187c3a',
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 5,
    padding: 10,
    marginBottom: 12,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#187c3a',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  signupText: {
    color: 'blue',
    marginTop: 10,
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
    borderRadius: 8,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#187c3a',
  },
  okBtn: {
    marginTop: 15,
    backgroundColor: '#187c3a',
    paddingHorizontal: 25,
    paddingVertical: 8,
    borderRadius: 5,
  },
  okBtnText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
