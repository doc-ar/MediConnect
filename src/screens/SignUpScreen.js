import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import EvilIcons from '@expo/vector-icons/EvilIcons';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Entypo } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
export default function SignUpScreen() {
    const navigation = useNavigation();
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="light-content" backgroundColor="#2F3D7E" />
            <View style={styles.topContainer}>
                <Text style={styles.TopSignInText}>Sign Up</Text>
                <Text style={styles.subtitleText}>Create your account to get your</Text>
                <Text style={styles.subtitleText}>Mediconnect experience started</Text>
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
                <Text style={styles.label}>Confirm Password</Text>
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
            <TouchableOpacity style={styles.signInButton} onPress={()=>navigation.navigate('RegisterDetails')}>
                <Text style={styles.signInButtonText}>Sign Up</Text>
            </TouchableOpacity>
            <View style={styles.socialContainer}>
                <Text style={styles.orText}>or</Text>
                <View style={styles.socialButtons}>
                    <TouchableOpacity style={styles.SocialMediaIconView}>
                    <EvilIcons name="sc-facebook" size={hp(4)} color="#2F3D7E" />                    
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SocialMediaIconView}>
                    <AntDesign name="google" size={hp(3)} color="#2F3D7E" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.SocialMediaIconView}>
                    <Entypo name="instagram" size={hp(3)} color="#2F3D7E" />                    
                    </TouchableOpacity>
                </View>
            </View>
                <Text style={styles.footerText}>Already have an account? <TouchableOpacity onPress={()=>navigation.navigate("Login")}><Text style={styles.signInText}>Sign In</Text></TouchableOpacity></Text>
            
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
        height: hp(25),
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
        fontSize: hp(2),
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
    socialContainer: {
        marginTop: hp(4),
        alignItems: 'center',
    },
    orText: {
        fontSize: hp(2),
        color: '#B0B0B0',
    },
    socialButtons: {
        flexDirection: 'row',
        marginTop: hp(3),
        justifyContent: 'space-between',
        width: wp(50),
    },
    socialIcon: {
        
    },
    SocialMediaIconView:{
      borderRadius:15,
      borderWidth:1.5,
      borderColor:'#2F3D7E',
      width:hp(5),
      height:hp(5),
      justifyContent:'center',
      alignItems:'center',
    },
    footerText: {
        marginTop: hp(3),
        fontSize: hp(2),
        color: '#B0B0B0',
    },
    signInText: {
        color: '#2F3D7E',
        fontWeight: 'bold',
    },
});
