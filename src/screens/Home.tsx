import React from 'react';
import {Text} from 'react-native';

import {useAppSelector} from '../store/hooks';
import Login from './Login';

const Home = () => {
    const loggedIn = useAppSelector(state => state.user.loggedIn);
    const loggedInName = useAppSelector(state => state.user.docData?.firstName);

    if (!loggedIn) {
        return <Login />;
    }

    return <Text>Welcome, {loggedInName}</Text>;
};

export default Home;
