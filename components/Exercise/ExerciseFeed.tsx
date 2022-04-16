import React, {useState, useEffect} from 'react';
import {Text, View, StyleSheet, ScrollView} from 'react-native';
import {ExerciseReference} from '@/types/exercise';
import {queryExercise} from '@/store/services';
import ExerciseComponent from './ExerciseComponent';

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
                console.log('Fetching exercises...');
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

                    setIsLoaded(true);
                    console.log('Exercises fetched.');
                } catch (err) {
                    // TODO: Better error handling.
                    console.error(err);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchExercises();
        }
    }, [isActive, isLoaded]);

    if (!isLoading && exercises.length) {
        return (
            <ScrollView>
                {exercises.map(exercise => (
                    <ExerciseComponent
                        exerciseReference={exercise}
                        key={exercise.exerciseId}
                    />
                ))}
            </ScrollView>
        );
    } else if (isLoading) {
        return <Text>LOADING FEED</Text>;
    } else {
        return <Text>No Content</Text>;
    }
};

// const styles = StyleSheet.create({
//     container: {
//         height: 1000,
//     },
// });

export default ExerciseFeed;
