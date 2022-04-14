import React, {useEffect, useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {View, SafeAreaView, StyleSheet, Text, TextInput} from 'react-native';
import validator from 'email-validator';
import {Auth} from 'aws-amplify';
import dayjs from 'dayjs';
import Spinner from '@/components/Utility/Spinner';
import {showMessage} from 'react-native-flash-message';
import AnimatedButton from '@/components/Utility/AnimatedButton';

const PasswordInput = ({
    navigation,
    route,
}: NativeStackScreenProps<AuthStackParamList, 'PasswordInput'>) => {
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [email, setEmail] = useState('');

    const [isSigningUp, setIsSigningUp] = useState(false);
    const [validForm, setValidForm] = useState(false);

    const validateSignUp = (): boolean => {
        // TODO: Validate all previous values as well in the route.params object.

        if (password !== confPassword) {
            return false;
        }

        if (!validator.validate(email)) {
            return false;
        }

        return true;
    };

    useEffect(() => {
        if (password !== confPassword) {
            setValidForm(false);
            return;
        }

        if (!validator.validate(email)) {
            setValidForm(false);
            return;
        }

        setValidForm(true);
    }, [password, confPassword, email]);

    const buttonPress = async () => {
        setIsSigningUp(true);
        setValidForm(false);

        try {
            if (!validateSignUp()) {
                throw new Error('Invalid form.');
            }

            const user = await Auth.signUp({
                username: route.params.username,
                password: password,
                attributes: {
                    email: email,
                    birthdate: dayjs(route.params.dob).format('YYYY-MM-DD'),
                    gender: route.params.gender,
                    given_name: route.params.firstName,
                    family_name: route.params.surname,
                    locale: route.params.country,
                },
            });

            console.log('SUCCESSFUL SIGN UP', user);

            navigation.reset({
                routes: [
                    {name: 'HomeAuth'},
                    {
                        name: 'Verify',
                        params: {
                            username: route.params.username,
                            password: password,
                            sendOnLoad: false,
                        },
                    },
                ],
            });
        } catch (err: any) {
            // TODO: Handle an error with sign up.
            showMessage({
                message: err.message,
                type: 'danger',
                position: 'bottom',
            });

            // console.error(err);
        } finally {
            setIsSigningUp(false);
            setValidForm(true);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>Finally, secure your account.</Text>
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Password"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Confirm password"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setConfPassword}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    secureTextEntry={true}
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Email"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    autoComplete="off"
                    autoCorrect={false}
                    keyboardType="email-address"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.hint}>
                    Passwords must contain both uppercase letters, lowercase
                    letters and numbers. Emails are used for password recovery -
                    we will not send you spam.
                </Text>
            </View>

            <View style={styles.row}>
                <AnimatedButton
                    content={
                        !isSigningUp ? (
                            'Create Account'
                        ) : (
                            <Spinner
                                style={styles.spinner}
                                diameter={28}
                                spinnerWidth={4}
                                backgroundColor="#f3fcf0"
                                spinnerColor="#343E4B"
                            />
                        )
                    }
                    style={styles.button}
                    textStyle={styles.buttonText}
                    pressedColor="#D5576C"
                    disabledColor="grey"
                    disabled={!validForm}
                    onPress={buttonPress}
                />
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
        width: '90%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    label: {
        color: '#f3fcf0',
        fontSize: 14,
        marginLeft: 3,
    },
    hint: {
        color: '#f3fcf0',
        fontSize: 12,
        padding: '2.5%',
    },
    buttonText: {
        color: '#f3fcf0',
        fontSize: 14,
        paddingVertical: 8,
        alignSelf: 'center',
    },
    spinnerContainer: {
        flex: 1,
    },
    spinner: {
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
    },
});

export default PasswordInput;
