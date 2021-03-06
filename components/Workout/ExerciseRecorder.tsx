import React, {ComponentProps, useCallback, ReactElement} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import SetRecorder from './SetRecorder';
import AnimatedButton from '@/components/Utility/AnimatedButton';
import {useAppDispatch, useAppSelector} from '@/store/hooks';
import {ADD_SET, REMOVE_SET} from '@/store/slices/activeWorkout';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {GestureDetector} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';
import ExercisePopover from './ExercisePopover';

export type ExerciseRecorderProps = {
    index: number;
    gesture?: ReactElement<ComponentProps<typeof GestureDetector>>;
};

const ExerciseRecorder: React.FC<ExerciseRecorderProps> = ({
    index,
    gesture,
}) => {
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

    const header = (
        <View style={styles.headerContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>
                    {exercise.exerciseReference.name}
                </Text>
            </View>

            <View style={styles.popoverContainer}>
                <ExercisePopover />
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            {gesture
                ? React.cloneElement<ComponentProps<typeof GestureDetector>>(
                      gesture,
                      gesture.props,
                      header,
                  )
                : header}
            <Animated.View>
                <View>
                    <View style={styles.setContainer}>
                        <View style={styles.setsHeader}>
                            <View
                                style={{
                                    ...styles.headerColumn,
                                    ...styles.smallHeaderColumn,
                                }}>
                                <Text style={styles.headerText}>#</Text>
                            </View>
                            <View style={styles.headerColumn}>
                                <Text style={styles.headerText}>Weight</Text>
                            </View>
                            <View
                                style={{
                                    ...styles.headerColumn,
                                    ...styles.headerColumnBreak,
                                }}
                            />
                            <View style={styles.headerColumn}>
                                <Text style={styles.headerText}>Reps</Text>
                            </View>
                            <View
                                style={{
                                    ...styles.headerColumn,
                                    ...styles.smallHeaderColumn,
                                }}>
                                <Icon name="check" size={12} color="#f3fcf0" />
                            </View>
                        </View>
                        {exercise.sets.map((set, i) => {
                            return (
                                <SetRecorder
                                    index={i}
                                    key={set.uid}
                                    set={set}
                                    onDismiss={deleteSet}
                                    exerciseIndex={index}
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
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 10,
        borderColor: '#f3fcf0',
        paddingVertical: 10,
        borderRadius: 3,
        backgroundColor: '#1A1F25',
        borderWidth: 1,
    },
    setContainer: {
        flexDirection: 'column',
        alignItems: 'stretch',
        flexWrap: 'nowrap',
        alignContent: 'flex-start',
        marginBottom: 5,
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        maxHeight: 32,
    },
    titleContainer: {
        flex: 1,
        alignSelf: 'flex-start',
        flexGrow: 1,
        height: '100%',
        justifyContent: 'center',
    },
    title: {
        color: '#f3fcf0',
        fontWeight: 'bold',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center',
        textAlignVertical: 'center',
    },
    popoverContainer: {
        flex: 1,
        flexBasis: 38,
        flexGrow: 0,
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
    setsHeader: {
        marginTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerColumn: {
        flex: 1,
        marginBottom: 5,
        alignItems: 'center',
    },
    smallHeaderColumn: {
        flexBasis: 40,
        flexGrow: 0,
    },
    headerColumnBreak: {
        flexBasis: 10,
        flexGrow: 0,
    },
    headerText: {
        color: '#f3fcf0',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default ExerciseRecorder;
