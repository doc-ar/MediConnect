import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ActivityIndicator} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Modal from "react-native-modal";
import { ScrollView } from 'react-native';
import { useMediConnectStore } from '../Store/Store';
import { Entypo } from '@expo/vector-icons';

export default function ChangePassword() {
    const navigation = useNavigation();
    const FetchRequest = useMediConnectStore(state=>state.fetchWithRetry);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [ModalText,setModalText] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [success,setSuccess] = useState(false);
    const [isLoadingModalVisible,setIsLoadingModalVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);
    
    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setIsPasswordValid(hasUppercase && hasLowercase && hasNumber && hasSpecialChar);
    };

    const handleChangePassword = async () => {
        setModalText('');
        setSuccess(false);
        if (!currentPassword || !password || !confirmPassword) {
            setModalText("Fields cannot be empty");
            setModalVisible(true)
            return;
        }

        if(!isPasswordValid){
            setModalText("New Password not valid");
            setModalVisible(true);
            return;
        }
        if (password !== confirmPassword) {
            setModalText("Password and Confirm Password do not match");
            setModalVisible(true)
            return;
        }

        try{
            setIsLoadingModalVisible(true);
            const response = await FetchRequest("https://www.mediconnect.live/auth/change-password","POST",{old_password: currentPassword, new_password: password});
            if(response.status === 200){
              setModalText("Password Changed Successfully!");
              setSuccess(true);
              setModalVisible(true);
            }
            else{
              console.log("Password Failed, response: ", response);
              setModalText("Password Change failed: ",response.error);
              setModalVisible(true);
            }
            }
          catch(error){
            console.error("Password Change failed: ", error);
            setModalText("Password Change Failed, Try Again");
            setModalVisible(true);
          }
          finally{
            setIsLoadingModalVisible(false);
          }
        
    };
    
    return (
        <SafeAreaView style={styles.container}>    
            <StatusBar barStyle="dark-content" backgroundColor="white" />
            <View style={styles.TopView}>
            <AntDesign name="arrowleft" size={hp(3.5)} color="#646466" style={styles.backArrow} onPress={()=>navigation.goBack()}/>
            <Text style={styles.PrescriptionText}>Change Password</Text>
            </View>
            <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.BottomView} >
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Current Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your Current Password..."
                        placeholderTextColor="#B0B0B0"
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                        onFocus={() => setShowPasswordValidation(false)}
                    />
                </View>
                <Text style={styles.label}>New Password</Text>
                {showPasswordValidation && (
                        <View style={styles.passwordValidation}>
                            <Text style={styles.validationText}>
                                {`• At least one uppercase letter`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one lowercase letter`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one number`}
                            </Text>
                            <Text style={styles.validationText}>
                                {`• At least one special character`}
                            </Text>
                        </View>
                    )}
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password..."
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={password}
                        onChangeText={(text) => {
                            setPassword(text);
                            validatePassword(text);
                        }}                       
                        onFocus={() => setShowPasswordValidation(true)}
                    />
                </View>
                <Text style={styles.label}>Confirm New Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password..."
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        onFocus={() => setShowPasswordValidation(false)}
                    />
                </View>
            </View>
            
            <TouchableOpacity style={styles.Button} onPress={handleChangePassword}>
                <Text style={styles.ButtonText}>Change Password</Text>
            </TouchableOpacity>
            
            <Modal isVisible={isModalVisible}>
          <View style={styles.ModalView}>
            
              <Text style={styles.ModalText}>{ModalText}</Text>
              {success ? <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.ModalIcon}/> :
              <Entypo name="emoji-sad" size={hp(9)} color="#a1020a" style={styles.ModalIcon}/>}
              <TouchableOpacity onPress={()=>{setModalVisible(false)}} style={styles.ModalButton}><Text style={styles.ModalButtonText}>Back</Text></TouchableOpacity>
              
          </View>
            </Modal>
      <Modal isVisible={isLoadingModalVisible}>
        <View style={styles.LoadingModal}>
          <ActivityIndicator size="large" color="#fafafa" />
        </View>
      </Modal>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        alignItems: 'center',
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
    BottomView: {
        width: wp(100),
        alignItems: 'center',
        //justifyContent: 'center',
    },
    inputContainer: {
        width: wp(85),
        marginTop: hp(2),
    },
    label: {
        marginTop: hp(3),
        fontSize: hp(2.2),
        fontWeight: 'bold',
    },
    inputWrapper: {
        marginTop: hp(1),
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: wp(1.2),
        height:hp(5),
        justifyContent:'center'
    },
    input: {
        fontSize: hp(2.2),
        color: 'black'
    },
    Button: {
        backgroundColor: '#2F3D7E',
        width: wp(85),
        height: hp(6),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },
    ButtonText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
  
    passwordValidation: {
        marginTop: hp(1),
        padding: wp(2),
        backgroundColor: '#F5F5F5',
        borderRadius: 5,
    },
    validationText: {
        color: 'black',
        fontSize: hp(2),
    },
    ModalView:{
        backgroundColor:"white",
        borderRadius:20,
        height:hp(30),
        width:wp(80),
        alignSelf:"center"
      },
      ModalText:{
        fontSize:hp(2),
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:hp(3)
      },
      ModalIcon:{
        alignSelf:"center",
      },
      ModalButton:{
        justifyContent:"center",
        borderRadius:10,
        width: wp(33),
        height: hp(5),
        alignItems:"center",
        alignSelf:"center",
        backgroundColor: "#2F3D7E",
        marginVertical: hp(3)
      },
      ModalButtonText:{
        color:"white",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      LoadingModal:{
        height:hp(30),
        width:wp(80),
        alignSelf:"center",
        justifyContent:"center",
        alignItems:"center"
      }
});
