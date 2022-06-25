import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {RecordedExercise, RecordedSet} from '@/types/workout';
import {ExerciseReference} from '@/types/exercise';
import uuid from 'react-native-uuid';
import {TMeasureBy} from '@/types';

const activeWorkoutAdapter = createEntityAdapter();

const initialState = activeWorkoutAdapter.getInitialState({
    workoutCommenced: false,
    startTime: 0,
    finishTime: 0,
    exercises: [] as RecordedExercise[],
});

type AddSetPayload = {
    index: number;
    set: RecordedSet;
};

type DeleteSetPayload = {
    exerciseIndex: number;
    index: number;
};

type UpdateSetPayload = {
    exerciseIndex: number;
    index: number;
    key: 'measureAmount' | 'weightAmount' | 'measureBy';
    value: string | TMeasureBy;
};

const activeWorkoutSlice = createSlice({
    name: 'activeWorkout',
    initialState,
    reducers: {
        START_WORKOUT(state) {
            state.workoutCommenced = true;
            state.startTime = new Date().getTime();
            state.exercises = [];
        },

        FINISH_WORKOUT(state) {
            state.workoutCommenced = false;
            state.startTime = 0;
        },

        ADD_EXERCISE(state, action: PayloadAction<ExerciseReference>) {
            state.exercises = [
                ...state.exercises,
                {
                    exerciseReference: action.payload,
                    notes: '',
                    options: {
                        measureBy: 'reps',
                        weightUnit: 'kg',
                    },
                    sets: [
                        {
                            weightAmount: 0,
                            measureAmount: 0,
                            measureBy: 'reps',
                            uid: uuid.v4() as string,
                        },
                    ],
                    uid: uuid.v4() as string,
                },
            ];
        },

        ADD_SET(state, action: PayloadAction<AddSetPayload>) {
            let s: RecordedSet = {
                ...action.payload.set,
                uid: uuid.v4() as string,
            };

            if (state.exercises[action.payload.index]) {
                state.exercises[action.payload.index].sets = [
                    ...state.exercises[action.payload.index].sets,
                    s,
                ];
            }
        },

        REMOVE_SET(state, action: PayloadAction<DeleteSetPayload>) {
            if (
                state.exercises[action.payload.exerciseIndex] &&
                state.exercises[action.payload.exerciseIndex].sets[
                    action.payload.index
                ]
            ) {
                state.exercises[action.payload.exerciseIndex].sets = [
                    ...state.exercises[action.payload.exerciseIndex].sets.slice(
                        0,
                        action.payload.index,
                    ),
                    ...state.exercises[action.payload.exerciseIndex].sets.slice(
                        action.payload.index + 1,
                    ),
                ];
            }
        },

        UPDATE_SET(state, action: PayloadAction<UpdateSetPayload>) {
            if (
                state.exercises[action.payload.exerciseIndex] &&
                state.exercises[action.payload.exerciseIndex].sets[
                    action.payload.index
                ]
            ) {
                if (
                    action.payload.key === 'measureBy' &&
                    action.payload.value === 'repsWeight'
                ) {
                    state.exercises[action.payload.exerciseIndex].sets[
                        action.payload.index
                    ][action.payload.key] = action.payload.value;
                } else if (action.payload.key !== 'measureBy') {
                    state.exercises[action.payload.exerciseIndex].sets[
                        action.payload.index
                    ][action.payload.key] =
                        parseFloat(action.payload.value) || 0;
                }

                console.log(
                    'SET UPDATED:',
                    state.exercises[action.payload.exerciseIndex].sets[
                        action.payload.index
                    ],
                );
            }
        },
    },
});

export const {
    START_WORKOUT,
    FINISH_WORKOUT,
    ADD_EXERCISE,
    ADD_SET,
    REMOVE_SET,
    UPDATE_SET,
} = activeWorkoutSlice.actions;
export default activeWorkoutSlice.reducer;
