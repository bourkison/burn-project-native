import {
    createEntityAdapter,
    createSlice,
    PayloadAction,
} from '@reduxjs/toolkit';

const userAdapter = createEntityAdapter();

const initialState = userAdapter.getInitialState({
    loggedIn: false,
    username: '',
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: {
            reducer(state, action: PayloadAction<{username: string}>) {
                state.username = action.payload.username;
            },

            prepare(username: string) {
                return {
                    payload: {username},
                };
            },
        },
    },
});

export const {login} = userSlice.actions;

export default userSlice.reducer;
