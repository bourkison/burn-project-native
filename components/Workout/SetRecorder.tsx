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

    const touchStart = useSharedValue({x: 0, y: 0, context: 0});

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
        .manualActivation(true)
        .onTouchesDown(e => {
            touchStart.value = {
                x: e.changedTouches[0].absoluteX,
                y: e.changedTouches[0].absoluteY,
                context: sContTranslateX.value,
            };
        })
        .onTouchesMove((e, state) => {
            // Check the difference in X is greater than the distance in Y (and thus user is swiping left to right).
            if (
                Math.abs(e.changedTouches[0].absoluteX - touchStart.value.x) >
                Math.abs(e.changedTouches[0].absoluteY - touchStart.value.y)
            ) {
                state.activate();
            } else {
                state.fail();
            }
        })
        .onUpdate(e => {
            let v = e.translationX + touchStart.value.context;

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
                sContTranslateX.value =
                    e.translationX + touchStart.value.context;

                let delVal =
                    e.translationX + touchStart.value.context + DELETE_OFFSET;

                if (delVal < 0) {
                    delVal = 0;
                }

                sDelTranslateX.value = delVal;
            }
        })
        .onEnd(e => {
            // State === 5 when active
            if (isDeleting.value && e.state === 5) {
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
                1.05,
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
                <Animated.View
                    style={[
                        rContStyle,
                        !completed
                            ? styles.inputContainer
                            : {
                                  ...styles.inputContainer,
                                  ...styles.completedInputContainer,
                              },
                    ]}>
                    <View style={{...styles.column, ...styles.smallColumn}}>
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
                            style={
                                !completed
                                    ? styles.textInput
                                    : {
                                          ...styles.textInput,
                                          ...styles.completedTextInput,
                                      }
                            }
                            onChangeText={updateWeight}
                            selectTextOnFocus={true}
                            contextMenuHidden={true}
                        />
                    </View>
                    <View style={{...styles.column, ...styles.columnBreak}} />
                    <View style={styles.column}>
                        <TextInput
                            keyboardType="decimal-pad"
                            defaultValue={set.measureAmount.toString()}
                            autoComplete="off"
                            autoCorrect={false}
                            placeholderTextColor="#97A5B6"
                            placeholder="Reps"
                            style={
                                !completed
                                    ? styles.textInput
                                    : {
                                          ...styles.textInput,
                                          ...styles.completedTextInput,
                                      }
                            }
                            onChangeText={updateMeasure}
                            selectTextOnFocus={true}
                            contextMenuHidden={true}
                        />
                    </View>
                    <View style={{...styles.column, ...styles.smallColumn}}>
                        <Pressable
                            onPress={() => {
                                toggleCompleted(!completed);
                            }}
                            style={
                                !completed
                                    ? styles.checkbox
                                    : {
                                          ...styles.checkbox,
                                          ...styles.completedCheckBox,
                                      }
                            }>
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
    },
    inputContainer: {
        flexDirection: 'row',
        backgroundColor: '#1A1F25',
    },
    completedInputContainer: {
        backgroundColor: 'rgba(42, 157, 143, 1)',
        paddingVertical: 2,
    },
    deleteContainer: {
        position: 'absolute',
        height: '100%',
        width: '100%',
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
    smallColumn: {
        flexBasis: 40,
        flexGrow: 0,
    },
    columnBreak: {
        flexBasis: 10,
        flexGrow: 0,
    },
    text: {
        color: '#f3fcf0',
    },
    textInput: {
        marginHorizontal: 12,
        backgroundColor: '#343E4B',
        color: '#f3fcf0',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        marginVertical: 2,
        fontSize: 12,
        fontWeight: 'bold',
        lineHeight: 16,
        flex: 1,
        width: '100%',
        textAlign: 'center',
    },
    completedTextInput: {
        backgroundColor: 'transparent',
        borderColor: 'transparent',
    },
    checkbox: {
        backgroundColor: '#343E4B',
        borderRadius: 3,
        padding: 2,
    },
    completedCheckBox: {
        shadowColor: '#f3fcf0',
        shadowOffset: {
            height: 1,
            width: 1,
        },
        shadowOpacity: 0.9,
        elevation: 4,
    },
});

export default SetRecorder;
