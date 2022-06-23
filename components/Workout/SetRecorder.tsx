import {RecordedSet} from '@/types/workout';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Text} from 'react-native-elements';

type SetRecorderProps = {
    set: RecordedSet;
    index: number;
};

const SetRecorder: React.FC<SetRecorderProps> = ({set, index}) => {
    return (
        <View style={styles.container}>
            <View style={styles.column}>
                <Text style={styles.text}>{index}</Text>
            </View>
            <View style={styles.column}>
                <Text style={styles.text}>{set.measureAmount}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexBasis: 24,
    },
    column: {
        flex: 1,
        alignItems: 'center',
    },
    text: {
        color: '#f3fcf0',
    },
});

export default SetRecorder;
