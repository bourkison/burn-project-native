import ExerciseFeed from '@/components/Exercise/ExerciseFeed';
import React from 'react';
import {SafeAreaView} from 'react-native-safe-area-context';

const ExerciseHome = () => {
    return (
        <SafeAreaView>
            <ExerciseFeed />
        </SafeAreaView>
    );
};

export default ExerciseHome;
