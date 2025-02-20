import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import MedicationTable from "../components/MedicationTable";
import PrescriptionTable from "../components/PrescriptionTable";
import { useMediConnectStore } from "../Store/Store";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
export default function PrescriptionScreen() {
  const navigation = useNavigation();
  const FetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
  const [Loading2, setLoading2] = useState(true);
  const [Prescriptions, setPrescriptions] = useState([
    /*{
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
      }*/
  ]);

  useEffect(() => {
    /*const fetchLatestPrescription=async()=>{
        const response = await FetchRequest("https://www.mediconnect.live/mobile/latest-prescription","get"
        );
        if (response.status === 200) {
            console.log("Latest prescription Data , Back to Prescription screen Success: ",response.data);
            setLatestPrescription(response.data);
            setLoading(false);
        }
        else{
        console.log("Error Fetching Latest Prescription Data on Prescription Screen: ",response.data);
        setLoading(true);
    }}*/

    const fetchAllPrescriptions = async () => {
      const response = await FetchRequest(
        "http://localhost:3002/mobile/all-prescriptions",
        "get",
      );
      if (response.status === 200) {
        console.log(
          "All prescription Data , Back to Prescription screen Success: ",
          response.data,
        );
        setPrescriptions(response.data);
        setLoading2(false);
      } else {
        console.log(
          "Error Fetching All Prescription Data on Prescription Screen: ",
          response.data,
        );
        setLoading2(true);
      }
    };
    //fetchLatestPrescription();
    fetchAllPrescriptions();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.TopView}>
        <AntDesign
          name="arrowleft"
          size={hp(3.5)}
          color="#646466"
          style={styles.backArrow}
          onPress={() => navigation.goBack()}
        />
        <Text style={styles.PrescriptionText}>My Prescriptions</Text>
      </View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {!Loading2 ? (
          Prescriptions.length !== 0 ? (
            <>
              <Text style={styles.LatestPrescriptionText}>
                Current Prescription{" "}
              </Text>
              <Text style={styles.dated}> Dated: {Prescriptions[0].date}</Text>
              <MedicationTable Prescription={Prescriptions[0]} />
              {console.log("Prescriptions", Prescriptions[0].medication)}
              <Text style={styles.PastPrescriptionText}>
                Past Prescriptions
              </Text>
              <PrescriptionTable
                Prescription={Prescriptions}
                Navigation={navigation}
              />
            </>
          ) : (
            <>
              <Text style={styles.NoPrescriptionText}>
                You currently have no prescription data.
              </Text>
            </>
          )
        ) : (
          <Text style={styles.LoadingText}>Loading...</Text>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    alignItems: "center",
    paddingVertical: hp(1),
    paddingHorizontal: wp(4),
  },
  TopView: {
    flexDirection: "row",
    marginTop: hp(0.5),
    justifyContent: "center",
    width: wp(100),
    alignItems: "center",
    borderBottomWidth: hp(0.06),
    borderBottomColor: "#d4d2cd",
    paddingBottom: hp(1),
  },
  backArrow: {
    position: "absolute",
    left: 0,
  },
  PrescriptionText: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#41474D",
  },
  LatestPrescriptionText: {
    fontSize: hp(2.5),
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: hp(2.3),
  },
  dated: {
    fontSize: hp(1.5),
    fontWeight: "bold",
    alignSelf: "flex-start",
    marginTop: hp(1),
    color: "gray",
  },
  PastPrescriptionText: {
    marginTop: hp(2),
    fontSize: hp(2.5),
    fontWeight: "bold",
    alignSelf: "flex-start",
  },
  LoadingText: {
    fontSize: hp(2.3),
    fontWeight: "bold",
    marginVertical: hp(4),
    alignSelf: "center",
  },
  NoPrescriptionText: {
    fontWeight: "bold",
    fontSize: hp(2),
    color: "#41474D",
    textAlign: "center",
    marginTop: hp(3),
  },
});
