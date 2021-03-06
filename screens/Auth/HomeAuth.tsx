import React, {useState} from 'react';
import {View, StyleSheet, Text, SafeAreaView, Dimensions} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from 'nav/Navigator';
import Video from 'react-native-video';
import AnimatedButton from '@/components/Utility/AnimatedButton';
const {height} = Dimensions.get('window');
// import backgroundVid from '@/assets/videos/loginVideo.mp4';

const HomeAuth = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'HomeAuth'>) => {
    const [videoPaused, setVideoPaused] = useState(false);
    const [loginModal, setLoginModal] = useState(false);

    navigation.addListener('focus', () => {
        setVideoPaused(false);
        setLoginModal(false);
    });

    const navigateLogin = () => {
        setLoginModal(true);
        navigation.navigate('Login');
    };

    const navigateSignUp = () => {
        setVideoPaused(true);
        navigation.navigate('UsernameInput');
    };

    let cont: JSX.Element | undefined;

    if (!loginModal) {
        cont = (
            <View style={styles.formContainer}>
                <Text style={styles.headers}>STRENIVE</Text>
                <View style={styles.buttonsCont}>
                    <AnimatedButton
                        style={styles.signUpButton}
                        onPress={navigateSignUp}
                        textStyle={styles.signUpButtonText}>
                        Create Account
                    </AnimatedButton>
                    <AnimatedButton
                        style={styles.loginButton}
                        onPress={navigateLogin}
                        textStyle={styles.loginButtonText}>
                        Login
                    </AnimatedButton>
                </View>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Video
                source={require('@/assets/videos/loginVideo.mp4')}
                paused={videoPaused}
                style={styles.backgroundVideo}
                resizeMode={'cover'}
                muted={true}
                repeat={true}
                rate={1.0}
            />
            <SafeAreaView style={styles.container}>{cont}</SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    backgroundVideo: {
        position: 'absolute',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        height: height,
    },
    headers: {
        fontSize: 48,
        marginBottom: 10,
        color: '#F3FCF0',
        textShadowRadius: 1,
        textShadowColor: 'black',
    },
    buttonsCont: {
        flexDirection: 'column',
        marginTop: 10,
        width: '100%',
        paddingHorizontal: 50,
        height: 90,
    },
    signUpButton: {
        padding: 10,
        backgroundColor: 'rgba(243, 252, 240, 0.9)',
        flex: 1,
        justifyContent: 'center',
        borderRadius: 25,
        width: '100%',
    },
    signUpButtonText: {
        color: '#000',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    loginButton: {
        borderColor: 'rgba(243, 252, 240, 0.9)',
        borderWidth: 2,
        padding: 10,
        flex: 1,
        justifyContent: 'center',
        borderRadius: 25,
        width: '100%',
        marginTop: 15,
    },
    loginButtonText: {
        color: 'rgba(243, 252, 240, 0.9)',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

export default HomeAuth;
