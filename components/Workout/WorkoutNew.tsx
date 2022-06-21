import React, {useState, useEffect} from 'react';
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

const WorkoutNew = () => {
    const MINIMIZED_HEIGHT = 80;
    const HEADER_HEIGHT = 140;

    const workoutCommenced = useAppSelector(
        storeState => storeState.activeWorkout.workoutCommenced,
    );
    const workoutStartTime = useAppSelector(
        storeState => storeState.activeWorkout.startTime,
    );

    const [intervalId, setIntervalId] = useState<NodeJS.Timer | null>(null);
    const [timeString, setTimeString] = useState('00:00');
    const [expanded, setExpanded] = useState(true); // Set to true as always opens up expanded.

    const expandedHeight = useWindowDimensions().height - HEADER_HEIGHT; // 140 is height of header.

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
        if (
            expanded &&
            sHeight.value < ((expandedHeight - MINIMIZED_HEIGHT) / 4) * 3
        ) {
            sHeight.value = withTiming(MINIMIZED_HEIGHT, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
            setExpanded(false);
        } else if (
            !expanded &&
            sHeight.value > (expandedHeight - MINIMIZED_HEIGHT) / 4
        ) {
            sHeight.value = withTiming(expandedHeight, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
            setExpanded(true);
        } else if (expanded) {
            sHeight.value = withTiming(expandedHeight, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
        } else if (!expanded) {
            sHeight.value = withTiming(MINIMIZED_HEIGHT, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });
        }

        console.log('Correcting.');
    };

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
            sHeight.value = withTiming(expandedHeight, {
                duration: 500,
                easing: Easing.bezier(0.25, 1, 0.25, 1),
            });

            setIntervalId(
                setInterval(() => {
                    setTimeString(prettifyTime(workoutStartTime));
                }, 1000),
            );
        }
    }, [workoutCommenced, workoutStartTime, sHeight, expandedHeight]);

    // Clear interval when workout start time changes.
    useEffect(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
    }, [workoutStartTime]);

    return (
        <Animated.View style={[styles.container, rStyle]}>
            <View style={{flex: 1, height: 20, alignItems: 'center'}}>
                <GestureDetector gesture={panGesture}>
                    <View style={styles.handle} />
                </GestureDetector>
            </View>
            <Text style={{color: '#f3fcf0'}}>{timeString}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        borderTopColor: 'rgba(243, 252, 240, 0.4)',
        borderTopWidth: 1,
    },
    handle: {
        marginTop: 15,
        width: 60,
        height: 7,
        backgroundColor: '#f3fcf0',
        borderRadius: 5,
    },
});

export default WorkoutNew;
