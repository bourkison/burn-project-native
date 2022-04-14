import React, {useEffect} from 'react';

import {View, StyleSheet} from 'react-native';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withRepeat,
    withTiming,
    cancelAnimation,
    Easing,
} from 'react-native-reanimated';

const Spinner = () => {
    const rotation = useSharedValue(0);

    const animatedStyles = useAnimatedStyle(() => {
        return {
            transform: [
                {
                    rotateZ: `${rotation.value}deg`,
                },
            ],
        };
    }, [rotation.value]);

    useEffect(() => {
        rotation.value = withRepeat(
            withTiming(360, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
        );

        return () => cancelAnimation(rotation);
    }, []);

    return (
        <View>
            <Animated.View style={[styles.spinner, animatedStyles]} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
    },
    spinner: {
        height: 60,
        width: 60,
        borderRadius: 30,
        borderWidth: 7,
        borderTopColor: '#f5f5f5',
        borderRightColor: '#f5f5f5',
        borderBottomColor: '#f5f5f5',
        borderLeftColor: 'green',
    },
});

export default Spinner;
