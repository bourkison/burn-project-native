import React, {useState} from 'react';
import {Button, TextInput, View, StyleSheet} from 'react-native';

import {Auth} from 'aws-amplify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const login = async () => {
        console.log('Logging in...');
        try {
            const user = await Auth.signIn({username, password});
            console.log('Logged in:', user);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <View style={styles.container}>
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
