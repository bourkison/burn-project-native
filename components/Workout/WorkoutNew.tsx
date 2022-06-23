import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {ADD_EXERCISE} from '@/store/slices/activeWorkout';
import {ExerciseReference} from '@/types/exercise';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
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
            <Text style={styles.content}>CONTENT</Text>
            {exercises.map(e => {
                return <ExerciseRecorder exercise={e} />;
            })}
            <View style={styles.buttonCont}>
                <AnimatedButton
                    onPress={addExerciseButton}
                    style={styles.addExerciseButton}
                    textStyle={styles.addExerciseButtonText}>
                    Add Exercise
                </AnimatedButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 10,
    },
    content: {
        color: '#f3fcf0',
        fontSize: 80,
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
