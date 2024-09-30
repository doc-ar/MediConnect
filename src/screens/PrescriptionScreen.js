import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { StyleSheet, Text, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import MedicationTable from '../components/MedicationTable';
import PrescriptionTable from '../components/PrescriptionTable';

export default function PrescriptionScreen({navigation}){

      const [Prescriptions, setPrescriptions]=useState([{
        Doctor:"Dr. John Doe",
        Date:"2024-09-01",
        Medication:[
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },{
        Doctor:"Dr. Junaid J",
        Date:"2024-08-01",
        Medication:[
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. AR",
        Date:"2024-01-11",
        Medication: [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. Laiba",
        Date:"2023-09-04",
        Medication: [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. Junaid J",
        Date:"2023-07-21",
        Medication: [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. AR",
        Date:"2023-07-21",
        Medication: [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. Junaid J",
        Date:"2023-07-21",
        Medication: [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      },
      {
        Doctor:"Dr. AR",
        Date:"2023-07-21",
        Medication:  [
            {
              "Medicine": "Azoxan",
              "Strength": "500mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            },
            {
              "Medicine": "Conta",
              "Strength": "200mg",
              "Dosage": "1 tablet",
              "Frequency": "6 hrs",
              "Duration": "5 Days"
            },
            {
              "Medicine": "Floran",
              "Strength": "500mg",
              "Dosage": "1 tablet",
              "Frequency": "24 hrs",
              "Duration": "8 Days"
            },
            {
              "Medicine": "Roxan",
              "Strength": "200mg",
              "Dosage": "2 tablets",
              "Frequency": "12 hrs",
              "Duration": "10 Days"
            }
          ]
      }

    
    ]);

    return(
        <>
        <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <ScrollView contentContainerStyle={styles.container}>
              <View style={styles.TopView}>
                <Text style={styles.PrescriptionText}>My Prescriptions</Text>
                </View>
                <Text style={styles.LatestPrescriptionText}>Latest Prescription</Text>
                <MedicationTable Medication={Prescriptions[1].Medication}/>
                <Text style={styles.PastPrescriptionText}>Past Prescriptions</Text>
                <PrescriptionTable Prescription={Prescriptions} Navigation={navigation}/>
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        alignItems:"center",
        paddingVertical:hp(1),
        paddingHorizontal:wp(4)
    },
    TopView:{
      paddingTop: hp(0.5),
      borderBottomWidth:hp(0.06),
      borderBottomColor:"#d4d2cd",
      paddingBottom:hp(1),
      width:wp(100),
      alignItems:"center"
    },
    PrescriptionText: {
      fontSize: hp(2.8),
      fontWeight: "bold",
      color: "#41474D",
    },
    LatestPrescriptionText:{
        marginBottom:hp(1.5),
        fontSize:hp(2),
        fontWeight:"bold",
        alignSelf:"flex-start",
        marginTop:hp(1.8),
    },
    PastPrescriptionText:{
        marginTop:hp(2),
        fontSize:hp(2),
        fontWeight:"bold",
        alignSelf:"flex-start"
    }
    
})