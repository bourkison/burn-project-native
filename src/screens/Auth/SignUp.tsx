import React, {useState} from 'react';
import {
    TextInput,
    View,
    SafeAreaView,
    StyleSheet,
    Text,
    Pressable,
    ScrollView,
} from 'react-native';
import {showMessage} from 'react-native-flash-message';
import Icon from 'react-native-vector-icons/FontAwesome';
import DatePicker from 'react-native-date-picker';
import RNPickerSelect from 'react-native-picker-select';
import {CircleSnail} from 'react-native-progress';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParamList} from '@/nav/Navigator';

import dayjs from 'dayjs';

import {Auth} from 'aws-amplify';
const countries = [
    {label: 'Afghanistan', value: 'Afghanistan'},
    {label: 'Albania', value: 'Albania'},
    {label: 'Algeria', value: 'Algeria'},
    {label: 'American Samoa', value: 'American Samoa'},
    {label: 'Andorra', value: 'Andorra'},
    {label: 'Angola', value: 'Angola'},
    {label: 'Anguilla', value: 'Anguilla'},
    {label: 'Antarctica', value: 'Antarctica'},
    {label: 'Antigua and Barbuda', value: 'Antigua and Barbuda'},
    {label: 'Argentina', value: 'Argentina'},
    {label: 'Armenia', value: 'Armenia'},
    {label: 'Aruba', value: 'Aruba'},
    {label: 'Australia', value: 'Australia'},
    {label: 'Austria', value: 'Austria'},
    {label: 'Azerbaijan', value: 'Azerbaijan'},
    {label: 'Bahamas (the)', value: 'Bahamas (the)'},
    {label: 'Bahrain', value: 'Bahrain'},
    {label: 'Bangladesh', value: 'Bangladesh'},
    {label: 'Barbados', value: 'Barbados'},
    {label: 'Belarus', value: 'Belarus'},
    {label: 'Belgium', value: 'Belgium'},
    {label: 'Belize', value: 'Belize'},
    {label: 'Benin', value: 'Benin'},
    {label: 'Bermuda', value: 'Bermuda'},
    {label: 'Bhutan', value: 'Bhutan'},
    {
        label: 'Bolivia (Plurinational State of)',
        value: 'Bolivia (Plurinational State of)',
    },
    {
        label: 'Bonaire,int Eustatius and Saba',
        value: 'Bonaire,int Eustatius and Saba',
    },
    {label: 'Bosnia and Herzegovina', value: 'Bosnia and Herzegovina'},
    {label: 'Botswana', value: 'Botswana'},
    {label: 'Bouvet Island', value: 'Bouvet Island'},
    {label: 'Brazil', value: 'Brazil'},
    {
        label: 'British Indian Ocean Territory (the)',
        value: 'British Indian Ocean Territory (the)',
    },
    {label: 'Brunei Darussalam', value: 'Brunei Darussalam'},
    {label: 'Bulgaria', value: 'Bulgaria'},
    {label: 'Burkina Faso', value: 'Burkina Faso'},
    {label: 'Burundi', value: 'Burundi'},
    {label: 'Cabo Verde', value: 'Cabo Verde'},
    {label: 'Cambodia', value: 'Cambodia'},
    {label: 'Cameroon', value: 'Cameroon'},
    {label: 'Canada', value: 'Canada'},
    {label: 'Cayman Islands (the)', value: 'Cayman Islands (the)'},
    {
        label: 'Central African Republic (the)',
        value: 'Central African Republic (the)',
    },
    {label: 'Chad', value: 'Chad'},
    {label: 'Chile', value: 'Chile'},
    {label: 'China', value: 'China'},
    {label: 'Christmas Island', value: 'Christmas Island'},
    {
        label: 'Cocos (Keeling) Islands (the)',
        value: 'Cocos (Keeling) Islands (the)',
    },
    {label: 'Colombia', value: 'Colombia'},
    {label: 'Comoros (the)', value: 'Comoros (the)'},
    {
        label: 'Congo (the Democratic Republic of the)',
        value: 'Congo (the Democratic Republic of the)',
    },
    {label: 'Congo (the)', value: 'Congo (the)'},
    {label: 'Cook Islands (the)', value: 'Cook Islands (the)'},
    {label: 'Costa Rica', value: 'Costa Rica'},
    {label: 'Croatia', value: 'Croatia'},
    {label: 'Cuba', value: 'Cuba'},
    {label: 'Curaçao', value: 'Curaçao'},
    {label: 'Cyprus', value: 'Cyprus'},
    {label: 'Czechia', value: 'Czechia'},
    {label: "Côte d'Ivoire", value: "Côte d'Ivoire"},
    {label: 'Denmark', value: 'Denmark'},
    {label: 'Djibouti', value: 'Djibouti'},
    {label: 'Dominica', value: 'Dominica'},
    {label: 'Dominican Republic (the)', value: 'Dominican Republic (the)'},
    {label: 'Ecuador', value: 'Ecuador'},
    {label: 'Egypt', value: 'Egypt'},
    {label: 'El Salvador', value: 'El Salvador'},
    {label: 'Equatorial Guinea', value: 'Equatorial Guinea'},
    {label: 'Eritrea', value: 'Eritrea'},
    {label: 'Estonia', value: 'Estonia'},
    {label: 'Eswatini', value: 'Eswatini'},
    {label: 'Ethiopia', value: 'Ethiopia'},
    {
        label: 'Falkland Islands (the) [Malvinas]',
        value: 'Falkland Islands (the) [Malvinas]',
    },
    {label: 'Faroe Islands (the)', value: 'Faroe Islands (the)'},
    {label: 'Fiji', value: 'Fiji'},
    {label: 'Finland', value: 'Finland'},
    {label: 'France', value: 'France'},
    {label: 'French Guiana', value: 'French Guiana'},
    {label: 'French Polynesia', value: 'French Polynesia'},
    {
        label: 'French Southern Territories (the)',
        value: 'French Southern Territories (the)',
    },
    {label: 'Gabon', value: 'Gabon'},
    {label: 'Gambia (the)', value: 'Gambia (the)'},
    {label: 'Georgia', value: 'Georgia'},
    {label: 'Germany', value: 'Germany'},
    {label: 'Ghana', value: 'Ghana'},
    {label: 'Gibraltar', value: 'Gibraltar'},
    {label: 'Greece', value: 'Greece'},
    {label: 'Greenland', value: 'Greenland'},
    {label: 'Grenada', value: 'Grenada'},
    {label: 'Guadeloupe', value: 'Guadeloupe'},
    {label: 'Guam', value: 'Guam'},
    {label: 'Guatemala', value: 'Guatemala'},
    {label: 'Guernsey', value: 'Guernsey'},
    {label: 'Guinea', value: 'Guinea'},
    {label: 'Guinea-Bissau', value: 'Guinea-Bissau'},
    {label: 'Guyana', value: 'Guyana'},
    {label: 'Haiti', value: 'Haiti'},
    {
        label: 'Heard Island and McDonald Islands',
        value: 'Heard Island and McDonald Islands',
    },
    {label: 'Holy See (the)', value: 'Holy See (the)'},
    {label: 'Honduras', value: 'Honduras'},
    {label: 'Hong Kong', value: 'Hong Kong'},
    {label: 'Hungary', value: 'Hungary'},
    {label: 'Iceland', value: 'Iceland'},
    {label: 'India', value: 'India'},
    {label: 'Indonesia', value: 'Indonesia'},
    {label: 'Iran (Islamic Republic of)', value: 'Iran (Islamic Republic of)'},
    {label: 'Iraq', value: 'Iraq'},
    {label: 'Ireland', value: 'Ireland'},
    {label: 'Isle of Man', value: 'Isle of Man'},
    {label: 'Israel', value: 'Israel'},
    {label: 'Italy', value: 'Italy'},
    {label: 'Jamaica', value: 'Jamaica'},
    {label: 'Japan', value: 'Japan'},
    {label: 'Jersey', value: 'Jersey'},
    {label: 'Jordan', value: 'Jordan'},
    {label: 'Kazakhstan', value: 'Kazakhstan'},
    {label: 'Kenya', value: 'Kenya'},
    {label: 'Kiribati', value: 'Kiribati'},
    {
        label: "Korea (the Democratic People's Republic of)",
        value: "Korea (the Democratic People's Republic of)",
    },
    {label: 'Korea (the Republic of)', value: 'Korea (the Republic of)'},
    {label: 'Kuwait', value: 'Kuwait'},
    {label: 'Kyrgyzstan', value: 'Kyrgyzstan'},
    {
        label: "Lao People's Democratic Republic (the)",
        value: "Lao People's Democratic Republic (the)",
    },
    {label: 'Latvia', value: 'Latvia'},
    {label: 'Lebanon', value: 'Lebanon'},
    {label: 'Lesotho', value: 'Lesotho'},
    {label: 'Liberia', value: 'Liberia'},
    {label: 'Libya', value: 'Libya'},
    {label: 'Liechtenstein', value: 'Liechtenstein'},
    {label: 'Lithuania', value: 'Lithuania'},
    {label: 'Luxembourg', value: 'Luxembourg'},
    {label: 'Macao', value: 'Macao'},
    {label: 'Madagascar', value: 'Madagascar'},
    {label: 'Malawi', value: 'Malawi'},
    {label: 'Malaysia', value: 'Malaysia'},
    {label: 'Maldives', value: 'Maldives'},
    {label: 'Mali', value: 'Mali'},
    {label: 'Malta', value: 'Malta'},
    {label: 'Marshall Islands (the)', value: 'Marshall Islands (the)'},
    {label: 'Martinique', value: 'Martinique'},
    {label: 'Mauritania', value: 'Mauritania'},
    {label: 'Mauritius', value: 'Mauritius'},
    {label: 'Mayotte', value: 'Mayotte'},
    {label: 'Mexico', value: 'Mexico'},
    {
        label: 'Micronesia (Federated States of)',
        value: 'Micronesia (Federated States of)',
    },
    {label: 'Moldova (the Republic of)', value: 'Moldova (the Republic of)'},
    {label: 'Monaco', value: 'Monaco'},
    {label: 'Mongolia', value: 'Mongolia'},
    {label: 'Montenegro', value: 'Montenegro'},
    {label: 'Montserrat', value: 'Montserrat'},
    {label: 'Morocco', value: 'Morocco'},
    {label: 'Mozambique', value: 'Mozambique'},
    {label: 'Myanmar', value: 'Myanmar'},
    {label: 'Namibia', value: 'Namibia'},
    {label: 'Nauru', value: 'Nauru'},
    {label: 'Nepal', value: 'Nepal'},
    {label: 'Netherlands (the)', value: 'Netherlands (the)'},
    {label: 'New Caledonia', value: 'New Caledonia'},
    {label: 'New Zealand', value: 'New Zealand'},
    {label: 'Nicaragua', value: 'Nicaragua'},
    {label: 'Niger (the)', value: 'Niger (the)'},
    {label: 'Nigeria', value: 'Nigeria'},
    {label: 'Niue', value: 'Niue'},
    {label: 'Norfolk Island', value: 'Norfolk Island'},
    {
        label: 'Northern Mariana Islands (the)',
        value: 'Northern Mariana Islands (the)',
    },
    {label: 'Norway', value: 'Norway'},
    {label: 'Oman', value: 'Oman'},
    {label: 'Pakistan', value: 'Pakistan'},
    {label: 'Palau', value: 'Palau'},
    {label: 'Palestine,tate of', value: 'Palestine,tate of'},
    {label: 'Panama', value: 'Panama'},
    {label: 'Papua New Guinea', value: 'Papua New Guinea'},
    {label: 'Paraguay', value: 'Paraguay'},
    {label: 'Peru', value: 'Peru'},
    {label: 'Philippines (the)', value: 'Philippines (the)'},
    {label: 'Pitcairn', value: 'Pitcairn'},
    {label: 'Poland', value: 'Poland'},
    {label: 'Portugal', value: 'Portugal'},
    {label: 'Puerto Rico', value: 'Puerto Rico'},
    {label: 'Qatar', value: 'Qatar'},
    {
        label: 'Republic of North Macedonia',
        value: 'Republic of North Macedonia',
    },
    {label: 'Romania', value: 'Romania'},
    {label: 'Russian Federation (the)', value: 'Russian Federation (the)'},
    {label: 'Rwanda', value: 'Rwanda'},
    {label: 'Réunion', value: 'Réunion'},
    {label: 'Saint Barthélemy', value: 'Saint Barthélemy'},
    {
        label: 'Saint Helena,scension and Tristan da Cunha',
        value: 'Saint Helena,scension and Tristan da Cunha',
    },
    {label: 'Saint Kitts and Nevis', value: 'Saint Kitts and Nevis'},
    {label: 'Saint Lucia', value: 'Saint Lucia'},
    {label: 'Saint Martin (French part)', value: 'Saint Martin (French part)'},
    {label: 'Saint Pierre and Miquelon', value: 'Saint Pierre and Miquelon'},
    {
        label: 'Saint Vincent and the Grenadines',
        value: 'Saint Vincent and the Grenadines',
    },
    {label: 'Samoa', value: 'Samoa'},
    {label: 'San Marino', value: 'San Marino'},
    {label: 'Sao Tome and Principe', value: 'Sao Tome and Principe'},
    {label: 'Saudi Arabia', value: 'Saudi Arabia'},
    {label: 'Senegal', value: 'Senegal'},
    {label: 'Serbia', value: 'Serbia'},
    {label: 'Seychelles', value: 'Seychelles'},
    {label: 'Sierra Leone', value: 'Sierra Leone'},
    {label: 'Singapore', value: 'Singapore'},
    {label: 'Sint Maarten (Dutch part)', value: 'Sint Maarten (Dutch part)'},
    {label: 'Slovakia', value: 'Slovakia'},
    {label: 'Slovenia', value: 'Slovenia'},
    {label: 'Solomon Islands', value: 'Solomon Islands'},
    {label: 'Somalia', value: 'Somalia'},
    {label: 'South Africa', value: 'South Africa'},
    {
        label: 'South Georgia and the South Sandwich Islands',
        value: 'South Georgia and the South Sandwich Islands',
    },
    {label: 'South Sudan', value: 'South Sudan'},
    {label: 'Spain', value: 'Spain'},
    {label: 'Sri Lanka', value: 'Sri Lanka'},
    {label: 'Sudan (the)', value: 'Sudan (the)'},
    {label: 'Suriname', value: 'Suriname'},
    {label: 'Svalbard and Jan Mayen', value: 'Svalbard and Jan Mayen'},
    {label: 'Sweden', value: 'Sweden'},
    {label: 'Switzerland', value: 'Switzerland'},
    {label: 'Syrian Arab Republic', value: 'Syrian Arab Republic'},
    {label: 'Taiwan', value: 'Taiwan'},
    {label: 'Tajikistan', value: 'Tajikistan'},
    {label: 'Tanzania,nited Republic of', value: 'Tanzania,nited Republic of'},
    {label: 'Thailand', value: 'Thailand'},
    {label: 'Timor-Leste', value: 'Timor-Leste'},
    {label: 'Togo', value: 'Togo'},
    {label: 'Tokelau', value: 'Tokelau'},
    {label: 'Tonga', value: 'Tonga'},
    {label: 'Trinidad and Tobago', value: 'Trinidad and Tobago'},
    {label: 'Tunisia', value: 'Tunisia'},
    {label: 'Turkey', value: 'Turkey'},
    {label: 'Turkmenistan', value: 'Turkmenistan'},
    {
        label: 'Turks and Caicos Islands (the)',
        value: 'Turks and Caicos Islands (the)',
    },
    {label: 'Tuvalu', value: 'Tuvalu'},
    {label: 'Uganda', value: 'Uganda'},
    {label: 'Ukraine', value: 'Ukraine'},
    {label: 'United Arab Emirates (the)', value: 'United Arab Emirates (the)'},
    {label: 'United Kingdom', value: 'United Kingdom'},
    {label: 'United States', value: 'United States'},
    {label: 'Uruguay', value: 'Uruguay'},
    {label: 'Uzbekistan', value: 'Uzbekistan'},
    {label: 'Vanuatu', value: 'Vanuatu'},
    {
        label: 'Venezuela (Bolivarian Republic of)',
        value: 'Venezuela (Bolivarian Republic of)',
    },
    {label: 'Vietnam', value: 'Vietnam'},
    {label: 'Virgin Islands (British)', value: 'Virgin Islands (British)'},
    {label: 'Virgin Islands (U.S.)', value: 'Virgin Islands (U.S.)'},
    {label: 'Wallis and Futuna', value: 'Wallis and Futuna'},
    {label: 'Western Sahara', value: 'Western Sahara'},
    {label: 'Yemen', value: 'Yemen'},
    {label: 'Zambia', value: 'Zambia'},
    {label: 'Zimbabwe', value: 'Zimbabwe'},
    {label: 'Åland Islands', value: 'Åland Islands'},
];

