import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import HomeStack from './src/TabNavigation/HomeStack';
import PrescriptionDetail from './src/screens/PrescriptionDetail';
import AppointmentDetails from './src/screens/AppointmentDetails';
import NewAppointment from './src/screens/NewAppointment';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="Home" component={HomeStack} />
        <Stack.Screen name="PrescriptionDetail" component={PrescriptionDetail} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
        <Stack.Screen name="NewAppointment" component={NewAppointment} />

      </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}


