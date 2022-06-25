import {queryExercise} from '@/store/services';
import {ExerciseReference} from '@/types/exercise';
import React, {useEffect, useState} from 'react';
import {
    TextInput,
    View,
    StyleSheet,
    Text,
    ViewStyle,
    Pressable,
} from 'react-native';
import Spinner from '../Utility/Spinner';

type ExerciseSearchType = {
    addExercise: (e: ExerciseReference) => void;
};

const ExerciseSearch: React.FC<ExerciseSearchType> = ({addExercise}) => {
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

    const exerciseListStyle = (
        s: ViewStyle,
        i: number,
        l: number,
    ): ViewStyle => {
        let r: ViewStyle = {...s};

        if (i === 0) {
            r.borderTopStartRadius = 3;
            r.borderTopEndRadius = 3;
        }

        if (i === l - 1) {
            r.borderBottomStartRadius = 3;
            r.borderBottomEndRadius = 3;
            r.borderBottomColor = s.borderColor;
        }

        return r;
    };

    const selectExercise = (e: ExerciseReference) => {
        console.log('Selected Exercise:', e);
        addExercise(e);
    };

    return (
        <View style={styles.container}>
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

            <View style={styles.optionsContainer}>
                {isLoading ? (
                    <Spinner
                        style={styles.spinner}
                        diameter={28}
                        spinnerWidth={4}
                        backgroundColor="#f3fcf0"
                        spinnerColor="#343E4B"
                    />
                ) : (
                    exercises
                        .filter(e => {
                            return e.name
                                .toLowerCase()
                                .includes(searchText.toLowerCase());
                        })
                        .map((e, i, arr) => {
                            return (
                                <Pressable
                                    onPress={() => {
                                        selectExercise(e);
                                    }}>
                                    <View
                                        style={exerciseListStyle(
                                            styles.exerciseOption,
                                            i,
                                            arr.length,
                                        )}
                                        key={e.exerciseId}>
                                        <Text style={styles.text}>
                                            {e.name}
                                        </Text>
                                    </View>
                                </Pressable>
                            );
                        })
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 5,
    },
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
    optionsContainer: {
        marginTop: 10,
        paddingHorizontal: 15,
    },
    exerciseOption: {
        padding: 5,
        borderColor: '#97A5B6',
        borderWidth: 1,
        backgroundColor: '#343E4B',
        borderBottomColor: 'transparent',
    },
    text: {
        color: '#f3fcf0',
        fontSize: 12,
    },
    spinner: {
        alignSelf: 'center',
    },
});

export default ExerciseSearch;
