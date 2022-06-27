import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    withTiming,
    Easing,
    runOnUI,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import ExerciseFeed from '@/components/Exercise/ExerciseFeed';
import AnimatedButton from '@/components/Utility/AnimatedButton';

const ExerciseHome = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const {width} = useWindowDimensions();
    const context = useSharedValue({navX: 0, pageX: 0, x: 0, y: 0});

    const sNavTranslateX = useSharedValue(0);
    const sPageTranslateX = useSharedValue(0);

    const rNavStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: sNavTranslateX.value}],
        };
    });
    const rPageStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: sPageTranslateX.value}],
        };
    });

    const switchPage = (index: number) => {
        setPageIndex(index);
        runOnUI(normaliseTracker)(index);
    };

    const normaliseTracker = (index: number) => {
        'worklet';

        sNavTranslateX.value = withSpring(index * (width / 2));
        sPageTranslateX.value = withTiming(index * -width, {
            duration: 300,
            easing: Easing.bezier(0.25, 1, 0.25, 1),
        });
    };

    const panGesture = Gesture.Pan()
        .manualActivation(true)
        .onTouchesDown(e => {
            context.value = {
                navX: sNavTranslateX.value,
                pageX: sPageTranslateX.value,
                x: e.changedTouches[0].absoluteX,
                y: e.changedTouches[0].absoluteY,
            };
        })
        .onTouchesMove((e, state) => {
            // Check the difference in X is greater than the distance in Y (and thus user is swiping left to right).
            if (
                Math.abs(e.changedTouches[0].absoluteX - context.value.x) >
                Math.abs(e.changedTouches[0].absoluteY - context.value.y)
            ) {
                state.activate();
            } else {
                state.fail();
            }
        })
        .onUpdate(e => {
            sNavTranslateX.value = context.value.navX - e.translationX;
            sPageTranslateX.value = context.value.pageX + e.translationX;
        })
        .onEnd(() => {
            if (sNavTranslateX.value > width / 4) {
                normaliseTracker(1);
            } else {
                normaliseTracker(0);
            }
        });

    return (
        <SafeAreaView style={styles.savContainer}>
            <GestureDetector gesture={panGesture}>
                <View style={styles.container}>
                    <View style={styles.topNavBar}>
                        <View style={styles.buttonsContainer}>
                            <AnimatedButton
                                style={styles.topNavButton}
                                textStyle={styles.topNavText}
                                scale={1}
                                onPress={() => {
                                    switchPage(0);
                                }}>
                                Followed
                            </AnimatedButton>
                            <AnimatedButton
                                style={styles.topNavButton}
                                textStyle={styles.topNavText}
                                scale={1}
                                onPress={() => {
                                    switchPage(1);
                                }}>
                                Explore
                            </AnimatedButton>
                        </View>
                        <Animated.View style={[styles.selector, rNavStyle]} />
                    </View>
                    <Animated.View style={[styles.feedContainer, rPageStyle]}>
                        <View>
                            <ExerciseFeed isActive={pageIndex === 0} />
                        </View>
                        <View>
                            <ExerciseFeed isActive={pageIndex === 1} />
                        </View>
                    </Animated.View>
                </View>
            </GestureDetector>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    savContainer: {
        backgroundColor: '#1A1F25',
        height: '100%',
    },
    container: {
        flex: 1,
    },
    topNavBar: {
        justifyContent: 'center',
        height: 50,
        flexDirection: 'column',
    },
    buttonsContainer: {
        flexDirection: 'row',
        width: '100%',
        flex: 15,
    },
    topNavButton: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: 'rgba(243, 252, 240, 0.3)',
        shadowOffset: {
            width: 0,
            height: 0,
        },
        shadowRadius: 3,
    },
    topNavText: {
        color: '#f3fcf0',
        textAlign: 'center',
    },
    selector: {
        backgroundColor: '#f3fcf0',
        flex: 1,
        width: '50%',
    },
    feedContainer: {
        flex: 1,
    },
});

export default ExerciseHome;
