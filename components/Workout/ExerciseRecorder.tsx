import React, {useCallback} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SetRecorder from './SetRecorder';
import AnimatedButton from '@/components/Utility/AnimatedButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {ADD_SET, REMOVE_SET} from '@/store/slices/activeWorkout';

type ExerciseRecorderProps = {
    index: number;
};

const ExerciseRecorder: React.FC<ExerciseRecorderProps> = ({index}) => {
    const dispatch = useAppDispatch();
    const exercise = useAppSelector(
        state => state.activeWorkout.exercises[index],
    );

    const addSet = () => {
        dispatch(
            ADD_SET({
                index: index,
                set: exercise.sets[exercise.sets.length - 1],
            }),
        );
    };

    const deleteSet = useCallback(
        (i: number) => {
            dispatch(REMOVE_SET({index: i, exerciseIndex: index}));
        },
        [dispatch, index],
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{exercise.exerciseReference.name}</Text>
            <View style={styles.setContainer}>
                {exercise.sets.map((set, i) => {
                    return (
                        <SetRecorder
                            index={i}
                            key={set.uid}
                            set={set}
                            onDismiss={deleteSet}
                        />
                    );
                })}
            </View>
            <View>
                <AnimatedButton
                    style={styles.addSetButton}
                    textStyle={styles.addSetButtonText}
                    onPress={addSet}>
                    Add Set
                </AnimatedButton>
            </View>
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
    setContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        alignContent: 'flex-start',
    },
    title: {
        color: '#f3fcf0',
        fontWeight: 'bold',
    },
    addSetButton: {
        width: '90%',
        backgroundColor: '#ce3b54',
        borderRadius: 5,
        alignSelf: 'center',
    },
    addSetButtonText: {
        color: '#f3fcf0',
        fontSize: 10,
        paddingVertical: 4,
        alignSelf: 'center',
        fontWeight: 'bold',
    },
});

export default ExerciseRecorder;
