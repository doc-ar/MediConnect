import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { useState } from "react";
import Ionicons from '@expo/vector-icons/Ionicons';
import AppointmentScreen from "../screens/AppointmentScreen";
import SettingsScreen from "../screens/SettingsScreen";
import HomeScreen from "../screens/HomeScreen";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { heightPercentageToDP as hp} from "react-native-responsive-screen";
import MedicalReacordsScreen from "../screens/MedicalRecordsScreen";
export default function HomeStack() {
  const Tab = createBottomTabNavigator();
  const [activeTab,setActiveTab]= useState("Home");

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        listeners={() => ({
          tabPress: () => {
            
            setActiveTab("Home")
            
          },
        })}
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: { color: "black", fontWeight: "bold", marginBottom:hp(0.5)},
          tabBarIcon: () => (
            <Ionicons
              name="home-sharp"
              size={26}
              color={activeTab=="Home"? "#2F3D7E":"gray"}
            />
          )
         
        }}
      />
      <Tab.Screen
        name="MedicalRecordsScreen"
        component={MedicalReacordsScreen}
        listeners={() => ({
          tabPress: () => {
            
            setActiveTab("Medical Records")
            
          },
        })}
        options={{
          tabBarLabel: "Medical Records",
          tabBarLabelStyle: { color: "black", fontWeight: "bold",marginBottom:hp(0.5)},
           tabBarIcon: () => (
            <MaterialCommunityIcons
              name="clipboard-plus"
              size={26}
              color={activeTab=="Medical Records"? "#2F3D7E":"gray"}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Appointment"
        component={AppointmentScreen}
        listeners={() => ({
          tabPress: () => {
            
            setActiveTab("Appointment")
            
          },
        })}
        options={{
          tabBarLabel: "Appointments",
          tabBarLabelStyle: { color: "black", fontWeight: "bold",marginBottom:hp(0.5)} ,
           tabBarIcon: () => (
            <MaterialIcons
              name="sticky-note-2"
              size={26}
              color={activeTab=="Appointment"? "#2F3D7E":"gray"}
            />
          )
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        listeners={() => ({
          tabPress: () => {
            
            setActiveTab("Settings")
            
          },
        })}
        options={{
          tabBarLabel: "Settings",
          tabBarLabelStyle: { color: "black", fontWeight: "bold", marginBottom:hp(0.5) },
           tabBarIcon: () => (
            <Ionicons
              name="settings-sharp"
              size={26}
              color={activeTab=="Settings"? "#2F3D7E":"gray"}
            />
          )
        }}
      />
      
    </Tab.Navigator>
  );
}
