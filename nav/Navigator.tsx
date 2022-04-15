import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useAppSelector} from '@/store/hooks';

import Home from '@/screens/Home';
import HomeAuth from '@/screens/Auth/HomeAuth';
import Login from '@/screens/Auth/Login';
import Verify from '@/screens/Auth/Verify';
import UsernameInput from '@/screens/Auth/SignUp/UsernameInput';
import DobInput from '@/screens/Auth/SignUp/DobInput';
import OtherInput from '@/screens/Auth/SignUp/OtherInput';
import PasswordInput from '@/screens/Auth/SignUp/PasswordInput';

export type AuthStackParamList = {
    HomeAuth: undefined;
    Login: undefined;
    Verify: {
        username: string;
        password: string;
        sendOnLoad: boolean;
    };
    UsernameInput: undefined;
    DobInput: {
        username: string;
        firstName: string;
        surname: string;
    };
    OtherInput: {
        username: string;
        firstName: string;
        surname: string;
        dob: Date;
        country: string;
    };
    PasswordInput: {
        username: string;
        firstName: string;
        surname: string;
        dob: Date;
        country: string;
        gender: string;
        metric: boolean;
        weight: number;
        height: number;
    };
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator();

const Navigator = () => {
    const loggedIn = useAppSelector(state => state.user.loggedIn);

    if (!loggedIn) {
        return (
            <Stack.Navigator initialRouteName="HomeAuth">
                <Stack.Screen
                    name="HomeAuth"
                    component={HomeAuth}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{
                        headerShown: false,
                        presentation: 'transparentModal',
                        animation: 'slide_from_bottom',
                    }}
                />
                <Stack.Screen
                    name="Verify"
                    component={Verify}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="UsernameInput"
                    component={UsernameInput}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="DobInput"
                    component={DobInput}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="OtherInput"
                    component={OtherInput}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
                <Stack.Screen
                    name="PasswordInput"
                    component={PasswordInput}
                    options={{
                        headerShown: false,
                        animation: 'slide_from_right',
                    }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <Tab.Navigator sceneContainerStyle={styles.loggedInContainer}>
            <Tab.Screen
                name="Home"
                component={Home}
                options={{
                    headerStyle: styles.loggedInContainer,
                    headerTitleStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarStyle: styles.loggedInContainer,
                }}
            />
        </Tab.Navigator>
    );
};

const styles = {
    loggedInContainer: {
        backgroundColor: '#3F4C5B',
        borderTopColor: '#f3fcf0',
        shadowColor: '#f3fcf0',
    },
};

export default Navigator;
