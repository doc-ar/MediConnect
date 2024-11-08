import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios';
import { useMediConnectStore } from '../Store/Store';

export default function LoginScreen({ navigation }) {

    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error,setError] = useState('');
    const setTokens = useMediConnectStore((state) => state.setTokens);
    const setIsRegistered = useMediConnectStore((state) => state.setIsRegistered);
    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError("Fields cannot be empty");
            return;
        }

        //const emailPattern = /^[a-zA-Z0-9._-]+@gmail\.com$/;
        //if (!emailPattern.test(email)) {
        //    setError("Email format is not valid");
        //    return;
        //}

        try {
            const response = await axios.post("https://www.mediconnect.live/auth/login", {
                email: email,
                password: password,
                role:"patient"
            }, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200 && response.data) {
                console.log("Success", response.data);
                setTokens(response.data.accessToken,response.data.refreshToken);
                setIsRegistered(response.data.hasPatientProfile);
                
            } else {
                setError("Login Failed. Try again.");
                setIsRegistered(false);
            }
        } catch (error) {
            console.error("Error:", error);
            setError("Login Failed. Try Again.");
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
            <View style={styles.topContainer}>
                <Text style={styles.TopSignInText}>Login</Text>
                <Text style={styles.subtitleText}>Login to Access your</Text>
                <Text style={styles.subtitleText}>MediConnect Experience</Text>
            </View>
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your email address..."
                        placeholderTextColor="#B0B0B0"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter your password..."
                        placeholderTextColor="#B0B0B0"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                    />
                </View>
            </View>
            <TouchableOpacity style={styles.signInButton} onPress={handleLogin}>
                <Text style={styles.signInButtonText}>Login</Text>
            </TouchableOpacity>
            {error && <Text style={styles.error}>{error}</Text>}
            <View style={styles.FooterView}>
                <Text style={styles.FooterText}>Don't have an account? </Text>
                <TouchableOpacity onPress={()=>navigation.navigate('SignUp')} ><Text style={styles.FooterSignUpText}>Sign Up</Text></TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=>navigation.navigate('ForgotPassword')} ><Text style={styles.forgotPassword}>Forgot your Password?</Text></TouchableOpacity>
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
    TopSignInText: {
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
        height: hp(3),
        fontSize: hp(2.2),
        color: 'black',
    },
    signInButton: {
        backgroundColor: '#2F3D7E',
        width: wp(85),
        height: hp(6),
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: hp(3),
    },
    signInButtonText: {
        color: 'white',
        fontSize: hp(2.5),
        fontWeight: 'bold',
    },
    FooterView:{
        flexDirection:"row",
        marginTop: hp(6),
       },
    FooterText: {
            fontSize: hp(2),
            color: '#B0B0B0',
        },
    FooterSignUpText: {
            color: '#2F3D7E',
            fontWeight: 'bold',
            fontSize: hp(2),
            textDecorationLine: 'underline',
            textDecorationColor:"#2F3D7E"
        },
    forgotPassword: {
        marginTop: hp(6),
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
    }
});
