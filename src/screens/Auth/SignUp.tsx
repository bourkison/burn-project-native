import React, {useState} from 'react';
import {
    TextInput,
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';

// import {Auth} from 'aws-amplify';

const Login = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'SignUp'>) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [isSigningUp, setIsSigningUp] = useState(false);

    const signUp = () => {
        console.log('Signing up:', username, email, password, confPassword, firstName, surname);
        setIsSigningUp(true);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <View style={styles.headerLeft}>
                    <Icon
                        size={20}
                        name="chevron-left"
                        onPress={navigation.goBack}
                        color="#F3FCF0"
                    />
                </View>
                <View style={styles.headerTitle}>
                    <Text style={styles.headerTitle}>Create Account</Text>
                </View>
                <View style={styles.headerRight} />
            </View>
            <View style={styles.formContainer}>
                <View style={styles.inputContainer}>
                    <Icon name="user" size={16} />
                    <TextInput
                        placeholder="Username"
                        onChangeText={setUsername}
                        autoComplete="off"
                        autoCorrect={false}
                        autoCapitalize="none"
                        style={styles.textInput}
                    />
                </View>
                <Text style={styles.textInputHint}>
                    Usernames must be unique, and between 3 and 24 characters.
                </Text>
                <View style={styles.inputContainer}>
                    <Icon name="envelope" size={16} />
                    <TextInput
                        placeholder="Email"
                        onChangeText={setEmail}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={17} />
                    <TextInput
                        placeholder="Password"
                        onChangeText={setPassword}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={styles.textInput}
                    />
                </View>
                <Text style={styles.textInputHint}>
                    Passwords must contain letters and numbers.
                </Text>
                <View style={styles.inputContainer}>
                    <Icon name="lock" size={17} />
                    <TextInput
                        placeholder="Confirm password"
                        onChangeText={setConfPassword}
                        autoCapitalize="none"
                        autoComplete="off"
                        autoCorrect={false}
                        secureTextEntry={true}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="signature" size={17} />
                    <TextInput
                        placeholder="First name"
                        onChangeText={setFirstName}
                        autoComplete="off"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="signature" size={17} />
                    <TextInput
                        placeholder="Surname"
                        onChangeText={setSurname}
                        autoComplete="off"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Icon name="calendar" size={17} />
                    <TextInput
                        placeholder="Surname"
                        onChangeText={setSurname}
                        autoComplete="off"
                        autoCorrect={false}
                        style={styles.textInput}
                    />
                </View>

                <Pressable
                    style={styles.signUpButton}
                    onPress={signUp}
                    disabled={isSigningUp}>
                    <Text style={styles.signUpButtonText}>Create Account</Text>
                </Pressable>
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
    headerContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    headerLeft: {
        flex: 1,
        fontSize: 24,
        alignItems: 'flex-start',
    },
    headerTitle: {
        flex: 3,
        textAlign: 'center',
        fontSize: 20,
        color: '#F3FCF0',
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
    },
    textInputHint: {
        fontSize: 10,
        color: '#F3FCF0',
        textAlign: 'left',
        alignSelf: 'flex-start',
    },
    signUpButton: {
        padding: 10,
        marginTop: 10,
        backgroundColor: '#E76F51',
        justifyContent: 'center',
        borderRadius: 25,
        width: '100%',
    },
    signUpButtonText: {
        color: '#F3FCF0',
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
        textTransform: 'uppercase',
    },
});

export default Login;
