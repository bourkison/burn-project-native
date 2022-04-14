import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import {Auth} from 'aws-amplify';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {UserDocData} from '@/types/user';
import {getUser} from '@/store/services';

const userAdapter = createEntityAdapter();

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (): Promise<UserDocData> => {
        // First call Auth.currentSession so error is thrown if no logged in user.
        await Auth.currentSession();

        let storageResponse: string | null = '';
        try {
            // Next try fetching docData from local storage.
            storageResponse = await AsyncStorage.getItem('@currentUserDocData');
        } catch (err) {
            console.error('Error accessing user storage:', err);
        } finally {
            // If found, return response.
            if (storageResponse) {
                console.log('User found in local storage.');
                return JSON.parse(storageResponse);
            }

            // Else pull from API.
            console.log(
                'No user found in local storage, fetching from API instead.',
            );
            const username = (await Auth.currentUserInfo()).username;

            if (!username) {
                throw new Error('No logged in user.');
            }

            const user = await getUser({userId: username, init: {}});
            console.log('User retrieved:', user);

            // Once successfully pulled from API, set to local storage.
            try {
                await AsyncStorage.setItem(
                    '@currentUserDocData',
                    JSON.stringify(user),
                );
            } catch (err) {
                console.error(
                    'Error setting to local storage, proceeding anyway.',
                );
            }

            return user;
        }
    },
);

export const logout = createAsyncThunk(
    'user/logout',
    async (): Promise<void> => {
        await Auth.signOut();
        await AsyncStorage.removeItem('@currentUserDocData');
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
            })
            .addCase(fetchUser.rejected, state => {
                state.loggedIn = false;
                state.docData = null;
                state.status = 'idle';
            })
            .addCase(logout.fulfilled, state => {
                state.loggedIn = false;
                state.docData = null;
                state.status = 'idle';
            });
    },
});

export default userSlice.reducer;
