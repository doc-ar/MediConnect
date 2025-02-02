import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { AntDesign, MaterialIcons, FontAwesome } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import Entypo from "@expo/vector-icons/Entypo";
import { StatusBar } from "expo-status-bar";
import { useMediConnectStore } from "../Store/Store";
import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import Modal from "react-native-modal";
export default function PatientDocuments() {
  const navigation = useNavigation();
  const [ModalText, setModalText] = useState("");
  const [Success, setSuccess] = useState(false);
  const FetchRequest = useMediConnectStore((state) => state.fetchWithRetry);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isLoadingModalVisible, setIsLoadingModalVisible] = useState(false);
  const PatientDocuments = useMediConnectStore(
    (state) => state.PatientData.reports,
  );
  const setPatientData = useMediConnectStore((state) => state.setPatientData);

  useEffect(() => {
    if (isModalVisible === false) {
      setTimeout(() => {
        setSuccess(false);
        setModalText("");
      }, 1000);
    }
  }, [isModalVisible]);
  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf"],
      });
      console.log(result);
      if (result.canceled === false) {
        console.log("File picked: ", result);
        return result;
      } else {
        console.log("Document picking was canceled.");
        setModalText("Error getting Document");
        setModalVisible(true);
        return null;
      }
    } catch (error) {
      console.error("Error picking document: ", error);
      setModalText("Error getting Document");
      setModalVisible(true);
    }
  };

  const handleUpload = async () => {
    const doc = await pickDocument();
    if (doc) {
      const uri = doc.assets[0].uri;
      const name = doc.assets[0].name || "uploaded_file";
      console.log("Uploading file: ", { name, uri });

      try {
        setIsLoadingModalVisible(true);
        const response = await FetchRequest(
          "http://localhost:3004/file/upload",
          "POST",
          { name: name, report: uri },
        );
        if (response.status === 201) {
          console.log("File Uploaded Successfully");
          setModalText("File Uploaded Successfully!");
          setSuccess(true);
          setModalVisible(true);
          fetchPatientData();
        } else {
          console.log("File Upload Failed, response: ", response);
          setModalText("File Upload Failed, Try Again");
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error uploading file: ", error);
        setModalText("File Upload Failed, Try Again");
        setModalVisible(true);
      } finally {
        setIsLoadingModalVisible(false);
      }
    }
  };

  const handleDownload = async (fileUrl, fileName) => {
    try {
      setIsLoadingModalVisible(true);
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;
      console.log("Downloading file to: ", fileUri);

      const downloadResumable = FileSystem.createDownloadResumable(
        fileUrl,
        fileUri,
      );
      const { uri } = await downloadResumable.downloadAsync();

      console.log("File downloaded successfully: ", uri);

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        console.log("Sharing is not available on this device.");
        setModalText("Error Sharing file on this device");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error downloading file: ", error);
      setModalText("Error Downloading File");
      setModalVisible(true);
    } finally {
      setIsLoadingModalVisible(false);
    }
  };

  const handleDelete = async (file_Url) => {
    console.log("Deleting file: ", file_Url);
    try {
      setIsLoadingModalVisible(true);
      const response = await FetchRequest(
        "http://localhost:3004/file/delete",
        "DELETE",
        { file_url: file_Url },
      );
      if (response.status === 200) {
        console.log("File Deleted Successfully");
        setModalText("File Deleted Successfully!");
        setSuccess(true);
        setModalVisible(true);
        fetchPatientData();
      } else {
        console.log("File Deletion Failed, response: ", response);
        setModalText("File Deletion Failed, Try Again");
        setModalVisible(true);
      }
    } catch (error) {
      console.error("Error Deleting file: ", error);
      setModalText("File Deletion Failed, Try Again");
      setModalVisible(true);
    } finally {
      setIsLoadingModalVisible(false);
    }
  };

  const fetchPatientData = async () => {
    const response = await FetchRequest(
      "http://localhost:3004/mobile/patient-data",
      "get",
    );
    if (response.status === 200) {
      console.log(
        "Patient Data , Back to Patient doc Screen Success: ",
        response.data,
      );
      setPatientData(response.data);
    } else {
      console.log(
        "Error Fetching Patient Data on Home Screen: ",
        response.data,
      );
    }
  };

  const renderFileItem = ({ item }) => (
    <TouchableOpacity style={styles.fileItem}>
      <Text style={styles.fileName}>{item.name}</Text>
      <View style={styles.fileIcons}>
        <FontAwesome
          name="download"
          size={hp(2.8)}
          color="#2F3D7E"
          onPress={() => handleDownload(item.url, item.name)}
        />
        <MaterialIcons
          name="delete-outline"
          size={hp(2.8)}
          color="red"
          onPress={() => handleDelete(item.url)}
        />
      </View>
    </TouchableOpacity>
  );

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
        <Text style={styles.PrescriptionText}>My Documents</Text>
      </View>
      <TouchableOpacity style={styles.PickDocView} onPress={handleUpload}>
        <Entypo
          name="plus"
          size={hp(5)}
          color="#2F3D7E"
          style={styles.PickDocIcon}
        />
        <Text style={styles.PickDocText}>Choose a File</Text>
      </TouchableOpacity>

      <View style={styles.filesContainer}>
        <Text style={styles.header}>Your Files:</Text>
        {PatientDocuments.length > 0 ? (
          <FlatList
            data={PatientDocuments}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderFileItem}
            scrollEnabled
          />
        ) : (
          <Text style={styles.noFilesText}>No files available.</Text>
        )}
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={styles.ModalView}>
          <Text style={styles.ModalText}>{ModalText}</Text>
          {Success ? (
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
              setModalVisible(false);
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
    paddingVertical: hp(1),
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
  PickDocView: {
    backgroundColor: "#e1e5f5",
    height: hp(10),
    marginVertical: hp(2),
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    width: wp(95),
    alignSelf: "center",
  },
  PickDocText: {
    color: "#2F3D7E",
    fontSize: hp(2),
    fontWeight: "bold",
  },
  filesContainer: {
    flex: 1,
    width: wp(95),
    alignSelf: "center",
    marginTop: hp(2),
    marginBottom: hp(1),
  },
  header: {
    fontSize: hp(2),
    marginLeft: wp(1),
    fontWeight: "bold",
    marginBottom: hp(0.5),
  },
  fileItem: {
    paddingHorizontal: wp(3),
    paddingVertical: hp(1),
    marginVertical: wp(2),
    backgroundColor: "#e1e5f5",
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    height: hp(5),
  },
  fileName: {
    color: "#2F3D7E",
    fontSize: hp(2),
    width: wp(65),
  },
  noFilesText: {
    textAlign: "center",
    color: "#646466",
    fontSize: hp(1.8),
  },
  fileIcons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: wp(15),
  },
  ModalView: {
    backgroundColor: "white",
    borderRadius: 20,
    height: hp(30),
    width: wp(80),
    alignSelf: "center",
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
