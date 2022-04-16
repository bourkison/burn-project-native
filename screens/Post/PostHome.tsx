import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

import PostFeed from '@/components/Post/PostFeed';

const Home = () => {
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
