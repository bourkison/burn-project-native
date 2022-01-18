import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {useAppSelector} from '@/store/hooks';

import Home from '@/screens/Home';
import Login from '@/screens/Login';

const Tab = createBottomTabNavigator();

const Navigator = () => {
    const loggedIn = useAppSelector(state => state.user.loggedIn);

    if (!loggedIn) {
        return <Login />;
    }

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
        </Tab.Navigator>
    );
};

export default Navigator;
