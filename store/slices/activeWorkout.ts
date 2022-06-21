import {createEntityAdapter, createSlice} from '@reduxjs/toolkit';

const activeWorkoutAdapter = createEntityAdapter();

const initialState = activeWorkoutAdapter.getInitialState({
    workoutCommenced: false,
    startTime: 0,
});

const activeWorkoutSlice = createSlice({
    name: 'activeWorkout',
    initialState,
    reducers: {
        startWorkout(state) {
            console.log('WORKOUT COMMENCED');
            state.workoutCommenced = true;
            state.startTime = new Date().getTime();
            console.log('VALUES:', state.workoutCommenced, state.startTime);
        },
    },
});

export const {startWorkout} = activeWorkoutSlice.actions;
export default activeWorkoutSlice.reducer;
