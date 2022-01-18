import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import {Auth} from 'aws-amplify';
import {UserDocData} from '../../types/user';
import {getUser} from '../services';

const userAdapter = createEntityAdapter();

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (): Promise<UserDocData> => {
        const username = (await Auth.currentUserInfo()).username;

        if (!username) {
            throw new Error('No logged in user.');
        }

        const user = await getUser({userId: username, init: {}});
        console.log('User fetched:', user);
        return user;
    },
);

const initialState = userAdapter.getInitialState({
    loggedIn: false,
    docData: null as UserDocData | null,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(fetchUser.pending, state => {
                state.status = 'loading';
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.loggedIn = true;
                state.docData = action.payload;
                state.status = 'succeeded';
            });
    },
});

export default userSlice.reducer;
