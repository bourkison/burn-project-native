import React, {useState, useEffect, useMemo} from 'react';
import {SafeAreaView, View, StyleSheet, Text, TextInput} from 'react-native';

import {Auth} from 'aws-amplify';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {showMessage} from 'react-native-flash-message';
import AnimatedButton from '@/components/Utility/AnimatedButton';
import Spinner from '@/components/Utility/Spinner';

import {useAppDispatch} from '@/store/hooks';
import {FETCH_USER} from '@/store/slices/user';

const Verify = ({
    route,
}: NativeStackScreenProps<AuthStackParamList, 'Verify'>) => {
    const [verificationCode, setVerificationCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);

    const dispatch = useAppDispatch();

    const verifyEmail = async () => {
        setIsVerifying(true);
        try {
            await Auth.confirmSignUp(route.params.username, verificationCode);
            await Auth.signIn(
                route.params.username,
                route.params.password,
            ).catch(err => {
                // TODO: Navigate to login.
                throw err;
            });

            await dispatch(FETCH_USER());
        } catch (err: any) {
            showMessage({
                message: err.message,
                type: 'danger',
                position: 'bottom',
            });
        } finally {
            setIsVerifying(false);
        }
    };

    const resendVerification = async () => {
        setIsResending(true);
        await Auth.resendSignUp(route.params.username);
        setIsResending(false);
    };

    const validForm = useMemo(() => {
        return !isVerifying && verificationCode;
    }, [isVerifying, verificationCode]);

    useEffect(() => {
        if (route.params.sendOnLoad) {
            Auth.resendSignUp(route.params.username);
        }
    }, [route.params.sendOnLoad, route.params.username]);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>Verify your email.</Text>
            </View>
            <View style={styles.row}>
                <Text style={styles.hint}>
                    We have sent a verification code to your email. Please input
                    below to verify your email and begin using Strenive!
                </Text>
            </View>
            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Verification code."
                    placeholderTextColor="#97A5B6"
                    onChangeText={setVerificationCode}
                />
            </View>
            <View style={styles.row}>
                {/* TODO: Make buttons nicer. */}
                <AnimatedButton
                    style={styles.button}
                    textStyle={styles.buttonText}
                    pressedColor="#D5576C"
                    disabledColor="grey"
                    onPress={resendVerification}
                    disabled={isResending}>
                    {!isResending ? (
                        'Resend'
                    ) : (
                        <Spinner
                            style={styles.spinner}
                            diameter={28}
                            spinnerWidth={4}
                            backgroundColor="#f3fcf0"
                            spinnerColor="#343E4B"
                        />
                    )}
                </AnimatedButton>
                <AnimatedButton
                    style={styles.button}
                    textStyle={styles.buttonText}
                    pressedColor="#D5576C"
                    disabledColor="grey"
                    disabled={!validForm}
                    onPress={verifyEmail}>
                    {!isVerifying ? (
                        'Create Account'
                    ) : (
                        <Spinner
                            style={styles.spinner}
                            diameter={28}
                            spinnerWidth={4}
                            backgroundColor="#f3fcf0"
                            spinnerColor="#343E4B"
                        />
                    )}
                </AnimatedButton>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#272f38',
    },
    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    header: {
        fontWeight: '600',
        color: '#f3fcf0',
        fontSize: 18,
        marginVertical: 10,
    },
    hint: {
        color: '#f3fcf0',
        fontSize: 12,
        padding: '2.5%',
    },
    textInput: {
        marginHorizontal: '2%',
        height: 40,
        width: '90%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#343E4B',
        color: '#f3fcf0',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        fontSize: 14,
    },
    button: {
        width: '45%',
        marginHorizontal: '2.5%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#f3fcf0',
        fontSize: 14,
        paddingVertical: 8,
        alignSelf: 'center',
    },
    spinner: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default Verify;
