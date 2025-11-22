import * as React from 'react';
import { useState } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, StyleSheet, 
  ImageBackground, Alert, KeyboardAvoidingView, Platform, Dimensions 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const bgImage = require('../assets/image.jpeg');
const { width, height } = Dimensions.get('window');

export default function Signup({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  const handleSignup = () => {
    if (!name || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill all fields!');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }
    if (!agreeTerms) {
      Alert.alert('Error', 'Please agree to the terms and conditions!');
      return;
    }

    
    Alert.alert('Success', 'Account created successfully!');
    
   
    navigation.navigate('Home');
  };

  return (
    <View style={{ flex: 1 }}>
      <ImageBackground
        source={bgImage}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
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
                <Ionicons
                  name={showPassword ? 'eye' : 'eye-off'}
                  size={24}
                  color="gray"
                />
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

            <View style={styles.checkboxContainer}>
              <TouchableOpacity
                style={[styles.checkbox, agreeTerms && styles.checkboxChecked]}
                onPress={() => setAgreeTerms(!agreeTerms)}
              >
                {agreeTerms && <Ionicons name="checkmark" size={16} color="#fff" />}
              </TouchableOpacity>
              <Text style={styles.checkboxLabel}>
                I agree to the Terms and Conditions
              </Text>
            </View>

           
            <TouchableOpacity onPress={handleSignup} style={{ width: '100%' }}>
              <LinearGradient
                colors={['#006400', '#00b300']}
                start={[0, 0]}
                end={[1, 0]}
                style={styles.button}
              >
                <Text style={styles.buttonText}>Sign Up</Text>
              </LinearGradient>
            </TouchableOpacity>

            <View style={styles.loginContainer}>
                <Text style={styles.loginText}>Already have an Account! </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginLink}>Login</Text>
                    </TouchableOpacity>
            </View>

            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or</Text>
              <View style={styles.dividerLine} />
            </View>

            <View style={styles.socialContainer}>
              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>f</Text>
                <Text style={styles.socialText}>SignUp with Facebook</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.socialButton}>
                <Text style={styles.socialIcon}>G</Text>
                <Text style={styles.socialText}>SignUp with Google</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, width, height },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.2)' },

  keyboardView: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  formContainer: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 25,
    width: width * 0.95,
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    elevation: 10,
  },
 
  subtitle: { fontSize: 16, color: '#006400', marginBottom: 20, textAlign: 'center' },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#006400',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: 'row',
    width: '100%',
    borderWidth: 1,
    borderColor: '#006400',
    borderRadius: 12,
    paddingHorizontal: 12,
    alignItems: 'center',
    marginBottom: 12,
    backgroundColor: '#fff',
  },
  passwordInput: { flex: 1, paddingVertical: 12, fontSize: 16 },
  checkboxContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  checkbox: { width: 22, height: 22, borderWidth: 2, borderColor: '#006400', borderRadius: 5, marginRight: 12, justifyContent: 'center', alignItems: 'center' },
  checkboxChecked: { backgroundColor: '#006400' },
  checkboxLabel: { color: '#006400', fontSize: 13 },
  button: { padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 5, marginBottom: 15 },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: 'bold' },
  loginContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: 15 },
  loginText: { color: '#666', fontSize: 13 },
  loginLink: { color: '#006400', fontSize: 13, fontWeight: 'bold' },
  divider: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  dividerLine: { flex: 1, height: 1, backgroundColor: '#ccc' },
  dividerText: { marginHorizontal: 10, color: '#666', fontSize: 13 },
  socialContainer: { gap: 10 },
  socialButton: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#006400', borderRadius: 12, padding: 12, backgroundColor: '#fff' },
  socialIcon: { fontSize: 18, fontWeight: 'bold', color: '#006400', marginRight: 10, width: 22, textAlign: 'center' },
  socialText: { color: '#006400', fontSize: 15, fontWeight: '500' },
});
