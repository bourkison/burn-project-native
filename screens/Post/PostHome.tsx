import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

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
        <SafeAreaView style={styles.container}>
            <PostFeed />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
    },
});

export default Home;
