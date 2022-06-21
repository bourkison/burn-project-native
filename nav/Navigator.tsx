import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {useAppSelector} from '@/store/hooks';
import Icon from 'react-native-vector-icons/FontAwesome5';

import HomeAuth from '@/screens/Auth/HomeAuth';
import Login from '@/screens/Auth/Login';
import Verify from '@/screens/Auth/Verify';
import UsernameInput from '@/screens/Auth/SignUp/UsernameInput';
import DobInput from '@/screens/Auth/SignUp/DobInput';
import OtherInput from '@/screens/Auth/SignUp/OtherInput';
import PasswordInput from '@/screens/Auth/SignUp/PasswordInput';

import PostNavigator, {PostStackParamList} from '@/nav/PostNavigator';
import ExerciseNavigator, {
    ExerciseStackParamList,
} from '@/nav/ExerciseNavigator';
import {NavigatorScreenParams} from '@react-navigation/native';
import WorkoutNavigator, {WorkoutStackParamList} from '@/nav/WorkoutNavigator';

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

export type MainTabParamList = {
    Post: NavigatorScreenParams<PostStackParamList>;
    Exercise: NavigatorScreenParams<ExerciseStackParamList>;
    Workout: NavigatorScreenParams<WorkoutStackParamList>;
};

const Stack = createNativeStackNavigator<AuthStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

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
                name="Post"
                component={PostNavigator}
                options={{
                    headerStyle: styles.loggedInContainer,
                    headerTitle: 'Home',
                    headerTitleStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarStyle: styles.loggedInContainer,
                    tabBarLabelStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarLabel: 'Home',
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <Icon
                                name="home"
                                size={size}
                                color={focused ? '#f3fcf0' : '#97A5B6'}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Exercise"
                component={ExerciseNavigator}
                options={{
                    headerStyle: styles.loggedInContainer,
                    headerTitleStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarStyle: styles.loggedInContainer,
                    tabBarLabelStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <Icon
                                name="dumbbell"
                                size={size}
                                color={focused ? '#f3fcf0' : '#97A5B6'}
                            />
                        );
                    },
                }}
            />
            <Tab.Screen
                name="Workout"
                component={WorkoutNavigator}
                options={{
                    headerStyle: styles.loggedInContainer,
                    headerTitleStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarStyle: styles.loggedInContainer,
                    tabBarLabelStyle: {
                        color: '#f3fcf0',
                    },
                    tabBarIcon: ({size, focused}) => {
                        return (
                            <Icon
                                name="dumbbell"
                                size={size}
                                color={focused ? '#f3fcf0' : '#97A5B6'}
                            />
                        );
                    },
                }}
            />
        </Tab.Navigator>
    );
};

const styles = {
    loggedInContainer: {
        backgroundColor: '#1A1F25',
        borderTopColor: '#f3fcf0',
        shadowColor: '#f3fcf0',
    },
};

export default Navigator;
