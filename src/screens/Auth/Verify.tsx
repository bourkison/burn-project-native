import React, {useState, useEffect} from 'react';
import {
    SafeAreaView,
    View,
    StyleSheet,
    Text,
    TextInput,
    Button,
} from 'react-native';

import {Auth} from 'aws-amplify';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';

const Verify = ({
    navigation,
    route,
}: NativeStackScreenProps<AuthStackParamList, 'Verify'>) => {
    const [verificationCode, setVerificationCode] = useState('');

    const verifyEmail = async () => {
        await Auth.confirmSignUp(route.params.username, verificationCode);
        await Auth.signIn(route.params.username, route.params.password);
    };

    const resendVerification = async () => {
        await Auth.resendSignUp(route.params.username);
    };

    useEffect(() => {
        if (route.params.sendOnLoad) {
            Auth.resendSignUp(route.params.username);
        }
    }, [route.params.sendOnLoad, route.params.username]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.formContainer}>
                <Text>
                    We have sent a verification code to your email. Please input
                    below to verify your email.
                </Text>
                <TextInput
                    placeholder="Verification code."
                    onChangeText={setVerificationCode}
                />
                <Button onPress={verifyEmail} title="Verify" />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        width: '100%',
        backgroundColor: '#264653',
    },
    formContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        padding: 20,
    },
});

export default Verify;
