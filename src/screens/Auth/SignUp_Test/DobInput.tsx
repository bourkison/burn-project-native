import React, {useState} from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';
import {View, SafeAreaView, Pressable, StyleSheet, Text} from 'react-native';
import DatePicker from 'react-native-date-picker';

const DobInput = ({}: NativeStackScreenProps<
    AuthStackParamList,
    'DobInput'
>) => {
    const [dob, setDob] = useState<Date>(new Date());
    const [open, setOpen] = useState(false);

    const buttonPress = () => {
        console.log(dob);
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.header}>What's your date of birth?</Text>
            </View>

            <View style={styles.row}>
                <Pressable
                    style={styles.dateButton}
                    onPress={() => {
                        setOpen(true);
                    }}>
                    <View style={styles.dateButtonView}>
                        <Text style={styles.dateButtonText}>
                            {dob.toDateString()}
                        </Text>
                        <Icon name="chevron-down" size={14} color="#f3fcf0" />
                    </View>
                </Pressable>
            </View>

            <View style={styles.row}>
                <Text style={styles.hint}>
                    You must be at least 16 years of age to use Strenive.
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

            <DatePicker
                modal
                open={open}
                mode="date"
                date={dob}
                maximumDate={new Date()}
                onConfirm={date => {
                    setOpen(false);
                    setDob(date);
                }}
                onCancel={() => {
                    setOpen(false);
                }}
            />
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
    hint: {
        color: '#f3fcf0',
        fontSize: 12,
    },
    buttonText: {
        color: '#f3fcf0',
        fontSize: 14,
        paddingVertical: 8,
        alignSelf: 'center',
    },
});

export default DobInput;
