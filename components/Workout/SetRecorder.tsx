import {useAppDispatch} from '@/store/hooks';
import {UPDATE_SET} from '@/store/slices/activeWorkout';
import {RecordedSet} from '@/types/workout';
import React, {useState} from 'react';
import {StyleSheet, View, TextInput, Pressable} from 'react-native';
import {Text} from 'react-native-elements';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import Animated, {
    Easing,
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
} from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/FontAwesome5';

type SetRecorderProps = {
    index: number;
    onDismiss: (i: number) => void;
    set: RecordedSet;
    exerciseIndex: number;
};

const SET_HEIGHT = 32;
const DELETE_OFFSET = 100;

const SetRecorder: React.FC<SetRecorderProps> = ({
    index,
    onDismiss,
    set,
    exerciseIndex,
}) => {
    const dispatch = useAppDispatch();

    const [width, setWidth] = useState(0); // Element width, used for calculating delete slide.
    const [completed, setCompleted] = useState(false);

    const sContTranslateX = useSharedValue(0);
    const sContScaleX = useSharedValue(1);
    const sDelTranslateX = useSharedValue(DELETE_OFFSET);
    const sHeight = useSharedValue(SET_HEIGHT);
    const isDeleting = useSharedValue(false);

    const context = useSharedValue(0);

    const rContStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: sContTranslateX.value,
                },
                {
                    scaleX: sContScaleX.value,
                },
            ],
            height: sHeight.value,
        };
    });

    const rDelStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: sDelTranslateX.value,
                },
            ],
            height: sHeight.value,
        };
    });

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = sContTranslateX.value;
        })
        .onUpdate(e => {
            let v = e.translationX + context.value;

            // Prevent right swipe.
            if (v > 0) {
                sContTranslateX.value = 0;
                sDelTranslateX.value = DELETE_OFFSET;
            }
            // Snap to delete.
            else if (v < -width / 2 && !isDeleting.value) {
                isDeleting.value = true;

                sContTranslateX.value = withTiming(
                    Math.floor((-width / 8) * 7),
                    {
                        duration: 300,
                        easing: Easing.bezier(0.25, 1, 0.25, 1),
                    },
                );

                // TODO: Add a vibrate.
            }
            // Prevent deleting if right swipe.
            else if (isDeleting.value && v > -width / 2 + 1) {
                isDeleting.value = false;

                sContTranslateX.value = withTiming(-width / 2 + 1, {
                    duration: 300,
                    easing: Easing.bezier(0.25, 1, 0.25, 1),
                });
            }
            // Else run normally.
            else if (!isDeleting.value) {
                sContTranslateX.value = e.translationX + context.value;

                let delVal = e.translationX + context.value + DELETE_OFFSET;

                if (delVal < 0) {
                    delVal = 0;
                }

                sDelTranslateX.value = delVal;
            }
        })
        .onEnd(() => {
            if (isDeleting.value) {
                // Run delete animation then remove from store.
                sContTranslateX.value = withTiming(
                    -width,
                    {
                        duration: 300,
                        easing: Easing.bezier(0.25, 1, 0.25, 1),
                    },
                    () => {
                        sHeight.value = withTiming(
                            0,
                            {
                                duration: 300,
                                easing: Easing.bezier(0.25, 1, 0.25, 1),
                            },
                            () => {
                                runOnJS(onDismiss)(index);
                            },
                        );
                    },
                );
            } else {
                sContTranslateX.value = withSpring(0);
                sDelTranslateX.value = 100;
                isDeleting.value = false;
            }
        });

    const updateWeight = (e: string) => {
        dispatch(
            UPDATE_SET({
                exerciseIndex: exerciseIndex,
                index: index,
                key: 'weightAmount',
                value: e,
            }),
        );
    };

    const updateMeasure = (e: string) => {
        dispatch(
            UPDATE_SET({
                exerciseIndex: exerciseIndex,
                index: index,
                key: 'measureAmount',
                value: e,
            }),
        );
    };

    const toggleCompleted = (v: boolean) => {
        setCompleted(v);

        if (v) {
            sContScaleX.value = withTiming(
                1.1,
                {
                    duration: 75,
                },
                () => {
                    sContScaleX.value = withTiming(1, {
                        duration: 75,
                    });
                },
            );
        }
    };

    return (
        <View
            style={styles.container}
            onLayout={e => {
                setWidth(e.nativeEvent.layout.width);
            }}>
            <Animated.View style={[rDelStyle, styles.deleteContainer]}>
                <Text style={styles.deleteText}>Delete</Text>
            </Animated.View>
            <GestureDetector gesture={panGesture}>
                <Animated.View style={[rContStyle, styles.inputContainer]}>
                    <View style={styles.column}>
                        <Text style={styles.text}>{index + 1}</Text>
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            keyboardType="decimal-pad"
                            defaultValue={set.weightAmount.toString()}
                            autoComplete="off"
                            autoCorrect={false}
                            placeholderTextColor="#97A5B6"
                            placeholder="Weight"
                            style={styles.textInput}
                            onChangeText={updateWeight}
                            selectTextOnFocus={true}
                            contextMenuHidden={true}
                        />
                    </View>
                    <View style={styles.column}>
                        <TextInput
                            keyboardType="decimal-pad"
                            defaultValue={set.measureAmount.toString()}
                            autoComplete="off"
                            autoCorrect={false}
                            placeholderTextColor="#97A5B6"
                            placeholder="Reps"
                            style={styles.textInput}
                            onChangeText={updateMeasure}
                            selectTextOnFocus={true}
                            contextMenuHidden={true}
                        />
                    </View>
                    <View style={styles.column}>
                        <Pressable
                            onPress={() => {
                                toggleCompleted(!completed);
                            }}
                            style={styles.checkbox}>
                            <Icon name="check" size={12} color="#f3fcf0" />
                        </Pressable>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        overflow: 'hidden',
        marginVertical: 2,
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1F25',
    },
    deleteContainer: {
        height: '100%',
        width: '100%',
        position: 'absolute',
        backgroundColor: 'red',
        alignItems: 'flex-end',
        justifyContent: 'center',
    },
    deleteText: {
        color: '#f3fcf0',
    },
    column: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    text: {
        color: '#f3fcf0',
    },
    textInput: {
        marginHorizontal: '2%',
        backgroundColor: '#343E4B',
        color: '#f3fcf0',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        fontSize: 12,
    },
    checkbox: {
        backgroundColor: '#343E4B',
        borderRadius: 3,
        padding: 2,
    },
});

export default SetRecorder;
