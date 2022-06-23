import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';
import {RecordedExercise} from '@/types/workout';

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
        startWorkout(state) {
            console.log('WORKOUT COMMENCED');
            state.workoutCommenced = true;
            state.startTime = new Date().getTime();
            state.exercises = [];
            console.log('VALUES:', state.workoutCommenced, state.startTime);
        },

        finishWorkout(state) {
            state.workoutCommenced = false;
            state.startTime = 0;
        },
    },
});

export const {startWorkout, finishWorkout} = activeWorkoutSlice.actions;
export default activeWorkoutSlice.reducer;
