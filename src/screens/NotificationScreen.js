import { StyleSheet, Text, View, ScrollView } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMediConnectStore } from "../Store/Store";
import { useEffect, useState } from "react";
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function NotificationScreen() {
    const navigation = useNavigation();
    const getNotifications = useMediConnectStore((state) => state.getNotifications);
    const [notifications, setNotifications] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            const fetchedNotifications = await getNotifications();
            setNotifications(fetchedNotifications);
            setLoading(false);
        };
        fetchNotifications();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
                <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={() => navigation.goBack()} />
                <Text style={styles.SettingsText}>Notifications</Text>
            </View>
            <ScrollView contentContainerStyle={styles.BottomView}>
                {loading && <Text style={styles.LoadingText}>Loading Notifications...</Text>}
                {!loading && Object.keys(notifications).length === 0 && <Text style={styles.LoadingText}>No Notifications</Text>}
                {!loading && Object.keys(notifications).map((key) => (
                    <View key={key} style={styles.NotificationView}>
                        <FontAwesome name="circle" size={hp(2)} color="#2F3D7E" style={styles.NotificationIcon} />
                        <Text style={styles.NotificationText}>{notifications[key]}</Text>
                    </View>
                ))}
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingVertical: hp(1),
    },
    SettingsText: {
        fontSize: hp(2.8),
        fontWeight: "bold",
        color: "#41474D"
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
        marginBottom: hp(1)
    },
    backArrow: {
        position: "absolute",
        left: 0
    },
    BottomView: {
        flex: 1,
        flexGrow: 1,
        paddingVertical: hp(1),
        paddingHorizontal: wp(1)
    },
    LoadingText: {
        fontSize: hp(1.5),
        fontWeight: "bold",
    },
    NotificationView: {
        flexDirection: "row",
        alignItems: "center",
        marginVertical: hp(0.5),
        borderBottomWidth: 1,
        borderBottomColor: "#d4d2cd",
        position:"relative",
        paddingBottom:hp(1)
    },
    NotificationText: {
        fontSize: hp(2),
        flex: 1,
        flexWrap: "wrap",
        marginLeft:wp(6),
        marginRight:wp(1)
    },
    NotificationIcon: {
        position:"absolute",
        top:hp(0.5)
    }
});
