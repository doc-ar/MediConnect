import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import HomeStack from './src/TabNavigation/HomeStack';
import PrescriptionDetail from './src/screens/PrescriptionDetail';
import AppointmentDetails from './src/screens/AppointmentDetails';
import NewAppointment from './src/screens/NewAppointment';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import ForgotPassword from './src/screens/ForgotPassword';
import LoadingScreen from './src/screens/LoadingScreen';
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
import { useEffect, useState } from 'react';

const Stack = createNativeStackNavigator();

export default function App() {
  const IsAuthenticated = useMediConnectStore(state => state.isAuthenticated);
  const checkRefreshToken = useMediConnectStore(state => state.checkRefreshToken);
  const getIsRegistered = useMediConnectStore(state => state.getIsRegistered);
  const RegistrationCheck = useMediConnectStore(state => state.RegistrationCheck);
  const setRegistrationCheck = useMediConnectStore(state => state.setRegistrationCheck);
  const [isLoadingAuthentication, setIsLoadingAuthentication] = useState(null);
  const [isLoadingRegistration, setIsLoadingRegistration] = useState(true);
  const [IsRegistered, setIsRegistered] = useState(false);
  const [AuthenticatedScreens, setAuthenticatedScreens] = useState(null);

  useEffect(() => {
    setIsLoadingAuthentication(true);
    const initializeAuth = async () => {
      const AuthenticatedScreens = await checkRefreshToken();
      setAuthenticatedScreens(AuthenticatedScreens);
      setIsLoadingAuthentication(false);
    };
    initializeAuth();
  }, [IsAuthenticated]);

  const initializeRegCheck = async () => {
    setIsLoadingRegistration(true);
    const registered = await getIsRegistered();
    setIsRegistered(registered);
    setIsLoadingRegistration(false);
    setRegistrationCheck(false);
  };

  useEffect(() => {
   initializeRegCheck();
  }, []);

  useEffect(() => {
    if(RegistrationCheck){
    initializeRegCheck();
    }
   }, [RegistrationCheck]);

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {/* Show loading screen if checking auth or registration status */}
          {isLoadingAuthentication || (AuthenticatedScreens && isLoadingRegistration) ? (
            <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
          ) : (
            <>
              {/* Authenticated screens */}
              {AuthenticatedScreens ? (
                IsRegistered ? (
                  // User authenticated and registered: Show home and additional screens
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
                    <Stack.Screen name="SetImage" component={SetImage} />
                  </>
                ) : (
                  // User authenticated but not registered: Show registration details screen
                  <Stack.Screen name="RegisterDetails" component={RegisterDetails} />
                )
              ) : (
                // User not authenticated: Show login-related screens
                <>
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
              )}
            </>
          )}
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
}
