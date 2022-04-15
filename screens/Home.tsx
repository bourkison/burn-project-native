import React from 'react';
import {Text, SafeAreaView, Button} from 'react-native';

import {useAppSelector, useAppDispatch} from '@/store/hooks';
import {logout as logoutThunk} from '@/store/slices/user';
import PostFeed from '@/components/Post/PostFeed';

const Home = () => {
    const loggedInName = useAppSelector(state => state.user.docData?.firstName);
    const dispatch = useAppDispatch();
    const logout = () => {
        dispatch(logoutThunk());
    };

    return (
        <SafeAreaView>
            <Text>Welcome, {loggedInName}</Text>
            <Button title="Logout" onPress={logout} />
            <PostFeed />
        </SafeAreaView>
    );
};

export default Home;
