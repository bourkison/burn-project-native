import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import AnimatedButton from '@/components/Utility/AnimatedButton';
import {startWorkout} from '@/store/slices/activeWorkout';
import {useAppDispatch} from '@/store/hooks';

const WorkoutHome = () => {
    const dispatch = useAppDispatch();

    const startWorkoutButton = () => {
        dispatch(startWorkout());
    };

    return (
        <SafeAreaView style={styles.container}>
            <AnimatedButton
                content="New Workout"
                style={styles.newWorkoutButton}
                textStyle={styles.newWorkoutButtonText}
                onPress={startWorkoutButton}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        flex: 1,
    },
    newWorkoutButton: {
        backgroundColor: '#29955B',
        marginHorizontal: 30,
        marginTop: 10,
        borderRadius: 5,
        height: 30,
    },
    newWorkoutButtonText: {
        color: '#f3fcf0',
    },
});

export default WorkoutHome;
