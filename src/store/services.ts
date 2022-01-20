import {Auth, API} from 'aws-amplify';
import {GetUserParams, GetUserInit, UserDocData} from '../types/user';

const API_NAME = 'projectburnapi';

export async function fetchJwtToken(): Promise<string> {
    try {
        return (await Auth.currentSession()).getIdToken().getJwtToken();
    } catch (err) {
        console.error('Error getting jwtToken', err);
        return '';
    }
}

export async function getUser(input: GetUserParams): Promise<UserDocData> {
    const path = '/user/' + input.userId;
    let myInit: GetUserInit = input.init;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    if (myInit.queryStringParameters?.view === 'profile') {
        throw new Error('Profile query passed through.');
    }

    const data = await API.get(API_NAME, path, myInit);

    return {
        _id: data.data._id,
        username: data.data.username,
        country: data.data.country,
        dob: data.data.dob,
        email: data.data.email,
        firstName: data.data.firstName,
        profilePhoto: data.data.profilePhoto,
        surname: data.data.surname,
        gender: data.data.gender,
        height: data.data.height,
        metric: data.data.metric,
        options: data.data.options,
        weight: data.data.weight,
        workouts: data.data.workouts,
    };
}
