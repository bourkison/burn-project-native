import React, {useEffect, useRef, useState} from 'react';
import {View, Modal, Text, StyleSheet, Pressable} from 'react-native';
import Animated, {
    runOnJS,
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';
import AnimatedButton from '../Utility/AnimatedButton';
import Icon from 'react-native-vector-icons/FontAwesome5';

const POPOVER_WIDTH = 300;

type ExercisePopoverOptionProps = {
    children: string;
    onPress: () => void;
};

type PopoverSecondPageProps = {
    page: number;
    returnToOptions: () => void;
};

const ExercisePopoverOption: React.FC<ExercisePopoverOptionProps> = ({
    children,
    onPress,
}) => {
    const [isPressing, setIsPressing] = useState(false);

    return (
        <Pressable
            onPressIn={() => {
                setIsPressing(true);
            }}
            onPressOut={() => {
                setIsPressing(false);
                onPress();
            }}>
            <View
                style={
                    isPressing
                        ? styles.optionContainerPressed
                        : styles.optionContainer
                }>
                <Text style={styles.optionText}>{children}</Text>
            </View>
        </Pressable>
    );
};

const PopoverSecondPage: React.FC<PopoverSecondPageProps> = ({
    page,
    returnToOptions,
}) => {
    useEffect(() => {
        console.log('page', page);
    }, [page]);

    return (
        <View>
            <AnimatedButton
                style={styles.popoverButton}
                textStyle={styles.popoverButtonText}
                onPress={returnToOptions}>
                Go Back
            </AnimatedButton>
        </View>
    );
};

const ExercisePopover = () => {
    const [popoverHeight, setPopoverHeight] = useState(0);
    const [popoverVisible, setPopoverVisible] = useState(false);
    const [modalPos, setModalPos] = useState<{x: number; y: number}>({
        x: 0,
        y: 0,
    });
    const [openPage, setOpenPage] = useState(-1);

    const sContTranslateY = useSharedValue(-100);
    const sInnerTranslateX = useSharedValue(0);

    const rContStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateY: sContTranslateY.value}],
        };
    });

    const rInnerStyle = useAnimatedStyle(() => {
        return {
            transform: [{translateX: sInnerTranslateX.value}],
        };
    });

    const ref = useRef<View>(null);
    const dropdownContentRef = useRef<Animated.View>(null);

    const openModal = () => {
        // Get position of popover.
        if (ref.current) {
            ref.current.measure((fx, fy, width, height, px, py) => {
                console.log('HEIGHT AND WIDTH:', height, width);

                setModalPos({
                    x: px + width,
                    y: py + height,
                });
            });

            console.log('MODAL POS:', modalPos);
        }

        setPopoverVisible(true);
    };

    const closeModal = () => {
        console.log('CLOSING MODAL');
        setPopoverVisible(false);
        sContTranslateY.value = popoverHeight !== 0 ? -popoverHeight : -100;
        sInnerTranslateX.value = 0;
    };

    const selectOption = (index: number) => {
        setOpenPage(index);

        runOnUI(() => {
            sInnerTranslateX.value = withTiming(-POPOVER_WIDTH);
        })();
    };

    const returnToOptions = () => {
        runOnUI(() => {
            sInnerTranslateX.value = withTiming(0, {}, () => {
                runOnJS(setOpenPage)(-1);
            });
        })();
    };

    return (
        <View>
            <Modal
                visible={popoverVisible}
                transparent={true}
                onRequestClose={closeModal}
                style={styles.popoverModal}>
                <Pressable
                    onPress={() => {
                        console.log('ATTEMPTED CLOSE MODAL');
                    }}
                    style={styles.modalBackdrop}>
                    <View
                        style={{
                            ...styles.popoverContainer,
                            top: modalPos.y,
                            left: modalPos.x,
                        }}>
                        <View style={styles.popoverOverflow}>
                            <Animated.View
                                style={[
                                    styles.popoverContentContainer,
                                    rContStyle,
                                ]}
                                ref={dropdownContentRef}
                                onLayout={e => {
                                    setPopoverHeight(
                                        e.nativeEvent.layout.height,
                                    );
                                    runOnUI(() => {
                                        sContTranslateY.value =
                                            -e.nativeEvent.layout.height;
                                        sContTranslateY.value = withTiming(0);
                                    })();
                                }}>
                                <Animated.View
                                    style={[rInnerStyle, styles.popoverInner]}>
                                    <View
                                        style={{flexBasis: POPOVER_WIDTH - 2}}>
                                        <ExercisePopoverOption
                                            onPress={() => {
                                                selectOption(1);
                                            }}>
                                            Option 1
                                        </ExercisePopoverOption>
                                        <ExercisePopoverOption
                                            onPress={() => {}}>
                                            Option 2
                                        </ExercisePopoverOption>
                                        <ExercisePopoverOption
                                            onPress={() => {}}>
                                            Option 3
                                        </ExercisePopoverOption>
                                    </View>
                                    <View style={styles.secondPageContainer}>
                                        <PopoverSecondPage
                                            page={openPage}
                                            returnToOptions={returnToOptions}
                                        />
                                    </View>
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </View>
                </Pressable>
            </Modal>

            <View style={styles.popoverButtonContainer} ref={ref}>
                <AnimatedButton
                    onPress={openModal}
                    style={styles.popoverButton}
                    textStyle={styles.popoverButtonText}>
                    <Icon name="ellipsis-h" color="#f3fcf0" />
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
        transform: [{translateX: -POPOVER_WIDTH}],
    },
    popoverOverflow: {
        overflow: 'hidden',
    },
    popoverContentContainer: {
        backgroundColor: '#1A1F25',
        borderRadius: 3,
        borderColor: '#f3fcf0',
        borderWidth: 1,
    },
    popoverInner: {
        flexDirection: 'row',
    },
    secondPageContainer: {
        width: POPOVER_WIDTH - 2,
        backgroundColor: 'blue',
        marginLeft: 2,
    },
    popoverButtonContainer: {},
    popoverButton: {
        backgroundColor: '#ce3b54',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 3,
        marginRight: 5,
    },
    popoverButtonText: {
        color: '#f3fcf0',
        textAlign: 'center',
    },
    modalBackdrop: {
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        position: 'absolute',
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
    },
    optionContainer: {
        backgroundColor: '#1A1F25',
    },
    optionContainerPressed: {
        backgroundColor: '#343E4B',
    },
    optionText: {
        color: '#f3fcf0',
        padding: 5,
        fontSize: 12,
    },
});

export default ExercisePopover;
