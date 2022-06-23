import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';
import ExerciseSearchModal from '../Exercise/ExerciseSearchModal';
import AnimatedButton from '../Utility/AnimatedButton';

const WorkoutNew = () => {
    const [exerciseSearchModal, setExerciseSearchModal] = useState(false);

    const addExerciseButton = () => {
        console.log('Add Exercise.');
        setExerciseSearchModal(true);
    };

    return (
        <View>
            <ExerciseSearchModal
                visible={exerciseSearchModal}
                setVisible={setExerciseSearchModal}
            />
            <Text style={styles.content}>CONTENT.</Text>
            <View style={styles.buttonCont}>
                <AnimatedButton
                    onPress={addExerciseButton}
                    style={styles.addExerciseButton}
                    textStyle={styles.addExerciseButtonText}>
                    Add Exercise
                </AnimatedButton>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    content: {
        color: '#f3fcf0',
        fontSize: 80,
    },
    buttonCont: {
        paddingHorizontal: 20,
    },
    addExerciseButton: {
        backgroundColor: '#f3fcf0',
        marginTop: 20,
        height: 30,
        width: '100%',
        borderRadius: 5,
    },
    addExerciseButtonText: {
        color: 'black',
        textAlign: 'center',
    },
});

export default WorkoutNew;
