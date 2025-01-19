import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { useMediConnectStore } from '../Store/Store';

export default function SOAPNotesScreen() {
    const navigation = useNavigation();
    const [SOAP, setSOAP] = useState(null);
    const [Loading, setLoading] = useState(true);
    const fetchRequest = useMediConnectStore((state) => state.fetchWithRetry);

    useEffect(() => {
        const fetchSOAP = async () => {
            const response = await fetchRequest("https://www.mediconnect.live/mobile/get-soap-notes", "get");
            if (response.status === 200) {
                console.log("SOAP Notes, Back to SOAP Screen Success: ", response.data);
                setSOAP(response.data);
                setLoading(false);
            } else {
                console.log("Error Fetching SOAP Notes: ", response.data);
            }
        }
        fetchSOAP();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={() => navigation.goBack()} />
                <Text style={styles.HeadingText}>SOAP Notes</Text>
            </View>
            <ScrollView contentContainerStyle={styles.BottomView}>
                {Loading && <Text style={styles.LoadingText}>Loading...</Text>}
                {!Loading && Object.keys(SOAP).length === 0 && <Text style={styles.LoadingText}>No SOAP Notes Data Available</Text>}
                {!Loading && Object.keys(SOAP).length > 0 && SOAP.soap_note_data &&
                    <View style={styles.NoteContainer}>
                        {/*<Text style={styles.DateText}>Last Updated: {note.LastUpdated}</Text>*/}
                        
                        <Text style={styles.SectionTitle}>Assessment:</Text>
                        <Text style={styles.ObjectText}>{SOAP.soap_note_data.assessment}</Text>

                        <Text style={styles.SectionTitle}>Subjective:</Text>
                        <Text style={styles.ObjectText}>{SOAP.soap_note_data.subjective}</Text>

                        <Text style={styles.SectionTitle}>Objective:</Text>
                        <Text style={styles.ObjectText}>{SOAP.soap_note_data.objective}</Text>

                        <Text style={styles.SectionTitle}>Plan:</Text>
                        <Text style={styles.ObjectText}>{SOAP.soap_note_data.plan}</Text>
                    </View>
                }
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: hp(1),
        paddingHorizontal: wp(2)
    },
    HeadingText: {
        fontSize: hp(2.8),
        fontWeight: "bold",
        color: "#41474D",
    },
    TopView: {
        flexDirection: "row",
        marginTop: hp(0.5),
        justifyContent: "center",
        width: wp(100),
        alignItems: "center",
        borderBottomWidth: hp(0.06),
        borderBottomColor: "#d4d2cd",
        paddingBottom: hp(1)
    },
    backArrow: {
        position: "absolute",
        left: 0
    },
    BottomView: {
        paddingHorizontal: wp(2)
    },
    LoadingText: {
        fontSize: hp(2.3),
        fontWeight: "bold",
        marginVertical: hp(4),
        alignSelf: "center",
    },
    NoteContainer: {
        marginVertical: hp(1),
        paddingVertical: hp(1),
    },
    DateText: {
        fontSize: hp(2),
        color: "#777",
        marginBottom: hp(1),
    },
    SectionTitle: {
        fontSize: hp(2),
        fontWeight: "bold",
        marginVertical: hp(1),
    },
    ObjectText: {
        fontSize: hp(2),
        marginBottom: hp(1),
    }
});
