import {RecordedExercise} from '@/types/workout';
import React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type ExerciseRecorderProps = {
    exercise: RecordedExercise;
};

const ExerciseRecorder: React.FC<ExerciseRecorderProps> = ({exercise}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>{exercise.exerciseReference.name}</Text>
            {exercise.sets.map(set => {
                return (
                    <View>
                        <Text>{set.measureAmount}</Text>
                    </View>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        borderColor: '#f3fcf0',
        padding: 10,
        borderRadius: 3,
        borderWidth: 1,
    },
    title: {
        color: '#f3fcf0',
        fontWeight: 'bold',
    },
});

export default ExerciseRecorder;
