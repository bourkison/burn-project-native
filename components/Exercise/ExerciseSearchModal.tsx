import React, {Dispatch, SetStateAction} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import ExerciseSearch from '@/components/Exercise/ExerciseSearch';
import AnimatedButton from '../Utility/AnimatedButton';
import {ExerciseReference} from '@/types/exercise';

type ExerciseSearchModalType = {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    addExercise: (e: ExerciseReference) => void;
};

const ExerciseSearchModal: React.FC<ExerciseSearchModalType> = ({
    visible,
    setVisible,
    addExercise,
}) => {
    const closeModal = () => {
        setVisible(false);
    };

    return (
        <Modal
            visible={visible}
            animationType="slide"
            onRequestClose={closeModal}
            transparent={true}>
            <View style={styles.modalContainer}>
                <View style={styles.addExerciseModal}>
                    <View style={styles.modalHeader}>
                        <View style={styles.modalTitleContainer}>
                            <Text style={styles.modalTitle}>
                                Exercise Search
                            </Text>
                        </View>
                        <View style={styles.closeButtonContainer}>
                            <AnimatedButton
                                onPress={closeModal}
                                style={styles.closeButton}
                                textStyle={styles.closeButtonText}>
                                x
                            </AnimatedButton>
                        </View>
                    </View>
                    <ExerciseSearch
                        addExercise={e => {
                            addExercise(e);
                            closeModal();
                        }}
                    />
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addExerciseModal: {
        width: '100%',
        justifyContent: 'center',
        borderColor: 'rgba(243, 252, 240, 0.4)',
        borderWidth: 1,
        borderRadius: 3,
        padding: 5,
        backgroundColor: '#1A1F25',
    },
    modalHeader: {
        flexDirection: 'row',
    },
    modalTitleContainer: {
        flex: 1,
    },
    modalTitle: {
        color: '#f3fcf0',
        fontWeight: 'bold',
        fontSize: 16,
        alignSelf: 'flex-start',
    },
    closeButtonContainer: {
        flex: 1,
        alignSelf: 'flex-end',
    },
    closeButton: {
        height: 20,
        width: 20,
        borderRadius: 3,
        alignSelf: 'flex-end',
    },
    closeButtonText: {
        color: '#f3fcf0',
        textAlign: 'right',
    },
});

export default ExerciseSearchModal;
