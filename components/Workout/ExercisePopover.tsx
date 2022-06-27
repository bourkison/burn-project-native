import React, {useRef, useState} from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
import Animated, {
    // runOnJS,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withSpring,
    // withTiming,
} from 'react-native-reanimated';
import AnimatedButton from '../Utility/AnimatedButton';

const ARROW_LENGTH = 20;
const POPOVER_WIDTH = 200;

const ExercisePopover = () => {
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [modalPos, setModalPos] = useState<{x: number; y: number}>({
        x: 0,
        y: 0,
    });
    const [refWidth, setRefWidth] = useState(0);

    const sScaleX = useSharedValue(0);
    const sScaleY = useSharedValue(0);

    const rStyle = useAnimatedStyle(() => {
        return {
            transform: [
                {scaleX: sScaleX.value},
                {scaleY: sScaleY.value},
                {translateX: -POPOVER_WIDTH},
            ],
        };
    });

    const ref = useRef<View>(null);

    const openModal = () => {
        // Get position of popover.
        if (ref.current) {
            ref.current.measure((fx, fy, width, height, px, py) => {
                setModalPos({
                    x: px + width,
                    y: py + height,
                });

                setRefWidth(width);
            });

            console.log('MODAL POS:', modalPos);
        }

        setPopoverVisible(true);

        runOnUI(() => {
            sScaleX.value = withSpring(1);
            sScaleY.value = withSpring(1);
        })();
    };

    const closeModal = () => {
        // runOnUI(() => {
        //     sScaleY.value = withTiming(
        //         0,
        //         {
        //             duration: 300,
        //         },
        //         () => {
        //             sScaleX.value = 0;
        //             runOnJS(setPopoverVisible)(false);
        //         },
        //     );
        // })();

        sScaleX.value = 0;
        sScaleY.value = 0;
        setPopoverVisible(false);
    };

    return (
        <View>
            <Modal
                visible={popoverVisible}
                transparent={true}
                style={styles.popoverModal}>
                <Animated.View
                    style={[
                        {
                            ...styles.popoverContainer,
                            top: modalPos.y,
                            left: modalPos.x,
                        },
                        rStyle,
                    ]}>
                    <View
                        style={{
                            ...styles.popoverArrow,
                            marginRight: refWidth / 2 - ARROW_LENGTH / 2,
                        }}
                    />
                    <View style={styles.popoverContentContainer}>
                        <Text>POPOVER.</Text>
                        <AnimatedButton
                            onPress={closeModal}
                            style={styles.popoverButton}
                            textStyle={styles.popoverButtonText}>
                            Close
                        </AnimatedButton>
                    </View>
                </Animated.View>
            </Modal>

            <View style={styles.popoverButtonContainer} ref={ref}>
                <AnimatedButton
                    onPress={openModal}
                    style={styles.popoverButton}
                    textStyle={styles.popoverButtonText}>
                    ...
                </AnimatedButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    popoverModal: {},
    popoverContainer: {
        maxWidth: POPOVER_WIDTH,
        position: 'relative',
        overflow: 'hidden',
    },
    popoverArrow: {
        width: ARROW_LENGTH,
        height: ARROW_LENGTH,
        backgroundColor: 'white',
        transform: [{rotate: '45deg'}],
        alignSelf: 'flex-end',
    },
    popoverContentContainer: {
        padding: 20,
        backgroundColor: 'white',
        transform: [{translateY: -10}],
    },
    popoverButtonContainer: {},
    popoverButton: {
        backgroundColor: '#ce3b54',
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    popoverButtonText: {
        color: '#f3fcf0',
    },
});

export default ExercisePopover;
