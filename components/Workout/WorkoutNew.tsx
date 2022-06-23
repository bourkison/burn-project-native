import {ExerciseReference} from '@/types/exercise';
import {RecordedExercise} from '@/types/workout';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import ExerciseSearchModal from '../Exercise/ExerciseSearchModal';
import AnimatedButton from '../Utility/AnimatedButton';

const WorkoutNew = () => {
    const [exerciseSearchModal, setExerciseSearchModal] = useState(false);
    const [exercises, setExercises] = useState<RecordedExercise[]>([]);

    const addExerciseButton = () => {
        console.log('Add Exercise.');
        setExerciseSearchModal(true);
    };

    const addExercise = (e: ExerciseReference) => {
        setExercises(arr => [
            ...arr,
            {
                exerciseReference: e,
                notes: '',
                options: {
                    measureBy: 'reps',
                    weightUnit: 'kg',
                },
                sets: [
                    {
                        weightAmount: 0,
                        measureAmount: 0,
                        measureBy: 'reps',
                    },
                ],
            },
        ]);
    };

    return (
        <View>
            <ExerciseSearchModal
                visible={exerciseSearchModal}
                setVisible={setExerciseSearchModal}
                addExercise={addExercise}
            />
            <Text style={styles.content}>CONTENT.</Text>
            {exercises.map(e => {
                return (
                    <Text style={{color: '#f3fcf0'}}>
                        {e.exerciseReference.name}
                    </Text>
                );
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
