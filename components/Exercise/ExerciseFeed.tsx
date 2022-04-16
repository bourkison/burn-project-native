import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {ExerciseReference} from '@/types/exercise';
import {queryExercise} from '@/store/services';

type ExerciseFeedProps = {
    isActive: boolean;
};

const ExerciseFeed: React.FC<ExerciseFeedProps> = ({isActive}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [exercises, setExercises] = useState<ExerciseReference[]>([]);

    useEffect(() => {
        if (isActive && !isLoaded) {
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

                    setIsLoading(false);
                    setIsLoaded(true);
                } catch (err) {
                    // TODO: Better error handling.
                    console.error(err);
                }
            };

            fetchExercises();
        }
    }, [isActive, isLoaded]);

    let content: JSX.Element;

    if (isLoading) {
        content = <Text>Loading</Text>;
    } else if (!isLoading && isLoaded && exercises.length) {
        content = (
            <View>
                {exercises.map(exercise => (
                    <Text>{exercise.name}</Text>
                ))}
            </View>
        );
    } else {
        content = <View />;
    }

    return <ScrollView style={styles.container}>{content}</ScrollView>;
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
    },
});

export default ExerciseFeed;
