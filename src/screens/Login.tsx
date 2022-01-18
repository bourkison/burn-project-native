import React, {useState} from 'react';
import {
    Button,
    TextInput,
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    SafeAreaView,
    Pressable,
} from 'react-native';

import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {fetchUser} from '@/store/slices/user';

import {Auth} from 'aws-amplify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const fetchingStatus = useAppSelector(state => state.user.status);

    const dispatch = useAppDispatch();

    const login = async () => {
        console.log('Logging in...');
        try {
            setIsLoggingIn(true);
            const user = await Auth.signIn({username, password});
            await dispatch(fetchUser());
            console.log('Logged in:', user);
        } catch (err) {
            console.error(err);
        }
    };

    let buttonComp = (
        <Pressable style={styles.loginButton} onPress={login}>
            <Text style={styles.loginButtonText}>Login</Text>
        </Pressable>
    );

    if (fetchingStatus === 'loading' || isLoggingIn) {
        buttonComp = <ActivityIndicator />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text style={styles.headers}>STRENIVE</Text>
                <TextInput
                    placeholder="Username"
                    onChangeText={setUsername}
                    autoComplete="off"
                    autoCapitalize="none"
                    onSubmitEditing={login}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    secureTextEntry={true}
                    onSubmitEditing={login}
                    style={styles.textInput}
                />
                <View style={styles.buttonsCont}>
                    <Pressable style={styles.signUpButton} onPress={login}>
                        <Text style={styles.signUpButtonText}>Sign Up</Text>
                    </Pressable>
                    {buttonComp}
                </View>
            </View>
        </SafeAreaView>
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
    headers: {
        fontSize: 48,
        marginBottom: 10,
    },
    buttonsCont: {
        flexDirection: 'row',
        height: 48,
        marginTop: 10,
    },
    signUpButton: {
        padding: 10,
        borderColor: '#f194ff',
        borderWidth: 4,
        marginRight: 3,
        flex: 1,
        justifyContent: 'center',
    },
    signUpButtonText: {
        color: '#f194ff',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    loginButton: {
        backgroundColor: '#f194ff',
        padding: 10,
        marginLeft: 3,
        flex: 1,
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    textInput: {
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        margin: 5,
    },
});

export default Login;
