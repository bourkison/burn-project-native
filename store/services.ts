import {Auth, API} from 'aws-amplify';
import {
    CreateLikeParams,
    CreateLikeInit,
    DeleteLikeParams,
    DeleteLikeInit,
} from '@/types';
import {GetUserParams, GetUserInit, UserDocData} from '@/types/user';
import {
    QueryPostParams,
    QueryPostInit,
    PostReference,
    GetPostParams,
    GetPostInit,
    Post,
} from '@/types/post';
import {
    ExerciseReference,
    QueryExerciseParams,
    QueryExerciseInit,
    GetExerciseParams,
    GetExerciseInit,
    Exercise,
} from '@/types/exercise';

const API_NAME = 'projectburnapi';

export const prettifyTime = (startTime: number) => {
    const now = new Date().getTime();
    let duration = now - startTime;

    let hours = Math.floor(
        (duration % (1000 * 60 * 60 * 24)) / (1000 * 60 * 24),
    );
    let minutes = Math.floor(
        (duration % (1000 * 60 * 60)) / (1000 * 60),
    ).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
    });
    let seconds = Math.floor((duration % (1000 * 60)) / 1000).toLocaleString(
        'en-US',
        {
            minimumIntegerDigits: 2,
            useGrouping: false,
        },
    );

    if (!hours) {
        return minutes + ':' + seconds;
    } else {
        return hours + ':' + minutes + ':' + seconds;
    }
};

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

/*
 *
 * LIKE SERVICES
 *
 */
export async function createLike(input: CreateLikeParams): Promise<void> {
    const path = '/like';
    let myInit: CreateLikeInit = input.init;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    await API.post(API_NAME, path, myInit);
    return;
}

export async function deleteLike(input: DeleteLikeParams): Promise<void> {
    const path = '/like';
    let myInit: DeleteLikeInit = input.init;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    await API.del(API_NAME, path, myInit);
    return;
}

/*
 *
 * EXERCISE SERVICES
 *
 */
export async function queryExercise(
    input: QueryExerciseParams,
): Promise<ExerciseReference[]> {
    const path = '/exercise';
    let myInit: QueryExerciseInit = input.init;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    const data = await API.get(API_NAME, path, myInit);

    if (!data.success) {
        throw new Error('Query exercise unsuccessful: ' + data.message);
    }

    let response: ExerciseReference[] = [];
    data.data.forEach((exerciseReference: any) => {
        response.push({
            exerciseId: exerciseReference.exerciseId,
            name: exerciseReference.name,
            muscleGroups: exerciseReference.muscleGroups,
            tags: exerciseReference.tags,
            createdBy: {
                username: exerciseReference.createdBy.username,
                userId: exerciseReference.createdBy.userId,
                profilePhoto: exerciseReference.createdBy.profilePhoto,
            },
            createdAt: exerciseReference.createdAt,
            isFollow: exerciseReference.isFollow,
        });
    });

    return response;
}

export async function getExercise(input: GetExerciseParams): Promise<Exercise> {
    const path = '/exercise/' + input.exerciseId;
    let myInit: GetExerciseInit = input.init;

    if (!myInit.headers) {
        myInit.headers = {
            Authorization: await fetchJwtToken(),
        };
    } else if (!myInit.headers.Authorization) {
        myInit.headers.Authorization = await fetchJwtToken();
    }

    const data = await API.get(API_NAME, path, myInit);

    if (!data.success) {
        throw new Error('Get exercise unsuccessful: ' + data.message);
    }

    return {
        _id: data.data._id,
        createdBy: {
            username: data.data.createdBy.username,
            userId: data.data.createdBy.userId,
            profilePhoto: data.data.createdBy.profilePhoto,
        },
        description: data.data.description,
        difficulty: data.data.difficulty,
        measureBy: data.data.measureBy,
        name: data.data.name,
        filePaths: data.data.filePaths,
        muscleGroups: data.data.muscleGroups,
        tags: data.data.tags,
        likeCount: data.data.likeCount,
        commentCount: data.data.commentCount,
        followCount: data.data.followCount,
        usedAmount: data.data.usedAmount,
        public: data.data.public,
        isLiked: data.data.isLiked,
        isFollowed: data.data.isFollowed,
        isFollowable: data.data.isFollowable,
        createdAt: data.data.createdAt,
    };
}
