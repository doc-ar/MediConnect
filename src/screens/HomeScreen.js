import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { DataTable } from 'react-native-paper'; 
import { StyleSheet, Text, View } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen(){
    const [UserName,setUserName] = useState("Sarah");
    const [Info, setInfo] = useState({
        Gender:"Male",
        Age:"48",
        BloodType:"O+",
        Weight:"70 kg",
        Height:"170 cm",
        Allergies:"None",
        BloodGlucose:"120 mg/dL",
        BloodPressure:"120/80 mmHg"
    });
    const [LatestAppointmentData,setLatestAppointmentData]=useState({date:"11"});

    return(
        <>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.container}>
                <View style={styles.TopView}>
                    <Text style={styles.WelcomeText}>Welcome Back, {UserName}</Text>
                    <Ionicons style={styles.NotificationIcon} name="notifications-outline" size={hp(3)} color="black" />
                </View>
                {Object.keys(LatestAppointmentData).length === 0 &&
                    <Text style={{fontSize:hp(2), fontWeight:"bold", marginTop:hp(2)}}>No Latest Appointment</Text>
                }
                {Object.keys(LatestAppointmentData).length !== 0 &&
                    <Text style={{fontSize:hp(2), fontWeight:"bold", marginTop:hp(2)}}>1 Latest Appointment</Text>
                }
                <View style={styles.BioView}>
                    <Text style={styles.BioDataText}>Bio Data:</Text>
                    <AntDesign name="edit" size={hp(3)} color="#2F3D7E" style={styles.editicon}/>
                </View>
                <DataTable style={styles.Infocontainer}> 
                    {Object.entries(Info).map(([key, value], index) => (
                        <DataTable.Row key={index}>
                            <DataTable.Cell>{key}</DataTable.Cell>
                            <DataTable.Cell>{value}</DataTable.Cell>
                        </DataTable.Row>
                    ))}
	            </DataTable> 
                
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'white',
      paddingTop:hp(1),
      paddingHorizontal:wp(2)
    },
    TopView:{
    flexDirection:"row", justifyContent:"space-between", width:wp(98),
    height: hp(4)
    },
    BioView:{
        flexDirection:"row", justifyContent:"space-between", width:wp(96)
    },
    WelcomeText:{
        fontSize:hp(3),
        fontWeight:"700",
        color:"black",
        left:0,
        position:"absolute"
    },
    NotificationIcon:{
        right:0,
        position:"absolute",
        paddingTop:hp(0.5)
    },
    editicon:{
        marginRight:wp(1)   
    },
    BioDataText:{
        fontSize:hp(2),
        fontWeight:"bold",
        marginVertical:hp(0.5)
    },
    Infocontainer: { 
        paddingHorizontal: wp(0.5),
        paddingVertical: hp(1),
        marginTop: hp(1.5),
        borderRadius: 15,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "#2F3D7E",

    }, 
});
