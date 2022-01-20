import React, {useState} from 'react';
import {
    View,
    StyleSheet,
    Text,
    SafeAreaView,
    Pressable,
    Dimensions,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import Video from 'react-native-video';
const {height} = Dimensions.get('window');
// import backgroundVid from '@/assets/videos/loginVideo.mp4';

const HomeAuth = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'HomeAuth'>) => {
    let [videoPaused, setVideoPaused] = useState(false);

    navigation.addListener('focus', () => {
        setVideoPaused(false);
    });

    const navigateLogin = () => {
        setVideoPaused(true);
        navigation.navigate('Login');
    };

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
            <SafeAreaView style={styles.container}>
                <View style={styles.formContainer}>
                    <Text style={styles.headers}>STRENIVE</Text>
                    <View style={styles.buttonsCont}>
                        <Pressable
                            style={styles.signUpButton}
                            onPress={navigateLogin}>
                            <Text style={styles.signUpButtonText}>
                                Create Account
                            </Text>
                        </Pressable>
                        <Pressable style={styles.loginButton}>
                            <Text style={styles.loginButtonText}>Login</Text>
                        </Pressable>
                    </View>
                </View>
            </SafeAreaView>
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
        color: 'white',
        textShadowRadius: 1,
        textShadowColor: 'black',
    },
    buttonsCont: {
        flexDirection: 'column',
        marginTop: 10,
        width: '100%',
        paddingLeft: 50,
        paddingRight: 50,
        height: 90,
    },
    signUpButton: {
        padding: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        marginRight: 3,
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
        borderColor: 'rgba(255, 255, 255, 0.9)',
        borderWidth: 2,
        padding: 10,
        marginLeft: 3,
        flex: 1,
        justifyContent: 'center',
        borderRadius: 25,
        width: '100%',
        marginTop: 15,
    },
    loginButtonText: {
        color: 'rgba(255, 255, 255, 0.9)',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

export default HomeAuth;
