import React, {useState, useEffect, Dispatch, SetStateAction} from 'react';
import {Text} from 'react-native-elements';
import {useAppSelector} from '@/store/hooks';
import {prettifyTime} from '@/store/services';
import Animated, {
    runOnJS,
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

const MINIMIZED_HEIGHT = 80;
const TAB_HEIGHT = 140;

type WorkoutNewProps = {
    popoverExpanded: boolean;
    setPopoverExpanded: Dispatch<SetStateAction<boolean>>;
};

const WorkoutNew: React.FC<WorkoutNewProps> = ({
    popoverExpanded,
    setPopoverExpanded,
}) => {
    const workoutCommenced = useAppSelector(
        storeState => storeState.activeWorkout.workoutCommenced,
    );
    const workoutStartTime = useAppSelector(
        storeState => storeState.activeWorkout.startTime,
    );

    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [timeString, setTimeString] = useState('00:00');
    const [actualExpanded, setActualExpanded] = useState(popoverExpanded);

    const expandedHeight = useWindowDimensions().height - TAB_HEIGHT; // 140 is height of header.

    const context = useSharedValue(0);
    const sHeight = useSharedValue(0);

    const rStyle = useAnimatedStyle(() => {
        return {
            height: sHeight.value,
        };
    });

    const correctPopover = () => {
        // Minimise if 3 quarters scrolled down
        // Else expand if 1 quarter scrolled up
        // Else return to previous state.
        if (
            popoverExpanded &&
            sHeight.value < ((expandedHeight - MINIMIZED_HEIGHT) / 4) * 3
        ) {
            setPopoverExpanded(false);
        } else if (
            !popoverExpanded &&
            sHeight.value > (expandedHeight - MINIMIZED_HEIGHT) / 4
        ) {
            setPopoverExpanded(true);
        } else if (popoverExpanded) {
            sHeight.value = withTiming(expandedHeight, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
        } else if (!popoverExpanded) {
            sHeight.value = withTiming(MINIMIZED_HEIGHT, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
        }
    };

    // As we track whether the popover should be expanded in parent
    // We must use this effect to ensure they are in sync whenever the parent changes.
    useEffect(() => {
        if (popoverExpanded && !actualExpanded) {
            sHeight.value = withTiming(expandedHeight, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
            setActualExpanded(true);
        } else if (!popoverExpanded && actualExpanded) {
            sHeight.value = withTiming(MINIMIZED_HEIGHT, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
            setActualExpanded(false);
        }
    }, [popoverExpanded, actualExpanded, expandedHeight, sHeight]);

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = sHeight.value;
        })
        .onUpdate(e => {
            let v = context.value - e.translationY;

            if (v > expandedHeight) {
                v = expandedHeight;
            } else if (v < MINIMIZED_HEIGHT) {
                v = MINIMIZED_HEIGHT;
            }

            sHeight.value = v;
        })
        .onEnd(() => {
            runOnJS(correctPopover)();
        });

    // On initial load set interval and expand drag up.
    useEffect(() => {
        if (workoutCommenced && workoutStartTime) {
            setPopoverExpanded(true);

            setIntervalId(
                setInterval(() => {
                    setTimeString(prettifyTime(workoutStartTime));
                }, 1000),
            );
        }
    }, [
        workoutCommenced,
        workoutStartTime,
        sHeight,
        expandedHeight,
        setPopoverExpanded,
    ]);

    // Clear interval when workout start time changes.
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [workoutStartTime]);

    return (
        <Animated.View style={[styles.container, rStyle]}>
            <View style={styles.headerContainer}>
                <View style={styles.handleContainer}>
                    <GestureDetector gesture={panGesture}>
                        <View style={styles.handle} />
                    </GestureDetector>
                </View>

                <View style={styles.headerTextContainer}>
                    <View style={styles.column}>
                        <Text style={styles.title}>New Workout</Text>
                    </View>
                    <View style={styles.column}>
                        <Text style={styles.timer}>{timeString}</Text>
                    </View>
                    <View style={styles.column} />
                </View>
            </View>
            <View style={styles.contentContainer}>
                <Text style={styles.content}>CONTENT.</Text>
            </View>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        borderTopColor: 'rgba(243, 252, 240, 0.4)',
        borderTopWidth: 1,
        flexDirection: 'column',
        alignItems: 'stretch',
    },
    headerContainer: {
        flex: 1,
        flexBasis: MINIMIZED_HEIGHT,
        flexGrow: 0,
    },
    handleContainer: {
        alignItems: 'center',
    },
    handle: {
        marginTop: 15,
        width: 60,
        height: 7,
        backgroundColor: '#f3fcf0',
        borderRadius: 5,
    },
    headerTextContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    column: {
        flex: 1,
    },
    title: {
        color: '#f3fcf0',
        fontWeight: 'bold',
    },
    timer: {
        color: '#f3fcf0',
        textAlign: 'center',
    },
    contentContainer: {
        position: 'relative',
        flex: 1,
        flexGrow: 1,
    },
    content: {
        color: '#f3fcf0',
        fontSize: 80,
    },
});

export default WorkoutNew;
