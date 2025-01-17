import { StyleSheet,Text,View,TouchableOpacity} from "react-native";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import * as Notifications from 'expo-notifications';
import * as linking from 'expo-linking';
export default function NotificationSettings(){
    const navigation = useNavigation();
    const [IsNotificationOn, setIsNotificationOn] = useState(false);

    useEffect(() => {
        const getPermission = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            console.log(status);
            if (status !== 'granted') {
                const { granted } = await Notifications.requestPermissionsAsync();
                if (granted) {
                    setIsNotificationOn(true);

                } else {
                    console.log("Notification permission denied");

                }
            } else {
                setIsNotificationOn(true);
    
            }
        };
        getPermission();
    }, []);

    const handleToggleNotifications=async()=>{
        linking.openSettings();
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
                <Text style={styles.SettingsText}>Notification Settings</Text>
            </View>
            <TouchableOpacity style={styles.button} onPress={()=>handleToggleNotifications()}>
                <View style={styles.buttonstartView}>
                    <AntDesign name="notification" size={hp(3)} color="#7B7B7C"/>
                    <Text style={styles.buttonText}>Notifications</Text>
                </View>
                {IsNotificationOn && <AntDesign name="checkcircle" size={hp(3)} color="#2F3D7E"/>}
                {!IsNotificationOn && <AntDesign name="checkcircle" size={hp(3)} color="#d4d2cd"/>}

            </TouchableOpacity>
            <Text style={styles.InfoText}>
                It is suggested to keep the notifications on to stay up to date.
            </Text>
        </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
    },
    SettingsText:{
        fontSize:hp(2.8),
        fontWeight:"bold",
        color:"#41474D"
    },
    TopView:{
        flexDirection:"row",
        marginTop:hp(0.5),
        justifyContent:"center",
        width: wp(100),
        alignItems:"center",
        borderBottomWidth:hp(0.06),
        borderBottomColor:"#d4d2cd",
        paddingBottom:hp(1),
        marginBottom:hp(2)
        },
    backArrow:{
        position:"absolute",
        left: 0
    },
      button:{
        width:wp(100),
        height:hp(7),
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        paddingHorizontal:wp(4),
        borderBottomWidth:hp(0.06),
        borderBottomColor:"#d4d2cd",
        paddingBottom:hp(1)
      },
      buttonstartView:{
        flexDirection:"row",
        alignItems:"center",
        width:wp(60),
      },
      buttonText:{
        fontSize:hp(2.3),
        fontWeight:"550",
        marginLeft:wp(5)
      },
      InfoText:{
        fontSize:hp(1.8),
        color:"#A2A29F",
        marginTop:hp(3),
        marginHorizontal:wp(5)
      }
})