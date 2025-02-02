import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Ionicons } from "@expo/vector-icons";
import { Entypo, AntDesign } from "@expo/vector-icons";
import { Fontisto } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useMediConnectStore } from "../Store/Store";
import Modal from "react-native-modal";
import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";

export default function SettingsScreen() {
  const navigation = useNavigation();
  const PatientData = useMediConnectStore((state) => state.PatientData);
  const setPatientData = useMediConnectStore((state) => state.setPatientData);
  const clearTokens = useMediConnectStore((state) => state.clearTokens);
  const FetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
  const [ModalText, setModalText] = useState(null);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false);

  const handleImageUpdate = async (uploadedImageUrl) => {
    try {
      const updatedPatient = { ...PatientData, image: uploadedImageUrl };
      console.log("updatedPatient: ", updatedPatient);
      const response = await FetchRequest(
        "http://localhost:3002/mobile/update-patient",
        "patch",
        updatedPatient,
      );
      if (response.status === 200) {
        console.log("Profile Picture Updated Successfully: ", response.data);
        setPatientData(response.data);
        setModalText("Profile picture changed successfully!");
        setIsModalVisible(true);
      } else {
        console.log("profile picture update Failed, response: ", response);
        setModalText("error updating profile picture");
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("error updating profile picture: ", error);
      setModalText("error updating profile picture");
      setIsModalVisible(true);
    }
  };
  const handleImageUpload = async () => {
    const doc = await pickDocument();
    if (doc) {
      let uploadedImageUrl = null;
      const uri = doc.assets[0].uri;
      const name = doc.assets[0].name || "Profile_Picture";
      console.log("Uploading file: ", { name, uri });

      try {
        setIsLoadingModalVisible(true);
        const response = await FetchRequest(
          "http://localhost:3004/file/upload-avatar",
          "POST",
          { file: uri, name: name },
        );
        if (response.status === 201) {
          console.log("Image Uploaded Successfully: ", response.data);
          uploadedImageUrl = response.data.file_url;
          handleImageUpdate(uploadedImageUrl);
        } else {
          console.log("Image Upload Failed, response: ", response);
          setModalText("Error Uploading Image");
          setIsModalVisible(true);
        }
      } catch (error) {
        console.error("Error uploading image: ", error);
        setModalText("Error Uploading Image");
        setIsModalVisible(true);
      } finally {
        setIsLoadingModalVisible(false);
        setImageModalVisible(false);
      }
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg"],
      });
      console.log(result);
      if (result.canceled === false) {
        console.log("Image picked: ", result);
        return result;
      } else {
        console.log("Image picking was canceled.");
        setModalText("Error getting image");
        setIsModalVisible(true);
        return null;
      }
    } catch (error) {
      console.error("Error picking Image: ", error);
      setModalText("Error getting image");
      setIsModalVisible(true);
    }
  };

  const handleImageDelete = async () => {
    try {
      setIsLoadingModalVisible(true);
      const updatedPatient = { ...PatientData, image: null };
      const response = await FetchRequest(
        "http://localhost:3002/mobile/update-patient",
        "patch",
        updatedPatient,
      );
      if (response.status === 200) {
        console.log("Image Deleted Successfully: ", response.data);
        setPatientData(response.data);
        setModalText("Image Deleted Successfully");
        setIsModalVisible(true);
      } else {
        console.log("Image Deletion Failed, response: ", response);
        setModalText("Error Deleting Image");
        setIsModalVisible(true);
      }
    } catch (error) {
      console.error("Error deleting image: ", error);
      setModalText("Error Deleting Image");
      setIsModalVisible(true);
    } finally {
      setIsLoadingModalVisible(false);
      setImageModalVisible(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="white" />
      <View style={styles.TopView}>
        <Text style={styles.SettingsText}>Settings</Text>
      </View>
      <View style={styles.BottomView}>
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: PatientData.image }}
            style={styles.PatientImage}
          />
          <MaterialCommunityIcons
            name="pencil-circle"
            size={hp(5)}
            color="#2F3D7E"
            style={styles.pencilicon}
            onPress={() => setImageModalVisible(true)}
          />
        </View>
        <Text style={styles.PatientName}>{PatientData.name}</Text>
        <Text style={styles.PatientEmail}>{PatientData.email}</Text>
        <View style={styles.buttons}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <View style={styles.buttonstartView}>
              <MaterialCommunityIcons
                name="account"
                size={hp(4)}
                color="#7B7B7C"
              />
              <Text style={styles.buttonText}>Edit Profile</Text>
            </View>
            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("SecurityScreen")}
          >
            <View style={styles.buttonstartView}>
              <MaterialIcons name="security" size={hp(3.3)} color="#7B7B7C" />
              <Text style={styles.buttonText}>Security</Text>
            </View>
            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("NotificationSettings")}
          >
            <View style={styles.buttonstartView}>
              <Ionicons name="notifications" size={hp(3.3)} color="#7B7B7C" />
              <Text style={styles.buttonText}>Notifications</Text>
            </View>
            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("HelpScreen")}
          >
            <View style={styles.buttonstartView}>
              <Entypo name="help-with-circle" size={hp(3.3)} color="#7B7B7C" />
              <Text style={styles.buttonText}>Help & Support</Text>
            </View>
            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("LanguageScreen")}
          >
            <View style={styles.buttonstartView}>
              <Fontisto name="world-o" size={hp(3.3)} color="#7B7B7C" />
              <Text style={styles.buttonText}>Language</Text>
            </View>
            <MaterialIcons name="navigate-next" size={hp(4)} color="#7B7B7C" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          onPress={() => clearTokens()}
          style={styles.LogOutbutton}
        >
          <Text style={styles.LogOutText}>Log Out</Text>
        </TouchableOpacity>
      </View>
      <Modal isVisible={isLoadingModalVisible}>
        <View style={styles.LoadingModal}>
          <ActivityIndicator size="large" color="#fafafa" />
        </View>
      </Modal>
      <Modal isVisible={isModalVisible}>
        <View style={styles.ModalView}>
          <Text style={styles.ModalText}>{ModalText}</Text>
          {ModalText?.toLowerCase().includes("success") ? (
            <AntDesign
              name="checkcircle"
              size={hp(9)}
              color="#2F3D7E"
              style={styles.Modalcheck}
            />
          ) : (
            <Entypo
              name="emoji-sad"
              size={hp(9)}
              color="#a1020a"
              style={styles.Modalcheck}
            />
          )}
          <TouchableOpacity
            style={styles.ModalButton}
            onPress={() => {
              setIsModalVisible(false);
            }}
          >
            <Text style={styles.ModalButtonText}>Okay</Text>
          </TouchableOpacity>
        </View>
      </Modal>

      <Modal isVisible={imageModalVisible}>
        <View style={styles.ImageModalView}>
          <Entypo
            name="circle-with-cross"
            style={styles.ImageModalCrossIcon}
            size={hp(3)}
            color="#7B7B7C"
            onPress={() => {
              setImageModalVisible(false);
            }}
          />
          <TouchableOpacity
            style={styles.ImageModalButton}
            onPress={() => {
              handleImageUpload();
            }}
          >
            <Text style={styles.ImageModalButtonText}>Edit Picture</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.ImageModalButton}
            onPress={() => {
              handleImageDelete();
            }}
          >
            <Text style={styles.ImageModalButtonText}>Delete Picture</Text>
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
    paddingVertical: hp(1),
  },
  TopView: {
    paddingTop: hp(0.5),
    borderBottomWidth: hp(0.06),
    borderBottomColor: "#d4d2cd",
    paddingBottom: hp(1),
    width: wp(100),
    alignItems: "center",
  },
  SettingsText: {
    fontSize: hp(2.8),
    fontWeight: "bold",
    color: "#41474D",
  },
  BottomView: {
    marginTop: hp(3),
    alignItems: "center",
    flex: 1,
  },
  imageContainer: {
    position: "relative",
    width: wp(28),
    height: wp(28),
  },
  PatientImage: {
    width: "100%",
    height: "100%",
    borderRadius: wp(15),
    borderWidth: wp(2),
    borderColor: "#EBEDF3",
  },
  pencilicon: {
    position: "absolute",
    bottom: -hp(1),
    right: -wp(2),
  },
  PatientName: {
    fontSize: hp(2.7),
    fontWeight: "700",
    color: "#2F3D7E",
    marginTop: hp(1),
  },
  PatientEmail: {
    fontSize: hp(1.8),
    color: "#A2A29F",
    marginTop: hp(0.3),
  },
  buttons: {
    marginTop: hp(6),
    marginHorizontal: wp(5),
  },
  button: {
    width: wp(90),
    height: hp(6),
    backgroundColor: "#EBEDF3",
    borderRadius: hp(1.5),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: wp(4),
    marginBottom: hp(2),
  },
  buttonstartView: {
    flexDirection: "row",
    alignItems: "center",
    width: wp(60),
  },
  buttonText: {
    fontSize: hp(2.3),
    fontWeight: "550",
    color: "#888885",
    marginLeft: wp(5),
  },
  LogOutbutton: {
    position: "absolute",
    bottom: hp(2),
  },
  LogOutText: {
    color: "red",
    fontSize: hp(2.3),
  },
  LoadingModal: {
    height: hp(30),
    width: wp(80),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
  },
  ModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: hp(27),
    width: wp(80),
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: wp(2),
    paddingVertical: hp(2),
  },
  ModalText: {
    fontSize: hp(2),
    fontWeight: "bold",
    textAlign: "center",
  },
  Modalcheck: {
    alignSelf: "center",
    marginVertical: hp(2),
  },
  ModalButton: {
    justifyContent: "center",
    borderRadius: 10,
    width: wp(33),
    height: hp(5),
    alignItems: "center",
    backgroundColor: "white",
    borderColor: "#2F3D7E",
    borderWidth: 2,
    marginTop: hp(1),
    alignSelf: "center",
  },
  ModalButtonText: {
    color: "#2F3D7E",
    fontSize: hp(1.8),
    fontWeight: "bold",
  },
  ImageModalView: {
    height: hp(25),
    width: wp(90),
    backgroundColor: "white",
    borderRadius: 20,
    alignSelf: "centre",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    position: "relative",
  },
  ImageModalButton: {
    height: hp(5),
    width: wp(80),
    backgroundColor: "white",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: hp(1),
    borderColor: "#2F3D7E",
    borderWidth: 2,
  },
  ImageModalButtonText: {
    color: "#2F3D7E",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  ImageModalCrossIcon: {
    position: "absolute",
    right: wp(4),
    top: hp(2),
  },
});
