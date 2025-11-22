import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Screens/Home';
import Signup from './Screens/Sign-up';
import LoginScreen from './Screens/Login';

const Stack = createNativeStackNavigator();

const headerOptions = {
  title: 'Explore Pakistan',
  headerStyle: { backgroundColor: '#187c3a' },
  headerTintColor: 'white',
  headerTitleStyle: { fontWeight: 'bold', fontSize: 30 },
  headerTitleAlign: 'center',
};

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen" screenOptions={headerOptions}>
        <Stack.Screen name="LoginScreen" component={LoginScreen} />
        <Stack.Screen name="Signup" component={Signup} />
        <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
