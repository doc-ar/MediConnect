import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider} from 'react-native-safe-area-context';
import HomeStack from './src/TabNavigation/HomeStack';
import PrescriptionDetail from './src/screens/PrescriptionDetail';
import AppointmentDetails from './src/screens/AppointmentDetails';
import NewAppointment from './src/screens/NewAppointment';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import RegisterDetails from './src/screens/RegisterDetails';
import LanguageScreen from './src/screens/LanguageScreen';
import NotificationSettings from './src/screens/NotificationSettings';
import HelpScreen from './src/screens/HelpScreen';
import ContactScreen from './src/screens/ContactScreen';
import TermsConditionsScreen from './src/screens/TermsConditionsScreen';
import AppInfoScreen from './src/screens/AppInfoScreen';
import EditProfile from './src/screens/EditProfile';
import NotificationScreen from './src/screens/NotificationScreen';
import RescheduleScreen from './src/screens/RescheduleScreen';
import SetImage from './src/screens/SetImage';
import { useMediConnectStore } from './src/Store/Store';
import { useState, useEffect } from 'react';
const Stack = createNativeStackNavigator();

export default function App() {
  const getIsRegistered = useMediConnectStore(state => state.getIsRegistered);
  const IsAuthenticated = useMediConnectStore(state => state.isAuthenticated);
  const [isRegistered, setIsRegistered] = useState(false);

  return (
    <NavigationContainer>
      <SafeAreaProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!IsAuthenticated &&
      <>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPassword}/>
        <Stack.Screen name="SignUp" component={SignUpScreen}/>
      </>
}
      {IsAuthenticated && 
        <>
        <Stack.Screen name="HomeStack" component={HomeStack} />
        <Stack.Screen name="PrescriptionDetail" component={PrescriptionDetail} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
        <Stack.Screen name="NewAppointment" component={NewAppointment} />
        <Stack.Screen name="LanguageScreen" component={LanguageScreen} />
        <Stack.Screen name="NotificationSettings" component={NotificationSettings} />
        <Stack.Screen name="HelpScreen" component={HelpScreen} />
        <Stack.Screen name="ContactScreen" component={ContactScreen} />
        <Stack.Screen name="AppInfoScreen" component={AppInfoScreen} />
        <Stack.Screen name="TermsConditionsScreen" component={TermsConditionsScreen} />
        <Stack.Screen name="EditProfile" component={EditProfile} />
        <Stack.Screen name="NotificationScreen" component={NotificationScreen} />
        <Stack.Screen name="RescheduleScreen" component={RescheduleScreen} />
        <Stack.Screen name="SetImage" component={SetImage}/>
        </>
        
      }
      </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}