const Login = ({
    navigation,
}: NativeStackScreenProps<AuthStackParamList, 'SignUp'>) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [surname, setSurname] = useState('');
    const [dob, setDob] = useState<Date | undefined>();
    const [gender, setGender] = useState('');
    const [country, setCountry] = useState('');
    const [dateModal, setDateModal] = useState(false);
    const [isSigningUp, setIsSigningUp] = useState(false);

    const signUp = async () => {
        setIsSigningUp(true);
        try {
            if (!username) {
                throw new Error('No username entered');
            }

            if (!email) {
                throw new Error('No email entered');
            }

            if (password.length < 8) {
                throw new Error(
                    'Password must be at least 8 characters in length',
                );
            }

            if (password !== confPassword) {
                throw new Error('Passwords do not match');
            }

            if (!firstName || !surname) {
                throw new Error('No name entered');
            }

            if (!dob) {
                throw new Error('No date of birth entered');
            }

            if (!country) {
                throw new Error('No country entered');
            }

            await Auth.signUp({
                username: username,
                password: password,
                attributes: {
                    email: email,
                    birthdate: dayjs(dob).format('YYYY-MM-DD'),
                    gender: gender,
                    given_name: firstName,
                    family_name: surname,
                    locale: country,
                },
            });

            setIsSigningUp(false);
            navigation.push('Verify', {username, password, sendOnLoad: false});
        } catch (err: any) {
            showMessage({
                message: err.message,
                type: 'danger',
                position: 'bottom',
            });

            setIsSigningUp(false);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
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
                        Usernames must be unique, and between 3 and 24
                        characters.
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
                    <Text style={styles.textInputHint}>
                        Emails are used for password recovery. We will not send
                        you spam.
                    </Text>
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
                        <Pressable
                            style={styles.textInput}
                            onPress={() => {
                                setDateModal(true);
                            }}>
                            <Text style={{...styles.textInput, marginLeft: 0}}>
                                {dob
                                    ? dob.toISOString().split('T')[0]
                                    : 'Date of birth'}
                            </Text>
                        </Pressable>
                    </View>
                    <Text style={styles.textInputHint}>
                        You must be at least 16 years of age to use this app.
                    </Text>

                    <View style={styles.inputContainer}>
                        <Icon name="transgender" size={17} />
                        <RNPickerSelect
                            onValueChange={setGender}
                            placeholder={{
                                label: 'Select gender...',
                                value: null,
                            }}
                            style={{
                                inputIOS: styles.textInput,
                                inputAndroid: styles.textInput,
                            }}
                            items={[
                                {label: 'Male', value: 'male'},
                                {label: 'Female', value: 'female'},
                                {label: 'Other', value: 'other'},
                            ]}
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Icon name="globe" size={17} />
                        <RNPickerSelect
                            onValueChange={setCountry}
                            placeholder={{
                                label: 'Select country...',
                                value: null,
                            }}
                            style={{
                                inputIOS: styles.textInput,
                                inputAndroid: styles.textInput,
                            }}
                            items={countries}
                        />
                    </View>

                    <Pressable
                        style={styles.signUpButton}
                        onPress={signUp}
                        disabled={isSigningUp}>
                        {!isSigningUp ? (
                            <Text style={styles.signUpButtonText}>
                                Create Account
                            </Text>
                        ) : (
                            <Text>
                                <CircleSnail
                                    indeterminate={true}
                                    color="#F3FCF0"
                                    size={29}
                                    style={styles.signUpButtonSpinner}
                                />
                            </Text>
                        )}
                    </Pressable>
                </View>

                <DatePicker
                    modal
                    open={dateModal}
                    maximumDate={new Date()}
                    mode="date"
                    onConfirm={date => {
                        setDateModal(false);
                        setDob(date);
                    }}
                    onCancel={() => {
                        setDateModal(false);
                    }}
                    date={dob || new Date()}
                />
            </ScrollView>
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
        marginTop: 15,
        backgroundColor: '#E76F51',
        justifyContent: 'center',
        borderRadius: 25,
        width: '100%',
        flexDirection: 'row',
    },
    signUpButtonText: {
        color: '#F3FCF0',
        margin: 10,
        fontSize: 14,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    signUpButtonSpinner: {
        paddingVertical: 5,
        justifySelf: 'center',
        alignSelf: 'center',
    },
});

export default Login;
