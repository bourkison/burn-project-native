import ExerciseFeed from '@/components/Exercise/ExerciseFeed';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';

const ExerciseHome = () => {
    return (
        <SafeAreaView style={styles.container}>
            <ExerciseFeed />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
    },
});

export default ExerciseHome;
