import React, {useState} from 'react';
import {
    SafeAreaView,
    StyleSheet,
    useWindowDimensions,
    View,
} from 'react-native';
import AnimatedButton from '@/components/Utility/AnimatedButton';

import PostFeed from '@/components/Post/PostFeed';
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSpring,
} from 'react-native-reanimated';

const Home = () => {
    const [pageIndex, setPageIndex] = useState(0);
    const {width} = useWindowDimensions();

    const sTranslateX = useSharedValue(0);
    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: sTranslateX.value}],
        };
    });

    const switchPage = (index: number) => {
        setPageIndex(index);
        sTranslateX.value = withSpring(index * (width / 2));
    };

    return (
        <SafeAreaView style={styles.container}>
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
                <Animated.View style={[styles.selector, rStyle]} />
            </View>
            <PostFeed />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1A1F25',
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

export default Home;
