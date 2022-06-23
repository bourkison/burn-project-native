import React, {Dispatch, SetStateAction} from 'react';
import {Modal, StyleSheet, View} from 'react-native';
import ExerciseSearch from '@/components/Exercise/ExerciseSearch';
import AnimatedButton from '../Utility/AnimatedButton';

type ExerciseSearchModalType = {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
};

const ExerciseSearchModal: React.FC<ExerciseSearchModalType> = ({
    visible,
    setVisible,
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
            <View style={styles.addExerciseModal}>
                <View style={styles.modalHeader}>
                    <View>
                        <Text>Exercise Search</Text>
                    </View>
                    <View>
                        <AnimatedButton>x</AnimatedButton>
                    </View>
                </View>
                <ExerciseSearch />
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    addExerciseModal: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalHeader: {},
});

export default ExerciseSearchModal;
