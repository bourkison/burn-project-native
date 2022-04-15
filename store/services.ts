import {Auth, API} from 'aws-amplify';
import {GetUserParams, GetUserInit, UserDocData} from '@/types/user';
import {
    QueryPostParams,
    QueryPostInit,
    PostReference,
    GetPostParams,
    GetPostInit,
    Post,
} from '@/types/post';

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

/*
 *
 * POST SERVICES
 *
 */

export async function queryPost(
    input: QueryPostParams,
): Promise<PostReference[]> {
    let myInit: QueryPostInit = input.init;
    const path = '/post';

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    const data = await API.get(API_NAME, path, myInit);
    let response: PostReference[] = [];
    data.data.forEach((postReference: any) => {
        response.push({
            _id: postReference._id,
            createdBy: {
                username: postReference.createdBy.username,
                userId: postReference.createdBy.userId,
                profilePhoto: postReference.createdBy.profilePhoto,
            },
            createdAt: postReference.createdAt,
        });
    });

    return response;
}

export async function getPost(input: GetPostParams): Promise<Post> {
    let myInit: GetPostInit = input.init;
    const path = '/post/' + input.postId;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    const data = await API.get(API_NAME, path, myInit);

    let response: Post = {
        _id: data.data._id,
        content: data.data.content,
        createdBy: {
            username: data.data.createdBy.username,
            userId: data.data.createdBy.userId,
            profilePhoto: data.data.createdBy.profilePhoto,
        },
        filePaths: data.data.filePaths,
        likeCount: data.data.likeCount,
        commentCount: data.data.commentCount,
        createdAt: data.data.createdAt,
        isLiked: data.data.isLiked,
    };

    if (data.data.share) {
        response.share = {
            _id: data.data.share._id,
            coll: data.data.share.coll,
        };
    }

    return response;
}
