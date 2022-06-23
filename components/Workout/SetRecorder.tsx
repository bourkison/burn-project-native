import {useAppDispatch} from '@/store/hooks';
import {REMOVE_SET} from '@/store/slices/activeWorkout';
import {RecordedSet} from '@/types/workout';
import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
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

type SetRecorderProps = {
    set: RecordedSet;
    index: number;
    exerciseIndex: number;
};

const SET_HEIGHT = 32;
const DELETE_OFFSET = 100;

const SetRecorder: React.FC<SetRecorderProps> = ({
    set,
    index,
    exerciseIndex,
}) => {
    const dispatch = useAppDispatch();

    const [width, setWidth] = useState(0); // Element width, used for calculating delete slide.

    const sContTranslateX = useSharedValue(0);
    const sHeight = useSharedValue(SET_HEIGHT);
    const sDelTranslateX = useSharedValue(DELETE_OFFSET);
    const isDeleting = useSharedValue(false);

    const context = useSharedValue(0);

    const rContStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    translateX: sContTranslateX.value,
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

    const deleteSet = () => {
        dispatch(REMOVE_SET({index, exerciseIndex}));

        // Reset values.
        sContTranslateX.value = 0;
        sHeight.value = SET_HEIGHT;
        sDelTranslateX.value = DELETE_OFFSET;
        isDeleting.value = false;
        context.value = 0;
    };

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
                console.log('DELETE!');

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
                                runOnJS(deleteSet)();
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
                        <Text style={styles.text}>{index}</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.text}>{set.measureAmount}</Text>
                    </View>
                </Animated.View>
            </GestureDetector>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        flex: 1,
        overflow: 'hidden',
        flexBasis: SET_HEIGHT,
    },
    inputContainer: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: '#1A1F25',
    },
    deleteContainer: {
        height: SET_HEIGHT,
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
    },
    text: {
        color: '#f3fcf0',
    },
});

export default SetRecorder;
