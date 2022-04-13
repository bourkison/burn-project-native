import React, {useState} from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {
    View,
    SafeAreaView,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const OtherInput = ({}: NativeStackScreenProps<
    AuthStackParamList,
    'OtherInput'
>) => {
    const [gender, setGender] = useState('male');
    const [weight, setWeight] = useState(0);
    const [height, setHeight] = useState(0);

    const buttonPress = () => {
        console.log(gender);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>
                    Understanding you a little more.
                </Text>
            </View>

            <View style={{...styles.row, ...styles.pickerRow}}>
                <View style={{width: '100%'}}>
                    <Text style={styles.label}>Gender</Text>
                </View>
                <View style={{width: '100%'}}>
                    <Picker
                        dropdownIconColor="#f3fcf0"
                        selectedValue={gender}
                        onValueChange={val => {
                            setGender(val);
                        }}>
                        <Picker.Item
                            color="#f3fcf0"
                            value="male"
                            label="Male"
                        />
                        <Picker.Item
                            color="#f3fcf0"
                            value="female"
                            label="Female"
                        />
                        <Picker.Item
                            color="#f3fcf0"
                            value="other"
                            label="Other"
                        />
                    </Picker>
                </View>
            </View>

            <View style={styles.row}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Height"
                    placeholderTextColor="#97A5B6"
                    onChangeText={val => {
                        setHeight(parseInt(val));
                    }}
                    autoComplete="off"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="done"
                />

                <TextInput
                    style={styles.textInput}
                    placeholder="Weight"
                    placeholderTextColor="#97A5B6"
                    onChangeText={val => {
                        setWeight(parseInt(val));
                    }}
                    autoComplete="off"
                    autoCorrect={false}
                    keyboardType="number-pad"
                    returnKeyType="done"
                />
            </View>

            <View style={styles.row}>
                <Text style={styles.hint}>
                    Height and weight are both optional, though will allow you
                    to better track fitness progress, as well as allow us to
                    better recommend you exercises and workouts.
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
    pickerRow: {
        flexDirection: 'column',
        paddingHorizontal: '5%',
    },
    header: {
        fontWeight: '600',
        color: '#f3fcf0',
        fontSize: 18,
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
    dateButton: {
        backgroundColor: '#343E4B',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        width: '90%',
        padding: 10,
        fontSize: 14,
        height: 40,
    },
    dateButtonView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    dateButtonText: {
        color: '#f3fcf0',
    },
    button: {
        width: '90%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
    },
    label: {
        color: '#97A5B6',
        fontSize: 14,
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
});

export default OtherInput;
