import {configureStore} from '@reduxjs/toolkit';
import userReducer from './slices/user';
import activeWorkoutReducer from './slices/activeWorkout';

const store = configureStore({
    reducer: {
        user: userReducer,
        activeWorkout: activeWorkoutReducer,
    },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type.
export type AppDispatch = typeof store.dispatch;

export default store;
