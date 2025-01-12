import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView } from "react-native";
import AntDesign from '@expo/vector-icons/AntDesign';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from "react";
import Modal from "react-native-modal";
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import { Entypo } from "@expo/vector-icons";
import { useMediConnectStore } from "../Store/Store";
export default function PurchaseMedication({ route }) {
    const navigation = useNavigation();
    const { Medication } = route.params;
    const PatientData = useMediConnectStore(state=>state.PatientData);
    const [username, setUsername] = useState(PatientData.name);
    const [contact, setContact] = useState(PatientData.contact);
    const [optionalContact, setOptionalContact] = useState('');
    const [address, setAddress] = useState(PatientData.address);
    const [email, setEmail] = useState(PatientData.email);
    const [note, setNote] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState('');
    const [medicationData, setMedicationData] = useState(
        Medication.map((item) => ({
            ...item,
            tablets: 5,
            perTabletPrice: (item.price/5).toFixed(2)
            
        }))
    );

    const handleIncrease = (index) => {
        setMedicationData((prevData) => {
            const updatedData = [...prevData];
            if (updatedData[index].tablets < 50) {
                updatedData[index].tablets += 1;
                updatedData[index].price = updatedData[index].tablets * updatedData[index].perTabletPrice;
            }
            return updatedData;
        });
    };

    const handleDecrease = (index) => {
        setMedicationData((prevData) => {
            const updatedData = [...prevData];
            if (updatedData[index].tablets > 5) {
                updatedData[index].tablets -= 1;
                updatedData[index].price = updatedData[index].tablets * updatedData[index].perTabletPrice;
            }
            return updatedData;
        });
    };

    const totalPrice = medicationData.reduce((total, item) => total + (item.perTabletPrice*item.tablets), 0);

    const handleConfirmPurchase = () => {
        setError('');
        if (!username || !contact || !address || !email) {
            setError("All required fields must be filled!");
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            setError("Email format is not valid");
            return;
        }
        if (contact && !Number.isFinite(parseFloat(contact))) {
            setError("Contact is invalid. Enter a valid Contact in numbers");
            return;
        }
        setModalVisible(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={() => navigation.goBack()} />
                <Text style={styles.PrescriptionText}>MediConnect Store</Text>
            </View>

            <View style={styles.Reciept}>
                <View style={styles.headerRow}>
                    <Text style={styles.headerText}>Medicine</Text>
                    <Text style={styles.headerText}>Strength</Text>
                    <Text style={styles.headerText}>Quantity</Text>
                    <Text style={styles.headerText}>Price</Text>
                </View>

                {medicationData.map((item, index) => (
                    <View style={styles.dataRow} key={index}>
                        <Text style={styles.dataText}>{item.medicine_name}</Text>
                        <Text style={styles.dataText}>{item.medicine_strength}</Text>
                        <View style={styles.TabletsView}>
                            {item.dosage.toLowerCase().includes("tablet") ?  <> 
                            <Entypo name="circle-with-minus" size={hp(2.3)} color="#2F3D7E" onPress={() => handleDecrease(index)} />
                            <Text style={styles.TabletsText}>{item.tablets}</Text>
                            <Entypo name="circle-with-plus" size={hp(2.3)} color="#2F3D7E" onPress={() => handleIncrease(index)} /></>:
                                <Text></Text>}
                        </View>
                        <Text style={styles.dataText}>$ {item.price}</Text>
                    </View>
                ))}

                <View style={styles.totalRow}>
                    <Text style={styles.totalText}>Total</Text>
                    <Text style={styles.totalText}>${totalPrice.toFixed(2)}</Text>
                </View>
            </View>
            <ScrollView contentContainerStyle={styles.formContainer}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your name"
                    value={username}
                    onChangeText={setUsername}
                    maxLength={20}
                />
                <Text style={styles.label}>Contact</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your contact"
                    value={contact}
                    keyboardType="phone-pad"
                    onChangeText={setContact}
                    maxLength={15}
                />
                <Text style={styles.label}>Optional Contact</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter additional contact"
                    value={optionalContact}
                    keyboardType="phone-pad"
                    onChangeText={setOptionalContact}
                    maxLength={15}
                />
                <Text style={styles.label}>Address</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your address"
                    value={address}
                    onChangeText={setAddress}
                    maxLength={30}
                />
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter your email"
                    value={email}
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    maxLength={40}

                />

                <Text style={styles.label}>Note</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter any additional information here"
                    value={note}
                    onChangeText={setNote}
                    maxLength={60}
                />

                <Text style={styles.paymentText}>Payment: Cash on Delivery</Text>

                {error && <Text style={styles.error}>{error}</Text>} 
            </ScrollView>

            <TouchableOpacity style={styles.button} onPress={handleConfirmPurchase}>
                    <Text style={styles.buttonText}>Confirm Purchase</Text>
            </TouchableOpacity>

            <Modal isVisible={isModalVisible}>
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Your order has been placed!</Text>
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.modalIcon} />
                    <TouchableOpacity style={styles.modalButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.modalButtonText}>Go Back</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </SafeAreaView>
            
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    PrescriptionText: {
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
        paddingBottom: hp(1),
    },
    backArrow: {
        position: "absolute",
        left: 0,
    },
    Reciept: {
        marginHorizontal: wp(5),
        marginTop: hp(2),
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderBottomWidth: 1,
        borderBottomColor: "#ccc",
        paddingBottom: hp(1),
        marginBottom: hp(1),
    },
    headerText: {
        fontSize: hp(2),
        fontWeight: "bold",
        color: "#41474D",
    },
    dataRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: hp(1),
        alignItems: "center",
    },
    dataText: {
        fontSize: hp(2.3),
        color: "#646466",
        width: wp(27),
    },
    TabletsView: {
        flexDirection: "row",
        alignItems: "center",
        width: wp(26),
    },
    TabletsText: {
        fontSize: hp(2.3),
        color: "#646466",
        marginLeft: wp(3.3),
        width: wp(6),
    },
    totalRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        borderTopWidth: 1,
        borderTopColor: "#ccc",
        paddingTop: hp(1),
        marginTop: hp(1),
        marginBottom: hp(2),

    },
    totalText: {
        fontSize: hp(2.3),
        fontWeight: "bold",
        color: "#41474D",

    },
    
    formContainer: {
        paddingHorizontal: wp(5),
    },
    label: {
        marginVertical: hp(1),
        fontSize: hp(2.2),
        fontWeight: "bold",
    },
    input: {
        borderRadius: 10,
        paddingHorizontal: wp(3),
        height: hp(6),
        fontSize: hp(2),
        backgroundColor: "#F5F5F5",
    },
    paymentText: {
        marginTop: hp(2),
        fontSize: hp(2.2),
        color: "#41474D",
        fontWeight: "bold",
    },
    button: {
        backgroundColor: "#2F3D7E",
        borderRadius: 10,
        height: hp(5),
        justifyContent: "center",
        alignItems: "center",
        marginVertical: hp(2),
        width: wp(90),
        alignSelf: "center",
    },
    buttonText: {
        color: "white",
        fontSize: hp(2.5),
        fontWeight: "bold",
    },
    error: {
        color: "red",
        marginTop: hp(1),
        fontSize: hp(2),
    },
    modalView: {
        backgroundColor: "white",
        borderRadius: 20,
        padding: hp(3),
        alignItems: "center",
    },
    modalText: {
        fontSize: hp(2.5),
        fontWeight: "bold",
        marginBottom: hp(2),
    },
    modalIcon: {
        marginBottom: hp(2),
    },
    modalButton: {
        backgroundColor: "#2F3D7E",
        borderRadius: 10,
        paddingVertical: hp(1.5),
        paddingHorizontal: wp(5),
    },
    modalButtonText: {
        color: "white",
        fontSize: hp(2),
        fontWeight: "bold",
    },
});
