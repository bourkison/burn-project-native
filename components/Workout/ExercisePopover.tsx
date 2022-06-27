import React, {useState} from 'react';
import {View, Modal, Text, StyleSheet} from 'react-native';
import AnimatedButton from '../Utility/AnimatedButton';

const ExercisePopover = () => {
    const [popoverVisible, setPopoverVisible] = useState(false);

    return (
        <View>
            <Modal visible={popoverVisible} transparent={true}>
                <View style={styles.popoverContainer}>
                    <Text>POPOVER.</Text>
                    <AnimatedButton
                        onPress={() => {
                            setPopoverVisible(false);
                        }}
                        style={styles.popoverButton}
                        textStyle={styles.popoverButtonText}>
                        Close
                    </AnimatedButton>
                </View>
            </Modal>

            <View style={styles.popoverButtonContainer}>
                <AnimatedButton
                    onPress={() => {
                        setPopoverVisible(true);
                    }}
                    style={styles.popoverButton}
                    textStyle={styles.popoverButtonText}>
                    ...
                </AnimatedButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    popoverContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
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
