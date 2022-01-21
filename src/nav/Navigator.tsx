import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useAppSelector} from '@/store/hooks';

import Home from '@/screens/Home';
import HomeAuth from '@/screens/Auth/HomeAuth';
import Login from '@/screens/Auth/Login';
import SignUp from '@/screens/Auth/SignUp';
import Verify from '@/screens/Auth/Verify';

export type AuthStackParamList = {
    HomeAuth: undefined;
    Login: undefined;
    SignUp: undefined;
    Verify: {
        username: string;
        password: string;
        sendOnLoad: boolean;
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
                    }}
                />
                <Stack.Screen
                    name="SignUp"
                    component={SignUp}
                    options={{
                        headerShown: false,
                    }}
                />
                <Stack.Screen
                    name="Verify"
                    component={Verify}
                    options={{
                        headerShown: false,
                    }}
                />
            </Stack.Navigator>
        );
    }

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
        </Tab.Navigator>
    );
};

export default Navigator;
