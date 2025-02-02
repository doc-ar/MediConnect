import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Modal from "react-native-modal";
import axios from "axios";
import { Entypo } from "@expo/vector-icons";
export default function ForgotPassword() {
  const navigation = useNavigation();

  const [email, setEmail] = useState("");
  const [ModalText, setModalText] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [success, setSuccess] = useState(false);

  const sendEmail = async () => {
    setSuccess(false);
    if (!email) {
      setModalText("Email cannot be empty");
      setIsModalVisible(true);
      return;
    }
    const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
    if (!emailPattern.test(email)) {
      setModalText("Email format is not valid");
      setIsModalVisible(true);
      return;
    }

    try {
      setIsLoadingModalVisible(true);
      const response = await axios.post(
        "http://localhost:3000/auth/forgot-password",
        {
          email: email,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        setModalText("Password Reset Email has been sent successfully!");
        setSuccess(true);
        setIsModalVisible(true);
      } else {
        setModalText("Request Failed. Try again.");
        setIsModalVisible(true);
        console.log(response);
      }
    } catch (error) {
      console.log("error: ", error);
      setModalText("Request Failed. Try again.");
      setIsModalVisible(true);
    } finally {
      setIsLoadingModalVisible(false);
    }
  };

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
        <Text style={styles.ForgotPasswordText}>Forgot Password</Text>
      </View>
      <View style={styles.BottomView}>
        <Text style={styles.BottomText}>
          Enter Your Email. We will send you a mail.
        </Text>
        <TextInput
          style={styles.inputfield}
          placeholder="email@gmail.com"
          value={email}
          onChangeText={(text) => setEmail(text)}
        ></TextInput>
        <TouchableOpacity onPress={sendEmail} style={styles.button}>
          <Text style={styles.buttontext}>Send</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.ModalView}>
          <Text style={styles.ModalText}>{ModalText}</Text>
          {success ? (
            <AntDesign
              name="checkcircle"
              size={hp(9)}
              color="#2F3D7E"
              style={styles.ModalIcon}
            />
          ) : (
            <Entypo
              name="emoji-sad"
              size={hp(9)}
              color="#a1020a"
              style={styles.ModalIcon}
            />
          )}
          <TouchableOpacity
            onPress={() => {
              setIsModalVisible(false);
            }}
            style={styles.ModalButton}
          >
            <Text style={styles.ModalButtonText}>Back</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <Modal isVisible={isLoadingModalVisible}>
        <View style={styles.LoadingModal}>
          <ActivityIndicator size="large" color="#fafafa" />
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
  ForgotPasswordText: {
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
  inputfield: {
    width: wp(90),
    marginVertical: hp(2),
    marginTop: hp(1),
    borderRadius: 10,
    backgroundColor: "#F5F5F5",
    paddingHorizontal: wp(1.2),
    height: hp(5),
    justifyContent: "center",
    color: "black",
    fontSize: hp(2.2),
  },
  BottomView: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: wp(100),
    paddingVertical: hp(2),
    paddingHorizontal: wp(5),
    marginTop: hp(5),
  },
  BottomText: {
    fontSize: hp(2.2),
    color: "#2F3D7E",
    textAlign: "center",
    fontWeight: "bold",
  },
  button: {
    width: wp(30),
    height: hp(6),
    marginVertical: hp(2),
    marginHorizontal: wp(25),
    backgroundColor: "#2F3D7E",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  buttontext: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: hp(2.5),
  },

  ModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: hp(30),
    width: wp(80),
    alignSelf: "center",
    paddingHorizontal: wp(2),
  },
  ModalText: {
    fontSize: hp(2),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(3),
  },
  ModalIcon: {
    alignSelf: "center",
  },
  ModalButton: {
    justifyContent: "center",
    borderRadius: 10,
    width: wp(33),
    height: hp(5),
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#2F3D7E",
    marginVertical: hp(3),
  },
  ModalButtonText: {
    color: "white",
    fontSize: hp(1.8),
    fontWeight: "bold",
  },
  LoadingModal: {
    height: hp(30),
    width: wp(80),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
});
