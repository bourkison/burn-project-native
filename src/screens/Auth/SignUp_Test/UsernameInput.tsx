import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {
    TextInput,
    View,
    SafeAreaView,
    Pressable,
    StyleSheet,
    Text,
} from 'react-native';

const UsernameInput = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'UsernameInput'>) => {
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');

    const buttonPress = () => {
        navigation.navigate('DobInput', {username, firstName, surname});
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>What do we call you?</Text>
            </View>

            <View style={styles.row}>
                <TextInput
                    style={{...styles.textInput, ...styles.usernameInput}}
                    placeholder="Username"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setUsername}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="First name"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setFirstName}
                    autoComplete="off"
                    autoCorrect={false}
                />

                <TextInput
                    style={styles.textInput}
                    placeholder="Surname"
                    placeholderTextColor="#97A5B6"
                    onChangeText={setSurname}
                    autoComplete="off"
                    autoCorrect={false}
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.hint}>
                    Usernames must be unique, and between 3 and 24 characters.
                </Text>
            </View>

            <View style={styles.row}>
                <Pressable
                    onPress={buttonPress}
                    style={({pressed}) => {
                        return !pressed
                            ? styles.button
                            : {...styles.button, backgroundColor: '#D5576C'};
                    }}>
                    <Text style={styles.buttonText}>Press</Text>
                </Pressable>
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
        marginBottom: 10,
    },
    header: {
        fontWeight: '600',
        color: '#f3fcf0',
        fontSize: 18,
    },
    usernameInput: {
        width: '90%',
    },
    textInput: {
        marginHorizontal: '2%',
        backgroundColor: '#343E4B',
        color: '#f3fcf0',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        fontSize: 14,
        height: 40,
        width: '43%',
    },
    button: {
        width: '90%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
    },
    hint: {
        color: '#f3fcf0',
        fontSize: 12,
        paddingHorizontal: '2.5%',
    },
    buttonText: {
        color: '#f3fcf0',
        fontSize: 14,
        paddingVertical: 8,
        alignSelf: 'center',
    },
});

export default UsernameInput;
