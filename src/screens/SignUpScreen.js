import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import axios from 'axios';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Modal from "react-native-modal";
import { ScrollView } from 'react-native';

export default function SignUpScreen() {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error,setError] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [showPasswordValidation, setShowPasswordValidation] = useState(false);

    const validatePassword = (password) => {
        const hasUppercase = /[A-Z]/.test(password);
        const hasLowercase = /[a-z]/.test(password);
        const hasNumber = /\d/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        setIsPasswordValid(hasUppercase && hasLowercase && hasNumber && hasSpecialChar);
    };

    const handleSignUp = async () => {
        setError('');

        if (!email || !password || !confirmPassword) {
            setError("Fields cannot be empty");
            return;
        }
        const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        if (!emailPattern.test(email)) {
            setError("Email format is not valid");
            return;
        }

        if(!isPasswordValid){
            setError("Password not valid");
            return;
        }
        if (password !== confirmPassword) {
            setError("Password and Confirm Password do not match");
            return;
        }

        try {
            const response = await axios.post("https://www.mediconnect.live/auth/signup", {
                email: email,
                password: password,
                role: "patient",
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data) {
                console.log("Success", response.data.users);
                setModalVisible(true);
            } else {
                setError("Sign Up Failed. Try again.");
            }
        } catch (error) {
            console.error("Error:",  error);
            setError("Sign Up Failed. Try Again.");
        }
    };
    
    return (
        <SafeAreaView style={styles.container}>    
            <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
            <View style={styles.topContainer}>
                <Text style={styles.TopSignUpText}>Sign Up</Text>
                <Text style={styles.subtitleText}>Create your account to get your</Text>
                <Text style={styles.subtitleText}>Mediconnect experience started</Text>
            </View>
            <ScrollView keyboardShouldPersistTaps="never" contentContainerStyle={styles.BottomView} >
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email address..."
                        placeholderTextColor="#B0B0B0"
                        value={email}
                        onChangeText={setEmail}
                        onFocus={() => setShowPasswordValidation(false)}
                    />
                </View>
                <Text style={styles.label}>Password</Text>
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
                <Text style={styles.label}>Confirm Password</Text>
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
            
            <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp}>
                <Text style={styles.signUpButtonText}>Sign Up</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.footerView}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.navigate("Login")}><Text style={styles.FooterSignInText}>Login</Text></TouchableOpacity>
            </View>
            <Modal isVisible={isModalVisible}>
                <View style={styles.ModalView}>
                    <Text style={styles.ModalText}>Account Successfully Created!</Text>
                    <AntDesign name="checkcircle" size={hp(9)} color="#2F3D7E" style={styles.Modalcheck}/>
                    <View style={styles.ModalButtons}>
                      <TouchableOpacity onPress={()=>setModalVisible(false)} style={styles.ModalCancelButton}><Text style={styles.CancelButtonText}>Cancel</Text></TouchableOpacity>
                      <TouchableOpacity style={styles.ModalButton} onPress={()=>{navigation.navigate("Login")}}><Text style={styles.LoginButtonText}>Login</Text></TouchableOpacity>
                    </View>
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
    topContainer: {
        backgroundColor: '#2F3D7E',
        width: wp(100),
        height: hp(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    TopSignUpText: {
        color: 'white',
        fontSize: hp(6.5),
        fontWeight: '500',
        marginBottom:hp(2)
    },
    subtitleText: {
        color: 'white',
        textAlign: 'center',
        marginBottom: hp(1),
        fontSize: hp(2.2),
    },
    BottomView: {
        width: wp(100),
        alignItems: 'center',
        //justifyContent: 'center',
    },
    inputContainer: {
        width: wp(85),
        marginTop: hp(5),
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
    signUpButton: {
        backgroundColor: '#2F3D7E',
        width: wp(85),
        height: hp(6),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(4),
    },
    signUpButtonText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
   footerView:{
    flexDirection:"row",
    marginTop: hp(6),
   },
    footerText: {
        fontSize: hp(2),
        color: '#B0B0B0',
    },
    FooterSignInText: {
        color: '#2F3D7E',
        fontWeight: 'bold',
        fontSize: hp(2),
        textDecorationLine: 'underline',
        textDecorationColor:"#2F3D7E"
    },
    error:{
        color:"red",
        marginTop:hp(2),
        fontSize:hp(2)
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
        height:hp(25),
        width:wp(80),
        alignSelf:"center"
      },
      ModalText:{
        fontSize:hp(2),
        fontWeight:"bold",
        textAlign:"center",
        marginVertical:hp(2)
      },
      ModalButtons:{
        alignSelf:"center",
        flexDirection:"row",
        justifyContent:"space-between",
        alignItems:"center",
        marginVertical:hp(1),
        height:hp(7),
        width:wp(70),
      },
      ModalCancelButton:{
        justifyContent:"center",
        borderRadius:10,
        width: wp(33),
        height: hp(5),
        alignItems:"center",
        backgroundColor: "white",
        borderWidth: 1,
        borderColor:"red"
      },
      ModalButton:{
        justifyContent:"center",
        borderRadius:10,
        width: wp(33),
        height: hp(5),
        alignItems:"center",
        backgroundColor: "#2F3D7E",
      },
      LoginButtonText:{
        color:"white",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      CancelButtonText:{
        color:"red",
        fontSize:hp(1.8),
        fontWeight:"bold"
      },
      Modalcheck:{
        alignSelf:"center",
      }
});
