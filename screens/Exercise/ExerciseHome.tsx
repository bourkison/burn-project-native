import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import Animated, {
    runOnJS,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';

import ExerciseFeed from '@/components/Exercise/ExerciseFeed';
import AnimatedButton from '@/components/Utility/AnimatedButton';

const ExerciseHome = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const {width} = useWindowDimensions();
    const context = useSharedValue({navX: 0, pageX: 0});

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
        normaliseTracker(index);
    };

    const normaliseTracker = (index: number) => {
        sNavTranslateX.value = withSpring(index * (width / 2));
        sPageTranslateX.value = withSpring(index * -width);
    };

    const panGesture = Gesture.Pan()
        .onStart(() => {
            context.value = {
                navX: sNavTranslateX.value,
                pageX: sPageTranslateX.value,
            };
        })
        .onUpdate(e => {
            sNavTranslateX.value = context.value.navX - e.translationX;
            sPageTranslateX.value = context.value.pageX + e.translationX;
        })
        .onEnd(() => {
            if (sNavTranslateX.value > width / 4) {
                console.log('Ended', 1, sNavTranslateX.value, width / 2);
                runOnJS(normaliseTracker)(1);
            } else {
                console.log('Ended', 0, sNavTranslateX.value, width / 2);
                runOnJS(normaliseTracker)(0);
            }
        });

    return (
        <SafeAreaView>
            <GestureDetector gesture={panGesture}>
                <View style={styles.container}>
                    <View style={styles.topNavBar}>
                        <View style={styles.buttonsContainer}>
                            <AnimatedButton
                                content="Followed"
                                style={styles.topNavButton}
                                textStyle={styles.topNavText}
                                scale={1}
                                onPress={() => {
                                    switchPage(0);
                                }}
                            />
                            <AnimatedButton
                                content="Explore"
                                style={styles.topNavButton}
                                textStyle={styles.topNavText}
                                scale={1}
                                onPress={() => {
                                    switchPage(1);
                                }}
                            />
                        </View>
                        <Animated.View style={[styles.selector, rNavStyle]} />
                    </View>
                    <Animated.View style={rPageStyle}>
                        <View>
                            <ExerciseFeed active={pageIndex === 0} />
                        </View>
                        <View>
                            <ExerciseFeed active={pageIndex === 1} />
                        </View>
                    </Animated.View>
                </View>
            </GestureDetector>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
        height: '100%',
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
});

export default ExerciseHome;