import {
    createAsyncThunk,
    createEntityAdapter,
    createSlice,
} from '@reduxjs/toolkit';
import {UserDocData} from '../../types/user';
import {getUser} from '../services';

const userAdapter = createEntityAdapter();

export const fetchUser = createAsyncThunk(
    'user/fetchUser',
    async (username: string): Promise<UserDocData> => {
        const user = await getUser({userId: username, init: {}});
        console.log('User fetched:', user);
        return user;
    },
);

const initialState = userAdapter.getInitialState({
    loggedIn: false,
    docData: null as UserDocData | null,
});

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder.addCase(fetchUser.fulfilled, (state, action) => {
            state.loggedIn = true;
            state.docData = action.payload;
        });
    },
});

export default userSlice.reducer;
