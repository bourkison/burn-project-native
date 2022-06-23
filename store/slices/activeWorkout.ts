import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';
import {RecordedExercise} from '@/types/workout';
import {ExerciseReference} from '@/types/exercise';

const activeWorkoutAdapter = createEntityAdapter();

const initialState = activeWorkoutAdapter.getInitialState({
    workoutCommenced: false,
    startTime: 0,
    finishTime: 0,
    exercises: [] as RecordedExercise[],
});

const activeWorkoutSlice = createSlice({
    name: 'activeWorkout',
    initialState,
    reducers: {
        START_WORKOUT(state) {
            console.log('WORKOUT COMMENCED');
            state.workoutCommenced = true;
            state.startTime = new Date().getTime();
            state.exercises = [];
            console.log('VALUES:', state.workoutCommenced, state.startTime);
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
                        },
                    ],
                },
            ];
        },
    },
});

export const {START_WORKOUT, FINISH_WORKOUT, ADD_EXERCISE} =
    activeWorkoutSlice.actions;
export default activeWorkoutSlice.reducer;
