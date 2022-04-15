import React, {useEffect, useState} from 'react';
import Animated, {
    useSharedValue,
    withTiming,
    interpolate,
    withRepeat,
    Easing,
    useAnimatedStyle,
    cancelAnimation,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import {Dimensions, StyleSheet, View} from 'react-native';

type PostSkeletonProps = {
    skeletons?: Skeleton[];
};

type Skeleton = {
    width: number;
};

const PostSkeleton: React.FC<PostSkeletonProps> = ({skeletons}) => {
    const AnimatedLG = Animated.createAnimatedComponent(LinearGradient);
    const animatedValue = useSharedValue(0);
    const width = Dimensions.get('window').width;

    const [renderedSkels, setRenderedSkels] = useState<Skeleton[]>([]);

    useEffect(() => {
        if (!skeletons) {
            let temp = [];
            const numSkels = Math.floor(Math.random() * 4) + 4;

            for (let i = 0; i < numSkels; i++) {
                const skelWidth = Math.floor(Math.random() * 70) + 30;
                temp.push({width: skelWidth});
            }

            setRenderedSkels(temp);
        } else {
            setRenderedSkels(skeletons);
        }
    }, [skeletons]);

    const rStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
            animatedValue.value,
            [0, 1],
            [-width * 2, width * 2],
        );

        return {
            transform: [{translateX: translateX}],
        };
    }, [animatedValue.value]);

    useEffect(() => {
        animatedValue.value = withRepeat(
            withTiming(1, {
                duration: 1000,
                easing: Easing.linear,
            }),
            -1,
        );

        console.log('Animated:', animatedValue.value);

        return () => cancelAnimation(animatedValue);
    }, [animatedValue]);

    return (
        <View style={styles.card}>
            <View style={styles.container}>
                {renderedSkels.map((skeleton, index) => (
                    <View
                        key={index}
                        style={[
                            styles.skeleton,
                            {width: skeleton.width + '%'},
                        ]}>
                        <AnimatedLG
                            colors={[
                                'transparent',
                                'rgba(243, 252, 240, 0.5)',
                                'transparent',
                            ]}
                            start={{x: 0, y: 0}}
                            end={{x: 1, y: 1}}
                            style={[styles.gradient, rStyle]}
                        />
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '100%',
        backgroundColor: '#343E4B',
        padding: 25,
    },
    container: {
        overflow: 'hidden',
    },
    skeleton: {
        flex: 1,
        borderRadius: 5,
        backgroundColor: '#3F4C5B',
        shadowColor: '#f3fcf0',
        shadowOffset: {
            width: 0,
            height: 3,
        },
        shadowOpacity: 0.24,
        shadowRadius: 10,
        height: 20,
        width: '45%',
        overflow: 'hidden',
        marginBottom: 10,
    },
    gradient: {
        width: '100%',
        height: '100%',
    },
});

export default PostSkeleton;
