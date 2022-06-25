import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {ADD_EXERCISE} from '@/store/slices/activeWorkout';
import {ExerciseReference} from '@/types/exercise';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import ExerciseSearchModal from '../Exercise/ExerciseSearchModal';
import AnimatedButton from '../Utility/AnimatedButton';
import ExerciseRecorder from './ExerciseRecorder';

const WorkoutNew = () => {
    const [exerciseSearchModal, setExerciseSearchModal] = useState(false);

    const dispatch = useAppDispatch();
    const exercises = useAppSelector(state => state.activeWorkout.exercises);

    const addExerciseButton = () => {
        console.log('Add Exercise.');
        setExerciseSearchModal(true);
    };

    const addExercise = (e: ExerciseReference) => {
        dispatch(ADD_EXERCISE(e));
    };

    return (
        <View style={styles.container}>
            <ExerciseSearchModal
                visible={exerciseSearchModal}
                setVisible={setExerciseSearchModal}
                addExercise={addExercise}
            />
            <ScrollView>
                <View style={styles.exercisesContainer}>
                    {exercises.map((e, i) => {
                        return <ExerciseRecorder index={i} key={i} />;
                    })}
                </View>
                <View style={styles.buttonCont}>
                    <AnimatedButton
                        onPress={addExerciseButton}
                        style={styles.addExerciseButton}
                        textStyle={styles.addExerciseButtonText}>
                        Add Exercise
                    </AnimatedButton>
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
        flexDirection: 'column',
        alignItems: 'stretch',
        flex: 1,
    },
    content: {
        color: '#f3fcf0',
        fontSize: 80,
    },
    exercisesContainer: {
        alignItems: 'stretch',
        flexDirection: 'column',
    },
    buttonCont: {
        paddingHorizontal: 20,
    },
    addExerciseButton: {
        backgroundColor: '#f3fcf0',
        marginTop: 20,
        height: 30,
        width: '100%',
        borderRadius: 5,
    },
    addExerciseButtonText: {
        color: 'black',
        textAlign: 'center',
    },
});

export default WorkoutNew;
