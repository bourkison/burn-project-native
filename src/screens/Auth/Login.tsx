import React, {useState} from 'react';
import {
    TextInput,
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {CircleSnail} from 'react-native-progress';

import {useAppDispatch} from '@/store/hooks';
import {fetchUser} from '@/store/slices/user';

import {Auth} from 'aws-amplify';

const Login = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const dispatch = useAppDispatch();

    const login = async () => {
        console.log('Logging in...');
        try {
            setIsLoggingIn(true);
            const user = await Auth.signIn({username, password}).catch(err => {
                if (err.code === 'UserNotConfirmedException') {
                    console.log('User not confirmed', err, err.code);
                    navigation.replace('Verify', {
                        username,
                        password,
                        sendOnLoad: true,
                    });
                } else if (err.code === 'NotAuthorizedException') {
                    showMessage({
                        message: err.message,
                        type: 'danger',
                        position: 'bottom',
                    });
                    throw err;
                }
            });
            console.log('Logged in:', user, isLoggingIn);
            await dispatch(fetchUser());
        } catch (err: any) {
            setIsLoggingIn(false);
            console.error(err, err.code);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Icon
                        size={20}
                        name="chevron-down"
                        onPress={navigation.goBack}
                        color="#F3FCF0"
                    />
                </View>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerTitleText}>Login</Text>
                </View>
                <View style={styles.headerRight} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={16} color="#272f38" />
                    <TextInput
                        placeholder="Username"
                        onChangeText={setUsername}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={styles.textInput}
                        onSubmitEditing={login}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={17} color="#272f38" />
                    <TextInput
                        placeholder="Password"
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={styles.textInput}
                        onSubmitEditing={login}
                    />
                </View>
                <View style={styles.buttonCont}>
                    <Pressable
                        style={styles.loginButton}
                        onPress={login}
                        disabled={isLoggingIn}>
                        {!isLoggingIn ? (
                            <Text style={styles.loginButtonText}>Login</Text>
                        ) : (
                            <View>
                                <CircleSnail
                                    indeterminate={true}
                                    color="#F3FCF0"
                                    size={29}
                                    style={styles.loginButtonSpinner}
                                />
                            </View>
                        )}
                    </Pressable>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: 'transparent',
    },
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginVertical: 10,
    },
    headerLeft: {
        flex: 1,
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 3,
    },
    headerTitleText: {
        fontSize: 20,
        color: '#F3FCF0',
        textAlign: 'center',
    },
    headerRight: {
        flex: 1,
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
    inputContainer: {
        width: '100%',
        marginBottom: 5,
        marginTop: 20,
        marginHorizontal: 5,
        backgroundColor: '#F3FCF0',
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        borderRadius: 10,
        paddingVertical: 7,
        paddingHorizontal: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        textAlign: 'left',
        fontSize: 18,
        marginLeft: 10,
        width: '100%',
        paddingVertical: 2,
    },
    buttonCont: {
        paddingHorizontal: 50,
        height: 50,
        width: '100%',
    },
    loginButton: {
        marginTop: 15,
        textAlign: 'center',
        backgroundColor: '#E76F51',
        justifyContent: 'center',
        flex: 1,
        borderRadius: 25,
        width: '100%',
    },
    loginButtonText: {
        color: '#F3FCF0',
        margin: 10,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
    loginButtonSpinner: {
        paddingVertical: 5,
        justifySelf: 'center',
        alignSelf: 'center',
    },
    signUpButtonSpinner: {
        paddingVertical: 5,
        justifySelf: 'center',
        alignSelf: 'center',
    },
});

export default Login;
