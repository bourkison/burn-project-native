import React, {useState} from 'react';
import {TextInput, View, SafeAreaView, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';

import {useAppDispatch} from '@/store/hooks';
import {fetchUser} from '@/store/slices/user';

import {Auth} from 'aws-amplify';

const Login = ({}: NativeStackScreenProps<AuthStackParamList, 'Login'>) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);

    const dispatch = useAppDispatch();

    const login = async () => {
        console.log('Logging in...');
        try {
            setIsLoggingIn(true);
            const user = await Auth.signIn({username, password});
            await dispatch(fetchUser());
            console.log('Logged in:', user, isLoggingIn);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Username"
                    onChangeText={setUsername}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    onSubmitEditing={login}
                    style={styles.textInput}
                />
                <TextInput
                    placeholder="Password"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    secureTextEntry={true}
                    onSubmitEditing={login}
                    style={styles.textInput}
                />
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
    textInput: {
        width: '100%',
        borderColor: 'black',
        borderWidth: 1,
        textAlign: 'center',
        fontSize: 16,
        padding: 5,
        margin: 5,
        backgroundColor: 'white',
    },
});

export default Login;
