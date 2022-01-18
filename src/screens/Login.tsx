import React, {useState} from 'react';
import {
    Button,
    TextInput,
    View,
    StyleSheet,
    Text,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';

import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {fetchUser} from '@/store/slices/user';

import {Auth} from 'aws-amplify';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const fetchingStatus = useAppSelector(state => state.user.status);
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
            setIsLoggingIn(true);
            const user = await Auth.signIn({username, password});
            await dispatch(fetchUser());
            console.log('Logged in:', user);
        } catch (err) {
            console.error(err);
        }
    };

    let buttonComp = <Button title="Login" onPress={login} />;

    if (fetchingStatus === 'loading' || isLoggingIn) {
        buttonComp = <ActivityIndicator />;
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.container}>
                <Text>{loggedInUsername}</Text>
                <TextInput placeholder="Username" onChangeText={setUsername} />
                <TextInput placeholder="Password" onChangeText={setPassword} />
                {buttonComp}
            </View>
        </SafeAreaView>
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
