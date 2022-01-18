import React, {useState} from 'react';
import {Button, TextInput, View, StyleSheet, Text} from 'react-native';

import {useAppSelector, useAppDispatch} from '../store/hooks';
import {fetchUser} from '../store/slices/user';

import {Auth} from 'aws-amplify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const loggedInUsername = useAppSelector(state => {
        if (state.user.docData && state.user.docData.username) {
            return state.user.docData.username;
        }

        return '';
    });

    const dispatch = useAppDispatch();

    const login = async () => {
        console.log('Logging in...');
        try {
            const user = await Auth.signIn({username, password});
            dispatch(fetchUser((await Auth.currentUserInfo()).username));
            console.log('Logged in:', user);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
            <Text>{loggedInUsername}</Text>
            <TextInput placeholder="Username" onChangeText={setUsername} />
            <TextInput placeholder="Password" onChangeText={setPassword} />
            <Button title="Login" onPress={login} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default Login;
