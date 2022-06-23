import {queryExercise} from '@/store/services';
import {ExerciseReference} from '@/types/exercise';
import React, {useEffect, useState} from 'react';
import {TextInput, View, StyleSheet, Text} from 'react-native';
import Spinner from '../Utility/Spinner';

const ExerciseSearch = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [searchText, setSearchText] = useState('');
    const [exercises, setExercises] = useState<ExerciseReference[]>([]);

    useEffect(() => {
        const fetchExercises = async () => {
            setIsLoading(true);

            try {
                setExercises(
                    await queryExercise({
                        init: {
                            queryStringParameters: {
                                user: true,
                                loadAmount: 5,
                            },
                        },
                    }),
                );
            } catch (err) {
                // TODO: Better error handling.
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchExercises();
    }, []);

    return (
        <View>
            <View style={styles.textInputContainer}>
                <TextInput
                    style={styles.textInput}
                    placeholder="Search for an exercise..."
                    onChangeText={setSearchText}
                    autoComplete="off"
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholderTextColor="#97A5B6"
                />
            </View>

            <View>
                {isLoading ? (
                    <Spinner
                        diameter={28}
                        spinnerWidth={4}
                        backgroundColor="#f3fcf0"
                        spinnerColor="#343E4B"
                    />
                ) : (
                    exercises.map(e => {
                        return (
                            <View
                                style={{
                                    marginTop: 5,
                                    height: 30,
                                    backgroundColor: 'white',
                                }}>
                                <Text style={styles.text}>{e.name}</Text>
                            </View>
                        );
                    })
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    textInputContainer: {
        flex: 1,
        flexBasis: 30,
    },
    textInput: {
        marginHorizontal: '2%',
        backgroundColor: '#343E4B',
        color: '#f3fcf0',
        borderColor: '#97A5B6',
        borderRadius: 5,
        borderWidth: 1,
        padding: 10,
        fontSize: 12,
        height: 30,
    },
    text: {
        color: '#f3fcf0',
        fontSize: 18,
    },
});

export default ExerciseSearch;
