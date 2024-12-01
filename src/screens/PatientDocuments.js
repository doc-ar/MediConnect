import { StyleSheet,Text,TouchableOpacity,View, FlatList} from "react-native";
import {AntDesign, MaterialIcons, FontAwesome} from '@expo/vector-icons';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from "react-native-safe-area-context";
import * as DocumentPicker from "expo-document-picker";
import Entypo from '@expo/vector-icons/Entypo';
import * as FileSystem from 'expo-file-system';
import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
export default function PatientDocuments() {
    const navigation = useNavigation();
    const [files, setFiles] = useState([]);

    useEffect(() => {
        fetchFiles();
      }, []);

    const openFile = async (fileName) => {
        try {
            const directoryUri = FileSystem.documentDirectory + 'uploads/';
          const fileUri = directoryUri + fileName;
    
          // Check if the file exists
          const fileInfo = await FileSystem.getInfoAsync(fileUri);
          if (!fileInfo.exists) {
            console.log("Error: File not found.");
            return;
          }
          console.log("File exists, opening... ,",fileUri);
          navigation.navigate("DocumentViewer", { fileUri });
        } catch (error) {
          console.log("Error opening file:", error);
        }
      };

    const fetchFiles = async () => {
        try {
            const directoryUri = FileSystem.documentDirectory + 'uploads/';
            const dirInfo = await FileSystem.getInfoAsync(directoryUri);
    
          if (!dirInfo.exists) {
            console.log("No Files Found, The uploads directory is empty.");
            return;
          }
    
          const fileList = await FileSystem.readDirectoryAsync(directoryUri);
          setFiles(fileList);
        } catch (error) {
          console.error("Error fetching files:", error);
        }
      };
    
    const pickDocument = async () => {
        try {
          const result = await DocumentPicker.getDocumentAsync({type: ["application/pdf"]});

          if (!result.canceled) {
            console.log("File picked: ",result);
            return result;
          } else {
            console.log('Document picking was canceled.');
            return;
          }
        } catch (error) {
          console.error('Error picking document: ', error);
        }
      };


const saveFileLocally = async (fileUri, fileName) => {
  try {
    const directoryUri = FileSystem.documentDirectory + 'uploads/';
    const fileUriDest = directoryUri + fileName;

    const dirInfo = await FileSystem.getInfoAsync(directoryUri);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
    }

    await FileSystem.moveAsync({
      from: fileUri,
      to: fileUriDest,
    });

    console.log('File saved to:', fileUriDest);
  } catch (error) {
    console.error('Error saving file locally:', error);
  }
};

const handleUpload = async () => {
    const doc = await pickDocument();
    if (doc) {
    const uri = doc.assets[0].uri;
    const name = doc.assets[0].name;
    const fileName = name || 'uploaded_file';
    await saveFileLocally(uri, fileName);
    fetchFiles();
    }
  };

const handleDelete = async(fileName) =>{
    try {
        const directoryUri = FileSystem.documentDirectory + "uploads/";
        const fileUri = directoryUri + fileName;

        await FileSystem.deleteAsync(fileUri);
        console.log(`${fileName} deleted successfully.`);
        fetchFiles();
      } catch (error) {
        console.error("Error deleting file:", error);
      }
}
const handleDownload = async (fileName) => {
    /*try {
        const directoryUri = FileSystem.documentDirectory + "uploads/";
        const fileUri = directoryUri + fileName;
        const downloadUri = FileSystem.documentDirectory + fileName;

        await FileSystem.downloadAsync(fileUri, downloadUri);
        console.log(`${fileName} downloaded successfully.`);
      } catch (error) {
        console.error("Error downloading file:", error);
      }*/
  };
  const renderFileItem = ({ item }) => (
    <TouchableOpacity
      style={styles.fileItem}
      onPress={() => openFile(item)}
    >
    <Text style={styles.fileName}>{item}</Text>
    <View style={styles.fileIcons}>
    <FontAwesome name="download" size={hp(2.8)} color="#2F3D7E" onPress={()=>{handleDownload(item)}}/>
    <MaterialIcons name="delete-outline" size={hp(2.8)} color="red" onPress={()=>{handleDelete(item)}} />
    </View>
    </TouchableOpacity>
  );
  
  
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="white"/>
            <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.PrescriptionText}>My Documents</Text>
            </View>
            <TouchableOpacity style={styles.PickDocView} onPress={handleUpload}>
                <Entypo name="plus" size={hp(5)} color="#2F3D7E" style={styles.PickDocIcon}/>
                <Text style={styles.PickDocText}>Choose a File</Text>
            </TouchableOpacity>

        <View style={styles.filesContainer}>
        <Text style={styles.header}>Your Files:</Text>
      {files.length > 0 ? (
        <FlatList
          data={files}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderFileItem}
        />
      ) : (
        <Text style={styles.noFilesText}>No files available.</Text>
      )}
    </View>
        </SafeAreaView>
    );
}

const styles= StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"white",
        paddingVertical:hp(1),
    },
    PrescriptionText:{
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
        paddingBottom:hp(1)
        
    },
    backArrow:{
        position:"absolute",
        left: 0
    },
    PickDocView:{
        backgroundColor: '#e1e5f5',
        height: hp(10),
        marginVertical: hp(2),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: wp(95),
        alignSelf: 'center',
    },
    PickDocText:{
        color:"#2F3D7E",
        fontSize: hp(2),
        fontWeight:"bold"
    },
    filesContainer: {
        width:wp(95),
        alignSelf:"center",
        marginTop:hp(2)
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
        flexDirection:"row",
        justifyContent:"space-between",
        height:hp(5)
      },
      fileName: {
        color: "#2F3D7E",
        fontSize: hp(2),
        width: wp(65)
      },
      noFilesText: {
        textAlign: "center",
        color: "#646466",
        fontSize: hp(1.8),
      },
    fileIcons:{
        flexDirection:"row",
        justifyContent:"space-between",
        width:wp(15)
    }
})